import React from 'react';
import { COLORS } from "../constants";

const STATS = [
  { n: "50M+", d: "OPD visits/month" },
  { n: "3-6h", d: "Average wait time" },
  { n: "40%",  d: "Wrong dept visits" },
  { n: "0",    d: "Hardware needed"  },
];

const FEATURES = [
  { icon: "📱", title: "Digital Token System",  desc: "Scan QR or open URL. Get a token instantly with live position tracking." },
  { icon: "🤖", title: "AI Symptom Triage",     desc: "OpenAI-powered intake classifies urgency & routes you to the right department." },
  { icon: "⚡", title: "Real-Time Queue",        desc: "Auto-refreshing queue for both patients and doctors. No hardware required." },
  { icon: "📊", title: "Analytics Dashboard",   desc: "Cross-department load, triage breakdowns, and daily PDF reports for admins." },
  { icon: "🔔", title: "SMS Notifications",     desc: "WhatsApp & SMS alerts when you're 5 tokens away via Twilio." },
  { icon: "🏥", title: "Multi-Department",      desc: "General Medicine, Paediatrics, Orthopaedics — extensible via admin panel." },
];

const PROBLEMS = [
  { pain: "No queue visibility",    impact: "Patients can't leave, rest, or plan" },
  { pain: "Wrong department visits", impact: "30–40% visit the wrong dept first" },
  { pain: "No prioritization",       impact: "Critical cases wait behind routine ones" },
  { pain: "Zero admin data",         impact: "Can't improve what you can't measure" },
];

const HomePage = ({ setActive }) => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.navy, fontFamily: "'DM Sans', sans-serif", position: "relative", overflowX: "hidden" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── 1. NON-SCROLLABLE BACKGROUND IMAGE ── */}
      <div 
        style={{
          position: "fixed", // Makes image non-scrollable
          top: 0,
          left: 0,
          width: "100%",
          height: "100%", 
          backgroundImage: "url('/home.png')", 
          backgroundSize: "80",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      >
        {/* Overlay for Visibility and Blur */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            // Balanced tint: dark enough for text, light enough to see the image clearly
            background: `linear-gradient(to bottom, rgba(10, 25, 47, 0.4), rgba(10, 25, 47, 0.7))`,
            backdropFilter: "blur(6px)", // Reduced blur so user can see "what's in the image"
            WebkitBackdropFilter: "blur(3px)",
          }}
        />
      </div>

      {/* ── 2. CONTENT LAYER (Scrolls over the fixed image) ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        
        {/* ── Hero Section ── */}
        <div
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
              background: "rgba(0,191,166,0.2)",
              border: "1px solid rgba(0,191,166,0.5)",
              borderRadius: 20,
              padding: "6px 16px",
              marginBottom: 32,
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.teal, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: COLORS.teal, fontWeight: 600, letterSpacing: "0.5px" }}>
              HACKATHON BUILD · HEALTHTECH 2026
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 72,
              fontWeight: 800,
              color: COLORS.white,
              lineHeight: 1.05,
              margin: "0 0 24px",
              maxWidth: 800,
              textShadow: "0 4px 20px rgba(0,0,0,0.8)", // Heavy shadow for maximum readability
            }}
          >
            End the<br />
            <span style={{ color: COLORS.teal }}>Hospital Queue</span>
            <br />Chaos
          </h1>

          <p style={{ fontSize: 20, color: COLORS.white, maxWidth: 560, lineHeight: 1.7, margin: "0 0 48px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            Real-time digital queues, AI-powered triage, and zero hardware dependency — built for India's 1.4 billion.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              onClick={() => setActive("patient")}
              style={{ background: COLORS.teal, color: COLORS.navy, border: "none", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 25px rgba(0,0,191,0.3)" }}
            >
              Get Your Token →
            </button>
            <button
              onClick={() => setActive("doctor")}
              style={{ background: "rgba(255,255,255,0.15)", color: COLORS.white, border: "1px solid rgba(255,255,255,0.3)", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer", backdropFilter: "blur(10px)" }}
            >
              Doctor Dashboard
            </button>
          </div>

          {/* Stats Bar */}
          <div style={{ display: "flex", marginTop: 80, borderRadius: 14, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(10, 25, 47, 0.6)", backdropFilter: "blur(20px)" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: "24px 40px", textAlign: "center", borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.teal, fontFamily: "'Syne', sans-serif" }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Problem Section ── */}
        {/* We use semi-transparent backgrounds so the fixed image stays visible behind the content sections */}
        <div style={{ padding: "100px 80px", background: "rgba(10, 25, 47, 0.85)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
              <div>
                <div style={{ color: COLORS.teal, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 16 }}>THE PROBLEM</div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 44, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, margin: "0 0 20px" }}>One physical token.<br />Zero information.</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, margin: "0 0 32px" }}>
                  India's government hospitals handle over 50 million OPD visits per month. Patients wait 3–6 hours in crowded corridors.
                </p>
                <button onClick={() => setActive("triage")} style={{ background: "transparent", color: COLORS.teal, border: `1px solid ${COLORS.teal}`, padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Try AI Triage →</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {PROBLEMS.map((item, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, backdropFilter: "blur(5px)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4d4d", flexShrink: 0 }} />
                    <div>
                      <div style={{ color: COLORS.white, fontSize: 14, fontWeight: 600 }}>{item.pain}</div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 }}>{item.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Features Section ── */}
        <div style={{ padding: "100px 80px", background: "rgba(10, 25, 47, 0.9)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ color: COLORS.teal, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 12 }}>WHAT WE BUILT</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: COLORS.white, margin: 0 }}>Three modules. One solution.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 24px", backdropFilter: "blur(10px)" }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white, marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;