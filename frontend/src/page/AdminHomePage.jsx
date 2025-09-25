import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

import {
  FaDollarSign,
  FaShoppingCart,
  FaBoxes,
  FaCheckCircle,
  FaTruck,
  FaHourglassHalf,
  FaTimesCircle,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 10;

  // Redux selectors
  const {
    products,
    totalProducts,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);

  const {
    orders,
    totalOrders,
    totalPages,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit }));
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return (
          <FaHourglassHalf className="text-yellow-500" title="Processing" />
        );
      case "Shipped":
        return <FaTruck className="text-blue-500" title="Shipped" />;
      case "Delivered":
        return <FaCheckCircle className="text-green-500" title="Delivered" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-500" title="Cancelled" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {productsLoading || ordersLoading ? (
        <p>Loading...</p>
      ) : productsError ? (
        <p className="text-red-500">Error fetching products: {productsError}</p>
      ) : ordersError ? (
        <p className="text-red-500">Error fetching orders: {ordersError}</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center gap-4">
              <FaDollarSign className="text-primary dark:text-primary-light w-10 h-10" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Revenue
                </h2>
                <p className="text-3xl font-bold text-primary dark:text-primary-light">
                  ${totalSales?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center gap-4">
              <FaShoppingCart className="text-primary dark:text-primary-light w-10 h-10" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Total Orders
                </h2>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {totalOrders || 0}
                </p>
                <Link
                  to="/admin/orders"
                  className="text-primary dark:text-primary-light hover:underline font-medium"
                >
                  Manage Orders
                </Link>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center gap-4">
              <FaBoxes className="text-primary dark:text-primary-light w-10 h-10" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Total Products
                </h2>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {totalProducts || products.length || 0}
                </p>
                <Link
                  to="/admin/products"
                  className="text-primary dark:text-primary-light hover:underline font-medium"
                >
                  Manage Products
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Total Price</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                      >
                        <td className="py-3 px-4 font-mono text-sm">
                          {order._id}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {order.user?.name || "Unknown User"}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-semibold flex items-center gap-2">
                          {renderStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No recent orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className={`px-4 py-2 rounded-full font-semibold shadow-md flex items-center gap-2 ${
                  page === 1
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                <FaChevronLeft />
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                )
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const isGap = idx > 0 && p - prev > 1;
                  return (
                    <React.Fragment key={p}>
                      {isGap && <span className="px-2 text-gray-500">...</span>}
                      <button
                        onClick={() => handlePageChange(p)}
                        className={`mx-1 px-3 py-1 rounded-full font-semibold transition ${
                          p === page
                            ? "bg-primary text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className={`px-4 py-2 rounded-full font-semibold shadow-md flex items-center gap-2 ${
                  page === totalPages
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                Next
                <FaChevronRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
