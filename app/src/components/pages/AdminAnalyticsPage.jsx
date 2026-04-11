import React from 'react';

const DEPT_DATA = [
  { name: "General Medicine", registered: 94, completed: 62, avg: "8.4m", load: 78 },
  { name: "Paediatrics",      registered: 41, completed: 35, avg: "6.2m", load: 45 },
  { name: "Orthopaedics",     registered: 28, completed: 22, avg: "11.1m", load: 55 },
];

const TRIAGE_DATA = [
  { label: "Routine",   value: 64, color: "#3b82f6" },
  { label: "Priority",  value: 28, color: "#f59e0b" },
  { label: "Emergency", value: 8,  color: "#ef4444" },
];

const HOURLY_DATA = [4, 8, 14, 19, 22, 28, 31, 26, 22, 18, 12, 8];
const HOURS       = ["0700","0800","0900","1000","1100","1200","1300","1400","1500","1600","1700","1800"];

// ── Dashboard Components ──────────────────────────────────────────

const HourlyChart = () => {
  const maxH = Math.max(...HOURLY_DATA);
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
        overflowX: "auto", // Allow scrolling on very small phones
        paddingBottom: 10
      }}>
        {HOURLY_DATA.map((v, i) => (
          <div key={i} style={{ flex: 1, minWidth: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: "bold" }}>{v}</div>
            <div style={{
                width: "100%",
                height: `${(v / maxH) * 120}px`,
                background: v === maxH ? "#1e40af" : "#93c5fd",
                borderRadius: "2px 2px 0 0",
            }} />
            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 6, fontWeight: 600 }}>{HOURS[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TriageDistribution = () => (
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
      {TRIAGE_DATA.map((t) => (
        <div key={t.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{t.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.value}%</span>
          </div>
          <div style={{ background: "#f1f5f9", height: 10, borderRadius: 5, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${t.value}%`, background: t.color }} />
          </div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 24, padding: 16, borderRadius: 4, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Clinical Accuracy</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>94.2%</div>
    </div>
  </div>
);

const AdminAnalyticsPage = () => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      color: "#1e293b",
      fontFamily: "'Times New Roman', Times, serif",
      paddingTop: "80px", // Reduced slightly for mobile comfort
      paddingBottom: 40,
    }}>
      <style>{`
        /* Responsive Grid Logic */
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
          overflow-x: auto; /* Enable horizontal scroll for mobile */
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        /* Mobile specific overrides */
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
              Enterprise Monitoring Dashboard | 2026-04-11
            </p>
          </div>
          <button style={{
            background: "#0f172a", color: "#ffffff", border: "none", padding: "12px 24px", borderRadius: 4,
            fontSize: 14, fontWeight: 700, cursor: "pointer"
          }}>
            Download PDF Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {[
              { l: "Total Registrations", v: "163", c: "#0f172a" },
              { l: "Consultations Completed", v: "119", c: "#10b981" },
              { l: "Avg. Patient Latency", v: "24.5m", c: "#1e40af" },
              { l: "Critical Redirection", v: "08", c: "#ef4444" }
          ].map(s => (
            <div key={s.l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: 4 }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, fontWeight: 800, textTransform: "uppercase" }}>{s.l}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Chart Row */}
        <div className="charts-row">
          <HourlyChart />
          <TriageDistribution />
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
              {DEPT_DATA.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", color: "#334155", fontSize: 14 }}>
                  <td style={{ padding: "18px 20px", color: "#0f172a", fontWeight: 700 }}>{d.name}</td>
                  <td style={{ padding: "18px 20px" }}>{d.registered}</td>
                  <td style={{ padding: "18px 20px" }}>{d.completed}</td>
                  <td style={{ padding: "18px 20px" }}>{d.avg}</td>
                  <td style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 80, height: 8, background: "#f1f5f9", borderRadius: 5 }}>
                            <div style={{ width: `${d.load}%`, height: "100%", background: d.load > 70 ? "#f59e0b" : "#3b82f6", borderRadius: 5 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{d.load}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "18px 20px" }}>
                    <span style={{ 
                        fontSize: 10, padding: "5px 12px", borderRadius: 4, fontWeight: 800,
                        background: d.load > 70 ? "#fffbeb" : "#f0fdf4",
                        color: d.load > 70 ? "#92400e" : "#166534"
                    }}>
                        {d.load > 70 ? "HIGH" : "OPTIMAL"}
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