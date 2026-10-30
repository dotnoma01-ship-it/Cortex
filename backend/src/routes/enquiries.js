const express = require("express");
const rateLimit = require("express-rate-limit");
const Enquiry = require("../models/Enquiry");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();
const sendLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many enquiries. Please try again later." },
});

const emailConfigured = () => Boolean(
  process.env.RESEND_API_KEY &&
  process.env.ENQUIRY_FROM_EMAIL &&
  process.env.ENQUIRY_TO_EMAIL,
);

const cleanText = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";

router.get("/config", (req, res) => {
  res.json({
    success: true,
    emailEnabled: emailConfigured(),
    whatsappNumber: String(process.env.WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  });
});

router.post("/", sendLimit, async (req, res, next) => {
  try {
    if (!emailConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Email enquiries are not configured yet. Please use WhatsApp if it is available.",
      });
    }

    const name = cleanText(req.body?.name, 120);
    const email = cleanText(req.body?.email, 254).toLowerCase();
    const question = cleanText(req.body?.question, 5000);
    const productTitle = cleanText(req.body?.productTitle, 180);
    const productUrl = cleanText(req.body?.productUrl, 2048);
    const selectedOptions = Array.isArray(req.body?.selectedOptions)
      ? req.body.selectedOptions.filter((x) => typeof x === "string").slice(0, 8).map((x) => cleanText(x, 100))
      : [];

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !question) {
      return res.status(400).json({ success: false, message: "Enter your name, a valid email, and a question." });
    }
    if (productUrl) {
      try {
        const parsed = new URL(productUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid URL protocol");
      } catch {
        return res.status(400).json({ success: false, message: "The product page URL is invalid." });
      }
    }

    const enquiry = await Enquiry.create({ name, email, question, productTitle, productUrl, selectedOptions });
    const details = [
      `Name: ${name}`,
      `Customer email: ${email}`,
      productTitle ? `Product: ${productTitle}` : "",
      productUrl ? `Product page: ${productUrl}` : "",
      selectedOptions.length ? `Selected options: ${selectedOptions.join("; ")}` : "",
      "",
      "Question:",
      question,
      `Enquiry reference: ${enquiry.id}`,
    ].filter(Boolean).join("\n");

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.ENQUIRY_FROM_EMAIL,
          to: [process.env.ENQUIRY_TO_EMAIL],
          reply_to: email,
          subject: productTitle ? `Product enquiry: ${productTitle}` : "Cortex website enquiry",
          text: details,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.id) throw new Error("Email provider did not accept the enquiry notification.");
      enquiry.emailStatus = "accepted";
      enquiry.emailProviderId = String(result.id).slice(0, 200);
      await enquiry.save();
      return res.status(201).json({ success: true, recorded: true, emailStatus: "accepted" });
    } catch (error) {
      enquiry.emailStatus = "failed";
      await enquiry.save();
      console.error("Enquiry notification failed:", error.message);
      return res.status(202).json({ success: true, recorded: true, emailStatus: "failed" });
    }
  } catch (err) {
    return next(err);
  }
});

router.get("/", protect, admin, async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort("-createdAt").limit(200).lean();
    return res.json({ success: true, enquiries });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
