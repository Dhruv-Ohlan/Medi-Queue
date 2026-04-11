import React, { useState, useEffect, useRef } from "react";
import { COLORS } from "../constants";
import { Badge, StatCard } from "../components";
import { getTokenStatus } from "../../api/services";

const DEPTS = ["General Medicine", "Paediatrics", "Orthopaedics"];

const FORM_FIELDS = [
  { label: "Full Name",    key: "name",  placeholder: "Rahul Sharma",       type: "text"   },
  { label: "Age",           key: "age",   placeholder: "32",                type: "number" },
  { label: "Phone Number",  key: "phone", placeholder: "+91 98765 43210",    type: "tel"    },
];

const StepIndicator = ({ step }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40, position: "relative", zIndex: 2, flexWrap: "wrap", gap: "10px" }}>
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
            background: step > i + 1 ? COLORS.teal : step === i + 1 ? COLORS.navy : "rgba(255,255,255,0.2)",
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
          <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.2)", margin: "0 8px" }} className="step-line" />
        )}
      </div>
    ))}
  </div>
);

const PatientPortalPage = ({ setActive, patientForm, setPatientForm, trackingId, setTrackingId }) => {
  // If we have a trackingId (came back from triage), show token view (step 3)
  const [step, setStep] = useState(trackingId ? 3 : 1);
  const [form, setForm] = useState({
    name: patientForm?.name || "",
    age: patientForm?.age || "",
    gender: patientForm?.gender || "",
    phone: patientForm?.phone || "",
  });

  // ── Token status polling state ──────────────────────────────────
  const [tokenData, setTokenData] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const pollRef = useRef(null);

  // Sync step if trackingId arrives (e.g. user navigates back from triage)
  useEffect(() => {
    if (trackingId) {
      setStep(3);
    }
  }, [trackingId]);

  // ── Poll token status every 30s when on step 3 ─────────────────
  useEffect(() => {
    if (step !== 3 || !trackingId) return;

    const fetchStatus = async () => {
      setStatusLoading(true);
      setStatusError(null);
      try {
        const res = await getTokenStatus(trackingId);
        setTokenData(res.data);
      } catch (err) {
        setStatusError(err.message);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus(); // initial fetch
    pollRef.current = setInterval(fetchStatus, 3000);

    return () => clearInterval(pollRef.current);
  }, [step, trackingId]);

  const handleContinue = () => {
    // Validate minimum fields
    if (!form.name.trim() || !form.age || !form.gender || !form.phone.trim()) {
      alert("Please fill in all fields before continuing.");
      return;
    }

    // Save to shared state so AITriagePage can use it
    setPatientForm({ ...form });
    setActive("triage");
  };

  // ── Demo token fallback (when backend isn't running) ────────────
  const generateDemoToken = () => {
    const t = {
      tokenNumber: Math.floor(Math.random() * 40) + 60,
      currentServingToken: `${Math.floor(Math.random() * 30) + 20}`,
      queuePosition: Math.floor(Math.random() * 12) + 3,
      etaMinutes: Math.floor(Math.random() * 45) + 15,
      department: DEPTS[Math.floor(Math.random() * DEPTS.length)],
      urgencyLevel: ["routine", "priority"][Math.floor(Math.random() * 2)],
      status: "waiting",
    };
    setTokenData(t);
    setStep(3);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'Times New Roman', Times, serif", paddingTop: 64, overflowX: "hidden" }}>
      
      {/* ── RESPONSIVE OVERRIDES ── */}
      <style>
        {`
          @media (max-width: 600px) {
            .portal-container { padding: 24px 15px !important; }
            .portal-title { font-size: 28px !important; }
            .step-line { display: none !important; }
            .token-number { font-size: 48px !important; }
            .stat-grid { grid-template-columns: 1fr !important; }
          }
        `}
      </style>

      {/* ── 1. GLOBAL BACKGROUND IMAGE (patientportal.png) ── */}
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
            background: "rgba(10, 25, 47, 0.85)", 
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />
      </div>

      {/* ── 2. CONTENT LAYER ── */}
      <div className="portal-container" style={{ maxWidth: 580, margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: COLORS.teal, fontWeight: 700, letterSpacing: "1px", marginBottom: 10 }}>
            PATIENT PORTAL
          </div>
          <h1 className="portal-title" style={{ fontSize: 36, fontWeight: 800, color: COLORS.white, margin: "0 0 8px" }}>
            Get Your Digital Token
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, margin: 0 }}>
            Register in under 2 minutes. Track your queue in real time.
          </p>
        </div>

        <StepIndicator step={step} />

        {/* ── Step 1: Registration Form with Blurred home.png background ── */}
        {step === 1 && (
          <div
            style={{
              position: "relative",
              borderRadius: 24,
              padding: "32px 24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
              overflow: "hidden", 
              background: "rgba(0, 0, 0, 0.4)", 
            }}
          >
            {/* Blurred Background Layer */}
            <div 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: "url('/home.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(8px)", 
                zIndex: -1,
                transform: "scale(1.1)", 
              }}
            />

            {/* Content Layer */}
            <div style={{ position: "relative", zIndex: 2 }}>
                <h3 style={{ 
                    margin: "0 0 24px", 
                    fontSize: 22, 
                    fontWeight: 700, 
                    color: "#ffffff",
                    textShadow: "0 2px 4px rgba(0,0,0,0.8)"
                }}>
                  Personal Information
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {FORM_FIELDS.map((f) => (
                    <div key={f.key}>
                      <label style={{ 
                          fontSize: 14, 
                          fontWeight: 700, 
                          color: "#ffffff", 
                          display: "block", 
                          marginBottom: 6,
                          textShadow: "0 1px 3px rgba(0,0,0,1)" 
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
                          padding: "12px 14px",
                          borderRadius: 8,
                          boxSizing: "border-box",
                          border: "1px solid rgba(255,255,255,0.3)",
                          fontSize: 14,
                          color: "#ffffff",
                          outline: "none",
                          background: "rgba(0, 0, 0, 0.6)", 
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ 
                        fontSize: 14, 
                        fontWeight: 700, 
                        color: "#ffffff", 
                        display: "block", 
                        marginBottom: 6,
                        textShadow: "0 1px 3px rgba(0,0,0,1)" 
                    }}>Gender</label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          onClick={() => setForm({ ...form, gender: g })}
                          style={{
                            flex: "1 1 80px",
                            padding: "10px",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            background: form.gender === g ? COLORS.teal : "rgba(0,0,0,0.6)",
                            color: form.gender === g ? COLORS.navy : "#ffffff",
                            border: form.gender === g ? `1px solid ${COLORS.teal}` : "1px solid rgba(255,255,255,0.3)",
                            transition: "all 0.2s ease"
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
                    background: COLORS.teal,
                    color: COLORS.navy,
                    border: "none",
                    padding: "14px",
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    marginTop: 28,
                    boxShadow: "0 4px 15px rgba(0, 191, 166, 0.4)"
                  }}
                >
                  Continue to AI Triage →
                </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Token Display (LIVE from API) ── */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Loading state */}
            {statusLoading && !tokenData && (
              <div style={{ textAlign: "center", padding: 40, color: COLORS.white }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Loading your token status...</div>
              </div>
            )}

            {/* Error state */}
            {statusError && (
              <div style={{ 
                background: "rgba(239, 68, 68, 0.15)", 
                border: "1px solid rgba(239, 68, 68, 0.4)", 
                borderRadius: 12, 
                padding: "16px 20px", 
                color: "#fca5a5", 
                fontSize: 14, 
                textAlign: "center" 
              }}>
                ⚠️ {statusError}
              </div>
            )}

            {/* Token card */}
            {tokenData && (
              <>
                <div style={{ background: COLORS.navy, borderRadius: 20, padding: 32, textAlign: "center", border: "1px solid rgba(0,191,166,0.3)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(0,191,166,0.06)" }} />
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "2px", marginBottom: 12 }}>YOUR TOKEN NUMBER</div>
                  <div className="token-number" style={{ fontSize: 64, fontWeight: 800, color: COLORS.teal, lineHeight: 1 }}>
                    {tokenData.tokenNumber}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Badge type={tokenData.urgencyLevel}>{tokenData.urgencyLevel}</Badge>
                    {" "}
                    <Badge type={tokenData.status === "called" ? "priority" : "general"}>{tokenData.status}</Badge>
                  </div>
                  <div style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Department</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.white }}>{tokenData.department}</div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.98)", borderRadius: 16, padding: 24, border: `1px solid ${COLORS.gray200}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy }}>Live Queue Status</div>
                    {statusLoading && (
                      <div style={{ fontSize: 11, color: COLORS.gray400, fontWeight: 600 }}>Refreshing...</div>
                    )}
                  </div>
                  <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <StatCard label="Now Serving"  value={tokenData.currentServingToken || "—"} />
                    <StatCard label="Your Position" value={tokenData.queuePosition != null ? `#${tokenData.queuePosition}` : "—"} accent={COLORS.amber} />
                    <StatCard label="Est. Wait"     value={tokenData.etaMinutes != null ? `${tokenData.etaMinutes}m` : "—"} accent={COLORS.green} />
                  </div>
                  <div style={{ marginTop: 14, fontSize: 11, color: COLORS.gray400, textAlign: "center" }}>
                    Auto-refreshes every 30 seconds
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 1 && (
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            Already triaged?{" "}
            <span onClick={generateDemoToken} style={{ color: COLORS.teal, cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>
              Generate demo token
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PatientPortalPage;