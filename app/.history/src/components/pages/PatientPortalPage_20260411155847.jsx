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
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
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
              step > i + 1 ? COLORS.teal : step === i + 1 ? COLORS.navy : COLORS.gray200,
            color: step > i + 1 ? COLORS.navy : COLORS.white,
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {step > i + 1 ? "✓" : i + 1}
        </div>
        <span
          style={{
            fontSize: 12,
            color: step === i + 1 ? COLORS.navy : COLORS.gray400,
            marginLeft: 6,
            fontWeight: step === i + 1 ? 600 : 400,
          }}
        >
          {label}
        </span>
        {i < 2 && (
          <div style={{ width: 32, height: 1, background: COLORS.gray200, margin: "0 10px" }} />
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
    // Navigate to AI Triage page; in a real app you'd pass form data via context/router
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
 
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 13,
              color: COLORS.teal,
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: 10,
            }}
          >
            PATIENT PORTAL
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 36,
              fontWeight: 800,
              color: COLORS.navy,
              margin: "0 0 8px",
            }}
          >
            Get Your Digital Token
          </h1>
          <p style={{ color: COLORS.gray400, fontSize: 15, margin: 0 }}>
            Register in under 2 minutes. Track your queue in real time.
          </p>
        </div>
 
        <StepIndicator step={step} />
 
        {/* ── Step 1: Registration Form ── */}
        {step === 1 && (
          <div
            style={{
              background: COLORS.white,
              borderRadius: 16,
              padding: 32,
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: COLORS.navy }}>
              Personal Information
            </h3>
 
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {FORM_FIELDS.map((f) => (
                <div key={f.key}>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.gray600,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    type={f.type}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 8,
                      boxSizing: "border-box",
                      border: `1px solid ${COLORS.gray200}`,
                      fontSize: 14,
                      color: COLORS.navy,
                      outline: "none",
                      background: COLORS.gray50,
                    }}
                  />
                </div>
              ))}
 
              {/* Gender */}
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.gray600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Gender
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setForm({ ...form, gender: g })}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        background: form.gender === g ? COLORS.tealLight : COLORS.gray50,
                        color: form.gender === g ? COLORS.tealDark : COLORS.gray600,
                        border:
                          form.gender === g
                            ? `1.5px solid ${COLORS.teal}`
                            : `1px solid ${COLORS.gray200}`,
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
 
            <button
              onClick={handleContinue}
              style={{
                width: "100%",
                background: COLORS.navy,
                color: COLORS.white,
                border: "none",
                padding: "13px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                marginTop: 28,
              }}
            >
              Continue to AI Triage →
            </button>
          </div>
        )}
 
        {/* ── Step 3: Token Display ── */}
        {step === 3 && token && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Token card */}
            <div
              style={{
                background: COLORS.navy,
                borderRadius: 20,
                padding: 32,
                textAlign: "center",
                border: "1px solid rgba(0,191,166,0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "rgba(0,191,166,0.06)",
                }}
              />
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "2px",
                  marginBottom: 12,
                }}
              >
                YOUR TOKEN NUMBER
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 64,
                  fontWeight: 800,
                  color: COLORS.teal,
                  lineHeight: 1,
                }}
              >
                {token.number}
              </div>
              <div style={{ marginTop: 12 }}>
                <Badge type={token.urgency}>{token.urgency}</Badge>
              </div>
              <div style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                Department
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.white }}>
                {token.dept}
              </div>
            </div>
 
            {/* Live queue status */}
            <div
              style={{
                background: COLORS.white,
                borderRadius: 16,
                padding: 24,
                border: `1px solid ${COLORS.gray200}`,
              }}
            >
              <div
                style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}
              >
                Live Queue Status
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <StatCard label="Now Serving"  value={token.current} />
                <StatCard label="Your Position" value={`#${token.position}`} accent={COLORS.amber} />
                <StatCard label="Est. Wait"    value={`${token.wait}m`}     accent={COLORS.green} />
              </div>
 
              {/* Progress bar */}
              <div style={{ marginTop: 20 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
                >
                  <span style={{ fontSize: 12, color: COLORS.gray400 }}>Queue Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.navy }}>
                    {100 - token.position * 4}% complete
                  </span>
                </div>
                <div
                  style={{
                    background: COLORS.gray100,
                    borderRadius: 6,
                    height: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: COLORS.teal,
                      height: "100%",
                      width: `${100 - token.position * 4}%`,
                      borderRadius: 6,
                    }}
                  />
                </div>
              </div>
            </div>
 
            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                style={{
                  flex: 1,
                  background: COLORS.tealLight,
                  color: COLORS.tealDark,
                  border: "none",
                  padding: "12px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🔔 Notify Me When Close
              </button>
              <button
                style={{
                  flex: 1,
                  background: COLORS.gray100,
                  color: COLORS.gray600,
                  border: "none",
                  padding: "12px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📱 Share Token
              </button>
            </div>
          </div>
        )}
 
        {/* Demo helper — skip to token view */}
        {step === 1 && (
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: COLORS.gray400 }}>
            Already triaged?{" "}
            <span
              onClick={generateToken}
              style={{ color: COLORS.teal, cursor: "pointer", fontWeight: 600 }}
            >
              Generate demo token
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
 
export default PatientPortalPage;