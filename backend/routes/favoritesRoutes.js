// routes/favoritesRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// @desc    Get current user's favorites
// @route   GET /api/favorites
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add product to favorites
// @route   POST /api/favorites/:productId
// @access  Private
router.post("/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productId = req.params.productId;

    if (user.favorites.includes(productId)) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    user.favorites.push(productId);
    await user.save();

    res.status(201).json({ message: "Added to favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Remove product from favorites
// @route   DELETE /api/favorites/:productId
// @access  Private
router.delete("/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productId = req.params.productId;

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== productId
    );

    await user.save();

    res.json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
