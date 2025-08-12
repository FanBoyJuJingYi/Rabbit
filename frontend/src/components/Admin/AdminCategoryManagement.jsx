import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../redux/slices/categorySlice";

import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaTags,
} from "react-icons/fa";

const initialForm = {
  name: "",
  description: "",
};

const AdminCategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error, addCategoryStatus } = useSelector(
    (state) => state.categories
  );

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name is required");

    if (editId) {
      dispatch(updateCategory({ id: editId, categoryData: form }));
    } else {
      dispatch(addCategory(form));
    }
    setForm(initialForm);
    setEditId(null);
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setForm({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Form */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-900 dark:text-white mb-2">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Category name"
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Category description (optional)"
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={addCategoryStatus === "loading"}
            className={`w-full py-3 rounded-md font-semibold transition-colors ${
              addCategoryStatus === "loading"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
            aria-busy={addCategoryStatus === "loading"}
            aria-label={editId ? "Update Category" : "Add Category"}
          >
            {addCategoryStatus === "loading"
              ? editId
                ? "Updating..."
                : "Adding..."
              : editId
              ? "Update Category"
              : "Add Category"}
          </button>
        </form>
      </div>

      {/* Loading & Error */}
      {loading && (
        <p className="p-6 text-center text-gray-600 dark:text-gray-400">
          Loading categories...
        </p>
      )}
      {error && (
        <p className="p-6 text-center text-red-600 dark:text-red-500">{error}</p>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </td>
                  <td className="px-6 py-4">{category.description || "-"}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2"
                      title="Edit Category"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2"
                      title="Delete Category"
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
    </div>
  );
};

export default AdminCategoryManagement;
