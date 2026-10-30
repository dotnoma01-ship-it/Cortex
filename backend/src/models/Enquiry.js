const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    question: { type: String, required: true, trim: true, maxlength: 5000 },
    productTitle: { type: String, trim: true, maxlength: 180, default: "" },
    productUrl: { type: String, trim: true, maxlength: 2048, default: "" },
    selectedOptions: { type: [String], default: [] },
    emailStatus: { type: String, enum: ["pending", "accepted", "failed"], default: "pending" },
    emailProviderId: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Enquiry", enquirySchema);
