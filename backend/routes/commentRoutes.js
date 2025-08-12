const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get comments by productId - Public
router.get('/product/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.productId }).populate('user', 'name avatar');
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add new comment - Private
router.post('/', protect, async (req, res) => {
  const { productId, content, rating } = req.body;

  try {
    const comment = new Comment({
      product: productId,
      user: req.user._id,
      content,
      rating,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete comment by id - Private (owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
