import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  status: { type: String, enum: ["pending","calling","answered","no-answer","failed","completed"], default: "pending" },
  tries: { type: Number, default: 0 },
  lastTriedAt: Date
}, { timestamps: true });

export default mongoose.model("Lead", LeadSchema);