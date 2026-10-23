const express = require("express");
const crypto = require("crypto");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

const PAYSTACK_API = "https://api.paystack.co";

const getCurrency = () =>
  String(process.env.PAYSTACK_CURRENCY || "USD").toUpperCase();

const getSecretKey = () => {
  const key = process.env.PAYSTACK_SECRET_KEY;

  if (!key || !key.startsWith("sk_test_") && !key.startsWith("sk_live_")) {
    throw new Error("Paystack is not configured correctly.");
  }

  return key;
};

const amountToSmallestUnit = (amount) => Math.round(amount * 100);

const discountFor = (subtotal, items, code) => {
  const volume = items.reduce(
    (sum, item) =>
      sum +
      item.price *
        item.quantity *
        (item.quantity >= 10 ? 0.1 : item.quantity >= 5 ? 0.05 : 0),
    0,
  );

  const afterVolume = subtotal - volume;
  const codeRate =
    code === "FLASH30" ? 0.3 : code === "WELCOME10" ? 0.1 : 0;

  return Math.round(
    (volume + afterVolume * codeRate + (subtotal >= 1000 ? 20 : 0)) * 100,
  ) / 100;
};

async function paystackRequest(path, options = {}) {
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Paystack request failed.");
  }

  return result.data;
}

/*
 * POST /api/orders
 * Create a pending order and initialize Paystack checkout.
 */
router.post("/", protect, async (req, res, next) => {
  let order;

  try {
    const {
      items,
      shippingAddress,
      shippingMethod,
      discountCode,
    } = req.body || {};

    if (!Array.isArray(items) || !items.length || items.length > 100) {
      return res.status(400).json({
        success: false,
        message: "A non-empty cart is required.",
      });
    }

    if (
      !shippingAddress?.email ||
      !shippingAddress?.firstName ||
      !shippingAddress?.lastName ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.region ||
      !shippingAddress?.zip
    ) {
      return res.status(400).json({
        success: false,
        message: "A complete shipping address is required.",
      });
    }

    if (!["standard", "express", "pickup"].includes(shippingMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping method.",
      });
    }

    const currency = getCurrency();

    if (!["USD", "NGN"].includes(currency)) {
      return res.status(500).json({
        success: false,
        message: "The configured payment currency is unsupported.",
      });
    }

    const orderItems = [];

    for (const line of items) {
      const qty = Number(line.qty);

      if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
        return res.status(400).json({
          success: false,
          message: "An item quantity is invalid.",
        });
      }

      const product = await Product.findOne({
        handle: String(line.handle || "").toLowerCase(),
      });

      const variant = product?.variants.find(
        (v) => v.externalId === String(line.variantId),
      );

      if (!product || !variant || !variant.available) {
        return res.status(400).json({
          success: false,
          message: "One or more items are invalid or unavailable.",
        });
      }

      if (product.stock < qty) {
        return res.status(409).json({
          success: false,
          message: `${product.title} does not have enough stock.`,
        });
      }

      orderItems.push({
        product: product._id,
        handle: product.handle,
        title: product.title,
        variantExternalId: variant.externalId,
        variantTitle: variant.title,
        image: variant.image || product.images[0] || "",
        price: variant.price,
        quantity: qty,
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const discount = discountFor(
      subtotal,
      orderItems,
      String(discountCode || "").toUpperCase(),
    );

    const shipping =
      shippingMethod === "pickup"
        ? 0
        : shippingMethod === "express"
          ? subtotal >= 500
            ? 0
            : 45
          : 29;

    const total = Math.round(
      Math.max(0, subtotal - discount + shipping) * 100,
    ) / 100;

    if (!Number.isFinite(total) || total <= 0) {
      return res.status(400).json({
        success: false,
        message: "The order total must be greater than zero.",
      });
    }

    order = await Order.create({
      orderNumber: `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        email: String(shippingAddress.email).trim().toLowerCase(),
        firstName: String(shippingAddress.firstName).trim(),
        lastName: String(shippingAddress.lastName).trim(),
        address: String(shippingAddress.address).trim(),
        city: String(shippingAddress.city).trim(),
        region: String(shippingAddress.region).trim(),
        zip: String(shippingAddress.zip).trim(),
      },
      shippingMethod,
      subtotal,
      discount,
      shipping,
      total,
      currency,
      paymentMethod: "paystack",
      paymentStatus: "pending",
      orderStatus: "pending",
      stockCommitted: false,
    });

    const frontendUrl = (
      process.env.CLIENT_URL || "http://localhost:5173"
    ).replace(/\/+$/, "");

    const callbackUrl = `${frontendUrl}/#/checkout`;

    const payment = await paystackRequest("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: order.shippingAddress.email,
        amount: amountToSmallestUnit(order.total),
        currency: order.currency,
        reference: `HS-${order._id}-${crypto.randomBytes(8).toString("hex")}`,
        callback_url: callbackUrl,
        metadata: {
          orderId: String(order._id),
          orderNumber: order.orderNumber,
          userId: String(req.user._id),
        },
      }),
    });

    if (!payment.authorization_url || !payment.reference) {
      throw new Error("Paystack did not return a checkout URL.");
    }

    order.paymentReference = payment.reference;
    await order.save();

    return res.status(201).json({
      success: true,
      message: "Checkout initialized.",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
      },
      authorizationUrl: payment.authorization_url,
      reference: payment.reference,
    });
  } catch (err) {
    if (order && !order.paymentReference) {
      await Order.deleteOne({ _id: order._id }).catch(() => {});
    }

    if (
      err.message &&
      /paystack|currency|authorization|checkout/i.test(err.message)
    ) {
      return res.status(502).json({
        success: false,
        message: err.message,
      });
    }

    return next(err);
  }
});

/*
 * GET /api/orders/verify/:reference
 * Verify payment with Paystack before confirming the order.
 */
router.get("/verify/:reference", protect, async (req, res, next) => {
  try {
    const reference = String(req.params.reference || "");

    if (!reference || reference.length > 200) {
      return res.status(400).json({
        success: false,
        message: "A valid payment reference is required.",
      });
    }

    const order = await Order.findOne({
      paymentReference: reference,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order was found for this payment reference.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.json({
        success: true,
        message: "Payment has already been verified.",
        order,
      });
    }

    const payment = await paystackRequest(
      `/transaction/verify/${encodeURIComponent(reference)}`,
    );

    if (
      payment.reference !== order.paymentReference ||
      payment.status !== "success" ||
      payment.currency !== order.currency ||
      Number(payment.amount) !== amountToSmallestUnit(order.total)
    ) {
      if (payment.status === "failed" || payment.status === "abandoned") {
        order.paymentStatus = "failed";
        await order.save();
      }

      return res.status(400).json({
        success: false,
        message: "Payment has not been verified. Your order is not confirmed.",
      });
    }

    /*
     * Recheck stock and commit it only after successful payment.
     * Roll back any partial deductions if an item is unavailable.
     */
    const committedItems = [];

    for (const item of order.items) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        { new: true },
      );

      if (!product) {
        for (const committed of committedItems) {
          await Product.updateOne(
            { _id: committed.product },
            { $inc: { stock: committed.quantity } },
          );
        }

        return res.status(409).json({
          success: false,
          message:
            "Payment succeeded, but an item is now out of stock. Contact support before placing another order.",
          paymentReceived: true,
          orderNumber: order.orderNumber,
        });
      }

      committedItems.push(item);
    }

    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    order.stockCommitted = true;
    await order.save();

    await User.updateOne(
      { _id: req.user._id },
      { $set: { cart: [] } },
    );

    return res.json({
      success: true,
      message: "Payment verified and order confirmed.",
      order,
    });
  } catch (err) {
    return next(err);
  }
});

/*
 * GET /api/orders/mine
 * Customer order history.
 */
router.get("/mine", protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");

    return res.json({ success: true, orders });
  } catch (err) {
    return next(err);
  }
});

/*
 * GET /api/orders
 * Admin order listing.
 */
router.get("/", protect, admin, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort("-createdAt")
      .limit(200);

    return res.json({ success: true, orders });
  } catch (err) {
    return next(err);
  }
});

/*
 * PATCH /api/orders/:id
 * Admin order management.
 */
router.patch("/:id", protect, admin, async (req, res, next) => {
  try {
    const update = {};

    if (
      ["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        req.body?.orderStatus,
      )
    ) {
      update.orderStatus = req.body.orderStatus;
    }

    /*
     * Payment status is intentionally not editable here.
     * Only verified Paystack transactions can mark an order as paid.
     */
    if (req.body?.paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status must be updated through payment verification.",
      });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.json({ success: true, order });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;