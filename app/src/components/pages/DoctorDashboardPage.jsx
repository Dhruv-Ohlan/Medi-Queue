import React, { useState, useEffect, useRef, useCallback } from "react";
import { COLORS } from "../constants";
import { Badge, StatCard } from "../components";
import * as api from "../../api/services";

// ── Login Form ────────────────────────────────────────────────────────────────
const LoginForm = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState("doctor.gm@mediqueue.com");
  const [password, setPassword] = useState("password123");

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ background: "#ffffff", borderRadius: 8, padding: 40, maxWidth: 420, width: "90%", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <div style={{ fontSize: 11, color: "#64748b", fontWeight: 800, letterSpacing: "1.5px", marginBottom: 8, textTransform: "uppercase" }}>Clinical Access</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: "0 0 24px" }}>Doctor Login</h2>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 4, padding: "12px 16px", color: "#b91c1c", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#334155", display: "block", marginBottom: 6 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#334155", display: "block", marginBottom: 6 }}>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" style={{ width: "100%", padding: "12px 14px", borderRadius: 4, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
          <button onClick={() => onLogin(email, password)} disabled={loading} style={{
            width: "100%", background: "#0f172a", color: "#ffffff", border: "none", padding: "14px", borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1
          }}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 16 }}>
          Demo credentials pre-filled for testing
        </p>
      </div>
    </div>
  );
};

// ── Professional Emergency Protocol ───────────────────────────────────────────
const EmergencyModal = ({ alert, onAcknowledge, loading }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15, 23, 42, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
    <div style={{ background: "#ffffff", borderRadius: 8, padding: 40, maxWidth: 500, width: "90%", borderLeft: `8px solid #ef4444`, textAlign: "left", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#ef4444", letterSpacing: "1.5px", marginBottom: 10 }}>CRITICAL ALERT</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 15 }}>Emergency Patient Arrival</div>
      <div style={{ fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
        Token <strong>#{alert.tokenNumber}</strong> — <strong>{alert.patientName}</strong> has been triaged as <strong>EMERGENCY</strong>. Immediate clinical intervention is requested.
      </div>
      <div style={{ background: "#fef2f2", borderRadius: 4, padding: "16px", border: "1px solid #fee2e2", marginBottom: 25 }}>
        <div style={{ fontSize: 13, color: "#991b1b", fontWeight: 700 }}>AI DIAGNOSTIC SUMMARY:</div>
        <div style={{ fontSize: 14, color: "#b91c1c", marginTop: 4 }}>"{alert.aiReasoning || alert.symptoms}"</div>
      </div>
      <button onClick={() => onAcknowledge(alert.id)} disabled={loading} style={{ width: "100%", background: "#0f172a", color: "#ffffff", border: "none", padding: "16px", borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer", textTransform: "uppercase", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Acknowledging..." : "Acknowledge and Proceed"}
      </button>
    </div>
  </div>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const DoctorDashboardPage = () => {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Queue state
  const [queueData, setQueueData] = useState(null);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueError, setQueueError] = useState(null);

  // Action state
  const [actionLoading, setActionLoading] = useState(null); // tokenId being acted on
  const [actionFeedback, setActionFeedback] = useState(null);

  // Emergency
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [ackLoading, setAckLoading] = useState(false);

  const pollRef = useRef(null);

  // ── Login handler ──────────────────────────────────────────────
  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await api.login(email, password);
      sessionStorage.setItem("mq_token", res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Fetch queue ────────────────────────────────────────────────
  const fetchQueue = useCallback(async () => {
    if (!user?.departmentId) return;
    const deptId = typeof user.departmentId === "object" ? user.departmentId._id : user.departmentId;
    setQueueLoading(true);
    setQueueError(null);
    try {
      const res = await api.getDeptQueue(deptId);
      setQueueData(res.data);
      // Show emergency alert if present and not yet acknowledged
      if (res.data.emergencyAlert) {
        setEmergencyAlert(res.data.emergencyAlert);
      }
    } catch (err) {
      setQueueError(err.message);
    } finally {
      setQueueLoading(false);
    }
  }, [user]);

  // Poll every 30s
  useEffect(() => {
    if (!user) return;
    fetchQueue();
    pollRef.current = setInterval(fetchQueue, 30000);
    return () => clearInterval(pollRef.current);
  }, [user, fetchQueue]);

  // ── Token actions ──────────────────────────────────────────────
  const handleAction = async (actionFn, tokenId, label) => {
    setActionLoading(tokenId);
    setActionFeedback(null);
    try {
      await actionFn(tokenId);
      setActionFeedback({ type: "success", message: `${label} — Success` });
      fetchQueue(); // refresh queue
    } catch (err) {
      setActionFeedback({ type: "error", message: err.message });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const handleAcknowledge = async (tokenId) => {
    setAckLoading(true);
    try {
      await api.acknowledgeEmergency(tokenId);
      setEmergencyAlert(null);
      fetchQueue();
    } catch (err) {
      setActionFeedback({ type: "error", message: err.message });
    } finally {
      setAckLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem("mq_token");
    setUser(null);
    setQueueData(null);
  };

  // ── If not logged in, show login form ──────────────────────────
  if (!user) {
    return <LoginForm onLogin={handleLogin} loading={authLoading} error={authError} />;
  }

  const queue = queueData?.activeQueue || [];
  const stats = queueData?.stats || {};
  const load = stats.waitingCount > 10 ? 92 : stats.waitingCount > 5 ? 65 : 35;
  const loadColor = load > 85 ? "#ef4444" : load > 60 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'Times New Roman', Times, serif", paddingTop: 80, backgroundColor: "#f8fafc" }}>
      
      {/* ── RESPONSIVE STYLES ── */}
      <style>
        {`
          @media (max-width: 768px) {
            .dashboard-container { padding: 20px 15px !important; }
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
            .header-flex { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
            .patient-row { flex-direction: column !important; align-items: flex-start !important; gap: 15px !important; }
            .action-buttons { width: 100% !important; justify-content: flex-start !important; }
          }
          @media (max-width: 480px) {
            .stats-grid { grid-template-columns: 1fr !important; }
            .header-title { font-size: 28px !important; }
          }
        `}
      </style>

      {/* ── 1. BACKGROUND LAYER ── */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "url('/doctor.png')", backgroundSize: "cover", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(248, 250, 252, 0.9)", backdropFilter: "blur(2px)" }} />
      </div>

      {emergencyAlert && <EmergencyModal alert={emergencyAlert} onAcknowledge={handleAcknowledge} loading={ackLoading} />}

      {/* Action feedback toast */}
      {actionFeedback && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 100, padding: "12px 20px", borderRadius: 4,
          background: actionFeedback.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${actionFeedback.type === "success" ? "#bbf7d0" : "#fee2e2"}`,
          color: actionFeedback.type === "success" ? "#166534" : "#b91c1c",
          fontSize: 13, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          {actionFeedback.message}
        </div>
      )}

      <div className="dashboard-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        
        {/* Header */}
        <div className="header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h1 className="header-title" style={{ fontSize: 36, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Clinical Dashboard
            </h1>
            <p style={{ color: "#64748b", fontSize: 16, margin: "6px 0 0" }}>
              {user.name} | {user.role === "doctor" ? "Medical Officer" : "Staff"}
            </p>
          </div>
          <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 12 }}>
            <Badge type="routine">System: Online</Badge>
            <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #e2e8f0", padding: "6px 14px", borderRadius: 4, fontSize: 12, color: "#64748b", cursor: "pointer", fontWeight: 600 }}>
              Logout
            </button>
          </div>
        </div>

        {/* Queue error */}
        {queueError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 4, padding: "12px 16px", color: "#b91c1c", fontSize: 13, marginBottom: 16 }}>
            ⚠️ {queueError}
          </div>
        )}

        {/* Stats Row */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          <StatCard label="Patients in Queue" value={stats.waitingCount ?? "—"} />
          <StatCard label="Consultations Done" value={stats.completedCount ?? "—"} accent="#10b981" />
          <StatCard label="Avg. Consultation" value={stats.avgConsultTimeMinutes != null ? `${stats.avgConsultTimeMinutes}m` : "—"} accent="#3b82f6" />
          <StatCard label="Throughput/hr" value={stats.throughputPerHour ?? "—"} accent="#ef4444" />
        </div>

        {/* Department Load Status */}
        <div style={{ background: "#ffffff", borderRadius: 8, padding: "20px", border: `1px solid #e2e8f0`, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: "#0f172a", fontWeight: 700 }}>Unit Resource Saturation</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: loadColor }}>
              {load > 85 ? "CRITICAL LOAD" : load > 60 ? "MODERATE LOAD" : "OPTIMAL LOAD"}
              {queueLoading && <span style={{ fontWeight: 400, marginLeft: 8, color: "#94a3b8", fontSize: 11 }}>⟳ syncing</span>}
            </span>
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 4, height: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${load}%`, background: loadColor, transition: "width 1s ease-in-out" }} />
          </div>
        </div>

        {/* Patient Queue Table */}
        <div style={{ background: "#ffffff", borderRadius: 8, border: `1px solid #e2e8f0`, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid #e2e8f0`, background: "#f8fafc", fontWeight: 700, color: "#0f172a", fontSize: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Active Patient Queue</span>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Auto-refreshes every 30s</span>
          </div>

          {queue.map((p, i) => (
            <div key={p.id || i} className="patient-row" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, borderBottom: i === queue.length - 1 ? "none" : `1px solid #f1f5f9`, background: p.urgencyLevel === 'emergency' ? '#fef2f2' : 'transparent' }}>
              <div style={{ fontSize: 24 }}>{p.urgencyLevel === 'emergency' ? '🔴' : p.urgencyLevel === 'priority' ? '🟡' : '🔵'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 17 }}>
                  #{p.tokenNumber} | {p.patientName} <span style={{ color: "#64748b", fontWeight: 400, fontSize: 14 }}>(Age: {p.age})</span>
                  {" "}
                  <Badge type={p.urgencyLevel}>{p.urgencyLevel}</Badge>
                  {p.status === "called" && <Badge type="priority">CALLED</Badge>}
                </div>
                <div style={{ fontSize: 14, color: "#475569", marginTop: 4, fontStyle: "italic" }}>
                  Triage Note: {p.aiReasoning || "—"}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                  Waiting: {p.waitTime}m
                </div>
              </div>
              <div className="action-buttons" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.status === "waiting" && (
                  <button
                    onClick={() => handleAction(api.callPatient, p.id, "Patient called")}
                    disabled={actionLoading === p.id}
                    style={{ background: "#0f172a", color: "white", padding: "10px 20px", borderRadius: 4, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13, opacity: actionLoading === p.id ? 0.6 : 1 }}
                  >
                    {actionLoading === p.id ? "..." : "Call Patient"}
                  </button>
                )}
                {p.status === "called" && (
                  <button
                    onClick={() => handleAction(api.completeConsult, p.id, "Consult completed")}
                    disabled={actionLoading === p.id}
                    style={{ background: "#10b981", color: "white", padding: "10px 20px", borderRadius: 4, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13, opacity: actionLoading === p.id ? 0.6 : 1 }}
                  >
                    {actionLoading === p.id ? "..." : "Complete"}
                  </button>
                )}
                <button
                  onClick={() => handleAction(api.skipPatient, p.id, "Patient skipped")}
                  disabled={actionLoading === p.id}
                  style={{ background: "white", color: "#64748b", padding: "10px 14px", borderRadius: 4, border: "1px solid #cbd5e1", cursor: "pointer", fontSize: 13, opacity: actionLoading === p.id ? 0.6 : 1 }}
                >
                  Skip
                </button>
              </div>
            </div>
          ))}
          {queue.length === 0 && !queueLoading && (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No active patients in queue.</div>
          )}
          {queue.length === 0 && queueLoading && (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Loading queue...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;