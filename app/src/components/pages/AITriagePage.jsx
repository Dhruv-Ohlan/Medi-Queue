import React, { useState } from "react";
import { registerToken } from "../../api/services";

// ── 1. THEME CONSTANTS ────────────────────────────────────────────────
const COLORS = {
  teal: "#00BFA6",
  navy: "#0a192f",
  lightNavy: "#112240",
  white: "#ffffff",
  slate: "#8892b0",
  green: "#22c55e",
};

const QUESTIONS = [
  { id: "complaint", label: "Primary Complaint?", options: ["Fever / Chills", "Chest pain", "Injury / Fracture", "Abdominal pain", "Headache", "Breathing difficulty", "Child illness", "Other"] },
  { id: "duration", label: "Symptom Duration?", options: ["Less than 24h", "1–3 days", "4–7 days", "1+ week"] },
  { id: "severity", label: "Discomfort Level?", options: ["Mild", "Moderate", "Severe", "Unbearable"] },
  { id: "associated", label: "Associated Symptoms?", options: ["Nausea", "Dizziness", "Numbness", "High fever", "None"] },
  { id: "conditions", label: "Pre-existing?", options: ["Diabetes", "Hypertension", "Heart disease", "Asthma", "None"] },
];

// Map severity text to numeric pain level
const SEVERITY_MAP = { "Mild": 2, "Moderate": 5, "Severe": 8, "Unbearable": 10 };

// ── 2. COMPACT TIMELINE ITEM ──────────────────────────────────────────
const TimelineItem = ({ status, label, subtext, isLast }) => {
  const isCompleted = status === "completed";
  const isActive = status === "active";

  return (
    <div style={{ display: "flex", gap: 12, height: isLast ? "auto" : 60 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          background: isCompleted ? COLORS.green : "transparent",
          border: isActive ? `2px solid ${COLORS.teal}` : `2px solid #233554`,
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2, boxShadow: isActive ? `0 0 10px ${COLORS.teal}` : "none"
        }}>
          {isCompleted && <span style={{ color: "white", fontSize: 10 }}>✓</span>}
          {isActive && <div style={{ width: 8, height: 8, background: COLORS.teal, borderRadius: "50%" }} />}
        </div>
        {!isLast && <div style={{ width: 1, flex: 1, background: isCompleted ? COLORS.green : "#233554" }} />}
      </div>
      <div style={{ paddingTop: 0 }}>
        <div style={{ fontWeight: 700, color: (isActive || isCompleted) ? COLORS.white : COLORS.slate, fontSize: 14 }}>{label}</div>
        <div style={{ fontSize: 11, color: COLORS.slate }}>{subtext}</div>
      </div>
    </div>
  );
};

// ── 3. MAIN PAGE ──────────────────────────────────────────────────────
const AITriagePage = ({ patientForm, setTrackingId, setActive }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [view, setView] = useState("form");

  // API integration state
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [tokenResult, setTokenResult] = useState(null);

  const q = QUESTIONS[step];
  const isSelected = !!answers[q?.id];

  /**
   * Build the registration payload from patient form + triage answers
   * and submit to POST /api/tokens/register
   */
  const submitRegistration = async () => {
    setView("loading");
    setSubmitting(true);
    setApiError(null);

    // Build the symptoms string from triage answers
    const symptomsText = [
      answers.complaint,
      answers.associated !== "None" ? answers.associated : null,
    ].filter(Boolean).join(", ");

    const payload = {
      name: patientForm?.name || "Demo Patient",
      age: parseInt(patientForm?.age) || 30,
      gender: patientForm?.gender || "Other",
      phoneNumber: patientForm?.phone || "+910000000000",
      symptoms: symptomsText || "General checkup",
      painLevel: SEVERITY_MAP[answers.severity] || 3,
      duration: answers.duration || "Unknown",
      conditions: answers.conditions !== "None" ? answers.conditions : undefined,
    };

    try {
      const res = await registerToken(payload);
      setTokenResult(res.data);

      // Store trackingId in shared state so PatientPortalPage can poll status
      if (res.data?.trackingId && setTrackingId) {
        setTrackingId(res.data.trackingId);
      }

      setView("result");
    } catch (err) {
      setApiError(err.message);
      setView("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Last question answered → submit to backend
      submitRegistration();
    }
  };

  const handleViewToken = () => {
    // Navigate to patient portal to see live status
    setActive("patient");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      fontFamily: "'Times New Roman', Times, serif", 
      background: `radial-gradient(circle at 50% 50%, #112240 0%, #0a192f 100%)`,
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      paddingTop: 120,
      paddingBottom: 40 
    }}>
      
      {/* ── VIEW: FORM ── */}
      {view === "form" && (
        <div style={{ width: "90%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.white, margin: 0 }}>Your Visit</h1>
            <p style={{ color: COLORS.slate, fontSize: 14, marginTop: 8 }}>Complete assessment to join queue.</p>
          </div>

          <div style={{ background: "rgba(17, 34, 64, 0.7)", borderRadius: 20, padding: 24, border: "1px solid rgba(0, 191, 166, 0.2)", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 11, color: COLORS.teal, fontWeight: 700, letterSpacing: "1px", marginBottom: 12 }}>
              STEP {step + 1} OF {QUESTIONS.length}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.white, marginBottom: 24, lineHeight: 1.3 }}>{q.label}</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {q.options.map(opt => (
                <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })} style={{
                  padding: "12px 16px", borderRadius: 10, textAlign: "left", fontSize: 15, fontWeight: 600, cursor: "pointer",
                  border: answers[q.id] === opt ? `1px solid ${COLORS.teal}` : "1px solid #233554",
                  background: answers[q.id] === opt ? "rgba(0, 191, 166, 0.1)" : "transparent", 
                  color: answers[q.id] === opt ? COLORS.teal : COLORS.white,
                  transition: "0.2s"
                }}>{opt}</button>
              ))}
            </div>

            <button onClick={handleNext} disabled={!isSelected} style={{
              width: "100%", padding: "14px", borderRadius: 10, fontSize: 16, fontWeight: 700, border: "none",
              background: isSelected ? COLORS.teal : "#233554", color: isSelected ? COLORS.navy : COLORS.slate, 
              cursor: isSelected ? "pointer" : "not-allowed"
            }}>
              {step < QUESTIONS.length - 1 ? "Next Step" : "Generate Token"}
            </button>
          </div>
        </div>
      )}

      {/* ── VIEW: LOADING ── */}
      {view === "loading" && (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <div style={{ fontSize: 40, color: COLORS.teal }}>⚕️</div>
          <h2 style={{ color: COLORS.white, marginTop: 20 }}>
            {submitting ? "Analyzing Symptoms & Assigning Token..." : "Triaging Symptoms..."}
          </h2>
          <p style={{ color: COLORS.slate, fontSize: 14, marginTop: 8 }}>
            Our AI is determining urgency and routing to the right department.
          </p>
        </div>
      )}

      {/* ── VIEW: ERROR ── */}
      {view === "error" && (
        <div style={{ width: "90%", maxWidth: 400, textAlign: "center" }}>
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            border: "1px solid rgba(239, 68, 68, 0.3)", 
            borderRadius: 20, 
            padding: 32 
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: "#fca5a5", fontSize: 20, margin: "0 0 12px" }}>Registration Failed</h2>
            <p style={{ color: COLORS.slate, fontSize: 14, lineHeight: 1.6 }}>
              {apiError || "Unable to connect to server. Please try again."}
            </p>
            <button 
              onClick={() => { setView("form"); setStep(QUESTIONS.length - 1); }} 
              style={{ 
                marginTop: 20, padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: "transparent", color: COLORS.teal, border: `1px solid ${COLORS.teal}`, cursor: "pointer" 
              }}
            >
              ← Go Back and Retry
            </button>
          </div>
        </div>
      )}

      {/* ── VIEW: RESULT (LIVE from API) ── */}
      {view === "result" && tokenResult && (
        <div style={{ width: "90%", maxWidth: 400 }}>
          <div style={{ background: "rgba(17, 34, 64, 0.8)", borderRadius: 24, padding: "24px", textAlign: "center", border: "1px solid rgba(0, 191, 166, 0.3)", marginBottom: 24 }}>
            <div style={{ color: COLORS.slate, fontSize: 11, fontWeight: 700, letterSpacing: "2px" }}>TOKEN ASSIGNED</div>
            <div style={{ fontSize: 56, fontWeight: 800, color: COLORS.teal, margin: "8px 0" }}>
              {tokenResult.tokenNumber}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.white }}>
              Unit: {tokenResult.department}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: COLORS.slate }}>
              Urgency: <span style={{ color: tokenResult.urgencyLevel === "emergency" ? "#ef4444" : tokenResult.urgencyLevel === "priority" ? "#f59e0b" : COLORS.green, fontWeight: 700, textTransform: "uppercase" }}>{tokenResult.urgencyLevel}</span>
            </div>
            {tokenResult.estimatedWaitMinutes != null && (
              <div style={{ marginTop: 8, fontSize: 13, color: COLORS.white }}>
                Est. wait: <strong>{tokenResult.estimatedWaitMinutes} min</strong>
              </div>
            )}
          </div>

          {/* AI Reasoning */}
          {tokenResult.aiReasoning && (
            <div style={{ background: "rgba(0, 191, 166, 0.08)", border: "1px solid rgba(0, 191, 166, 0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: COLORS.teal, fontWeight: 700, letterSpacing: "1px", marginBottom: 6 }}>AI TRIAGE REASONING</div>
              <div style={{ fontSize: 13, color: COLORS.white, lineHeight: 1.5 }}>{tokenResult.aiReasoning}</div>
            </div>
          )}

          <div style={{ padding: "0 10px" }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, color: COLORS.slate, letterSpacing: "1px", marginBottom: 20, textTransform: "uppercase" }}>Visit Progress</h3>
            
            <TimelineItem status="completed" label="Registered" subtext={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
            <TimelineItem status="active" label="Waiting" subtext={`Est. Wait: ${tokenResult.estimatedWaitMinutes || "—"} min`} />
            <TimelineItem status="pending" label="Called" subtext="Pending" />
            <TimelineItem status="pending" label="Completed" subtext="Prescription" isLast />
          </div>

          {/* Navigate to live status tracker */}
          <button onClick={handleViewToken} style={{ 
            width: "100%", background: COLORS.teal, color: COLORS.navy, 
            border: "none", padding: "14px", borderRadius: 10, fontSize: 15, fontWeight: 700, 
            cursor: "pointer", marginTop: 24, boxShadow: "0 4px 15px rgba(0,191,166,0.3)"
          }}>
            Track Live Queue Status →
          </button>

          <button onClick={() => window.location.reload()} style={{ width: "100%", background: "transparent", border: "1px solid #233554", color: COLORS.slate, padding: "10px", borderRadius: 10, marginTop: 12, cursor: "pointer", fontSize: 13 }}>
            Restart Session
          </button>
        </div>
      )}
    </div>
  );
};

export default AITriagePage;