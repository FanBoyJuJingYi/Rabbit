const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Get all comments with pagination
// @route   GET /api/comments
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;         // Current page
    const limit = 10;                                   // Comments per page
    const skip = (page - 1) * limit;

    // Count total number of comments
    const totalComments = await Comment.countDocuments();

    // Fetch comments with pagination and populate user and product fields
    const comments = await Comment.find()
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatarUrl")     // Include user's name and avatar
      .populate("product", "name");           // Include product's name

    // Return the results with pagination info
    res.status(200).json({
      comments,
      page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Delete a comment by ID
// @route   DELETE /api/comments/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
