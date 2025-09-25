const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    user.shippingAddresses = []; // initialize empty array
    await user.save();

    // Payload formatted according to middleware
    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl || null,
          shippingAddresses: user.shippingAddresses || [],
        },
        token,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Email does not exist
      return res.status(400).json({ message: "Incorrect email" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Password is incorrect
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Payload formatted according to middleware
    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
      if (err) throw err;
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl || null,
          shippingAddresses: user.shippingAddresses || [],
        },
        token,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      ...user.toObject(),
      shippingAddresses: user.shippingAddresses || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Update or replace shipping addresses (full array)
router.put("/profile/shipping", protect, async (req, res) => {
  try {
    const { shippingAddresses } = req.body;
    if (!Array.isArray(shippingAddresses)) {
      return res.status(400).json({ message: "shippingAddresses must be an array" });
    }
    if (shippingAddresses.length > 2) {
      return res.status(400).json({ message: "Maximum 2 shipping addresses allowed" });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.shippingAddresses = shippingAddresses;
    await user.save();
    res.json({ shippingAddresses: user.shippingAddresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update avatar
router.put("/profile/avatar", protect, async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    if (!avatarUrl) {
      return res.status(400).json({ message: "avatarUrl is required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.avatarUrl = avatarUrl;
    await user.save();
    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/profile/shipping/:index", protect, async (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);
    if (isNaN(index)) {
      return res.status(400).json({ message: "Invalid index" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (index < 0 || index >= user.shippingAddresses.length) {
      return res.status(400).json({ message: "Index out of range" });
    }

    user.shippingAddresses.splice(index, 1);
    await user.save();

    res.json({ shippingAddresses: user.shippingAddresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
