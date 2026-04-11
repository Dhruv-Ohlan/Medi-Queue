import React from 'react';
import { COLORS } from "../constants";

const STATS = [
  { n: "50M+", d: "OPD visits/month" },
  { n: "3-6h", d: "Average wait time" },
  { n: "40%",  d: "Wrong dept visits" },
  { n: "0",    d: "Hardware needed"  },
];

const FEATURES = [
  { icon: "📱", title: "Digital Token System",   desc: "Scan QR or open URL. Get a token instantly with live position tracking." },
  { icon: "🤖", title: "AI Symptom Triage",      desc: "OpenAI-powered intake classifies urgency & routes you to the right department." },
  { icon: "⚡", title: "Real-Time Queue",         desc: "Auto-refreshing queue for both patients and doctors. No hardware required." },
  { icon: "📊", title: "Analytics Dashboard",    desc: "Cross-department load, triage breakdowns, and daily PDF reports for admins." },
  { icon: "🔔", title: "SMS Notifications",      desc: "WhatsApp & SMS alerts when you're 5 tokens away via Twilio." },
  { icon: "🏥", title: "Multi-Department",       desc: "General Medicine, Paediatrics, Orthopaedics — extensible via admin panel." },
];

const PROBLEMS = [
  { pain: "No queue visibility",    impact: "Patients can't leave, rest, or plan" },
  { pain: "Wrong department visits", impact: "30–40% visit the wrong dept first" },
  { pain: "No prioritization",       impact: "Critical cases wait behind routine ones" },
  { pain: "Zero admin data",         impact: "Can't improve what you can't measure" },
];

const HomePage = ({ setActive }) => {
  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: COLORS.navy, 
      fontFamily: "'Times New Roman', Times, serif", // Updated to professional serif
      position: "relative", 
      overflowX: "hidden" 
    }}>
      
      {/* ── RESPONSIVE STYLES (Inline Media Query Simulation) ── */}
      <style>
        {`
          @media (max-width: 768px) {
            .hero-title { font-size: 42px !important; }
            .hero-para { font-size: 16px !important; }
            .stats-container { flex-direction: column !important; width: 90% !important; margin-top: 40px !important; }
            .stats-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; padding: 20px !important; }
            .grid-two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
            .grid-three-col { grid-template-columns: 1fr !important; }
            .section-padding { padding: 60px 20px !important; }
            .btn-group { flex-direction: column !important; width: 100% !important; gap: 12px !important; }
            .btn-group button { width: 100% !important; }
          }
        `}
      </style>

      {/* ── 1. FIXED BACKGROUND IMAGE ── */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%", 
          backgroundImage: "url('/home.png')", 
          backgroundSize: "cover", // Optimized for full screen
          backgroundPosition: "center",
          zIndex: 0,
        }}
      >
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, rgba(10, 25, 47, 0.5), rgba(10, 25, 47, 0.8))`,
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
          }}
        />
      </div>

      {/* ── 2. SCROLLABLE CONTENT ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        
        {/* ── Hero Section ── */}
        <div
          className="section-padding"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "120px 40px 80px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,191,166,0.15)",
              border: "1px solid rgba(0,191,166,0.4)",
              borderRadius: 4,
              padding: "6px 16px",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 11, color: COLORS.teal, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
              Medical Efficiency Dashboard 2026
            </span>
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: COLORS.white,
              lineHeight: 1.1,
              margin: "0 0 24px",
              maxWidth: 900,
              textShadow: "0 4px 15px rgba(0,0,0,0.6)",
            }}
          >
            Optimizing Healthcare Delivery for <br />
            <span style={{ color: COLORS.teal }}>Digital Hospital Infrastructure</span>
          </h1>

          <p className="hero-para" style={{ fontSize: 20, color: "rgba(255,255,255,0.9)", maxWidth: 650, lineHeight: 1.6, margin: "0 0 40px" }}>
            Reducing OPD congestion through real-time queue synchronization, AI-based triage routing, and unified administrative analytics.
          </p>

          <div className="btn-group" style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              onClick={() => setActive("patient")}
              style={{ background: COLORS.teal, color: COLORS.navy, border: "none", padding: "16px 36px", borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}
            >
              Access Patient Portal →
            </button>
            <button
              onClick={() => setActive("doctor")}
              style={{ background: "rgba(255,255,255,0.1)", color: COLORS.white, border: "1px solid rgba(255,255,255,0.3)", padding: "16px 36px", borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(10px)" }}
            >
              Doctor Login
            </button>
          </div>

          {/* Stats Bar */}
          <div className="stats-container" style={{ display: "flex", marginTop: 80, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(10, 25, 47, 0.8)", backdropFilter: "blur(20px)" }}>
            {STATS.map((s, i) => (
              <div key={i} className="stats-item" style={{ padding: "24px 45px", textAlign: "center", borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.teal }}>{s.n}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Problem Section ── */}
        <div className="section-padding" style={{ padding: "100px 80px", background: "rgba(255, 255, 255, 0.02)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="grid-two-col" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 80, alignItems: "center" }}>
              <div>
                <div style={{ color: COLORS.teal, fontSize: 13, fontWeight: 700, letterSpacing: "1px", marginBottom: 16 }}>OPERATIONAL CHALLENGES</div>
                <h2 style={{ fontSize: 42, fontWeight: 700, color: COLORS.white, lineHeight: 1.2, margin: "0 0 20px" }}>The Bottleneck of <br />Traditional OPD Management.</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 17, lineHeight: 1.8, margin: "0 0 32px" }}>
                  Current healthcare systems face significant throughput issues. Physical queuing leads to patient dissatisfaction and administrative opacity.
                </p>
                <button onClick={() => setActive("triage")} style={{ background: "transparent", color: COLORS.teal, border: `1px solid ${COLORS.teal}`, padding: "12px 28px", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>View AI Triage Logic →</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {PROBLEMS.map((item, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "18px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                    <div>
                      <div style={{ color: COLORS.white, fontSize: 15, fontWeight: 700 }}>{item.pain}</div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 4 }}>{item.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Features Section ── */}
        <div className="section-padding" style={{ padding: "100px 80px", background: "rgba(10, 25, 47, 0.95)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{ color: COLORS.teal, fontSize: 13, fontWeight: 700, letterSpacing: "1px", marginBottom: 12 }}>SYSTEM ARCHITECTURE</div>
              <h2 style={{ fontSize: 38, fontWeight: 700, color: COLORS.white, margin: 0 }}>Integrated Healthcare Modules</h2>
            </div>
            <div className="grid-three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "32px 24px", transition: "transform 0.3s ease" }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.white, marginBottom: 10 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "40px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          © 2026 MediQueue Management Systems. All Rights Reserved.
        </div>

      </div>
    </div>
  );
};

export default HomePage;