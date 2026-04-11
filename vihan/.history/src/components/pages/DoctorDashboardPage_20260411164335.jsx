import { useState } from "react";
import { COLORS } from "../constants";
import { Badge, StatCard } from "../components";

const QUEUE_DATA = {
  "General Medicine": [
    { token: "GM-42", name: "Priya Patel",       age: 34, urgency: "emergency", reason: "Severe chest pain, shortness of breath",    wait: 2  },
    { token: "GM-43", name: "Arun Kumar",        age: 56, urgency: "priority",  reason: "High fever (40°C), 3 days duration",          wait: 18 },
    { token: "GM-44", name: "Sunita Devi",       age: 28, urgency: "routine",   reason: "Cold and cough, 5 days",                      wait: 32 },
    { token: "GM-45", name: "Rajan Singh",       age: 45, urgency: "priority",  reason: "Abdominal pain, moderate severity",           wait: 38 },
    { token: "GM-46", name: "Meena Kumari",      age: 62, urgency: "routine",   reason: "Routine follow-up, hypertension",             wait: 45 },
  ],
  "Paediatrics": [
    { token: "PA-12", name: "Baby Sharma (5)",   age: 5,  urgency: "priority",  reason: "High fever, febrile seizure history",         wait: 12 },
    { token: "PA-13", name: "Aryan Verma (8)",   age: 8,  urgency: "routine",   reason: "Stomach ache, mild",                          wait: 28 },
  ],
  "Orthopaedics": [
    { token: "OR-08", name: "Deepak Jain",       age: 38, urgency: "priority",  reason: "Fall injury, right wrist pain",               wait: 15 },
    { token: "OR-09", name: "Kavita Rao",        age: 50, urgency: "routine",   reason: "Knee pain, chronic",                          wait: 40 },
  ],
};

const DEPT_LOAD = {
  "General Medicine": 78,
  "Paediatrics": 45,
  "Orthopaedics": 55,
};

const URGENCY_COLOR = {
  emergency: COLORS.red,
  priority:  COLORS.amber,
  routine:   COLORS.green,
};

// ── Sub-components ──────────────────────────────────────────────────────────

const EmergencyModal = ({ onAcknowledge }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(229,57,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
    <div style={{ background: COLORS.white, borderRadius: 20, padding: 36, maxWidth: 440, width: "90%", border: `3px solid ${COLORS.red}`, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🚨</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.red, fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>EMERGENCY ALERT</div>
      <div style={{ fontSize: 15, color: COLORS.navy, fontWeight: 600, marginBottom: 4 }}>GM-42 · Priya Patel · Age 34</div>
      <div style={{ fontSize: 14, color: COLORS.gray600, background: "#FFF3F3", borderRadius: 8, padding: "10px 14px", margin: "12px 0 20px" }}>
        AI flagged: Severe chest pain with shortness of breath — possible cardiac event.
      </div>
      <button onClick={onAcknowledge} style={{ width: "100%", background: COLORS.red, color: COLORS.white, border: "none", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Acknowledge Emergency</button>
    </div>
  </div>
);

const DeptTabs = ({ active, setActive }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
    {Object.keys(QUEUE_DATA).map((dept) => (
      <button
        key={dept}
        onClick={() => setActive(dept)}
        style={{
          padding: "8px 18px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          background: active === dept ? COLORS.navy : "rgba(255,255,255,0.7)",
          color: active === dept ? COLORS.white : COLORS.gray600,
          border: active === dept ? "none" : `1px solid ${COLORS.gray200}`,
          backdropFilter: "blur(4px)",
        }}
      >
        {dept}
        <span style={{ background: active === dept ? "rgba(255,255,255,0.2)" : COLORS.gray100, color: active === dept ? COLORS.white : COLORS.gray600, borderRadius: 10, padding: "2px 7px", fontSize: 11, marginLeft: 6 }}>
          {QUEUE_DATA[dept].length}
        </span>
      </button>
    ))}
  </div>
);

const QueueRow = ({ patient, isLast }) => (
  <div style={{ padding: "16px 20px", borderBottom: !isLast ? `1px solid ${COLORS.gray100}` : "none", display: "flex", alignItems: "center", gap: 16, background: patient.urgency === "emergency" ? "rgba(255, 243, 243, 0.6)" : "transparent" }}>
    <div style={{ width: 6, height: 48, borderRadius: 3, background: URGENCY_COLOR[patient.urgency], flexShrink: 0 }} />
    <div style={{ minWidth: 70 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy, fontFamily: "'Syne', sans-serif" }}>{patient.token}</div>
      <div style={{ marginTop: 4 }}><Badge type={patient.urgency}>{patient.urgency}</Badge></div>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.navy }}>{patient.name} · Age {patient.age}</div>
      <div style={{ fontSize: 13, color: COLORS.gray600, marginTop: 3 }}>🤖 {patient.reason}</div>
    </div>
    <div style={{ fontSize: 13, color: COLORS.gray500, minWidth: 60, textAlign: "right" }}>{patient.wait}m wait</div>
    <div style={{ display: "flex", gap: 8 }}>
      <button style={{ padding: "7px 14px", background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Call</button>
      <button style={{ padding: "7px 12px", background: "rgba(255,255,255,0.5)", color: COLORS.gray600, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Skip</button>
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────────────────────────

const DoctorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("General Medicine");
  const [showEmergency, setShowEmergency] = useState(true);

  const queue = QUEUE_DATA[activeTab] || [];
  const load = DEPT_LOAD[activeTab] || 50;
  const loadColor = load > 85 ? COLORS.red : load > 60 ? COLORS.amber : COLORS.green;

  return (
    <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'DM Sans', sans-serif", paddingTop: 64, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* ── 1. FIXED BACKGROUND LAYER (2% Blur) ── */}
      <div 
        style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          backgroundImage: "url('/doctor.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      >
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(248, 250, 252, 0.82)", // Professional light tint
            backdropFilter: "blur(px)", // 2% Blur
            WebkitBackdropFilter: "blur(2px)",
          }}
        />
      </div>

      {showEmergency && <EmergencyModal onAcknowledge={() => setShowEmergency(false)} />}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.navy, margin: 0 }}>Doctor Dashboard</h1>
            <p style={{ color: COLORS.gray600, fontSize: 14, margin: "4px 0 0" }}>OPD Queue Management · Live</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.green }} />
            <span style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600 }}>Live · Auto-refresh 30s</span>
          </div>
        </div>

        {/* Stats row with Glassmorphism */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {/* Note: StatCard should handle its own semi-transparent background for best look */}
          <StatCard label="Tokens Waiting"   value={queue.length} />
          <StatCard label="Completed Today"  value="38"    accent={COLORS.green} />
          <StatCard label="Avg. Consult Time" value="8.4m" accent={COLORS.amber} />
          <StatCard label="Throughput"       value="7/hr"  accent={COLORS.teal}  />
        </div>

        <DeptTabs active={activeTab} setActive={setActiveTab} />

        {/* Load bar panel */}
        <div style={{ background: "rgba(255, 255, 255, 0.7)", borderRadius: 10, padding: "12px 16px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20, display: "flex", alignItems: "center", gap: 16, backdropFilter: "blur(5px)" }}>
          <span style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600 }}>Department Load</span>
          <div style={{ flex: 1, background: COLORS.gray100, borderRadius: 6, height: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${load}%`, background: loadColor, transition: "width 0.5s" }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: loadColor, minWidth: 40 }}>{load}%</span>
        </div>

        {/* Queue Table with Glassmorphism */}
        <div style={{ background: "rgba(255, 255, 255, 0.75)", borderRadius: 14, border: `1px solid ${COLORS.gray200}`, overflow: "hidden", backdropFilter: "blur(10px)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.4)" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy }}>Queue · {activeTab}</span>
            <span style={{ fontSize: 13, color: COLORS.gray600 }}>{queue.length} patients waiting</span>
          </div>

          {queue.map((patient, i) => (
            <QueueRow key={patient.token} patient={patient} isLast={i === queue.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;