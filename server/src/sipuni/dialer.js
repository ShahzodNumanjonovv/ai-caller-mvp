import axios from "axios";
import Lead from "../models/Lead.js";
import CallLog from "../models/CallLog.js";
import { ioRef } from "../index.js";


/**
 * SIPUNI dialer
 * Env requirements:
 *  - SIPUNI_BASE (e.g. https://sipuni.com)
 *  - SIPUNI_ACCOUNT (e.g. 064629)
 *  - SIPUNI_API_KEY
 *  - SIPUNI_OPERATOR (e.g. 201)  // User / sipnumber to originate from
 *  - PUBLIC_WEBHOOK_URL          // Your /sipuni/webhook endpoint
 */
const {
  SIPUNI_BASE,
  SIPUNI_ACCOUNT,
  SIPUNI_API_KEY,
  SIPUNI_OPERATOR,
  PUBLIC_WEBHOOK_URL,
} = process.env;

let running = false;
let busy = false;

export function getCampaignState() {
  return { running, busy };
}

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
  ioRef()?.emit("log", { t: Date.now(), msg: `Dialing ${lead.phone} via Sipuni ...` });

  try {
    // ⚠️ Sipuni API hujjatlarida aniq endpoint nomini tekshiring!
    const url = `${SIPUNI_BASE}/api/call`;
    const payload = {
      account: SIPUNI_ACCOUNT,
      api_key: SIPUNI_API_KEY,
      user: String(SIPUNI_OPERATOR),   // Sipuni “Users”dagi raqam (201/202/…)
      dst: lead.phone,                 // E.164 formatdagi telefon
      webhook: PUBLIC_WEBHOOK_URL,     // Sipuni → sizga eventlar
    };

    const { data } = await axios.post(url, payload, { timeout: 10000 });
    const callId = data?.call_id || data?.id || data?.sid || `sipuni:${Date.now()}`;

    await CallLog.create({
      callId,
      leadPhone: lead.phone,
      status: data?.status || "initiated",
      direction: "outbound",
      raw: data,
    });

    // 30s kutamiz → webhook kelmasa ham minimal tekshiruv
    setTimeout(async () => {
      const latest = await CallLog.findOne({ callId }).sort({ createdAt: -1 });
      const s = (latest?.status || "").toLowerCase();

      const okStatuses = ["answered", "in-progress", "connected", "completed", "bridged"];
      if (okStatuses.some(x => s.includes(x))) {
        await Lead.updateOne({ _id: lead._id }, { status: "completed" });
        ioRef()?.emit("log", { t: Date.now(), msg: `Lead ${lead.phone} connected.` });
      } else if (["busy", "no-answer", "failed", "canceled"].some(x => s.includes(x))) {
        await Lead.updateOne({ _id: lead._id }, { status: "no-answer" });
        ioRef()?.emit("log", { t: Date.now(), msg: `No answer/busy: ${lead.phone} → next.` });
      } else {
        await Lead.updateOne({ _id: lead._id }, { status: "no-answer" });
        ioRef()?.emit("log", { t: Date.now(), msg: `Timeout: ${lead.phone} → next.` });
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