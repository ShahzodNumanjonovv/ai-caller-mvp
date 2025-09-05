import { Router } from "express";
import Seller from "../models/Seller.js";
import { auth } from "../utils/auth.js";

const r = Router();

r.get("/", auth, async (req, res) => {
  res.json(await Seller.find());
});

r.post("/", auth, async (req, res) => {
  const { name, phone } = req.body;
  const s = await Seller.create({ name, phone, isActive: true });
  res.json(s);
});

export default r;