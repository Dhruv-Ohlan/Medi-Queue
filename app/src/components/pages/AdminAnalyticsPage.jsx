import React, { useState, useEffect, useCallback } from 'react';
import * as api from "../../api/services";

// ── Login Form (Admin) ────────────────────────────────────────────
const AdminLoginForm = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState("admin@mediqueue.com");
  const [password, setPassword] = useState("password123");

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ background: "#ffffff", borderRadius: 4, padding: 40, maxWidth: 420, width: "90%", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <div style={{ fontSize: 11, color: "#64748b", fontWeight: 800, letterSpacing: "1.5px", marginBottom: 8, textTransform: "uppercase" }}>Administrative Access</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: "0 0 24px" }}>Admin Login</h2>

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

// ── Dashboard Components ──────────────────────────────────────────

const HourlyChart = ({ data }) => {
  // data = [{ time: "07:00", registrations: 4 }, ...]
  const chartData = data || [];
  const maxH = Math.max(...chartData.map(d => d.registrations), 1);

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 4,
      padding: "20px",
      border: "1px solid #e2e8f0",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
        Registration Flow Analysis (Hourly)
      </div>
      <div style={{ 
        display: "flex", 
        alignItems: "flex-end", 
        gap: "2%", 
        flex: 1, 
        minHeight: 160,
        overflowX: "auto",
        paddingBottom: 10
      }}>
        {chartData.length === 0 && (
          <div style={{ flex: 1, textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 60 }}>No data available</div>
        )}
        {chartData.map((v, i) => (
          <div key={i} style={{ flex: 1, minWidth: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: "bold" }}>{v.registrations}</div>
            <div style={{
                width: "100%",
                height: `${(v.registrations / maxH) * 120}px`,
                background: v.registrations === maxH ? "#1e40af" : "#93c5fd",
                borderRadius: "2px 2px 0 0",
            }} />
            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 6, fontWeight: 600 }}>{v.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TriageDistribution = ({ data }) => {
  // data = [{ urgency: "routine", count: 64 }, ...]
  const total = (data || []).reduce((acc, t) => acc + t.count, 0) || 1;
  const colorMap = { routine: "#3b82f6", priority: "#f59e0b", emergency: "#ef4444" };

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 4,
      padding: "20px",
      border: "1px solid #e2e8f0",
      height: "100%"
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
        Triage Status Matrix
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {(data || []).map((t) => {
          const pct = Math.round((t.count / total) * 100);
          const color = colorMap[t.urgency] || "#3b82f6";
          return (
            <div key={t.urgency}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "capitalize" }}>{t.urgency}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}% ({t.count})</span>
              </div>
              <div style={{ background: "#f1f5f9", height: 10, borderRadius: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}
        {(!data || data.length === 0) && (
          <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: 20 }}>No data</div>
        )}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────

const AdminAnalyticsPage = () => {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

  // Report state
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  const todayStr = new Date().toISOString().split("T")[0];

  // ── Login ──────────────────────────────────────────────────────
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

  // ── Fetch analytics ────────────────────────────────────────────
  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const res = await api.getAnalytics(todayStr);
      setAnalytics(res.data);
    } catch (err) {
      setAnalyticsError(err.message);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [todayStr]);

  useEffect(() => {
    if (!user) return;
    fetchAnalytics();
  }, [user, fetchAnalytics]);

  // ── Download PDF ───────────────────────────────────────────────
  const handleDownloadReport = async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      const blob = await api.downloadDailyReport(todayStr);
      // blob is already the data because our interceptor unwraps — but blob responses
      // need the raw response. Let's handle both cases:
      const blobData = blob instanceof Blob ? blob : new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blobData);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mediqueue-report-${todayStr}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setReportError(err.message);
    } finally {
      setReportLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem("mq_token");
    setUser(null);
    setAnalytics(null);
  };

  // ── If not logged in ──────────────────────────────────────────
  if (!user) {
    return <AdminLoginForm onLogin={handleLogin} loading={authLoading} error={authError} />;
  }

  const summary = analytics?.summary || {};
  const deptBreakdown = analytics?.departmentBreakdown || [];
  const triageDist = analytics?.triageDistribution || [];
  const peakLoad = analytics?.peakLoadTimeSeries || [];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      color: "#1e293b",
      fontFamily: "'Times New Roman', Times, serif",
      paddingTop: "80px",
      paddingBottom: 40,
    }}>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .header-area {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 24px;
        }
        .table-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow-x: auto;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        @media (max-width: 900px) {
          .charts-row {
            grid-template-columns: 1fr;
          }
          .header-area {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .header-area button {
            width: 100%;
          }
          .page-padding {
            padding: 0 16px !important;
          }
        }
      `}</style>

      <div className="page-padding" style={{ width: "100%", padding: "0 32px", boxSizing: "border-box" }}>
        
        {/* Header Section */}
        <div className="header-area">
          <div>
            <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Hospital Operations Analytics
            </h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>
              Enterprise Monitoring Dashboard | {todayStr}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button 
              onClick={handleDownloadReport} 
              disabled={reportLoading}
              style={{
                background: "#0f172a", color: "#ffffff", border: "none", padding: "12px 24px", borderRadius: 4,
                fontSize: 14, fontWeight: 700, cursor: reportLoading ? "wait" : "pointer", opacity: reportLoading ? 0.7 : 1
              }}
            >
              {reportLoading ? "Generating..." : "Download PDF Report"}
            </button>
            <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #e2e8f0", padding: "12px 16px", borderRadius: 4, fontSize: 12, color: "#64748b", cursor: "pointer", fontWeight: 600 }}>
              Logout
            </button>
          </div>
        </div>

        {/* Report download error */}
        {reportError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 4, padding: "12px 16px", color: "#b91c1c", fontSize: 13, marginBottom: 16 }}>
            ⚠️ Report download failed: {reportError}
          </div>
        )}

        {/* Analytics error */}
        {analyticsError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 4, padding: "12px 16px", color: "#b91c1c", fontSize: 13, marginBottom: 16 }}>
            ⚠️ {analyticsError}
          </div>
        )}

        {/* Loading state */}
        {analyticsLoading && !analytics && (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", fontSize: 16 }}>
            Loading analytics data...
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          {[
              { l: "Total Registrations", v: summary.totalRegistered ?? "—", c: "#0f172a" },
              { l: "Consultations Completed", v: summary.totalCompleted ?? "—", c: "#10b981" },
              { l: "Currently Waiting", v: summary.totalWaiting ?? "—", c: "#1e40af" },
              { l: "Currently Being Seen", v: summary.totalCalled ?? "—", c: "#ef4444" }
          ].map(s => (
            <div key={s.l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: 4 }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, fontWeight: 800, textTransform: "uppercase" }}>{s.l}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Chart Row */}
        <div className="charts-row">
          <HourlyChart data={peakLoad} />
          <TriageDistribution data={triageDist} />
        </div>

        {/* Department Table */}
        <div className="table-container">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["Clinical Department", "Reg. Volume", "Closed Cases", "Avg. Wait", "Saturation", "Status"].map(h => (
                  <th key={h} style={{ padding: "18px 20px", fontSize: 12, color: "#0f172a", fontWeight: 800, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deptBreakdown.map((d, i) => {
                const loadPct = d.totalRegistered > 0 ? Math.round((d.waiting / d.totalRegistered) * 100) : 0;
                const avgWait = d.avgWaitTimeMinutes != null ? `${Math.round(d.avgWaitTimeMinutes)}m` : "—";
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", color: "#334155", fontSize: 14 }}>
                    <td style={{ padding: "18px 20px", color: "#0f172a", fontWeight: 700 }}>{d.name}</td>
                    <td style={{ padding: "18px 20px" }}>{d.totalRegistered}</td>
                    <td style={{ padding: "18px 20px" }}>{d.completed}</td>
                    <td style={{ padding: "18px 20px" }}>{avgWait}</td>
                    <td style={{ padding: "18px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 80, height: 8, background: "#f1f5f9", borderRadius: 5 }}>
                              <div style={{ width: `${Math.min(loadPct, 100)}%`, height: "100%", background: loadPct > 70 ? "#f59e0b" : "#3b82f6", borderRadius: 5 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{loadPct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                      <span style={{ 
                          fontSize: 10, padding: "5px 12px", borderRadius: 4, fontWeight: 800,
                          background: loadPct > 70 ? "#fffbeb" : "#f0fdf4",
                          color: loadPct > 70 ? "#92400e" : "#166534"
                      }}>
                          {loadPct > 70 ? "HIGH" : "OPTIMAL"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {deptBreakdown.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                    {analyticsLoading ? "Loading..." : "No department data available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;