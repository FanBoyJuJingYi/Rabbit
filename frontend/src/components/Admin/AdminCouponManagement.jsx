import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  fetchCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../redux/slices/couponSlice";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: 0,
  expiresAt: "",
  minPurchase: 0,
  active: true,
};

const AdminCouponManagement = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((state) => state.coupons);

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateCoupon({ id: editId, couponData: form }));
    } else {
      dispatch(addCoupon(form));
    }
    setForm(initialForm);
    setEditId(null);
  };

  const handleEdit = (coupon) => {
    setEditId(coupon._id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      minPurchase: coupon.minPurchase,
      active: coupon.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // cuộn lên form khi edit
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Manage Coupons
      </h2>

      {/* Form tạo/cập nhật coupon */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <label className="block font-semibold text-gray-900 dark:text-white mb-1">Code</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="Enter coupon code"
          />
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block font-semibold text-gray-900 dark:text-white mb-1">Discount Type</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed amount ($)</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block font-semibold text-gray-900 dark:text-white mb-1">Discount Value</label>
            <input
              name="discountValue"
              type="number"
              value={form.discountValue}
              onChange={handleChange}
              min={0}
              step="any"
              required
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Enter discount value"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-900 dark:text-white mb-1">Expires At</label>
          <input
            name="expiresAt"
            type="date"
            value={form.expiresAt}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-900 dark:text-white mb-1">Minimum Purchase</label>
          <input
            name="minPurchase"
            type="number"
            value={form.minPurchase}
            onChange={handleChange}
            min={0}
            step="any"
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="Enter minimum purchase amount"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={form.active}
            onChange={handleChange}
            className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="active" className="font-semibold text-gray-900 dark: select-none">
            Active
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark py-3 px-6 rounded-full shadow-md font-semibold transition w-full md:w-auto"
        >
          {editId ? "Update Coupon" : "Add Coupon"}
        </button>
      </form>

      {/* Table danh sách coupon */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-600 dark:text-gray-400">
            Loading coupons...
          </p>
        ) : error ? (
          <p className="p-6 text-center text-red-600 dark:text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-semibold">Code</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Value</th>
                  <th className="px-6 py-4 font-semibold">Expires At</th>
                  <th className="px-6 py-4 font-semibold">Min Purchase</th>
                  <th className="px-6 py-4 font-semibold text-center">Active</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      No coupons found.
                    </td>
                  </tr>
                )}
                {coupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 capitalize">{coupon.discountType}</td>
                    <td className="px-6 py-4">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4">${coupon.minPurchase}</td>
                    <td className="px-6 py-4 text-center font-semibold">
                      {coupon.active ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2 font-semibold"
                        title="Edit Coupon"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2 font-semibold"
                        title="Delete Coupon"
                      >
                        <FaTrashAlt />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCouponManagement;
