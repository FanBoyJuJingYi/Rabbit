const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const User = require('../models/User');

// middleware bảo vệ admin cho tất cả route
router.use(protect);
router.use(admin);

// GET /api/admin/revenue/summary
router.get('/summary', async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const ordersCount = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    res.json({
      totalCustomers: usersCount,
      totalOrders: ordersCount,
      totalRevenue: totalSales[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /api/admin/revenue/sales/:period
router.get('/sales/:period', async (req, res) => {
  try {
    const { period } = req.params;
    let groupBy = {};
    let sortBy = {};

    switch (period) {
      case 'monthly':
        groupBy = {
          _id: { year: { $year: '$paidAt' }, month: { $month: '$paidAt' } },
        };
        sortBy = { '_id.year': 1, '_id.month': 1 };
        break;
      case 'quarterly':
        groupBy = {
          _id: {
            year: { $year: '$paidAt' },
            quarter: {
              $ceil: { $divide: [{ $month: '$paidAt' }, 3] },
            },
          },
        };
        sortBy = { '_id.year': 1, '_id.quarter': 1 };
        break;
      case 'yearly':
        groupBy = {
          _id: { year: { $year: '$paidAt' } },
        };
        sortBy = { '_id.year': 1 };
        break;
      default:
        return res.status(400).json({ message: 'Invalid period' });
    }

    const salesData = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          ...groupBy,
          totalSales: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: sortBy },
    ]);

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /api/admin/revenue/targets/:period
router.get('/targets/:period', async (req, res) => {
  try {
    const { period } = req.params;
    let targets = [];

    // Trả dữ liệu mẫu (nếu chưa có model Target)
    if (period === 'monthly') {
      targets = [
        { _id: { year: 2025, month: 7 }, targetAmount: 1000000 },
        { _id: { year: 2025, month: 8 }, targetAmount: 1500000 },
      ];
    } else if (period === 'quarterly') {
      targets = [
        { _id: { year: 2025, quarter: 3 }, targetAmount: 3000000 },
        { _id: { year: 2025, quarter: 4 }, targetAmount: 4500000 },
      ];
    } else if (period === 'yearly') {
      targets = [
        { _id: { year: 2024 }, targetAmount: 10000000 },
        { _id: { year: 2025 }, targetAmount: 15000000 },
      ];
    } else {
      return res.status(400).json({ message: 'Invalid period' });
    }

    res.json(targets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /api/admin/revenue/orders/recent
router.get('/orders/recent', async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate({
        path: 'orderItems.productId',
        select: 'name images',
      });

    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /api/admin/revenue/statistics/:period
router.get('/statistics/:period', async (req, res) => {
  try {
    const { period } = req.params;
    let groupBy = {};
    let sortBy = {};

    switch (period) {
      case 'monthly':
        groupBy = {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        };
        sortBy = { '_id.year': 1, '_id.month': 1 };
        break;
      case 'quarterly':
        groupBy = {
          _id: {
            year: { $year: '$createdAt' },
            quarter: {
              $ceil: { $divide: [{ $month: '$createdAt' }, 3] },
            },
          },
        };
        sortBy = { '_id.year': 1, '_id.quarter': 1 };
        break;
      case 'yearly':
        groupBy = {
          _id: { year: { $year: '$createdAt' } },
        };
        sortBy = { '_id.year': 1 };
        break;
      default:
        return res.status(400).json({ message: 'Invalid period' });
    }

    const stats = await Order.aggregate([
      {
        $group: {
          ...groupBy,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: sortBy },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
