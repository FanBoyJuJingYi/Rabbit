import React, { useEffect, useState } from "react"; // thêm useState
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../redux/slices/adminOrderSlice";

import { FaTrashAlt, FaTruck, FaCheckCircle, FaChevronLeft, FaChevronRight, FaFilter  } from "react-icons/fa";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, page, totalPages, totalOrders, loading, error } = useSelector(
    (state) => state.adminOrders
  );

  const [filterStatus, setFilterStatus] = useState(""); // trạng thái lọc ("" nghĩa tất cả)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders({ page: 1, status: filterStatus }));
    }
  }, [dispatch, user, navigate, filterStatus]);

  const handlePageChange = (pageNum) => {
    if (pageNum !== page && pageNum >= 1 && pageNum <= totalPages) {
      dispatch(fetchAllOrders({ page: pageNum, status: filterStatus }));
    }
  };

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId));
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pagesToShow = new Set([1, totalPages]);
    if (page - 1 > 1) pagesToShow.add(page - 1);
    pagesToShow.add(page);
    if (page + 1 < totalPages) pagesToShow.add(page + 1);

    const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);

    const buttons = [];
    for (let i = 0; i < sortedPages.length; i++) {
      if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) {
        buttons.push(
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-gray-500 select-none"
          >
            ...
          </span>
        );
      }
      const pageNum = sortedPages[i];
      buttons.push(
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`px-3 py-1 rounded-full font-semibold shadow-md transition ${
            pageNum === page
              ? "bg-primary"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-current={pageNum === page ? "page" : undefined}
          aria-label={`Go to page ${pageNum}`}
        >
          {pageNum}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <FaTruck className="text-primary dark:text-primary-light w-8 h-8" />
        Order Management
      </h2>

      {/* Thêm phần lọc trạng thái */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <label
          htmlFor="statusFilter"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold mb-2 sm:mb-0 select-none"
        >
          <FaFilter className="text-primary dark:text-primary-light w-5 h-5" />
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-48 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-primary focus:outline-none transition-shadow
            hover:shadow-md"
        >
          <option value="">All</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 dark:text-red-500">{error}</p>
      ) : (
        <>
          {/* Bảng đơn hàng */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Total Price</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {orders.length ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition"
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-600 dark:text-blue-400">
                        #{order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.user?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${(order.totalPrice || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="border rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
                          aria-label={`Change status for order ${order._id}`}
                        >
                          {["Processing", "Shipped", "Delivered", "Cancelled"].map(
                            (statusOption) => (
                              <option key={statusOption} value={statusOption}>
                                {statusOption}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap space-x-2 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          title="Mark as Delivered"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition flex items-center gap-2"
                          onClick={() => handleStatusChange(order._id, "Delivered")}
                        >
                          <FaCheckCircle />
                          Delivered
                        </button>
                        <button
                          title="Delete Order"
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition flex items-center gap-2"
                          onClick={() => handleDelete(order._id)}
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 select-none"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className={`px-4 py-2 rounded-full font-semibold shadow-md transition flex items-center gap-2 ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-primary hover:bg-primary-dark"
              }`}
              aria-label="Previous page"
            >
              <FaChevronLeft />
              Prev
            </button>

            {renderPagination()}

            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className={`px-4 py-2 rounded-full font-semibold shadow-md transition flex items-center gap-2 ${
                page === totalPages
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-primary hover:bg-primary-dark"
              }`}
              aria-label="Next page"
            >
              Next
              <FaChevronRight />
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 select-none">
            Total Orders: {totalOrders}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderManagement;
