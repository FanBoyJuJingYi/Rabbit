import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";

import { FaTrashAlt, FaEdit, FaPlus, FaBoxOpen } from "react-icons/fa";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error, currentPage, totalPages, totalProducts } =
    useSelector((state) => state.adminProducts);

  const {
    categories,
    loading: categoriesLoading,
    error: categoryError,
  } = useSelector((state) => state.categories);

  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(""); // sẽ lưu tên category (string)
  const limit = 10;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // gọi API gửi category name thay vì id
    dispatch(fetchAdminProducts({ page, limit, category: selectedCategory }));
  }, [dispatch, page, limit, selectedCategory]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return [...Array(totalPages)].map((_, idx) => {
      const pageNum = idx + 1;
      return (
        <button
          key={pageNum}
          onClick={() => goToPage(pageNum)}
          className={`mx-1 px-3 py-1 rounded-full font-semibold shadow-md transition ${
            page === pageNum
              ? "bg-primary text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <FaBoxOpen className="text-primary dark:text-primary-light w-7 h-7" />
          Product Management
        </h2>
        <Link
          to="/admin/products/add"
          className="bg-primary hover:bg-primary-dark transition rounded-full py-3 px-6 font-semibold shadow-md flex items-center gap-2"
        >
          <FaPlus />
          Add Product
        </Link>
      </div>

      {/* Filter by Category */}
      <div className="mb-4">
        <label
          htmlFor="categoryFilter"
          className="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
        >
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          className="border border-gray-300 rounded-md px-3 py-2 w-60"
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={categoriesLoading}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {categoryError && (
          <p className="mt-1 text-red-500">Error loading categories</p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        ) : error ? (
          <p className="p-6 text-center text-red-600 dark:text-red-500">
            {error}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">SKU</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="hover:underline"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">{product.sku}</td>
                      <td className="px-6 py-4">
                        {product.category || "No Category"}
                      </td>
                      <td className="px-6 py-4 text-center flex justify-center gap-3">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2"
                          title="Edit Product"
                        >
                          <FaEdit />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2"
                          title="Delete Product"
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalProducts > limit && (
        <div className="mt-6 flex justify-center space-x-3">
          <button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className={`px-4 py-2 rounded-full font-semibold shadow-md transition ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            Prev
          </button>
          {renderPagination()}
          <button
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
            className={`px-4 py-2 rounded-full font-semibold shadow-md transition ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
