const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");
const { publicProduct } = require("../utils/product");
const router = express.Router();

const productFields = ["handle", "title", "type", "tags", "images", "options", "variants", "description", "stock", "rating", "reviews", "dims", "weight", "seat", "origin", "sku"];
const normalize = (body) => Object.fromEntries(productFields.filter((key) => body[key] !== undefined).map((key) => [key, key === "description" ? String(body[key]) : body[key]]));
router.get("/", async (req, res, next) => { try {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 48));
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.inStock === "true") filter.stock = { $gt: 0 };
  if (req.query.q) filter.$text = { $search: String(req.query.q) };
  const sortMap = { newest: "-createdAt", price_asc: "variants.price", price_desc: "-variants.price", title_asc: "title", title_desc: "-title" };
  const [rows, total] = await Promise.all([Product.find(filter).sort(sortMap[req.query.sort] || "-createdAt").skip((page - 1) * limit).limit(limit), Product.countDocuments(filter)]);
  res.json({ success: true, products: rows.map(publicProduct), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
} catch (err) { next(err); } });
router.get("/:handle", async (req, res, next) => { try { const product = await Product.findOne({ handle: req.params.handle.toLowerCase() }); if (!product) return res.status(404).json({ success: false, message: "Product not found" }); res.json({ success: true, product: publicProduct(product) }); } catch (err) { next(err); } });
router.post("/", protect, admin, async (req, res, next) => { try { const product = await Product.create({ ...normalize(req.body || {}), externalId: String(req.body.externalId || Date.now()) }); res.status(201).json({ success: true, product: publicProduct(product) }); } catch (err) { next(err); } });
router.patch("/:id", protect, admin, async (req, res, next) => { try { const product = await Product.findByIdAndUpdate(req.params.id, normalize(req.body || {}), { new: true, runValidators: true }); if (!product) return res.status(404).json({ success: false, message: "Product not found" }); res.json({ success: true, product: publicProduct(product) }); } catch (err) { next(err); } });
module.exports = router;
