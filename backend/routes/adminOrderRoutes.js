const express = require('express');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/admin/orders?page=&limit= — lấy với phân trang
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

<<<<<<< HEAD
    const totalOrders = await Order.countDocuments();

=======

    const totalOrders = await Order.countDocuments();


    const totalRevenueAgg = await Order.aggregate([
      { $match: {} },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

>>>>>>> 1aa479b (Upload 2)
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      page,
      totalPages: Math.ceil(totalOrders / limit),
<<<<<<< HEAD
      totalOrders
=======
      totalOrders,
      totalRevenue
>>>>>>> 1aa479b (Upload 2)
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

<<<<<<< HEAD
// PUT /api/admin/orders/:id — cập nhật trạng thái đơn
=======
// PUT /api/admin/orders/:id
>>>>>>> 1aa479b (Upload 2)
router.put('/:id', protect, admin, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status || order.status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

<<<<<<< HEAD
// DELETE /api/admin/orders/:id — xoá đơn hàng
=======
// DELETE /api/admin/orders/:id 
>>>>>>> 1aa479b (Upload 2)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

<<<<<<< HEAD
// GET /api/admin/orders/stats/revenue — thống kê doanh thu
router.get('/stats/revenue', protect, admin, async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    const defaultEnd = new Date();
    const defaultStart = new Date(defaultEnd);
    defaultStart.setDate(defaultEnd.getDate() - 30);

    const start = startDate ? new Date(startDate) : defaultStart;
    const end = endDate ? new Date(endDate) : defaultEnd;

    const matchFilter = {
      createdAt: { $gte: start, $lte: end },
      isPaid: true
    };

    let groupBy;
    if (period === 'daily') {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    } else if (period === 'weekly') {
      groupBy = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
    } else {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
    }

    const currentStats = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
          '_id.week': 1
        }
      }
    ]);

    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration);
    const prevEnd = new Date(end.getTime() - duration);

    const prevStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: prevStart, $lte: prevEnd },
          isPaid: true
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    const currRevenue = currentStats.reduce((sum, s) => sum + s.totalRevenue, 0);
    const currOrders = currentStats.reduce((sum, s) => sum + s.orderCount, 0);
    const currAOV = currRevenue / (currOrders || 1);

    const prevRevenue = prevStats[0]?.totalRevenue || 0;
    const prevOrders = prevStats[0]?.orderCount || 0;
    const prevAOV = prevRevenue / (prevOrders || 1);

    const percentChange = (curr, prev) =>
      prev ? ((curr - prev) / prev) * 100 : 0;

    const chartData = currentStats.map((s) => {
      let date;
      if (period === 'daily') {
        date = new Date(s._id.year, s._id.month - 1, s._id.day).toISOString();
      } else if (period === 'weekly') {
        date = new Date(s._id.year, 0, 1 + (s._id.week - 1) * 7).toISOString();
      } else {
        date = new Date(s._id.year, s._id.month - 1, 1).toISOString();
      }
      return {
        date,
        revenue: s.totalRevenue,
        orders: s.orderCount,
        averageOrderValue: s.avgOrderValue
      };
    });

    res.json({
      totalRevenue: currRevenue,
      totalOrders: currOrders,
      avgOrderValue: currAOV,
      revenueChange: parseFloat(percentChange(currRevenue, prevRevenue).toFixed(2)),
      ordersChange: parseFloat(percentChange(currOrders, prevOrders).toFixed(2)),
      aovChange: parseFloat(percentChange(currAOV, prevAOV).toFixed(2)),
      chartData: {
        labels: chartData.map((d) => d.date),
        data: chartData.map((d) => d.revenue)
      },
      detailedStats: chartData
    });
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
=======
// GET /api/admin/orders/stats/revenue
// router.get('/stats/revenue', protect, admin, async (req, res) => {
//   try {
//     const { period = 'monthly', startDate, endDate } = req.query;
//     const defaultEnd = new Date();
//     const defaultStart = new Date(defaultEnd);
//     defaultStart.setDate(defaultEnd.getDate() - 30);

//     const start = startDate ? new Date(startDate) : defaultStart;
//     const end = endDate ? new Date(endDate) : defaultEnd;

//     const matchFilter = {
//       createdAt: { $gte: start, $lte: end },
//       isPaid: true
//     };

//     let groupBy;
//     if (period === 'daily') {
//       groupBy = {
//         year: { $year: '$createdAt' },
//         month: { $month: '$createdAt' },
//         day: { $dayOfMonth: '$createdAt' }
//       };
//     } else if (period === 'weekly') {
//       groupBy = {
//         year: { $year: '$createdAt' },
//         week: { $week: '$createdAt' }
//       };
//     } else {
//       groupBy = {
//         year: { $year: '$createdAt' },
//         month: { $month: '$createdAt' }
//       };
//     }

//     const currentStats = await Order.aggregate([
//       { $match: matchFilter },
//       {
//         $group: {
//           _id: groupBy,
//           totalRevenue: { $sum: '$totalPrice' },
//           orderCount: { $sum: 1 },
//           avgOrderValue: { $avg: '$totalPrice' }
//         }
//       },
//       {
//         $sort: {
//           '_id.year': 1,
//           '_id.month': 1,
//           '_id.day': 1,
//           '_id.week': 1
//         }
//       }
//     ]);

//     const duration = end.getTime() - start.getTime();
//     const prevStart = new Date(start.getTime() - duration);
//     const prevEnd = new Date(end.getTime() - duration);

//     const prevStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: prevStart, $lte: prevEnd },
//           isPaid: true
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: '$totalPrice' },
//           orderCount: { $sum: 1 }
//         }
//       }
//     ]);

//     const currRevenue = currentStats.reduce((sum, s) => sum + s.totalRevenue, 0);
//     const currOrders = currentStats.reduce((sum, s) => sum + s.orderCount, 0);
//     const currAOV = currRevenue / (currOrders || 1);

//     const prevRevenue = prevStats[0]?.totalRevenue || 0;
//     const prevOrders = prevStats[0]?.orderCount || 0;
//     const prevAOV = prevRevenue / (prevOrders || 1);

//     const percentChange = (curr, prev) =>
//       prev ? ((curr - prev) / prev) * 100 : 0;

//     const chartData = currentStats.map((s) => {
//       let date;
//       if (period === 'daily') {
//         date = new Date(s._id.year, s._id.month - 1, s._id.day).toISOString();
//       } else if (period === 'weekly') {
//         date = new Date(s._id.year, 0, 1 + (s._id.week - 1) * 7).toISOString();
//       } else {
//         date = new Date(s._id.year, s._id.month - 1, 1).toISOString();
//       }
//       return {
//         date,
//         revenue: s.totalRevenue,
//         orders: s.orderCount,
//         averageOrderValue: s.avgOrderValue
//       };
//     });

//     res.json({
//       totalRevenue: currRevenue,
//       totalOrders: currOrders,
//       avgOrderValue: currAOV,
//       revenueChange: parseFloat(percentChange(currRevenue, prevRevenue).toFixed(2)),
//       ordersChange: parseFloat(percentChange(currOrders, prevOrders).toFixed(2)),
//       aovChange: parseFloat(percentChange(currAOV, prevAOV).toFixed(2)),
//       chartData: {
//         labels: chartData.map((d) => d.date),
//         data: chartData.map((d) => d.revenue)
//       },
//       detailedStats: chartData
//     });
//   } catch (error) {
//     console.error('Error fetching revenue stats:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });
>>>>>>> 1aa479b (Upload 2)

module.exports = router;
