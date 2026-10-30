const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Enquiry = require("../models/Enquiry");
const { protect, admin } = require("../middleware/auth");
const router = express.Router();

const projectRoot = path.resolve(__dirname, "../../../");
const pageParams = (query) => ({
  page: Math.max(1, Number.parseInt(query.page, 10) || 1),
  limit: Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 25)),
});

router.get("/dashboard", protect, admin, async (req, res, next) => {
  try {
    const [products, lowStock, customers, enquiries, orderStats, revenueByCurrency] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
      User.countDocuments({ role: "customer" }),
      Enquiry.countDocuments(),
      Order.aggregate([{ $group: { _id: null, orders: { $sum: 1 }, pendingPayments: { $sum: { $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0] } } } }]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: "$currency", revenue: { $sum: "$total" }, paidOrders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    const stats = orderStats[0] || { orders: 0, revenue: 0, pendingPayments: 0 };
    res.json({ success: true, stats: { products, lowStock, customers, enquiries, orders: stats.orders, pendingPayments: stats.pendingPayments, revenueByCurrency } });
  } catch (err) { next(err); }
});

router.get("/categories", protect, admin, async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$type", productCount: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, categories: categories.map(({ _id, productCount }) => ({ name: _id, productCount })) });
  } catch (err) { next(err); }
});

router.get("/customers", protect, admin, async (req, res, next) => {
  try {
    const { page, limit } = pageParams(req.query);
    const query = String(req.query.q || "").trim().slice(0, 120);
    const filter = { role: "customer" };
    if (query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ name: { $regex: escaped, $options: "i" } }, { email: { $regex: escaped, $options: "i" } }];
    }
    const [customers, total] = await Promise.all([
      User.find(filter).select("name email role createdAt updatedAt").sort("-createdAt").skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, customers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
});

router.get("/inventory", protect, admin, async (req, res, next) => {
  try {
    const { page, limit } = pageParams(req.query);
    const filter = req.query.lowStock === "true" ? { stock: { $lte: 5 } } : {};
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ stock: 1, title: 1 }).skip((page - 1) * limit).limit(limit),
      Product.countDocuments(filter),
    ]);
    const { publicProduct } = require("../utils/product");
    res.json({ success: true, products: products.map(publicProduct), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
});

router.get("/sourcing", protect, admin, async (req, res, next) => {
  try {
    // Explicit allowlist: never accept a path or filename from the request.
    const allowedFiles = {
      dataset: path.join(projectRoot, "alibaba-bulk-import-dataset.json"),
      research: path.join(projectRoot, "alibaba-bulk-import-research.md"),
      supplierTemplates: path.join(projectRoot, "supplier-enquiry-templates.md"),
    };
    const [datasetText, researchReport, supplierTemplates] = await Promise.all([
      fs.readFile(allowedFiles.dataset, "utf8"),
      fs.readFile(allowedFiles.research, "utf8"),
      fs.readFile(allowedFiles.supplierTemplates, "utf8"),
    ]);
    res.json({ success: true, dataset: JSON.parse(datasetText), researchReport, supplierTemplates });
  } catch (err) {
    if (err.code === "ENOENT") return res.status(503).json({ success: false, message: "Sourcing files are not available in this backend deployment." });
    next(err);
  }
});

module.exports = router;
