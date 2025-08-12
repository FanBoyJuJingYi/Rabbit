import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../redux/slices/adminSlice";

import { FaTrashAlt, FaUserPlus, FaUsers } from "react-icons/fa";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error, page, pages, totalUsers } = useSelector(
    (state) => state.admin
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [submitError, setSubmitError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Search and filter state
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("");

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit, search: searchText, role: filterRole }));
  }, [dispatch, currentPage, searchText, filterRole]);

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterRole]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      await dispatch(addUser(formData)).unwrap();
      setFormData({ name: "", email: "", password: "", role: "customer" });
      // Reload users list after add
      dispatch(fetchUsers({ page: currentPage, limit, search: searchText, role: filterRole }));
    } catch (err) {
      setSubmitError(err.message || "Failed to add user");
    }
  };

  const handleRoleChange = (id, newRole) => {
    dispatch(updateUser({ id, role: newRole }));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
      // Adjust page if last user on page deleted
      if (users.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
      else dispatch(fetchUsers({ page: currentPage, limit, search: searchText, role: filterRole }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setFilterRole(e.target.value);
  };

  const renderPagination = () => {
    if (pages <= 1) return null;

    const pagesArr = [];
    for (let i = 1; i <= pages; i++) {
      pagesArr.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 px-3 py-1 rounded-full font-semibold shadow-md transition ${
            i === currentPage
              ? "bg-primary text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return <div className="my-4 flex justify-center">{pagesArr}</div>;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <FaUsers className="text-primary dark:text-primary-light w-7 h-7" />
          User Management
        </h2>
        <span className="bg-primary px-4 py-1 rounded-full shadow-md">
          Total: {totalUsers}
        </span>
      </div>

      {/* Add User Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <FaUserPlus />
          Add New User
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="md:col-span-2">
            {submitError && (
              <p className="mb-4 text-sm text-red-600 dark:text-red-500">{submitError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark transition rounded-full py-3 font-semibold shadow-md"
            >
              Add User
            </button>
          </div>
        </form>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search user..."
          value={searchText}
          onChange={handleSearchChange}
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none w-full md:w-64"
        />
        {/* Nếu muốn dùng filter role thì mở comment bên dưới */}
        {/* <select
          value={filterRole}
          onChange={handleRoleFilterChange}
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none w-full md:w-48"
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select> */}
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-600 dark:text-gray-400">Loading users...</p>
        ) : error ? (
          <p className="p-6 text-center text-red-600 dark:text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition shadow flex items-center gap-2 mx-auto"
                          title="Delete User"
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
      {totalUsers > limit && (
        <div className="mt-6 flex justify-center">{renderPagination()}</div>
      )}
    </div>
  );
};

export default UserManagement;
