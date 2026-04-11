/**
 * API service functions — thin wrappers over the centralized client.
 * Each function maps 1:1 to a backend route.
 */
import api from "./client";

// ═══════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════

/** POST /api/auth/login */
export const login = (email, password) =>
  api.post("/auth/login", { email, password });

/** GET /api/auth/me */
export const getMe = () => api.get("/auth/me");

// ═══════════════════════════════════════════════════════════════════
// PATIENT / TOKEN
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/tokens/register
 * @param {object} payload — { name, age, gender, phoneNumber, symptoms, painLevel?, fever?, duration?, conditions? }
 */
export const registerToken = (payload) =>
  api.post("/tokens/register", payload);

/**
 * GET /api/tokens/:trackingId/status
 */
export const getTokenStatus = (trackingId) =>
  api.get(`/tokens/${trackingId}/status`);

// ═══════════════════════════════════════════════════════════════════
// DOCTOR
// ═══════════════════════════════════════════════════════════════════

/** GET /api/departments/:id/queue */
export const getDeptQueue = (departmentId) =>
  api.get(`/departments/${departmentId}/queue`);

/** POST /api/tokens/:id/call */
export const callPatient = (tokenId) =>
  api.post(`/tokens/${tokenId}/call`);

/** POST /api/tokens/:id/complete */
export const completeConsult = (tokenId) =>
  api.post(`/tokens/${tokenId}/complete`);

/** POST /api/tokens/:id/skip */
export const skipPatient = (tokenId) =>
  api.post(`/tokens/${tokenId}/skip`);

/** POST /api/tokens/:id/emergency-ack */
export const acknowledgeEmergency = (tokenId) =>
  api.post(`/tokens/${tokenId}/emergency-ack`);

// ═══════════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════════

/** GET /api/admin/analytics?date=YYYY-MM-DD */
export const getAnalytics = (date) =>
  api.get("/admin/analytics", { params: date ? { date } : {} });

/**
 * POST /api/admin/reports/daily  → returns PDF blob
 */
export const downloadDailyReport = (date) =>
  api.post(
    "/admin/reports/daily",
    { date },
    { responseType: "blob", headers: { Accept: "application/pdf" } }
  );
