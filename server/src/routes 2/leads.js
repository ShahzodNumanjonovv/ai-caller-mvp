import { Router } from "express";
import multer from "multer";
import { parse } from "csv-parse";
import fs from "fs";
import Lead from "../models/Lead.js";
import { auth } from "../utils/auth.js";

const upload = multer({ dest: "uploads/" });
const r = Router();

r.get("/", auth, async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 }).limit(200);
  res.json(leads);
});

r.post("/csv", auth, upload.single("file"), async (req, res) => {
  const rows = [];
  const parser = fs.createReadStream(req.file.path).pipe(parse({ columns: false, trim: true }));
  for await (const record of parser) {
    const phone = record[0];
    if (phone) rows.push({ phone });
  }
  await Lead.insertMany(rows.map(p => ({ phone: p.phone })));
  fs.unlinkSync(req.file.path);
  res.json({ inserted: rows.length });
});

r.delete("/reset", auth, async (req, res) => {
  await Lead.deleteMany({});
  res.json({ ok: true });
});

export default r;