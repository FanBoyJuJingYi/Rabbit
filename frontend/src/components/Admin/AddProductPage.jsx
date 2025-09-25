import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../redux/slices/productsSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import { toast } from "sonner";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addProductStatus, addProductError } = useSelector(
    (state) => state.products
  );

  const { categories } = useSelector((state) => state.categories);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
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

  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // Lấy categories khi mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizesChange = (e) => {
    const value = e.target.value;
    setSizesInput(value);
    setProductData((prev) => ({
      ...prev,
      sizes: value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  const handleColorsChange = (e) => {
    const value = e.target.value;
    setColorsInput(value);
    setProductData((prev) => ({
      ...prev,
      colors: value
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    }));
  };

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
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const validateForm = () => {
    if (!productData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!productData.description.trim()) {
      toast.error("Product description is required");
      return false;
    }
    if (
      productData.price === "" ||
      isNaN(productData.price) ||
      Number(productData.price) < 0
    ) {
      toast.error("Price must be a positive number");
      return false;
    }
    if (
      productData.countInStock === "" ||
      isNaN(productData.countInStock) ||
      Number(productData.countInStock) < 0
    ) {
      toast.error("Count in stock must be a positive number");
      return false;
    }
    if (!productData.category.trim()) {
      toast.error("Category is required");
      return false;
    }
    if (!productData.sku.trim()) {
      toast.error("SKU is required");
      return false;
    }
    if (!productData.gender) {
      toast.error("Gender is required");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(addProduct(productData));
  };

  useEffect(() => {
    if (addProductStatus === "succeeded") {
      toast.success("Product added successfully");
      navigate("/admin/products");
    }
  }, [addProductStatus, navigate]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <FaUpload className="text-primary dark:text-primary-light w-8 h-8" />
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Product Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-label="Product Name"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter product description"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-label="Product Description"
          />
        </div>

        {/* Price and Stock in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-label="Product Price"
            />
          </div>

          <div>
            <label
              htmlFor="countInStock"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Count In Stock
            </label>
            <input
              id="countInStock"
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-label="Count In Stock"
            />
          </div>
        </div>

        {/* Category and Brand in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 select-none"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              aria-label="Product Category"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
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

        {/* Collections and Material in one row */}
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

        {/* Gender and SKU in one row */}
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
              SKU
            </label>
            <input
              id="sku"
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              placeholder="Stock Keeping Unit"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
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
              value={sizesInput}
              onChange={handleSizesChange}
              placeholder="e.g. S,M,L"
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
              value={colorsInput}
              onChange={handleColorsChange}
              placeholder="e.g. Red,Blue,Green"
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
              <img
                key={idx}
                src={image.url}
                alt={image.altText || "Product Image"}
                className="w-20 h-20 object-cover rounded-md shadow cursor-pointer"
                title="Product Image"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={addProductStatus === "loading" || uploading}
          className={`w-full py-3 rounded-md font-semibold transition-colors ${
            addProductStatus === "loading" || uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          aria-busy={addProductStatus === "loading" || uploading}
          aria-label="Add Product"
        >
          {addProductStatus === "loading" || uploading
            ? "Adding..."
            : "Add Product"}
        </button>

        {addProductError && (
          <p className="text-red-600 mt-2 font-medium select-none" role="alert">
            Error: {addProductError}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddProductPage;
