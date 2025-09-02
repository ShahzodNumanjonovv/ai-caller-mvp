import Lead from "../models/Lead.js";
import CallLog from "../models/CallLog.js";
import twilio from "twilio";
import dayjs from "dayjs";
import { ioRef } from "../index.js";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

let running = false;
let busy = false;

export function getCampaignState() { return { running, busy }; }

export async function startCampaign() {
  running = true;
  loop();
}

export async function stopCampaign() {
  running = false;
}

async function loop() {
  if (!running) return;
  if (busy) return setTimeout(loop, 1000);

  // keyingi pending lead
  const lead = await Lead.findOneAndUpdate(
    { status: "pending" },
    { status: "calling", lastTriedAt: new Date(), $inc: { tries: 1 } },
    { sort: { updatedAt: 1 }, new: true }
  );

  if (!lead) {
    ioRef()?.emit("log", { t: Date.now(), msg: "No pending leads." });
    running = false;
    return;
  }

  busy = true;
  ioRef()?.emit("log", { t: Date.now(), msg: `Dialing ${lead.phone} ...` });

  try {
    const call = await client.calls.create({
      to: lead.phone,
      from: process.env.TWILIO_CALLER_ID,
      // lead javob berganda shu URL dan TwiML olib, seller'ga bog'laydi
      url: `${process.env.PUBLIC_BASE_URL}/voice/lead-answer`,
      // call lifecycle loglari:
      statusCallback: `${process.env.PUBLIC_BASE_URL}/voice/status`,
      statusCallbackMethod: "POST",
      statusCallbackEvent: ["queued","ringing","answered","completed"]
    });

    await CallLog.create({ sid: call.sid, leadPhone: lead.phone, status: call.status, direction: call.direction, raw: call });

    // 30s kutamiz: answered bo'lmasa next
    setTimeout(async () => {
      // Twilio statuslarini ko'p hollarda callbackdan olamiz; bu yerda minimal tekshiruv
      const latest = await CallLog.findOne({ sid: call.sid }).sort({ createdAt: -1 });
      const s = latest?.status || "unknown";
      if (["answered","in-progress","completed"].includes(s)) {
        await Lead.updateOne({ _id: lead._id }, { status: "completed" });
        ioRef()?.emit("log", { t: Date.now(), msg: `Lead ${lead.phone} connected → seller.` });
      } else {
        await Lead.updateOne({ _id: lead._id }, { status: "no-answer" });
        ioRef()?.emit("log", { t: Date.now(), msg: `No answer: ${lead.phone} → next.` });
      }
      busy = false;
      loop();
    }, 30000);

  } catch (e) {
    await Lead.updateOne({ _id: lead._id }, { status: "failed" });
    ioRef()?.emit("log", { t: Date.now(), msg: `Failed ${lead.phone}: ${e.message}` });
    busy = false;
    setTimeout(loop, 1000);
  }
}