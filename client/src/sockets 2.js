import { io } from "socket.io-client";
const SOCKET_BASE = import.meta.env.VITE_API_BASE?.replace(/^http/, "ws") || "ws://localhost:4000";
export const socket = io(SOCKET_BASE, { transports: ["websocket"] });