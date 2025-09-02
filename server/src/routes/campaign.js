import { Router } from "express";
import { auth } from "../utils/auth.js";
import { startCampaign, stopCampaign, getCampaignState } from "../twilio/dialer.js";

const r = Router();

r.post("/start", auth, async (req, res) => {
  await startCampaign();
  res.json({ running: true });
});

r.post("/stop", auth, async (req, res) => {
  await stopCampaign();
  res.json({ running: false });
});

r.get("/state", auth, (req, res) => {
  res.json(getCampaignState());
});

export default r;