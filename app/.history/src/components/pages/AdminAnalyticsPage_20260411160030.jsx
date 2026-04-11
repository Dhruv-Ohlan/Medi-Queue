import { COLORS } from "../constants";
import { StatCard } from "../components";
 
const DEPT_DATA = [
  { name: "General Medicine", registered: 94, completed: 62, avg: "8.4m", load: 78 },
  { name: "Paediatrics",      registered: 41, completed: 35, avg: "6.2m", load: 45 },
  { name: "Orthopaedics",     registered: 28, completed: 22, avg: "11.1m", load: 55 },
];
 
const TRIAGE_DATA = [
  { label: "Routine",   value: 64, color: COLORS.green, bg: "#E8F5E9" },
  { label: "Priority",  value: 28, color: COLORS.amber, bg: "#FFF3E0" },
  { label: "Emergency", value: 8,  color: COLORS.red,   bg: "#FFEBEE" },
];
 
const HOURLY_DATA = [4, 8, 14, 19, 22, 28, 31, 26, 22, 18, 12, 8];
const HOURS       = ["7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm"];
 
// ── Sub-components ──────────────────────────────────────────────────────────
 
const HourlyChart = () => {
  const maxH = Math.max(...HOURLY_DATA);
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 14,
        padding: 24,
        border: `1px solid ${COLORS.gray200}`,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>
        Token Registrations by Hour
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160 }}>
        {HOURLY_DATA.map((v, i) => (
          <div
            key={i}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
          >
            <div style={{ fontSize: 10, color: COLORS.gray400 }}>{v}</div>
            <div
              style={{
                width: "100%",
                height: `${(v / maxH) * 130}px`,
                background:
                  v === maxH ? COLORS.teal : v >= 20 ? COLORS.navyLight : COLORS.gray200,
                borderRadius: "4px 4px 0 0",
                transition: "height 0.3s",
              }}
            />
            <div
              style={{
                fontSize: 9,
                color: COLORS.gray400,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                marginTop: 4,
              }}
            >
              {HOURS[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
const TriageDistribution = () => (
  <div
    style={{
      background: COLORS.white,
      borderRadius: 14,
      padding: 24,
      border: `1px solid ${COLORS.gray200}`,
    }}
  >
    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>
      Triage Distribution
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {TRIAGE_DATA.map((t) => (
        <div key={t.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{t.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.value}%</span>
          </div>
          <div
            style={{ background: COLORS.gray100, borderRadius: 6, height: 10, overflow: "hidden" }}
          >
            <div
              style={{
                height: "100%",
                width: `${t.value}%`,
                background: t.color,
                borderRadius: 6,
              }}
            />
          </div>
        </div>
      ))}
    </div>
 
    {/* AI accuracy callout */}
    <div
      style={{
        marginTop: 20,
        padding: 14,
        background: COLORS.gray50,
        borderRadius: 10,
      }}
    >
      <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 4 }}>
        AI routing accuracy
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: COLORS.tealDark,
          fontFamily: "'Syne', sans-serif",
        }}
      >
        94.2%
      </div>
    </div>
  </div>
);
 
const DeptTable = () => (
  <div
    style={{
      background: COLORS.white,
      borderRadius: 14,
      border: `1px solid ${COLORS.gray200}`,
      overflow: "hidden",
    }}
  >
    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.gray100}` }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy }}>
        Department Comparison
      </span>
    </div>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: COLORS.gray50 }}>
            {["Department", "Registered", "Completed", "Avg Consult", "Load", "Status"].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.gray400,
                    letterSpacing: "0.5px",
                  }}
                >
                  {h.toUpperCase()}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {DEPT_DATA.map((d) => {
            const statusColor = d.load > 75 ? COLORS.amber : COLORS.green;
            return (
              <tr key={d.name} style={{ borderTop: `1px solid ${COLORS.gray100}` }}>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: COLORS.navy }}>
                  {d.name}
                </td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: COLORS.gray800 }}>
                  {d.registered}
                </td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: COLORS.gray800 }}>
                  {d.completed}
                </td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: COLORS.gray800 }}>
                  {d.avg}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        flex: 1,
                        background: COLORS.gray100,
                        borderRadius: 4,
                        height: 6,
                        maxWidth: 80,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${d.load}%`,
                          background: d.load > 75 ? COLORS.amber : COLORS.teal,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>
                      {d.load}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: d.load > 75 ? "#FFF3E0" : "#E8F5E9",
                      color: statusColor,
                    }}
                  >
                    {d.load > 75 ? "Busy" : "Normal"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
 
// ── Main Page ────────────────────────────────────────────────────────────────
 
const AdminAnalyticsPage = () => (
  <div
    style={{
      minHeight: "100vh",
      background: COLORS.gray50,
      fontFamily: "'DM Sans', sans-serif",
      paddingTop: 64,
    }}
  >
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap"
      rel="stylesheet"
    />
 
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: COLORS.navy,
              margin: 0,
            }}
          >
            Admin Analytics
          </h1>
          <p style={{ color: COLORS.gray400, fontSize: 14, margin: "4px 0 0" }}>
            April 10, 2026 · All Departments
          </p>
        </div>
        <button
          style={{
            background: COLORS.navy,
            color: COLORS.white,
            border: "none",
            padding: "10px 20px",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          📄 Export PDF Report
        </button>
      </div>
 
      {/* Top stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <StatCard label="Total Registered" value="163" sub="Today's OPD" />
        <StatCard label="Completed"        value="119" sub="72.9% completion"    accent={COLORS.green} />
        <StatCard label="Avg Wait Time"    value="24m" sub="↓ 6m vs yesterday"  accent={COLORS.teal}  />
        <StatCard label="Emergencies"      value="8"   sub="All acknowledged"    accent={COLORS.red}   />
      </div>
 
      {/* Charts row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}
      >
        <HourlyChart />
        <TriageDistribution />
      </div>
 
      {/* Department comparison table */}
      <DeptTable />
    </div>
  </div>
);
 
export default AdminAnalyticsPage;