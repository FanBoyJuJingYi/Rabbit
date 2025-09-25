const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  expiresAt: { type: Date },
  minPurchase: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // user đã dùng coupon
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
