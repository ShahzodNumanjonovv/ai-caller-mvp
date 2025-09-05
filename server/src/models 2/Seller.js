import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Seller", SellerSchema);