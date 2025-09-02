import express from "express";
import twilio from "twilio";
import CallLog from "../models/CallLog.js";
import Seller from "../models/Seller.js";

const router = express.Router();
const VoiceResponse = twilio.twiml.VoiceResponse;

// Lead javob berganda: seller'ga ulaymiz
router.post("/lead-answer", async (req, res) => {
  // Aktiv seller topamiz (MVP: bir dona aktiv)
  const seller = await Seller.findOne({ isActive: true }).sort({ createdAt: -1 });

  const twiml = new VoiceResponse();
  if (seller?.phone) {
    const dial = twiml.dial({ callerId: process.env.TWILIO_CALLER_ID, answerOnBridge: true });
    dial.number(seller.phone);
  } else {
    twiml.say("Sorry, no seller is available right now.");
    twiml.hangup();
  }
  res.type("text/xml").send(twiml.toString());
});

// Status callback: log saqlash
router.post("/status", async (req, res) => {
  try {
    const { CallSid, CallStatus, To, From, Direction, CallDuration } = req.body;
    await CallLog.create({
      sid: CallSid,
      status: CallStatus,
      leadPhone: To,
      sellerPhone: null,
      direction: Direction,
      duration: CallDuration ? Number(CallDuration) : null,
      raw: req.body
    });
  } catch (e) { /* ignore */ }
  res.sendStatus(200);
});

export default router;