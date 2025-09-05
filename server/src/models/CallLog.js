import mongoose from "mongoose";

const CallLogSchema = new mongoose.Schema({
  callId: String,          // Sipuni call_id yoki id
  leadPhone: String,       // lead raqami
  sellerPhone: String,     // agent/extension raqami
  status: String,          // queued, ringing, answered, completed, no-answer, busy, failed, etc.
  event: String,           // Sipuni event type (agar bo‘lsa)
  direction: { type: String, default: "outbound" },
  duration: Number,        // sekundlarda davomiylik
  raw: Object              // butun webhook payload
}, { timestamps: true });

export default mongoose.model("CallLog", CallLogSchema);