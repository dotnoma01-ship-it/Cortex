const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  { product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, variantExternalId: { type: String, required: true }, quantity: { type: Number, required: true, min: 1, max: 100 } },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    cart: { type: [cartItemSchema], default: [] },
    wishlist: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], default: [] },
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", userSchema);
