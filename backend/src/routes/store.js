const express = require("express");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const { publicProduct } = require("../utils/product");
const router = express.Router();
const cartResponse = async (user) => { await user.populate("cart.product"); return user.cart.filter((line) => line.product).map((line) => ({ product: publicProduct(line.product), variantId: line.variantExternalId, quantity: line.quantity })); };
router.get("/cart", protect, async (req, res, next) => { try { res.json({ success: true, cart: await cartResponse(req.user) }); } catch (err) { next(err); } });
router.put("/cart", protect, async (req, res, next) => { try {
  const lines = Array.isArray(req.body?.items) ? req.body.items : null;
  if (!lines || lines.length > 100) return res.status(400).json({ success: false, message: "A cart with up to 100 items is required" });
  const nextCart = [];
  for (const line of lines) { const product = await Product.findOne({ handle: String(line.handle || "").toLowerCase() }); const qty = Number(line.qty); const variant = product?.variants.find((v) => v.externalId === String(line.variantId)); const preorder = product?.inventoryPolicy === "preorder"; if (!product || !variant || !variant.available || !Number.isInteger(qty) || qty < 1 || qty > 100 || (!preorder && qty > product.stock)) return res.status(400).json({ success: false, message: "One or more cart items are unavailable or exceed stock" }); nextCart.push({ product: product._id, variantExternalId: variant.externalId, quantity: qty }); }
  req.user.cart = nextCart; await req.user.save(); res.json({ success: true, cart: await cartResponse(req.user) });
} catch (err) { next(err); } });
router.get("/wishlist", protect, async (req, res, next) => { try { await req.user.populate("wishlist"); res.json({ success: true, products: req.user.wishlist.filter(Boolean).map(publicProduct) }); } catch (err) { next(err); } });
router.put("/wishlist", protect, async (req, res, next) => { try { const handles = Array.isArray(req.body?.handles) ? req.body.handles.slice(0, 100) : null; if (!handles) return res.status(400).json({ success: false, message: "Wishlist handles are required" }); const products = await Product.find({ handle: { $in: handles.map((h) => String(h).toLowerCase()) } }); req.user.wishlist = products.map((p) => p._id); await req.user.save(); res.json({ success: true, products: products.map(publicProduct) }); } catch (err) { next(err); } });
module.exports = router;
