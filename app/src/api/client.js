/**
 * Centralized API client for MediQueue.
 * All HTTP calls funnel through this single axios instance.
 */
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT when available ──────────────────
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("mq_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: unwrap { success, data } envelope ─────────
// Skip unwrapping for blob responses (PDF downloads, etc.)
api.interceptors.response.use(
  (res) => {
    if (res.config.responseType === "blob") {
      return res.data; // return raw blob
    }
    return res.data; // return { success, data, message, ... }
  },
  (error) => {
    // For blob error responses, try to parse the error message
    if (error.response?.config?.responseType === "blob" && error.response?.data) {
      return Promise.reject(new Error("Failed to download report. Please try again."));
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.map((e) => e.message).join(", ") ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

export default api;
