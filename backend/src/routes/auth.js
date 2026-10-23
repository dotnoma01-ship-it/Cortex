const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();
const token = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const profile = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

router.post("/register", async (req, res, next) => { try {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password || String(password).length < 8) return res.status(400).json({ success: false, message: "Name, valid email, and an 8-character password are required" });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address" });
  if (await User.exists({ email: String(email).toLowerCase() })) return res.status(409).json({ success: false, message: "An account with that email already exists" });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  res.status(201).json({ success: true, token: token(user), user: profile(user) });
} catch (err) { next(err); } });
router.post("/login", async (req, res, next) => { try {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email: String(email || "").toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(String(password || ""), user.password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
  res.json({ success: true, token: token(user), user: profile(user) });
} catch (err) { next(err); } });
router.get("/me", protect, (req, res) => res.json({ success: true, user: profile(req.user) }));
router.patch("/me", protect, async (req, res, next) => { try {
  const { name, email } = req.body || {};
  if (name) req.user.name = String(name).trim();
  if (email && /^\S+@\S+\.\S+$/.test(email)) { const exists = await User.exists({ email: String(email).toLowerCase(), _id: { $ne: req.user._id } }); if (exists) return res.status(409).json({ success: false, message: "Email is already in use" }); req.user.email = String(email).toLowerCase(); }
  await req.user.save(); res.json({ success: true, user: profile(req.user) });
} catch (err) { next(err); } });
module.exports = router;
