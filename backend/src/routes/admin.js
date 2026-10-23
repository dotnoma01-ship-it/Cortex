const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/auth");
const router = express.Router();

router.get("/dashboard", protect, admin, async (req, res, next) => {
  try {
    const [products, lowStock, orderStats] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
      Order.aggregate([{ $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$total", 0] } }, pendingPayments: { $sum: { $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0] } } } }]),
    ]);
    const stats = orderStats[0] || { orders: 0, revenue: 0, pendingPayments: 0 };
    res.json({ success: true, stats: { products, lowStock, ...stats } });
  } catch (err) { next(err); }
});
module.exports = router;
