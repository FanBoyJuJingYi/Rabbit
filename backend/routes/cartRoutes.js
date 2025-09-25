const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to get cart by userId or guestId
const getCart = async (userId, guestId) => {
  let cart = null;
  if (userId) {
    cart = await Cart.findOne({ user: userId });
  }
  if (!cart && guestId) {
    cart = await Cart.findOne({ guestId });
  }
  return cart;
}

//@route POST /api/cart
//@desc Add product to cart
//@access Private

router.post('/', async (req, res) => {
  const { productId, size, color, quantity, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Determine if the user is logged in or a guest
    let cart = await getCart(userId, guestId);

    //If the cart exists, update it
    if (cart) {
      const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);

      if (productIndex > -1) {
        // If the product already exists in the cart, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new product to the cart
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create a new cart for guest or user
      const newCart = new Cart({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [{
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity
        }],
        totalPrice: product.price * quantity
      });
      await newCart.save();
      return res.status(201).json(newCart)
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
})

// @route PUT /api/cart
// @desc Update product quantity in cart for a guest or logged-in user
// @access Private

router.put("/", async (req, res) => {
  const { productId, size, color, quantity, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);
    if (productIndex > -1) {
      // update quantity
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        // remove product if quantity is 0
        cart.products.splice(productIndex, 1);
      }

      cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
})

// @route DELETE /api/cart
// @desc Remove product from cart for a guest or logged-in user
// @access Private
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color
    );
    if (productIndex > -1) {
      // Remove product from cart
      cart.products.splice(productIndex, 1);
      // Recalculate total price
      cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
})

// @route GET /api/cart
// @desc Get cart for a guest or logged-in user
// @access Private

router.get("/", async (req, res) => {
  const { guestId, userId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
})

// @route DELETE /api/cart/merge
// @desc Merge guest cart with user cart on login 
// @access Private

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    // Find the guest cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "Guest cart is empty" });
      }
      if (userCart) {
        // Merge guest cart products into user cart
        guestCart.products.forEach((guestItem) => {
          const productindex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );
          if (productindex > -1) {
            // If product already exists in user cart, update quantity
            userCart.products[productindex].quantity += guestItem.quantity;
          } else {
            // If product does not exist, add it to user cart
            userCart.products.push(guestItem);
          }
        });

        userCart.totalPrice = userCart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        await userCart.save();
        // Delete the guest cart
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error('Error deleting guest cart:', error);
        }
        return res.status(200).json(userCart);
      } else {
        // If the user has no existing cart, assign the guest cart to the user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined; // Clear guestId
        await guestCart.save();
        return res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        // Guest cart has already been merged, return user cart
        return res.status(200).json(userCart);
      }
      return res.status(404).json({ message: 'Guest cart not found' });
    }
  } catch (error) {
    console.error('Error merging carts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
})

router.delete("/entire-cart", async (req, res) => {
  const { userId, guestId } = req.body;

  try {
    let cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // XOÁ LUÔN CẢ CART KHỎI DATABASE
    await Cart.findByIdAndDelete(cart._id);

    return res.status(200).json({
      message: 'Cart deleted successfully',
      deletedCartId: cart._id
    });
  } catch (error) {
    console.error('Error deleting cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;