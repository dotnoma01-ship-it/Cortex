const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    handle: String,
    title: String,
    variantExternalId: String,
    variantTitle: String,
    image: String,
    inventoryPolicy: { type: String, enum: ["stock", "preorder"], default: "stock" },
    priceStatus: { type: String, enum: ["approved", "estimated"], default: "approved" },
    saleUnit: { type: String, enum: ["piece", "slab", "m²"], default: "piece" },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [itemSchema],
      required: true,
    },

    shippingAddress: {
      email: {
        type: String,
        required: true,
      },
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      region: String,
      zip: String,
    },

    shippingMethod: {
      type: String,
      enum: ["standard", "express", "pickup"],
      required: true,
    },

    subtotal: {
      type: Number,
      min: 0,
      required: true,
    },

    discount: {
      type: Number,
      min: 0,
      default: 0,
    },

    shipping: {
      type: Number,
      min: 0,
      required: true,
    },

    total: {
      type: Number,
      min: 0,
      required: true,
    },

    currency: {
      type: String,
      enum: ["USD", "NGN"],
      default: "USD",
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["manual", "paystack", "flutterwave"],
      default: "paystack",
    },

    paymentReference: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "awaiting-sourcing",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    stockCommitted: {
      type: Boolean,
      default: false,
    },

    requiresSupplierSourcing: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
