// client/src/sockets.js
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is missing");

const SOCKET_URL = API_URL.replace(/^http/, "ws"); // https -> wss, http -> ws
export const socket = io(SOCKET_URL, { transports: ["websocket"] });