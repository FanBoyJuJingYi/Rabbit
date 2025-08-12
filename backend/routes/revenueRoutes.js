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
      { $match: { isPaid: true } },
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

// GET /api/admin/revenue/sales/monthly
router.get('/sales/monthly', async (req, res) => {
  try {
    const monthlySales = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { year: { $year: '$paidAt' }, month: { $month: '$paidAt' } },
          totalSales: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json(monthlySales);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /api/admin/revenue/targets/monthly
router.get('/targets/monthly', async (req, res) => {
  try {
    // Trả dữ liệu mẫu (nếu chưa có model Target)
    res.json([
      { _id: '2025-07', targetAmount: 1000000 },
      { _id: '2025-08', targetAmount: 1500000 },
    ]);
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
        select: 'name images', // Lấy cả tên và ảnh
      });

    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /api/admin/revenue/statistics/monthly
router.get('/statistics/monthly', async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
