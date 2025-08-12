const express = require("express");
const Coupon = require("../models/Coupon");
const router = express.Router();

// Lấy danh sách coupon
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Tạo coupon mới
router.post("/", async (req, res) => {
  const { code, discountType, discountValue, expiresAt, minPurchase, active } = req.body;
  try {
    const existing = await Coupon.findOne({ code });
    if (existing) return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = new Coupon({ code, discountType, discountValue, expiresAt, minPurchase, active });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Sửa coupon
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { code, discountType, discountValue, expiresAt, minPurchase, active } = req.body;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    if (code && code !== coupon.code) {
      const existCode = await Coupon.findOne({ code });
      if (existCode) return res.status(400).json({ message: "Coupon code already exists" });
    }

    coupon.code = code || coupon.code;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue || coupon.discountValue;
    coupon.expiresAt = expiresAt || coupon.expiresAt;
    coupon.minPurchase = minPurchase !== undefined ? minPurchase : coupon.minPurchase;
    coupon.active = active !== undefined ? active : coupon.active;

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Xóa coupon
router.delete("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Kiểm tra coupon (user check code, check đã dùng chưa, còn hiệu lực không...)
router.post("/check", async (req, res) => {
  const { couponCode, totalPrice, userId } = req.body;

  if (!couponCode) {
    return res.status(400).json({ message: "Coupon code required" });
  }

  try {
    const coupon = await Coupon.findOne({ code: couponCode, active: true });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    if (totalPrice < coupon.minPurchase) {
      return res.status(400).json({ message: `Minimum purchase for coupon is $${coupon.minPurchase}` });
    }

    // Kiểm tra user đã dùng chưa
    if (userId) {
      const usedBefore = coupon.usedBy.some(id => id.toString() === userId.toString());
      if (usedBefore) {
        return res.status(400).json({ message: "You have already used this coupon" });
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (coupon.discountValue / 100) * totalPrice;
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > totalPrice) discountAmount = totalPrice;

    res.json({ discountAmount, couponId: coupon._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Ghi nhận user đã dùng coupon khi đặt hàng thành công
router.post("/use", async (req, res) => {
  const { couponId, userId } = req.body;
  if (!couponId || !userId) return res.status(400).json({ message: "couponId and userId required" });

  try {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    if (!coupon.usedBy.includes(userId)) {
      coupon.usedBy.push(userId);
      await coupon.save();
    }
    res.json({ message: "Coupon usage saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
