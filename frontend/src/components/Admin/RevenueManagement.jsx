import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSummary,
  fetchMonthlySales,
  fetchRecentOrders,
  fetchMonthlyStatistics,
} from "../../redux/slices/revenueSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Chart from "react-apexcharts";

// Badge component cho trạng thái đơn hàng
function Badge({ size, color, children }) {
  const base = "inline-block px-2 py-0.5 rounded font-semibold text-white";
  const sizeClass = size === "sm" ? "text-xs" : "text-sm";
  const colorClass =
    color === "success"
      ? "bg-green-600"
      : color === "warning"
      ? "bg-yellow-500"
      : "bg-red-600";

  return (
    <span className={`${base} ${sizeClass} ${colorClass}`}>{children}</span>
  );
}

// Icon components
const ArrowUpIcon = () => (
  <span className="text-green-500 text-lg font-bold select-none">▲</span>
);
const ArrowDownIcon = () => (
  <span className="text-red-500 text-lg font-bold select-none">▼</span>
);
const GroupIcon = () => (
  <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-xl">👥</div>
);
const BoxIconLine = () => (
  <div className="bg-purple-100 text-purple-600 rounded-full p-2 text-xl">
    📦
  </div>
);
const MoreDotIcon = () => (
  <svg
    className="w-6 h-6 fill-current"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

export default function RevenueDashboard() {
  const dispatch = useDispatch();
  const {
    summary,
    monthlySales,

    recentOrders,
    monthlyStatistics,
    loading,
    error,
  } = useSelector((state) => state.revenue);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchMonthlySales());

    dispatch(fetchRecentOrders());
    dispatch(fetchMonthlyStatistics());
  }, [dispatch]);

  const formattedMonthlySales = monthlySales.map((item) => ({
    month: item._id.month,
    year: item._id.year,
    totalSales: item.totalSales,
    count: item.count,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 font-semibold p-4 bg-red-100 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
        Revenue Dashboard
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Customers */}
        <div className="flex flex-col justify-between rounded-xl p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="self-start mb-4">
            <GroupIcon />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Customers
            </p>
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {summary?.totalCustomers?.toLocaleString() ?? 0}
            </h3>
            <span className="inline-flex items-center gap-1 text-green-500 mt-2 font-medium">
              <ArrowUpIcon />
              {summary?.customersChangePercent?.toFixed(2) ?? "0.00"}%
            </span>
          </div>
        </div>

        {/* Orders */}
        <div className="flex flex-col justify-between rounded-xl p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="self-start mb-4">
            <BoxIconLine />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Orders
            </p>
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {summary?.totalOrders?.toLocaleString() ?? 0}
            </h3>
            <span className="inline-flex items-center gap-1 text-red-500 mt-2 font-medium">
              <ArrowDownIcon />
              {summary?.ordersChangePercent?.toFixed(2) ?? "0.00"}%
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="flex flex-col justify-center rounded-xl p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Total Revenue
          </p>
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
            ${summary?.totalRevenue ? summary.totalRevenue.toLocaleString() : 0}
          </h3>
        </div>
      </div>

      {/* Monthly Sales Chart */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Monthly Sales
        </h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedMonthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(val, idx) => {
                  const item = formattedMonthlySales[idx];
                  return item ? `${item.month}/${item.year}` : val;
                }}
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
                tickFormatter={(val) =>
                  typeof val === "number" ? val.toLocaleString() : val
                }
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8 }}
                labelStyle={{ color: "#f9fafb", fontWeight: "bold" }}
                itemStyle={{ color: "#f9fafb" }}
              />
              <Line
                type="monotone"
                dataKey="totalSales"
                stroke="#6366f1"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Monthly Targets (radial bar) */}

      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <div className="relative">
            <button
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="More options"
            >
              <MoreDotIcon />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
                <button
                  className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setDropdownOpen(false)}
                >
                  View More
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No recent orders</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Image
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Order ID
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Total Price
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const firstImage =
                    order.orderItems?.[0]?.productId?.images?.[0]?.url ||
                    order.orderItems?.[0]?.image ||
                    "https://via.placeholder.com/50";

                  let statusColor = "bg-gray-400 text-white";
                  const statusLower = order.status.toLowerCase();
                  if (statusLower.includes("processing")) {
                    statusColor = "bg-blue-500 text-white";
                  } else if (statusLower.includes("shipped")) {
                    statusColor = "bg-yellow-400 text-black";
                  } else if (statusLower.includes("delivered")) {
                    statusColor = "bg-green-500 text-white";
                  } else if (statusLower.includes("canceled")) {
                    statusColor = "bg-red-600 text-white";
                  }

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition"
                    >
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        <img
                          src={firstImage}
                          alt="Product"
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-mono text-indigo-600 dark:text-indigo-400">
                        {order._id}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold">
                        ${(order.totalPrice ?? 0).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        <span
                          className={`inline-block px-2 py-1 rounded font-semibold ${statusColor}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Monthly Statistics Chart */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Monthly Statistics
        </h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyStatistics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(val, idx) => {
                  const item = monthlyStatistics[idx];
                  return item && item.month && item.year
                    ? `${item.month}/${item.year}`
                    : val;
                }}
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
                tickFormatter={(val) =>
                  typeof val === "number" ? val.toLocaleString() : val
                }
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8 }}
                labelStyle={{ color: "#f9fafb", fontWeight: "bold" }}
                itemStyle={{ color: "#f9fafb" }}
              />
              <Line
                type="monotone"
                dataKey="totalOrders"
                stroke="#10b981"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
