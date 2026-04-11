import { useState } from "react";
import { COLORS } from "../constants";
import { Badge, StatCard } from "../components";

const DEPTS = ["General Medicine", "Paediatrics", "Orthopaedics"];

const FORM_FIELDS = [
  { label: "Full Name",     key: "name",  placeholder: "Rahul Sharma",      type: "text"   },
  { label: "Age",           key: "age",   placeholder: "32",                type: "number" },
  { label: "Phone Number",  key: "phone", placeholder: "+91 98765 43210",   type: "tel"    },
];

const StepIndicator = ({ step }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40, position: "relative", zIndex: 2 }}>
    {["Registration", "AI Triage", "Token"].map((label, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              step > i + 1 ? COLORS.teal : step === i + 1 ? COLORS.navy : "rgba(255,255,255,0.2)",
            color: step > i + 1 ? COLORS.navy : COLORS.white,
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
            border: step === i + 1 ? `2px solid ${COLORS.teal}` : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {step > i + 1 ? "✓" : i + 1}
        </div>
        <span
          style={{
            fontSize: 12,
            color: step === i + 1 ? COLORS.white : "rgba(255,255,255,0.5)",
            marginLeft: 6,
            fontWeight: step === i + 1 ? 600 : 400,
          }}
        >
          {label}
        </span>
        {i < 2 && (
          <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.2)", margin: "0 10px" }} />
        )}
      </div>
    ))}
  </div>
);

const PatientPortalPage = ({ setActive }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", age: "", gender: "", phone: "" });
  const [token, setToken] = useState(null);

  const handleContinue = () => {
    setActive("triage");
  };

  const generateToken = () => {
    const t = {
      number:   `GM-${Math.floor(Math.random() * 40) + 60}`,
      current:  `GM-${Math.floor(Math.random() * 30) + 20}`,
      position: Math.floor(Math.random() * 12) + 3,
      wait:     Math.floor(Math.random() * 45) + 15,
      dept:     DEPTS[Math.floor(Math.random() * DEPTS.length)],
      urgency:  ["routine", "priority"][Math.floor(Math.random() * 2)],
    };
    setToken(t);
    setStep(3);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'DM Sans', sans-serif", paddingTop: 64, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* ── 1. FIXED BACKGROUND LAYER ── */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%", 
          backgroundImage: "url('/patientportal.png')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      >
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10, 25, 47, 0.7)", 
            backdropFilter: "blur(20px)", // 50% Blur
            WebkitBackdropFilter: "blur(20px)",
          }}
        />
      </div>

      {/* ── 2. SCROLLABLE CONTENT LAYER ── */}
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: COLORS.teal, fontWeight: 700, letterSpacing: "1px", marginBottom: 10 }}>
            PATIENT PORTAL
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: COLORS.white, margin: "0 0 8px" }}>
            Get Your Digital Token
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, margin: 0 }}>
            Register in under 2 minutes. Track your queue in real time.
          </p>
        </div>

        <StepIndicator step={step} />

        {/* ── Step 1: Humanized Formal Registration Form ── */}
        {step === 1 && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.94)",
              borderRadius: "28px",
              padding: "40px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(12px)",
              position: "relative",
            }}
          >
            {/* Top Accent Line */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "10%",
              width: "80%",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${COLORS.teal}, transparent)`,
            }} />

            <h3 style={{ 
              margin: "0 0 8px", 
              fontSize: "20px", 
              fontWeight: 800, 
              color: COLORS.navy,
              fontFamily: "'Syne', sans-serif" 
            }}>
              Patient Registration
            </h3>
            <p style={{ 
              margin: "0 0 32px", 
              fontSize: "14px", 
              color: COLORS.gray600,
              lineHeight: "1.5" 
            }}>
              Please provide your details exactly as per your identity records to ensure accurate medical history mapping.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {FORM_FIELDS.map((f) => (
                <div key={f.key}>
                  <label style={{ 
                    fontSize: "12px", 
                    fontWeight: 700, 
                    color: COLORS.navy, 
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block", 
                    marginBottom: "8px" 
                  }}>
                    {f.label}
                  </label>
                  <input
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    type={f.type}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      borderRadius: "12px",
                      boxSizing: "border-box",
                      border: `1.5px solid ${COLORS.gray200}`,
                      fontSize: "15px",
                      color: COLORS.navy,
                      outline: "none",
                      background: "white",
                      transition: "all 0.2s ease",
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: COLORS.navy, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "12px" }}>
                  Gender
                </label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["Male", "Female", "Other"].map((g) => {
                    const isSelected = form.gender === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setForm({ ...form, gender: g })}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: "pointer",
                          background: isSelected ? COLORS.navy : "white",
                          color: isSelected ? COLORS.white : COLORS.gray600,
                          border: isSelected ? `2px solid ${COLORS.navy}` : `1.5px solid ${COLORS.gray200}`,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              style={{
                width: "100%",
                background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1e293b 100%)`,
                color: COLORS.white,
                border: "none",
                padding: "16px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: "36px",
                boxShadow: `0 10px 20px rgba(15, 23, 42, 0.2)`,
              }}
            >
              Continue to AI Triage →
            </button>
          </div>
        )}

        {/* ── Step 3: Token Display ── */}
        {step === 3 && token && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: COLORS.navy, borderRadius: 20, padding: 32, textAlign: "center", border: "1px solid rgba(0,191,166,0.3)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(0,191,166,0.06)" }} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "2px", marginBottom: 12 }}>YOUR TOKEN NUMBER</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 64, fontWeight: 800, color: COLORS.teal, lineHeight: 1 }}>{token.number}</div>
              <div style={{ marginTop: 12 }}><Badge type={token.urgency}>{token.urgency}</Badge></div>
              <div style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Department</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.white }}>{token.dept}</div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.98)", borderRadius: 16, padding: 24, border: `1px solid ${COLORS.gray200}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Live Queue Status</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <StatCard label="Now Serving"  value={token.current} />
                <StatCard label="Your Position" value={`#${token.position}`} accent={COLORS.amber} />
                <StatCard label="Est. Wait"    value={`${token.wait}m`}     accent={COLORS.green} />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Already triaged?{" "}
            <span onClick={generateToken} style={{ color: COLORS.teal, cursor: "pointer", fontWeight: 600 }}>
              Generate demo token
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PatientPortalPage;