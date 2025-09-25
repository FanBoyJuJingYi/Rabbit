const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const slugify = require("slugify"); // npm i slugify để tạo slug tự động

// Lấy danh sách tất cả danh mục
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Tạo mới danh mục
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true });

    const exist = await Category.findOne({ slug });
    if (exist) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ name, description, slug });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Sửa danh mục
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true });
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Kiểm tra trùng slug
    const exist = await Category.findOne({ slug, _id: { $ne: req.params.id } });
    if (exist) return res.status(400).json({ message: "Category slug already exists" });

    category.name = name || category.name;
    category.description = description || category.description;
    category.slug = slug;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Xóa danh mục
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
