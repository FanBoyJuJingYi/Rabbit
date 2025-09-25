const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products with pagination and optional category filter
// @access Private (Admin)
router.get("/", protect, admin, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }

<<<<<<< HEAD
    const totalProducts = await Product.countDocuments(filter);
=======
    // tổng sản phẩm (không phân trang)
    const totalProducts = await Product.countDocuments(filter);

    // lấy sản phẩm theo trang
>>>>>>> 1aa479b (Upload 2)
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      products,
      page,
<<<<<<< HEAD
      pages: Math.ceil(totalProducts / limit),
      totalProducts,
=======
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
>>>>>>> 1aa479b (Upload 2)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT /api/admin/products/:id
// @desc Update a product
// @access Private (Admin)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route DELETE /api/admin/products/:id
// @desc Delete a product
// @access Private (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: id });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
