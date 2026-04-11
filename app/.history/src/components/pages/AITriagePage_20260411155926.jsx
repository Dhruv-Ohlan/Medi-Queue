import { useState } from "react";
import { COLORS } from "../constants";
import { Badge } from "../components";
 
const QUESTIONS = [
  {
    id: "complaint",
    label: "What is your primary complaint today?",
    type: "options",
    options: [
      "Fever / Chills",
      "Chest pain",
      "Injury / Fracture",
      "Abdominal pain",
      "Headache",
      "Breathing difficulty",
      "Child illness",
      "Other",
    ],
  },
  {
    id: "duration",
    label: "How long have you had this symptom?",
    type: "options",
    options: ["Less than 24 hours", "1–3 days", "4–7 days", "More than a week"],
  },
  {
    id: "severity",
    label: "On a scale of 1–10, how severe is your discomfort?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: "associated",
    label: "Any associated symptoms?",
    type: "multi",
    options: [
      "Nausea/Vomiting",
      "Dizziness",
      "Shortness of breath",
      "Numbness",
      "High fever (>39°C)",
      "None",
    ],
  },
  {
    id: "conditions",
    label: "Any known pre-existing conditions?",
    type: "multi",
    options: ["Diabetes", "Hypertension", "Heart disease", "Asthma", "None"],
  },
];
 
// ── Sub-components ──────────────────────────────────────────────────────────
 
const OptionsGrid = ({ question, answers, setAnswers }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
    {question.options.map((opt) => {
      const selected = answers[question.id] === opt;
      return (
        <button
          key={opt}
          onClick={() => setAnswers({ ...answers, [question.id]: opt })}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            fontSize: 14,
            cursor: "pointer",
            textAlign: "left",
            background: selected ? COLORS.tealLight : COLORS.gray50,
            color: selected ? COLORS.tealDark : COLORS.gray800,
            border: selected ? `1.5px solid ${COLORS.teal}` : `1px solid ${COLORS.gray200}`,
            fontWeight: selected ? 600 : 400,
          }}
        >
          {opt}
        </button>
      );
    })}
  </div>
);
 
const SeveritySlider = ({ question, answers, setAnswers }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: COLORS.gray400 }}>Mild (1)</span>
      <span
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: COLORS.navy,
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {answers[question.id] || 5}
      </span>
      <span style={{ fontSize: 12, color: COLORS.gray400 }}>Severe (10)</span>
    </div>
    <input
      type="range"
      min={1}
      max={10}
      value={answers[question.id] || 5}
      onChange={(e) => setAnswers({ ...answers, [question.id]: parseInt(e.target.value) })}
      style={{ width: "100%", accentColor: COLORS.teal }}
    />
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <span key={n} style={{ fontSize: 11, color: COLORS.gray400 }}>
          {n}
        </span>
      ))}
    </div>
  </div>
);
 
const MultiSelect = ({ question, answers, setAnswers }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {question.options.map((opt) => {
      const selected = (answers[question.id] || []).includes(opt);
      return (
        <button
          key={opt}
          onClick={() => {
            const cur = answers[question.id] || [];
            setAnswers({
              ...answers,
              [question.id]: selected ? cur.filter((x) => x !== opt) : [...cur, opt],
            });
          }}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            fontSize: 14,
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: selected ? COLORS.tealLight : COLORS.gray50,
            color: selected ? COLORS.tealDark : COLORS.gray800,
            border: selected ? `1.5px solid ${COLORS.teal}` : `1px solid ${COLORS.gray200}`,
            fontWeight: selected ? 600 : 400,
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              border: `2px solid ${selected ? COLORS.teal : COLORS.gray200}`,
              background: selected ? COLORS.teal : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 11,
              color: COLORS.white,
            }}
          >
            {selected ? "✓" : ""}
          </span>
          {opt}
        </button>
      );
    })}
  </div>
);
 
// ── Classification logic ────────────────────────────────────────────────────
 
const classifySymptoms = (answers) => {
  const severity = answers.severity || 5;
  const complaint = answers.complaint || "";
 
  let urgency = "routine";
  let dept = "General Medicine";
  let reason = "Symptoms appear stable and non-urgent.";
 
  if (complaint === "Chest pain" || complaint === "Breathing difficulty" || severity >= 9) {
    urgency = "emergency";
    dept = "General Medicine";
    reason = "High-severity symptoms requiring immediate attention.";
  } else if (severity >= 7 || complaint === "Injury / Fracture") {
    urgency = "priority";
    dept = complaint === "Injury / Fracture" ? "Orthopaedics" : "General Medicine";
    reason = "Moderate-high severity; should be seen within the hour.";
  } else if (complaint === "Child illness") {
    dept = "Paediatrics";
  }
 
  return {
    urgency,
    dept,
    reason,
    token: `${dept.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 30) + 40}`,
    wait: Math.floor(Math.random() * 40) + 10,
  };
};
 
// ── Main Page ───────────────────────────────────────────────────────────────
 
const AITriagePage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const q = QUESTIONS[step];
 
  const handleClassify = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(classifySymptoms(answers));
      setLoading(false);
    }, 1800);
  };
 
  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };
 
  const urgencyMeta = {
    emergency: {
      icon: "🚨",
      bg: "#FFF3F3",
      border: COLORS.red,
      title: "Immediate Attention Required",
    },
    priority: {
      icon: "⚡",
      bg: "#FFF8EC",
      border: COLORS.amber,
      title: "Priority Patient",
    },
    routine: {
      icon: "✅",
      bg: COLORS.tealLight,
      border: COLORS.teal,
      title: "Routine Visit",
    },
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
 
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
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
            AI TRIAGE
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.navy,
              margin: "0 0 8px",
            }}
          >
            Symptom Assessment
          </h1>
          <p style={{ color: COLORS.gray400, fontSize: 15, margin: 0 }}>
            Answer a few questions to get routed to the right department.
          </p>
        </div>
 
        {/* ── Question card ── */}
        {!result && !loading && (
          <div
            style={{
              background: COLORS.white,
              borderRadius: 16,
              padding: 32,
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            {/* Progress bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 13, color: COLORS.gray400 }}>
                Question {step + 1} of {QUESTIONS.length}
              </span>
              <div
                style={{
                  background: COLORS.gray100,
                  borderRadius: 10,
                  height: 6,
                  flex: 1,
                  margin: "0 16px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: COLORS.teal,
                    height: "100%",
                    width: `${((step + 1) / QUESTIONS.length) * 100}%`,
                    borderRadius: 10,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal }}>
                {Math.round(((step + 1) / QUESTIONS.length) * 100)}%
              </span>
            </div>
 
            {/* Question label */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.navy,
                lineHeight: 1.4,
                marginBottom: 24,
              }}
            >
              {q.label}
            </div>
 
            {/* Answer input */}
            {q.type === "options" && (
              <OptionsGrid question={q} answers={answers} setAnswers={setAnswers} />
            )}
            {q.type === "slider" && (
              <SeveritySlider question={q} answers={answers} setAnswers={setAnswers} />
            )}
            {q.type === "multi" && (
              <MultiSelect question={q} answers={answers} setAnswers={setAnswers} />
            )}
 
            {/* Navigation */}
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 10,
                    border: `1px solid ${COLORS.gray200}`,
                    background: COLORS.white,
                    color: COLORS.gray600,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={() =>
                  step < QUESTIONS.length - 1 ? setStep((s) => s + 1) : handleClassify()
                }
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: 10,
                  border: "none",
                  background: COLORS.navy,
                  color: COLORS.white,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {step < QUESTIONS.length - 1 ? "Next →" : "Classify My Symptoms →"}
              </button>
            </div>
          </div>
        )}
 
        {/* ── Loading ── */}
        {loading && (
          <div
            style={{
              background: COLORS.white,
              borderRadius: 16,
              padding: 48,
              border: `1px solid ${COLORS.gray200}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 20 }}>🤖</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>
              AI is analyzing your symptoms...
            </div>
            <div style={{ fontSize: 14, color: COLORS.gray400 }}>
              Powered by OpenAI · Under 3 seconds
            </div>
            <div
              style={{
                marginTop: 24,
                height: 4,
                background: COLORS.gray100,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: COLORS.teal,
                  borderRadius: 4,
                  animation: "mqLoading 1.5s ease infinite",
                  width: "60%",
                }}
              />
            </div>
            <style>{`@keyframes mqLoading { 0%{width:0%} 50%{width:80%} 100%{width:100%} }`}</style>
          </div>
        )}
 
        {/* ── Result ── */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Urgency card */}
            <div
              style={{
                background: urgencyMeta[result.urgency].bg,
                border: `2px solid ${urgencyMeta[result.urgency].border}`,
                borderRadius: 16,
                padding: 28,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>
                {urgencyMeta[result.urgency].icon}
              </div>
              <Badge type={result.urgency}>{result.urgency}</Badge>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: COLORS.navy,
                  marginTop: 16,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {urgencyMeta[result.urgency].title}
              </div>
              <div style={{ fontSize: 14, color: COLORS.gray600, marginTop: 8 }}>
                {result.reason}
              </div>
            </div>
 
            {/* Details grid */}
            <div
              style={{
                background: COLORS.white,
                borderRadius: 16,
                padding: 24,
                border: `1px solid ${COLORS.gray200}`,
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "ASSIGNED DEPARTMENT", value: result.dept, color: COLORS.navy },
                  { label: "TOKEN NUMBER",         value: result.token, color: COLORS.tealDark },
                  { label: "ESTIMATED WAIT",       value: `${result.wait} minutes`, color: COLORS.navy },
                  { label: "CLASSIFICATION",       value: "AI-Powered", color: COLORS.navy },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            <button
              onClick={handleReset}
              style={{
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
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default AITriagePage;