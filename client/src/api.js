// client/src/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is missing");

export const api = axios.create({ baseURL: API_URL });

export function setToken(token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}