const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const nodemailer = require("nodemailer");
const { protect } = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// POST /api/checkout - tạo đơn
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice, couponCode } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items to checkout" });
  }

  // Kiểm tra đầy đủ các trường shippingAddress:
  const requiredFields = ['firstname', 'lastname', 'phone', 'address', 'city', 'postalCode', 'country'];
  for (const field of requiredFields) {
    if (!shippingAddress?.[field]) {
      return res.status(400).json({ message: `Missing shippingAddress field: ${field}` });
    }
  }

  try {
    let discountAmount = 0;
    let finalPrice = totalPrice;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, active: true });
      if (!coupon) return res.status(400).json({ message: "Invalid coupon code" });
      if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
        return res.status(400).json({ message: "Coupon has expired" });
      }
      if (totalPrice < coupon.minPurchase) {
        return res.status(400).json({ message: `Minimum purchase for coupon is $${coupon.minPurchase}` });
      }

      discountAmount = coupon.discountType === "percentage"
        ? (coupon.discountValue / 100) * totalPrice
        : coupon.discountValue;

      finalPrice = Math.max(0, totalPrice - discountAmount);
    }

    const newCheckout = new Checkout({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice: finalPrice,
      couponCode: couponCode || null,
      discountAmount,
      paymentStatus: "pending",
      isPaid: false,
    });

    await newCheckout.save();

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Checkout creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/checkout/:id/pay - cập nhật trạng thái thanh toán
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = "paid";
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();

      await checkout.save();
      return res.status(200).json(checkout);
    } else {
      return res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/checkout/:id/finalize - hoàn tất đơn hàng
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id).populate("user");
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if ((checkout.isPaid || checkout.paymentMethod === "cod") && !checkout.isFinalized) {
      // Kiểm tra tồn kho
      for (const item of checkout.checkoutItems) {
        const product = await Product.findById(item.productId);
        if (!product) return res.status(404).json({ message: `Product ${item.name} not found` });
        if (product.countInStock < item.quantity) {
          return res.status(400).json({ message: `Not enough stock for product ${product.name}` });
        }
      }

      // Trừ tồn kho
      for (const item of checkout.checkoutItems) {
        const product = await Product.findById(item.productId);
        product.countInStock -= item.quantity;
        await product.save();
      }

      // Tạo đơn Order
      const finalOrder = await Order.create({
        user: checkout.user._id,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        coupon: checkout.couponCode || null,
        discountAmount: checkout.discountAmount || 0,
        isPaid: checkout.isPaid,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: checkout.paymentStatus,
        paymentDetails: checkout.paymentDetails || null,
      });

      // Gửi email xác nhận
      const senderName = process.env.STORE_NAME || "Your Store";
      const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">You have successfully placed your order</h2>
          <p>Hi ${checkout.user.name},</p>
          <p>Thank you for your purchase. Your order has been received and is now being processed.</p>

          <h3>Shipping Address:</h3>
          <p>
            ${checkout.shippingAddress.firstname} ${checkout.shippingAddress.lastname}<br/>
            ${checkout.shippingAddress.address}, ${checkout.shippingAddress.city}<br/>
            ${checkout.shippingAddress.postalCode}, ${checkout.shippingAddress.country}<br/>
            Phone: ${checkout.shippingAddress.phone}
          </p>

          <h3>Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${checkout.checkoutItems.map(item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">
                  <img src="${item.image}" alt="${item.name}" width="80" style="border-radius: 5px;">
                </td>
                <td style="padding: 10px;">
                  ${item.name} <br/>
                  Quantity: ${item.quantity} <br/>
                  Price: $${item.price.toFixed(2)}
                </td>
              </tr>
            `).join("")}
          </table>

          <h3 style="text-align: right;">Total: $${checkout.totalPrice.toFixed(2)}</h3>

          <p>We'll notify you again when your order has shipped.</p>
          <p>– ${senderName}</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"${senderName}" <${process.env.EMAIL_USER}>`,
        to: checkout.user.email,
        subject: "You have successfully placed your order",
        html: emailHTML,
      });

      // Đánh dấu hoàn tất checkout
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // Xóa giỏ hàng
      await Cart.findOneAndDelete({ user: checkout.user._id });

      res.status(201).json(finalOrder);
    } else {
      res.status(400).json({ message: "Checkout not paid or already finalized" });
    }
  } catch (error) {
    console.error("Finalize order error:", error);
    res.status(500).json({ message: "Error finalizing order" });
  }
});

module.exports = router;
