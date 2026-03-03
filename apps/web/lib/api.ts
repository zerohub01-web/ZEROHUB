import axios from "axios";

// Route through Vercel proxy in production to avoid cross-domain third-party cookie blocking
const isProd = process.env.NODE_ENV === "production";
const baseURL = isProd ? "" : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000");

export const api = axios.create({
  baseURL,
  withCredentials: true
});
