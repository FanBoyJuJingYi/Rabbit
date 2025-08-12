const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const { protect, admin } = require('../middleware/authMiddleware');

// Helper: Validate Mongo ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// =============================
// PUBLIC ROUTES
// =============================

// @desc    Get all published posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatarUrl');
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get featured posts (latest published)
// @route   GET /api/posts/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const posts = await Post.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'name avatarUrl');
    res.json(posts);
  } catch (err) {
    console.error('Error fetching featured posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(id).populate('author', 'name avatarUrl');

    if (!post || post.status !== 'published') {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.meta.views = (post.meta.views || 0) + 1;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================
// ADMIN ROUTES
// =============================

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, content, featuredImage, status = 'draft' } = req.body;

    if (!title || !content || !featuredImage) {
      return res.status(400).json({ message: 'Title, content, and featured image are required' });
    }

    const post = new Post({
      title,
      content,
      featuredImage,
      status,
      author: req.user._id,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json({ message: err.message || 'Invalid post data' });
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(400).json({ message: err.message || 'Invalid update data' });
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/posts.js
// ADMIN ROUTE: get all posts, any status
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name avatarUrl');
    res.json(posts);
  } catch (err) {
    console.error('Error fetching admin posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
