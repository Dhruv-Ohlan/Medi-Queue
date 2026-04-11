import React, { useState } from "react";
import { COLORS } from "../constants";
import { Badge, StatCard } from "../components";

const QUEUE_DATA = {
  "General Medicine": [
    { token: "GM-42", name: "Priya Patel", age: 34, urgency: "emergency", reason: "Acute respiratory distress and persistent chest pressure.", wait: 2 },
    { token: "GM-43", name: "Arun Kumar", age: 56, urgency: "priority", reason: "High grade fever (103°F) with severe abdominal pain.", wait: 18 },
    { token: "GM-44", name: "Sunita Devi", age: 28, urgency: "routine", reason: "Persistent allergic rhinitis and dry cough.", wait: 32 },
    { token: "GM-45", name: "Rajan Singh", age: 45, urgency: "priority", reason: "Suspected lumbar strain following physical exertion.", wait: 38 },
    { token: "GM-46", name: "Meena Kumari", age: 62, urgency: "routine", reason: "Follow-up for hypertension and medication review.", wait: 45 },
  ],
  "Paediatrics": [
    { token: "PA-12", name: "Aryan Verma", age: 5, urgency: "priority", reason: "Suspected foreign body ingestion; stable vitals.", wait: 12 },
    { token: "PA-13", name: "Ishaan Mehta", age: 8, urgency: "routine", reason: "Routine wellness check and vaccination.", wait: 28 },
  ],
  "Orthopaedics": [
    { token: "OR-08", name: "Deepak Jain", age: 38, urgency: "priority", reason: "Localized swelling and pain in right ankle joint.", wait: 15 },
    { token: "OR-09", name: "Kavita Rao", age: 50, urgency: "routine", reason: "Chronic osteoarthritis follow-up.", wait: 40 },
  ],
};

const DEPT_LOAD = { "General Medicine": 92, "Paediatrics": 45, "Orthopaedics": 55 };

// ── Professional Emergency Protocol ───────────────────────────────────────────────

const EmergencyModal = ({ onAcknowledge }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15, 23, 42, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
    <div style={{ background: "#ffffff", borderRadius: 8, padding: 40, maxWidth: 500, width: "90%", borderLeft: `8px solid #ef4444`, textAlign: "left", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#ef4444", letterSpacing: "1.5px", marginBottom: 10 }}>CRITICAL ALERT</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 15 }}>Emergency Patient Arrival</div>
      <div style={{ fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
        A patient has been triaged as <strong>EMERGENCY</strong>. Immediate clinical intervention is requested in the OPD stabilization bay.
      </div>
      <div style={{ background: "#fef2f2", borderRadius: 4, padding: "16px", border: "1px solid #fee2e2", marginBottom: 25 }}>
        <div style={{ fontSize: 13, color: "#991b1b", fontWeight: 700 }}>AI DIAGNOSTIC SUMMARY:</div>
        <div style={{ fontSize: 14, color: "#b91c1c", marginTop: 4 }}>"Patient reports acute substernal chest pain radiating to the left arm. Vitals suggest immediate cardiac evaluation."</div>
      </div>
      <button onClick={onAcknowledge} style={{ width: "100%", background: "#0f172a", color: "#ffffff", border: "none", padding: "16px", borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>
        Acknowledge and Proceed
      </button>
    </div>
  </div>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────────

const DoctorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("General Medicine");
  const [showEmergency, setShowEmergency] = useState(true);

  const queue = QUEUE_DATA[activeTab] || [];
  const load = DEPT_LOAD[activeTab] || 50;
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
            .dept-selector { overflow-x: auto !important; white-space: nowrap !important; padding-bottom: 10px !important; }
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

      {showEmergency && <EmergencyModal onAcknowledge={() => setShowEmergency(false)} />}

      <div className="dashboard-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        
        {/* Header */}
        <div className="header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h1 className="header-title" style={{ fontSize: 36, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Clinical Dashboard
            </h1>
            <p style={{ color: "#64748b", fontSize: 16, margin: "6px 0 0" }}>
              Medical Officer: Dr. Alok | Shift: Morning (0800 - 1600)
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <Badge type="routine">System: Online</Badge>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, fontWeight: 700 }}>LAST SYNC: 2026-04-11 19:15</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          <StatCard label="Patients in Queue" value={queue.length} />
          <StatCard label="Consultations Done" value="38" accent="#10b981" />
          <StatCard label="Avg. Consultation" value="12m" accent="#3b82f6" />
          <StatCard label="Critical Cases" value="01" accent="#ef4444" />
        </div>

        {/* Dept Selector */}
        <div className="dept-selector" style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {Object.keys(QUEUE_DATA).map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveTab(dept)}
              style={{
                padding: "12px 24px",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                background: activeTab === dept ? "#0f172a" : "#ffffff",
                color: activeTab === dept ? "#ffffff" : "#475569",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s"
              }}
            >
              {dept} ({QUEUE_DATA[dept].length})
            </button>
          ))}
        </div>

        {/* Department Load Status */}
        <div style={{ background: "#ffffff", borderRadius: 8, padding: "20px", border: `1px solid #e2e8f0`, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: "#0f172a", fontWeight: 700 }}>Unit Resource Saturation: {activeTab}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: loadColor }}>
              {load > 85 ? "CRITICAL LOAD" : load > 60 ? "MODERATE LOAD" : "OPTIMAL LOAD"}
            </span>
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 4, height: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${load}%`, background: loadColor, transition: "width 1s ease-in-out" }} />
          </div>
        </div>

        {/* Patient Queue Table */}
        <div style={{ background: "#ffffff", borderRadius: 8, border: `1px solid #e2e8f0`, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid #e2e8f0`, background: "#f8fafc", fontWeight: 700, color: "#0f172a", fontSize: 15 }}>
            Active Patient Queue
          </div>

          {queue.map((p, i) => (
            <div key={i} className="patient-row" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, borderBottom: i === queue.length - 1 ? "none" : `1px solid #f1f5f9`, background: p.urgency === 'emergency' ? '#fef2f2' : 'transparent' }}>
              <div style={{ fontSize: 24 }}>{p.urgency === 'emergency' ? '🔴' : '🔵'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 17 }}>
                  {p.token} | {p.name} <span style={{ color: "#64748b", fontWeight: 400, fontSize: 14 }}>(Age: {p.age})</span>
                </div>
                <div style={{ fontSize: 14, color: "#475569", marginTop: 4, fontStyle: "italic" }}>Triage Note: {p.reason}</div>
              </div>
              <div className="action-buttons" style={{ display: "flex", gap: 12 }}>
                <button style={{ background: "#0f172a", color: "white", padding: "10px 24px", borderRadius: 4, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                  Examine Patient
                </button>
                <button style={{ background: "white", color: "#64748b", padding: "10px 18px", borderRadius: 4, border: "1px solid #cbd5e1", cursor: "pointer", fontSize: 13 }}>
                  Transfer
                </button>
              </div>
            </div>
          ))}
          {queue.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No active patients in this unit.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;