const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    option1: { type: String, default: null },
    option2: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    compare: { type: Number, default: null, min: 0 },
    available: { type: Boolean, default: true },
    image: { type: String, default: null },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    handle: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    type: { type: String, required: true, trim: true, index: true },
    tags: { type: [String], default: [] },
    images: { type: [String], default: [] },
    options: { type: [{ name: String, values: [String] }], default: [] },
    variants: { type: [variantSchema], validate: [(v) => v.length > 0, "At least one variant is required"] },
    description: { type: String, default: "" },
    stock: { type: Number, required: true, min: 0, default: 0, index: true },
    inventoryPolicy: { type: String, enum: ["stock", "preorder"], default: "stock", index: true },
    priceStatus: { type: String, enum: ["approved", "estimated"], default: "approved" },
    saleUnit: { type: String, enum: ["piece", "slab", "m²"], default: "piece" },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    dims: { type: String, default: "" },
    weight: { type: String, default: "" },
    seat: { type: String, default: "" },
    origin: { type: String, default: "" },
    sku: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

productSchema.index({ title: "text", type: "text", tags: "text" });
module.exports = mongoose.model("Product", productSchema);
