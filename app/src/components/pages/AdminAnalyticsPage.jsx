import React from 'react';
import { COLORS } from "../constants";
import { StatCard } from "../components";

const DEPT_DATA = [
  { name: "General Medicine", registered: 94, completed: 62, avg: "8.4m", load: 78 },
  { name: "Paediatrics",      registered: 41, completed: 35, avg: "6.2m", load: 45 },
  { name: "Orthopaedics",     registered: 28, completed: 22, avg: "11.1m", load: 55 },
];

const TRIAGE_DATA = [
  { label: "ROUTINE",   value: 64, color: "#00f3ff" }, // Neon Cyan
  { label: "PRIORITY",  value: 28, color: "#ffae00" }, // Neon Amber
  { label: "EMERGENCY", value: 8,  color: "#ff003c" }, // Cyber Red
];

const HOURLY_DATA = [4, 8, 14, 19, 22, 28, 31, 26, 22, 18, 12, 8];
const HOURS       = ["0700","0800","0900","1000","1100","1200","1300","1400","1500","1600","1700","1800"];

// ── Hacker Components ──────────────────────────────────────────────────────────

const HourlyChart = () => {
  const maxH = Math.max(...HOURLY_DATA);
  return (
    <div style={{
      background: "rgba(10, 25, 47, 0.8)",
      borderRadius: 4,
      padding: 24,
      border: "1px solid #1e293b",
      boxShadow: "0 0 20px rgba(0, 243, 255, 0.05)",
      position: "relative"
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#00f3ff", marginBottom: 20, letterSpacing: "2px", fontFamily: "'Space Mono', monospace" }}>
        {">"} REGISTRATION_LOG_HOURLY
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
        {HOURLY_DATA.map((v, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 10, color: "#00f3ff", fontFamily: "monospace" }}>{v}</div>
            <div style={{
                width: "100%",
                height: `${(v / maxH) * 120}px`,
                background: v === maxH ? "#00f3ff" : "rgba(0, 243, 255, 0.2)",
                border: v === maxH ? "none" : "1px solid #00f3ff",
                boxShadow: v === maxH ? "0 0 15px #00f3ff" : "none",
                transition: "all 0.3s ease",
            }} />
            <div style={{ fontSize: 9, color: "#64748b", marginTop: 4, fontFamily: "monospace" }}>{HOURS[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TriageDistribution = () => (
  <div style={{
    background: "rgba(10, 25, 47, 0.8)",
    borderRadius: 4,
    padding: 24,
    border: "1px solid #1e293b",
    boxShadow: "0 0 20px rgba(0, 243, 255, 0.05)"
  }}>
    <div style={{ fontSize: 12, fontWeight: 800, color: "#00f3ff", marginBottom: 20, letterSpacing: "2px", fontFamily: "'Space Mono', monospace" }}>
      {">"} TRIAGE_STATUS_MATRIX
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {TRIAGE_DATA.map((t) => (
        <div key={t.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", fontFamily: "monospace" }}>[{t.label}]</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: t.color, fontFamily: "monospace" }}>{t.value}.00%</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", height: 6, overflow: "hidden" }}>
            <div style={{
                height: "100%",
                width: `${t.value}%`,
                background: t.color,
                boxShadow: `0 0 10px ${t.color}`,
            }} />
          </div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 24, padding: 14, borderLeft: "2px solid #00f3ff", background: "rgba(0, 243, 255, 0.03)" }}>
      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>CORE_AI_ACCURACY</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: "#00f3ff", fontFamily: "'Syne', sans-serif" }}>94.2%</div>
    </div>
  </div>
);

const AdminAnalyticsPage = () => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020617", // True black-navy
      color: "#f8fafc",
      fontFamily: "'Space Mono', monospace",
      paddingTop: 64,
      position: "relative",
      backgroundImage: "radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)",
    }}>
      {/* Scanline Effect Overlay */}
      <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
          zIndex: 10, pointerEvents: "none", backgroundSize: "100% 2px, 3px 100%"
      }} />

      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, borderBottom: "1px solid #1e293b", paddingBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#00f3ff", margin: 0, textShadow: "0 0 10px rgba(0, 243, 255, 0.5)" }}>
              SYSTEM_ANALYTICS_V.2.6
            </h1>
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 5 }}>
              TIMESTAMP: 2026-04-10 // STATUS: ENCRYPTED_STABLE
            </p>
          </div>
          <button style={{
            background: "transparent", color: "#00f3ff", border: "1px solid #00f3ff", padding: "10px 20px", borderRadius: 2,
            fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace", boxShadow: "inset 0 0 10px rgba(0, 243, 255, 0.2)"
          }}>
            GENERATE_REPORT.PDF
          </button>
        </div>

        {/* Top stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
              { l: "TOTAL_REG", v: "163", c: "#00f3ff" },
              { l: "COMPLETE", v: "119", c: "#22c55e" },
              { l: "AVG_LATENCY", v: "24m", c: "#00f3ff" },
              { l: "CRITICAL", v: "08", c: "#ff003c" }
          ].map(s => (
            <div key={s.l} style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px solid #1e293b", padding: 20 }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8 }}>{s.l}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.c, fontFamily: "'Syne', sans-serif" }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
          <HourlyChart />
          <TriageDistribution />
        </div>

        {/* Table */}
        <div style={{ background: "rgba(10, 25, 47, 0.8)", border: "1px solid #1e293b" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
            <thead>
              <tr style={{ textAlign: "left", background: "rgba(0, 243, 255, 0.05)" }}>
                {["Dept", "Reg", "Done", "Avg", "Load", "Mode"].map(h => (
                  <th key={h} style={{ padding: "15px 20px", fontSize: 10, color: "#00f3ff", letterSpacing: "1px" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEPT_DATA.map((d, i) => (
                <tr key={i} style={{ borderTop: "1px solid #1e293b", color: "#94a3b8" }}>
                  <td style={{ padding: "15px 20px", color: "#f8fafc", fontWeight: 700 }}>{">"} {d.name.toUpperCase()}</td>
                  <td style={{ padding: "15px 20px" }}>{d.registered}</td>
                  <td style={{ padding: "15px 20px" }}>{d.completed}</td>
                  <td style={{ padding: "15px 20px" }}>{d.avg}</td>
                  <td style={{ padding: "15px 20px" }}>
                    <span style={{ color: d.load > 70 ? "#ffae00" : "#00f3ff" }}>{d.load}%</span>
                  </td>
                  <td style={{ padding: "15px 20px" }}>
                    <span style={{ 
                        fontSize: 10, padding: "2px 8px", border: `1px solid ${d.load > 70 ? "#ffae00" : "#22c55e"}`,
                        color: d.load > 70 ? "#ffae00" : "#22c55e"
                    }}>
                        {d.load > 70 ? "BUSY_LIMIT" : "OPTIMAL"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;