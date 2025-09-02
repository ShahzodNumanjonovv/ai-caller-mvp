import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { connectDB } from "./db.js";
import authRoute from "./routes/auth.js";
import leadsRoute from "./routes/leads.js";
import sellersRoute from "./routes/sellers.js";
import campaignRoute from "./routes/campaign.js";
import voiceRoute from "./twilio/voice.js";

const app = express();
app.use(cors({
  origin: ["https://ai-caller-mvp.vercel.app"], // faqat sizning frontend domeningiz
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/leads", leadsRoute);
app.use("/sellers", sellersRoute);
app.use("/campaign", campaignRoute);
app.use("/voice", voiceRoute);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Socket export for dialer
let ioInstance = null;
io.on("connection", (socket) => {
  ioInstance = io;
  socket.emit("log", { t: Date.now(), msg: "Connected to realtime log." });
});
export const ioRef = () => ioInstance;

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
  server.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
});