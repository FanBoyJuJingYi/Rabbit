import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import {
  updateProduct,
  resetUpdateStatus,
} from "../../redux/slices/adminProductSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const { updateStatus, updateError } = useSelector(
    (state) => state.adminProducts
  );

  const { categories } = useSelector((state) => state.categories);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  // state riêng để lưu text input sizes và colors
  const [inputSizesText, setInputSizesText] = useState("");
  const [inputColorsText, setInputColorsText] = useState("");

  const [uploading, setUploading] = useState(false);

  // Load product details
  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  // Load categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Khi có product mới, cập nhật state
  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || 0,
        countInStock: selectedProduct.countInStock || 0,
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        sizes: Array.isArray(selectedProduct.sizes)
          ? selectedProduct.sizes
          : [],
        colors: Array.isArray(selectedProduct.colors)
          ? selectedProduct.colors
          : [],
        collections: selectedProduct.collections || "",
        material: selectedProduct.material || "",
        gender: selectedProduct.gender || "",
        images: Array.isArray(selectedProduct.images)
          ? selectedProduct.images
          : [],
      });

      // set text input từ mảng sizes và colors
      setInputSizesText(
        Array.isArray(selectedProduct.sizes)
          ? selectedProduct.sizes.join(", ")
          : ""
      );
      setInputColorsText(
        Array.isArray(selectedProduct.colors)
          ? selectedProduct.colors.join(", ")
          : ""
      );
    }
  }, [selectedProduct]);

  // Reset update status khi component mount
  useEffect(() => {
    dispatch(resetUpdateStatus());
  }, [dispatch]);

  // Nếu update thành công thì chuyển trang
  useEffect(() => {
    if (updateStatus === "succeeded") {
      navigate("/admin/products");
    }
  }, [updateStatus, navigate]);

  // Các input thông thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "price" || name === "countInStock") && value !== "") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }
    setProductData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "countInStock" ? Number(value) : value,
    }));
  };

  // Khi user nhập sizes, cập nhật text inputSizesText
  const handleSizesInputChange = (e) => {
    setInputSizesText(e.target.value);
  };

  // Khi sizes input mất focus, cập nhật mảng sizes trong productData
  const handleSizesInputBlur = () => {
    const arr = inputSizesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setProductData((prev) => ({ ...prev, sizes: arr }));
  };

  // Khi user nhập colors, cập nhật text inputColorsText
  const handleColorsInputChange = (e) => {
    setInputColorsText(e.target.value);
  };

  // Khi colors input mất focus, cập nhật mảng colors trong productData
  const handleColorsInputBlur = () => {
    const arr = inputColorsText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    setProductData((prev) => ({ ...prev, colors: arr }));
  };

  // Xóa ảnh
  const handleRemoveImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Upload ảnh
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!productData.name.trim()) {
      toast.error("Product Name is required.");
      return;
    }
    if (!productData.description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (productData.price <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }
    if (productData.countInStock < 0) {
      toast.error("Count In Stock cannot be negative.");
      return;
    }
    if (!productData.sku.trim()) {
      toast.error("SKU is required.");
      return;
    }
    if (!productData.category.trim()) {
      toast.error("Category must be selected.");
      return;
    }

    dispatch(updateProduct({ id, productData }));
  };

  if (loading)
    return (
      <p className="text-center py-6 text-gray-600 dark:text-gray-300">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="text-center py-6 text-red-600 dark:text-red-400">
        Error: {error}
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <FaEdit className="text-primary dark:text-primary-light w-8 h-8" />
        Edit Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-required="true"
            aria-label="Product Name"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter product description"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-required="true"
            aria-label="Product Description"
          />
        </div>

        {/* Price and Count In Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Price *
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="0.00"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-required="true"
              aria-label="Product Price"
            />
          </div>

          <div>
            <label
              htmlFor="countInStock"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Count In Stock *
            </label>
            <input
              id="countInStock"
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="0"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-required="true"
              aria-label="Count In Stock"
            />
          </div>
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category as select */}
          <div>
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-required="true"
              aria-label="Product Category"
            >
              <option value="">-- Select a category --</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="brand"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Brand
            </label>
            <input
              id="brand"
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              placeholder="Brand name"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-label="Product Brand"
            />
          </div>
        </div>

        {/* Collections and Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="collections"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Collections
            </label>
            <input
              id="collections"
              type="text"
              name="collections"
              value={productData.collections}
              onChange={handleChange}
              placeholder="e.g. Summer 2025"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-label="Product Collections"
            />
          </div>

          <div>
            <label
              htmlFor="material"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Material
            </label>
            <input
              id="material"
              type="text"
              name="material"
              value={productData.material}
              onChange={handleChange}
              placeholder="Material type"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-label="Product Material"
            />
          </div>
        </div>

        {/* Gender and SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={productData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-label="Product Gender"
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sku"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              SKU *
            </label>
            <input
              id="sku"
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              placeholder="Stock Keeping Unit"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-required="true"
              aria-label="Product SKU"
            />
          </div>
        </div>

        {/* Sizes and Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="sizes"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Sizes (comma separated)
            </label>
            <input
              id="sizes"
              type="text"
              name="sizes"
              value={inputSizesText}
              onChange={handleSizesInputChange}
              onBlur={handleSizesInputBlur}
              placeholder="e.g. S, M, L"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-label="Product Sizes"
            />
          </div>

          <div>
            <label
              htmlFor="colors"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Colors (comma separated)
            </label>
            <input
              id="colors"
              type="text"
              name="colors"
              value={inputColorsText}
              onChange={handleColorsInputChange}
              onBlur={handleColorsInputBlur}
              placeholder="e.g. Red, Blue, Green"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-label="Product Colors"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image-upload"
            className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Upload Images
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block mb-2"
            aria-label="Upload product images"
          />
          {uploading && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Uploading...
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-4">
            {productData.images.map((image, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={image.url}
                  alt={image.altText || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md shadow cursor-pointer"
                  title="Product Image"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={updateStatus === "loading" || uploading}
          className={`w-full py-3 rounded-md font-semibold transition-colors ${
            updateStatus === "loading" || uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          aria-busy={updateStatus === "loading" || uploading}
          aria-label="Update Product"
        >
          {updateStatus === "loading" || uploading
            ? "Updating..."
            : "Update Product"}
        </button>

        {updateError && (
          <p className="text-red-600 mt-2 font-medium select-none" role="alert">
            Error: {updateError}
          </p>
        )}
      </form>
    </div>
  );
};

export default EditProductPage;
