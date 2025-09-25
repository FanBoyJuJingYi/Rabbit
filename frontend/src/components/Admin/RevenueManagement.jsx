import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSummary,
  fetchSales,
  fetchTargets,
  fetchRecentOrders,
  fetchStatistics,
  setPeriod,
} from "../../redux/slices/revenueSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function GroupIcon() {
  return (
    <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-xl">👥</div>
  );
}

function BoxIconLine() {
  return (
    <div className="bg-purple-100 text-purple-600 rounded-full p-2 text-xl">
      📦
    </div>
  );
}

function MoreDotIcon() {
  return (
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
}

export default function RevenueDashboard() {
  const dispatch = useDispatch();
  const {
    summary,
    sales,
    targets,
    recentOrders,
    statistics,
    currentPeriod,
    loading,
    error,
  } = useSelector((state) => state.revenue);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("monthly");

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchSales(timeRange));
    dispatch(fetchTargets(timeRange));
    dispatch(fetchRecentOrders());
    dispatch(fetchStatistics(timeRange));
    dispatch(setPeriod(timeRange));
  }, [dispatch, timeRange]);

  const formatChartData = (data, period) => {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
      let label = "";

      switch (period) {
        case "monthly":
          label = `${item._id.month}/${item._id.year}`;
          break;
        case "quarterly":
          label = `Q${item._id.quarter} ${item._id.year}`;
          break;
        case "yearly":
          label = `${item._id.year}`;
          break;
        default:
          label = `${item._id.month}/${item._id.year}`;
      }

      return {
        label,
        totalSales: item.totalSales || 0,
        count: item.count || 0,
        totalOrders: item.totalOrders || 0,
        totalRevenue: item.totalRevenue || 0,
      };
    });
  };

  const salesData = formatChartData(sales?.[currentPeriod], currentPeriod);
  const statisticsData = formatChartData(
    statistics?.[currentPeriod],
    currentPeriod
  );
  const targetData = formatChartData(targets?.[currentPeriod], currentPeriod);

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
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Revenue Dashboard
        </h1>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Time Range:
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

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

        {/* Period Summary */}
        <div className="flex flex-col justify-center rounded-xl p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Current Period
          </p>
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-white capitalize">
            {timeRange}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {salesData.length} {timeRange} periods
          </p>
        </div>
      </div>

      {/* Sales Chart */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Sales Trend ({timeRange})
        </h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 14 }} />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
                tickFormatter={(val) =>
                  typeof val === "number" ? `$${val.toLocaleString()}` : val
                }
              />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
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

      {/* Recent Orders */}
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
                  } else if (statusLower("canceled")) {
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
                        {order._id.substring(0, 8)}...
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

      {/* Statistics Chart */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Order Statistics ({timeRange})
        </h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statisticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 14 }} />
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
                name="Orders"
              />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#6366f1"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                name="Revenue"
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
