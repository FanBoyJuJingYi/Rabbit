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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state to manage current page for pagination
  const [page, setPage] = useState(1);
  const limit = 10; // Number of orders per page

  // Select product data from redux store
  const {
    products,
    loading: productsLoading,
    error: productsError,
<<<<<<< HEAD
=======
    totalProducts,
>>>>>>> 1aa479b (Upload 2)
  } = useSelector((state) => state.adminProducts);

  // Select order data and pagination info from redux store
  const {
    orders,
    totalOrders,
    totalPages,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  // Fetch products once when component mounts
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Fetch orders whenever `page` changes
  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit }));
  }, [dispatch, page]);

  // Handler to change page number safely within bounds
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Show loading or errors if any */}
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
<<<<<<< HEAD
                  ${totalSales.toFixed(2)}
=======
                  ${totalSales.toFixed(0)}
>>>>>>> 1aa479b (Upload 2)
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
                  {totalOrders}
                </p>
                <Link
                  to="/admin/orders"
                  className="self-start text-primary dark:text-primary-light hover:underline font-medium"
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
<<<<<<< HEAD
                  {products.length}
=======
                  {totalProducts}
>>>>>>> 1aa479b (Upload 2)
                </p>
                <Link
                  to="/admin/products"
                  className="self-start text-primary dark:text-primary-light hover:underline font-medium"
                >
                  Manage Products
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="mt-6">
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
<<<<<<< HEAD
                        <td className="py-3 px-4 font-mono text-sm">{order._id}</td>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {order.user?.name || "Unknown User"}
                        </td>
                        <td className="py-3 px-4 font-semibold">${order.totalPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 font-semibold flex items-center gap-2">
                          {order.status === "Processing" && (
                            <FaHourglassHalf className="text-yellow-500" title="Processing" />
                          )}
                          {order.status === "Shipped" && (
                            <FaTruck className="text-blue-500" title="Shipped" />
                          )}
                          {order.status === "Delivered" && (
                            <FaCheckCircle className="text-green-500" title="Delivered" />
                          )}
                          {order.status === "Cancelled" && (
                            <FaTimesCircle className="text-red-500" title="Cancelled" />
=======
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
                          {order.status === "Processing" && (
                            <FaHourglassHalf
                              className="text-yellow-500"
                              title="Processing"
                            />
                          )}
                          {order.status === "Shipped" && (
                            <FaTruck
                              className="text-blue-500"
                              title="Shipped"
                            />
                          )}
                          {order.status === "Delivered" && (
                            <FaCheckCircle
                              className="text-green-500"
                              title="Delivered"
                            />
                          )}
                          {order.status === "Cancelled" && (
                            <FaTimesCircle
                              className="text-red-500"
                              title="Cancelled"
                            />
>>>>>>> 1aa479b (Upload 2)
                          )}
                          <span>{order.status}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
<<<<<<< HEAD
                      <td colSpan="4" className="p-4 text-center text-gray-500 dark:text-gray-400">
=======
                      <td
                        colSpan="4"
                        className="p-4 text-center text-gray-500 dark:text-gray-400"
                      >
>>>>>>> 1aa479b (Upload 2)
                        No recent orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center space-x-2 select-none">
              {/* Page Numbers with Ellipsis */}
              <div className="flex justify-center items-center mt-6 space-x-2">
                {/* Prev Button */}
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className={`px-4 py-2 rounded-full font-semibold shadow-md transition flex items-center gap-2 ${
                    page === 1
                      ? "bg-gray-300 cursor-not-allowed text-gray-600"
                      : "bg-primary hover:bg-primary-dark "
                  }`}
                  aria-label="Previous page"
                >
                  <FaChevronLeft />
                  Prev
                </button>

                {/* Page Numbers with Ellipsis */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
<<<<<<< HEAD
                  .filter((p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
=======
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      (p >= page - 1 && p <= page + 1)
                  )
>>>>>>> 1aa479b (Upload 2)
                  .map((p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      return (
                        <React.Fragment key={p}>
<<<<<<< HEAD
                          <span className="px-2 text-gray-500 select-none">...</span>
=======
                          <span className="px-2 text-gray-500 select-none">
                            ...
                          </span>
>>>>>>> 1aa479b (Upload 2)
                          <button
                            onClick={() => handlePageChange(p)}
                            className={`mx-1 px-3 py-1 rounded-full font-semibold shadow-md transition ${
                              p === page
                                ? "bg-primary "
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`mx-1 px-3 py-1 rounded-full font-semibold shadow-md transition ${
                          p === page
                            ? "bg-primary"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                {/* Next Button */}
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
<<<<<<< HEAD

=======
>>>>>>> 1aa479b (Upload 2)
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
