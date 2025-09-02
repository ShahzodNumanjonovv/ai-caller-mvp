import { Router } from "express";
import { sign } from "../utils/auth.js";

const r = Router();

// MVP: bitta admin foydalanuvchi (hardcoded)
r.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@example.com" && password === "admin123") {
    return res.json({ token: sign({ role: "admin", email }) });
  }
  return res.status(401).json({ error: "Bad credentials" });
});

export default r;