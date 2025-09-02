import mongoose from "mongoose";

const CallLogSchema = new mongoose.Schema({
  leadPhone: String,
  sellerPhone: String,
  status: String,          // queued, ringing, in-progress, completed, no-answer, busy, failed, etc.
  sid: String,
  direction: String,       // outbound-api, ...
  duration: Number,
  raw: Object
}, { timestamps: true });

export default mongoose.model("CallLog", CallLogSchema);