import axios from "axios";

// Use relative URLs to go through the Next.js proxy in next.config.js
// This creates a Same-Site request and completely solves third-party cookie blocking.
export const api = axios.create({
  baseURL: "",
  withCredentials: true
});
