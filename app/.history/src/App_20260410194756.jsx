import { useState, useEffect, useRef } from "react";

const COLORS = {
  navy: "#0A1628",
  navyMid: "#112240",
  navyLight: "#1B3A6B",
  teal: "#00BFA6",
  tealDark: "#00897B",
  tealLight: "#E0F7F4",
  amber: "#FFB300",
  red: "#E53935",
  green: "#43A047",
  white: "#FFFFFF",
  gray50: "#F8FAFB",
  gray100: "#EFF3F6",
  gray200: "#D6DDE8",
  gray400: "#8A99B0",
  gray600: "#4A5568",
  gray800: "#1A202C",
};

const Badge = ({ type, children }) => {
  const styles = {
    routine: { bg: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7" },
    priority: { bg: "#FFF3E0", color: "#E65100", border: "#FFCC80" },
    emergency: { bg: "#FFEBEE", color: "#B71C1C", border: "#EF9A9A" },
    general: { bg: "#E3F2FD", color: "#0D47A1", border: "#90CAF9" },
    paeds: { bg: "#F3E5F5", color: "#4A148C", border: "#CE93D8" },
    ortho: { bg: "#E0F2F1", color: "#004D40", border: "#80CBC4" },
  };
  const s = styles[type] || styles.general;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      letterSpacing: "0.5px", textTransform: "uppercase",
    }}>{children}</span>
  );
};

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{
    background: COLORS.white, borderRadius: 14, padding: "20px 24px",
    border: `1px solid ${COLORS.gray200}`, position: "relative", overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, width: 4, height: "100%",
      background: accent || COLORS.teal, borderRadius: "14px 0 0 14px",
    }} />
    <div style={{ paddingLeft: 8 }}>
      <div style={{ fontSize: 13, color: COLORS.gray400, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.navy, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

const Nav = ({ active, setActive }) => {
  const links = [
    { id: "landing", label: "Home" },
    { id: "patient", label: "Patient Portal" },
    { id: "triage", label: "AI Triage" },
    { id: "doctor", label: "Doctor Dashboard" },
    { id: "admin", label: "Admin Analytics" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,22,40,0.97)", backdropFilter: "blur(12px)",
      borderBottom: `1px solid rgba(0,191,166,0.15)`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: 64,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #00BFA6, #0088cc)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>⚕</div>
        <span style={{ color: COLORS.white, fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>Medi<span style={{ color: COLORS.teal }}>Queue</span></span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {links.map(l => (
          <button key={l.id} onClick={() => setActive(l.id)} style={{
            background: active === l.id ? "rgba(0,191,166,0.15)" : "transparent",
            color: active === l.id ? COLORS.teal : "rgba(255,255,255,0.65)",
            border: active === l.id ? `1px solid rgba(0,191,166,0.4)` : "1px solid transparent",
            padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
            cursor: "pointer", transition: "all 0.2s",
          }}>{l.label}</button>
        ))}
      </div>
    </nav>
  );
};

const LandingPage = ({ setActive }) => {
  const stats = [
    { n: "50M+", d: "OPD visits/month" },
    { n: "3-6h", d: "Average wait time" },
    { n: "40%", d: "Wrong dept visits" },
    { n: "0", d: "Hardware needed" },
  ];
  const features = [
    { icon: "📱", title: "Digital Token System", desc: "Scan QR or open URL. Get a token instantly with live position tracking." },
    { icon: "🤖", title: "AI Symptom Triage", desc: "OpenAI-powered intake classifies urgency & routes you to the right department." },
    { icon: "⚡", title: "Real-Time Queue", desc: "Auto-refreshing queue for both patients and doctors. No hardware required." },
    { icon: "📊", title: "Analytics Dashboard", desc: "Cross-department load, triage breakdowns, and daily PDF reports for admins." },
    { icon: "🔔", title: "SMS Notifications", desc: "WhatsApp & SMS alerts when you're 5 tokens away via Twilio." },
    { icon: "🏥", title: "Multi-Department", desc: "General Medicine, Paediatrics, Orthopaedics — extensible via admin panel." },
  ];
  return (
    <div style={{ minHeight: "100vh", background: COLORS.navy, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Hero */}
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center", padding: "120px 40px 80px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,191,166,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(0,191,166,0.1)", border: "1px solid rgba(0,191,166,0.3)",
          borderRadius: 20, padding: "6px 16px", marginBottom: 32,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.teal, display: "inline-block" }} />
          <span style={{ fontSize: 12, color: COLORS.teal, fontWeight: 600, letterSpacing: "0.5px" }}>HACKATHON BUILD · HEALTHTECH 2026</span>
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 800,
          color: COLORS.white, lineHeight: 1.05, margin: "0 0 24px",
          maxWidth: 800,
        }}>
          End the<br /><span style={{ color: COLORS.teal }}>Hospital Queue</span><br />Chaos
        </h1>
        <p style={{
          fontSize: 20, color: "rgba(255,255,255,0.55)", maxWidth: 560,
          lineHeight: 1.7, margin: "0 0 48px",
        }}>
          Real-time digital queues, AI-powered triage, and zero hardware dependency — built for India's 1.4 billion.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={() => setActive("patient")} style={{
            background: COLORS.teal, color: COLORS.navy, border: "none",
            padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700,
            cursor: "pointer", letterSpacing: "-0.2px",
          }}>Get Your Token →</button>
          <button onClick={() => setActive("doctor")} style={{
            background: "transparent", color: COLORS.white,
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 500,
            cursor: "pointer",
          }}>Doctor Dashboard</button>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "flex", gap: 0, marginTop: 80, borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "24px 40px", textAlign: "center",
              borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.teal, fontFamily: "'Syne', sans-serif" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: "0.3px" }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Section */}
      <div style={{ padding: "80px 80px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ color: COLORS.teal, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 16 }}>THE PROBLEM</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 44, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, margin: "0 0 20px" }}>
                One physical token.<br />Zero information.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.8, margin: "0 0 32px" }}>
                India's government hospitals handle over 50 million OPD visits per month. Patients wait 3–6 hours in crowded corridors with zero visibility into when they'll be seen — called by loudspeaker or not at all.
              </p>
              <button onClick={() => setActive("triage")} style={{
                background: "transparent", color: COLORS.teal, border: `1px solid ${COLORS.teal}`,
                padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>Try AI Triage →</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { pain: "No queue visibility", impact: "Patients can't leave, rest, or plan" },
                { pain: "Wrong department visits", impact: "30–40% visit the wrong dept first" },
                { pain: "No prioritization", impact: "Critical cases wait behind routine ones" },
                { pain: "Zero admin data", impact: "Can't improve what you can't measure" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.red, flexShrink: 0 }} />
                  <div>
                    <div style={{ color: COLORS.white, fontSize: 14, fontWeight: 600 }}>{item.pain}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 2 }}>{item.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "80px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: COLORS.teal, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 12 }}>WHAT WE BUILT</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: COLORS.white, margin: 0 }}>Three modules. One solution.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "28px 24px", transition: "border-color 0.2s",
              }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: "80px", textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,191,166,0.03)",
      }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, color: COLORS.white, margin: "0 0 16px" }}>
          Ready to fix the OPD?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, margin: "0 0 36px" }}>No hardware. No installation. Just a QR code printout.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={() => setActive("patient")} style={{
            background: COLORS.teal, color: COLORS.navy, border: "none",
            padding: "14px 36px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}>Patient Portal</button>
          <button onClick={() => setActive("admin")} style={{
            background: "rgba(255,255,255,0.06)", color: COLORS.white, border: "1px solid rgba(255,255,255,0.15)",
            padding: "14px 36px", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer",
          }}>Admin Analytics</button>
        </div>
      </div>
    </div>
  );
};

const PatientPortal = ({ setActive }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", age: "", gender: "", phone: "" });
  const [token, setToken] = useState(null);

  const depts = ["General Medicine", "Paediatrics", "Orthopaedics"];
  const generateToken = () => {
    const t = {
      number: `GM-${Math.floor(Math.random() * 40) + 60}`,
      current: `GM-${Math.floor(Math.random() * 30) + 20}`,
      position: Math.floor(Math.random() * 12) + 3,
      wait: Math.floor(Math.random() * 45) + 15,
      dept: depts[Math.floor(Math.random() * depts.length)],
      urgency: ["routine", "priority"][Math.floor(Math.random() * 2)],
    };
    setToken(t);
    setStep(3);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.gray50, fontFamily: "'DM Sans', sans-serif", paddingTop: 64 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: COLORS.teal, fontWeight: 700, letterSpacing: "1px", marginBottom: 10 }}>PATIENT PORTAL</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: COLORS.navy, margin: "0 0 8px" }}>Get Your Digital Token</h1>
          <p style={{ color: COLORS.gray400, fontSize: 15, margin: 0 }}>Register in under 2 minutes. Track your queue in real time.</p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 40 }}>
          {["Registration", "AI Triage", "Token"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: step > i + 1 ? COLORS.teal : step === i + 1 ? COLORS.navy : COLORS.gray200,
                color: step > i + 1 ? COLORS.navy : COLORS.white,
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>{step > i + 1 ? "✓" : i + 1}</div>
              <span style={{ fontSize: 12, color: step === i + 1 ? COLORS.navy : COLORS.gray400, marginLeft: 6, fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
              {i < 2 && <div style={{ width: 32, height: 1, background: COLORS.gray200, margin: "0 10px" }} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, border: `1px solid ${COLORS.gray200}` }}>
            <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: COLORS.navy }}>Personal Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Full Name", key: "name", placeholder: "Rahul Sharma", type: "text" },
                { label: "Age", key: "age", placeholder: "32", type: "number" },
                { label: "Phone Number", key: "phone", placeholder: "+91 98765 43210", type: "tel" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray600, display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder} type={f.type} style={{
                      width: "100%", padding: "11px 14px", borderRadius: 8, boxSizing: "border-box",
                      border: `1px solid ${COLORS.gray200}`, fontSize: 14, color: COLORS.navy,
                      outline: "none", background: COLORS.gray50,
                    }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray600, display: "block", marginBottom: 6 }}>Gender</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Male", "Female", "Other"].map(g => (
                    <button key={g} onClick={() => setForm({ ...form, gender: g })} style={{
                      flex: 1, padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: form.gender === g ? COLORS.tealLight : COLORS.gray50,
                      color: form.gender === g ? COLORS.tealDark : COLORS.gray600,
                      border: form.gender === g ? `1.5px solid ${COLORS.teal}` : `1px solid ${COLORS.gray200}`,
                    }}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setActive("triage")} style={{
              width: "100%", background: COLORS.navy, color: COLORS.white, border: "none",
              padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 28,
            }}>Continue to AI Triage →</button>
          </div>
        )}

        {step === 3 && token && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Token card */}
            <div style={{
              background: COLORS.navy, borderRadius: 20, padding: 32, textAlign: "center",
              border: `1px solid rgba(0,191,166,0.3)`, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%",
                background: "rgba(0,191,166,0.06)",
              }} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "2px", marginBottom: 12 }}>YOUR TOKEN NUMBER</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 64, fontWeight: 800, color: COLORS.teal, lineHeight: 1 }}>{token.number}</div>
              <div style={{ marginTop: 12 }}><Badge type={token.urgency}>{token.urgency}</Badge></div>
              <div style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Department</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.white }}>{token.dept}</div>
            </div>

            {/* Live queue status */}
            <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.gray200}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Live Queue Status</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <StatCard label="Now Serving" value={token.current} />
                <StatCard label="Your Position" value={`#${token.position}`} accent={COLORS.amber} />
                <StatCard label="Est. Wait" value={`${token.wait}m`} accent={COLORS.green} />
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: COLORS.gray400 }}>Queue Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.navy }}>{100 - token.position * 4}% complete</span>
                </div>
                <div style={{ background: COLORS.gray100, borderRadius: 6, height: 8, overflow: "hidden" }}>
                  <div style={{ background: COLORS.teal, height: "100%", width: `${100 - token.position * 4}%`, borderRadius: 6 }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button style={{
                flex: 1, background: COLORS.tealLight, color: COLORS.tealDark, border: "none",
                padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>🔔 Notify Me When Close</button>
              <button style={{
                flex: 1, background: COLORS.gray100, color: COLORS.gray600, border: "none",
                padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>📱 Share Token</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TriagePage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    { id: "complaint", label: "What is your primary complaint today?", type: "options", options: ["Fever / Chills", "Chest pain", "Injury / Fracture", "Abdominal pain", "Headache", "Breathing difficulty", "Child illness", "Other"] },
    { id: "duration", label: "How long have you had this symptom?", type: "options", options: ["Less than 24 hours", "1–3 days", "4–7 days", "More than a week"] },
    { id: "severity", label: "On a scale of 1–10, how severe is your discomfort?", type: "slider", min: 1, max: 10 },
    { id: "associated", label: "Any associated symptoms?", type: "multi", options: ["Nausea/Vomiting", "Dizziness", "Shortness of breath", "Numbness", "High fever (>39°C)", "None"] },
    { id: "conditions", label: "Any known pre-existing conditions?", type: "multi", options: ["Diabetes", "Hypertension", "Heart disease", "Asthma", "None"] },
  ];

  const classify = () => {
    setLoading(true);
    setTimeout(() => {
      const severity = answers.severity || 5;
      const complaint = answers.complaint || "";
      let urgency = "routine", dept = "General Medicine", reason = "Symptoms appear stable and non-urgent.";
      if (complaint === "Chest pain" || complaint === "Breathing difficulty" || severity >= 9) {
        urgency = "emergency"; dept = "General Medicine";
        reason = "High-severity symptoms requiring immediate attention.";
      } else if (severity >= 7 || complaint === "Injury / Fracture") {
        urgency = "priority"; dept = complaint === "Injury / Fracture" ? "Orthopaedics" : "General Medicine";
        reason = "Moderate-high severity; should be seen within the hour.";
      } else if (complaint === "Child illness") {
        dept = "Paediatrics";
      }
      setResult({ urgency, dept, reason, token: `${dept.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 30) + 40}`, wait: Math.floor(Math.random() * 40) + 10 });
      setLoading(false);
    }, 1800);
  };

  const q = questions[step];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.gray50, fontFamily: "'DM Sans', sans-serif", paddingTop: 64 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: COLORS.teal, fontWeight: 700, letterSpacing: "1px", marginBottom: 10 }}>AI TRIAGE</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 34, fontWeight: 800, color: COLORS.navy, margin: "0 0 8px" }}>Symptom Assessment</h1>
          <p style={{ color: COLORS.gray400, fontSize: 15, margin: 0 }}>Answer a few questions to get routed to the right department.</p>
        </div>

        {!result && !loading && (
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: COLORS.gray400 }}>Question {step + 1} of {questions.length}</span>
              <div style={{ background: COLORS.gray100, borderRadius: 10, height: 6, flex: 1, margin: "0 16px", overflow: "hidden" }}>
                <div style={{ background: COLORS.teal, height: "100%", width: `${((step + 1) / questions.length) * 100}%`, borderRadius: 10, transition: "width 0.3s" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal }}>{Math.round(((step + 1) / questions.length) * 100)}%</span>
            </div>

            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, lineHeight: 1.4, marginBottom: 24 }}>{q.label}</div>

            {q.type === "options" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {q.options.map(opt => (
                  <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })} style={{
                    padding: "12px 16px", borderRadius: 10, fontSize: 14, cursor: "pointer", textAlign: "left",
                    background: answers[q.id] === opt ? COLORS.tealLight : COLORS.gray50,
                    color: answers[q.id] === opt ? COLORS.tealDark : COLORS.gray800,
                    border: answers[q.id] === opt ? `1.5px solid ${COLORS.teal}` : `1px solid ${COLORS.gray200}`,
                    fontWeight: answers[q.id] === opt ? 600 : 400,
                  }}>{opt}</button>
                ))}
              </div>
            )}

            {q.type === "slider" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: COLORS.gray400 }}>Mild (1)</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy, fontFamily: "'Syne', sans-serif" }}>{answers[q.id] || 5}</span>
                  <span style={{ fontSize: 12, color: COLORS.gray400 }}>Severe (10)</span>
                </div>
                <input type="range" min={1} max={10} value={answers[q.id] || 5}
                  onChange={e => setAnswers({ ...answers, [q.id]: parseInt(e.target.value) })}
                  style={{ width: "100%", accentColor: COLORS.teal }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <span key={n} style={{ fontSize: 11, color: COLORS.gray400 }}>{n}</span>
                  ))}
                </div>
              </div>
            )}

            {q.type === "multi" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map(opt => {
                  const sel = (answers[q.id] || []).includes(opt);
                  return (
                    <button key={opt} onClick={() => {
                      const cur = answers[q.id] || [];
                      setAnswers({ ...answers, [q.id]: sel ? cur.filter(x => x !== opt) : [...cur, opt] });
                    }} style={{
                      padding: "12px 16px", borderRadius: 10, fontSize: 14, cursor: "pointer", textAlign: "left",
                      display: "flex", alignItems: "center", gap: 10,
                      background: sel ? COLORS.tealLight : COLORS.gray50,
                      color: sel ? COLORS.tealDark : COLORS.gray800,
                      border: sel ? `1.5px solid ${COLORS.teal}` : `1px solid ${COLORS.gray200}`,
                      fontWeight: sel ? 600 : 400,
                    }}>
                      <span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${sel ? COLORS.teal : COLORS.gray200}`, background: sel ? COLORS.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: COLORS.white }}>{sel ? "✓" : ""}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} style={{
                  padding: "12px 24px", borderRadius: 10, border: `1px solid ${COLORS.gray200}`,
                  background: COLORS.white, color: COLORS.gray600, fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>← Back</button>
              )}
              <button onClick={() => step < questions.length - 1 ? setStep(s => s + 1) : classify()} style={{
                flex: 1, padding: "13px", borderRadius: 10, border: "none",
                background: COLORS.navy, color: COLORS.white, fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}>{step < questions.length - 1 ? "Next →" : "Classify My Symptoms →"}</button>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 48, border: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>🤖</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>AI is analyzing your symptoms...</div>
            <div style={{ fontSize: 14, color: COLORS.gray400 }}>Powered by OpenAI · Under 3 seconds</div>
            <div style={{ marginTop: 24, height: 4, background: COLORS.gray100, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", background: COLORS.teal, borderRadius: 4, animation: "loading 1.5s ease infinite", width: "60%" }} />
            </div>
            <style>{`@keyframes loading { 0%{width:0%} 50%{width:80%} 100%{width:100%} }`}</style>
          </div>
        )}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{
              background: result.urgency === "emergency" ? "#FFF3F3" : result.urgency === "priority" ? "#FFF8EC" : COLORS.tealLight,
              border: `2px solid ${result.urgency === "emergency" ? COLORS.red : result.urgency === "priority" ? COLORS.amber : COLORS.teal}`,
              borderRadius: 16, padding: 28, textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>
                {result.urgency === "emergency" ? "🚨" : result.urgency === "priority" ? "⚡" : "✅"}
              </div>
              <Badge type={result.urgency}>{result.urgency}</Badge>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.navy, marginTop: 16, fontFamily: "'Syne', sans-serif" }}>
                {result.urgency === "emergency" ? "Immediate Attention Required" : result.urgency === "priority" ? "Priority Patient" : "Routine Visit"}
              </div>
              <div style={{ fontSize: 14, color: COLORS.gray600, marginTop: 8 }}>{result.reason}</div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.gray200}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 4 }}>ASSIGNED DEPARTMENT</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy }}>{result.dept}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 4 }}>TOKEN NUMBER</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.tealDark }}>{result.token}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 4 }}>ESTIMATED WAIT</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy }}>{result.wait} minutes</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 4 }}>CLASSIFICATION</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy }}>AI-Powered</div>
                </div>
              </div>
            </div>

            <button onClick={() => { setStep(0); setAnswers({}); setResult(null); }} style={{
              background: COLORS.gray100, color: COLORS.gray600, border: "none",
              padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>Start Over</button>
          </div>
        )}
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("General Medicine");
  const [showEmergency, setShowEmergency] = useState(true);

  const queueData = {
    "General Medicine": [
      { token: "GM-42", name: "Priya Patel", age: 34, urgency: "emergency", reason: "Severe chest pain, shortness of breath", wait: 2 },
      { token: "GM-43", name: "Arun Kumar", age: 56, urgency: "priority", reason: "High fever (40°C), 3 days duration", wait: 18 },
      { token: "GM-44", name: "Sunita Devi", age: 28, urgency: "routine", reason: "Cold and cough, 5 days", wait: 32 },
      { token: "GM-45", name: "Rajan Singh", age: 45, urgency: "priority", reason: "Abdominal pain, moderate severity", wait: 38 },
      { token: "GM-46", name: "Meena Kumari", age: 62, urgency: "routine", reason: "Routine follow-up, hypertension", wait: 45 },
    ],
    "Paediatrics": [
      { token: "PA-12", name: "Baby Sharma (5)", age: 5, urgency: "priority", reason: "High fever, febrile seizure history", wait: 12 },
      { token: "PA-13", name: "Aryan Verma (8)", age: 8, urgency: "routine", reason: "Stomach ache, mild", wait: 28 },
    ],
    "Orthopaedics": [
      { token: "OR-08", name: "Deepak Jain", age: 38, urgency: "priority", reason: "Fall injury, right wrist pain", wait: 15 },
      { token: "OR-09", name: "Kavita Rao", age: 50, urgency: "routine", reason: "Knee pain, chronic", wait: 40 },
    ],
  };

  const queue = queueData[activeTab] || [];
  const urgencyColor = { emergency: COLORS.red, priority: COLORS.amber, routine: COLORS.green };
  const load = activeTab === "General Medicine" ? 78 : activeTab === "Paediatrics" ? 45 : 55;
  const loadColor = load > 85 ? COLORS.red : load > 60 ? COLORS.amber : COLORS.green;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.gray50, fontFamily: "'DM Sans', sans-serif", paddingTop: 64 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Emergency Modal */}
      {showEmergency && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(229,57,53,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: COLORS.white, borderRadius: 20, padding: 36, maxWidth: 440, width: "90%",
            border: `3px solid ${COLORS.red}`, textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚨</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.red, fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>EMERGENCY ALERT</div>
            <div style={{ fontSize: 15, color: COLORS.navy, fontWeight: 600, marginBottom: 4 }}>GM-42 · Priya Patel · Age 34</div>
            <div style={{ fontSize: 14, color: COLORS.gray600, background: "#FFF3F3", borderRadius: 8, padding: "10px 14px", margin: "12px 0 20px" }}>
              AI flagged: Severe chest pain with shortness of breath — possible cardiac event.
            </div>
            <button onClick={() => setShowEmergency(false)} style={{
              width: "100%", background: COLORS.red, color: COLORS.white, border: "none",
              padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}>Acknowledge Emergency</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.navy, margin: 0 }}>Doctor Dashboard</h1>
            <p style={{ color: COLORS.gray400, fontSize: 14, margin: "4px 0 0" }}>OPD Queue Management · Live</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.green }} />
            <span style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600 }}>Live · Auto-refresh 30s</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          <StatCard label="Tokens Waiting" value={queue.length} />
          <StatCard label="Completed Today" value="38" accent={COLORS.green} />
          <StatCard label="Avg. Consult Time" value="8.4m" accent={COLORS.amber} />
          <StatCard label="Throughput" value="7/hr" accent={COLORS.teal} />
        </div>

        {/* Department tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {Object.keys(queueData).map(d => (
            <button key={d} onClick={() => setActiveTab(d)} style={{
              padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: activeTab === d ? COLORS.navy : COLORS.white,
              color: activeTab === d ? COLORS.white : COLORS.gray600,
              border: activeTab === d ? "none" : `1px solid ${COLORS.gray200}`,
            }}>
              {d} <span style={{
                background: activeTab === d ? "rgba(255,255,255,0.2)" : COLORS.gray100,
                color: activeTab === d ? COLORS.white : COLORS.gray600,
                borderRadius: 10, padding: "2px 7px", fontSize: 11, marginLeft: 6,
              }}>{queueData[d].length}</span>
            </button>
          ))}
        </div>

        {/* Load bar */}
        <div style={{ background: COLORS.white, borderRadius: 10, padding: "12px 16px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600, whiteSpace: "nowrap" }}>Department Load</span>
          <div style={{ flex: 1, background: COLORS.gray100, borderRadius: 6, height: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${load}%`, background: loadColor, borderRadius: 6, transition: "width 0.5s" }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: loadColor, minWidth: 40 }}>{load}%</span>
          <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: load > 85 ? "#FFEBEE" : load > 60 ? "#FFF3E0" : "#E8F5E9", color: loadColor }}>
            {load > 85 ? "High" : load > 60 ? "Moderate" : "Normal"}
          </span>
        </div>

        {/* Queue table */}
        <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy }}>Queue · {activeTab}</span>
            <span style={{ fontSize: 13, color: COLORS.gray400 }}>{queue.length} patients waiting</span>
          </div>
          {queue.map((p, i) => (
            <div key={p.token} style={{
              padding: "16px 20px", borderBottom: i < queue.length - 1 ? `1px solid ${COLORS.gray100}` : "none",
              display: "flex", alignItems: "center", gap: 16,
              background: p.urgency === "emergency" ? "#FFF8F8" : COLORS.white,
            }}>
              <div style={{ width: 6, height: 48, borderRadius: 3, background: urgencyColor[p.urgency], flexShrink: 0 }} />
              <div style={{ minWidth: 70 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy, fontFamily: "'Syne', sans-serif" }}>{p.token}</div>
                <div style={{ marginTop: 4 }}><Badge type={p.urgency}>{p.urgency}</Badge></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.navy }}>{p.name} · Age {p.age}</div>
                <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 3 }}>🤖 {p.reason}</div>
              </div>
              <div style={{ fontSize: 13, color: COLORS.gray400, minWidth: 60, textAlign: "right" }}>{p.wait}m wait</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ padding: "7px 14px", background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Call</button>
                <button style={{ padding: "7px 12px", background: COLORS.gray100, color: COLORS.gray600, border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Skip</button>
                <button style={{ padding: "7px 12px", background: "#E8F5E9", color: "#2E7D32", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Done</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const deptData = [
    { name: "General Medicine", registered: 94, completed: 62, avg: "8.4m", load: 78 },
    { name: "Paediatrics", registered: 41, completed: 35, avg: "6.2m", load: 45 },
    { name: "Orthopaedics", registered: 28, completed: 22, avg: "11.1m", load: 55 },
  ];
  const triageData = { routine: 64, priority: 28, emergency: 8 };
  const hourlyData = [4, 8, 14, 19, 22, 28, 31, 26, 22, 18, 12, 8];
  const hours = ["7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm"];
  const maxH = Math.max(...hourlyData);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.gray50, fontFamily: "'DM Sans', sans-serif", paddingTop: 64 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.navy, margin: 0 }}>Admin Analytics</h1>
            <p style={{ color: COLORS.gray400, fontSize: 14, margin: "4px 0 0" }}>April 10, 2026 · All Departments</p>
          </div>
          <button style={{
            background: COLORS.navy, color: COLORS.white, border: "none",
            padding: "10px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}>📄 Export PDF Report</button>
        </div>

        {/* Top stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          <StatCard label="Total Registered" value="163" sub="Today's OPD" />
          <StatCard label="Completed" value="119" sub="72.9% completion" accent={COLORS.green} />
          <StatCard label="Avg Wait Time" value="24m" sub="↓ 6m vs yesterday" accent={COLORS.teal} />
          <StatCard label="Emergencies" value="8" sub="All acknowledged" accent={COLORS.red} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Peak load chart */}
          <div style={{ background: COLORS.white, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Token Registrations by Hour</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160 }}>
              {hourlyData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 10, color: COLORS.gray400 }}>{v}</div>
                  <div style={{
                    width: "100%", height: `${(v / maxH) * 130}px`,
                    background: v === maxH ? COLORS.teal : v >= 20 ? COLORS.navyLight : COLORS.gray200,
                    borderRadius: "4px 4px 0 0", transition: "height 0.3s",
                  }} />
                  <div style={{ fontSize: 9, color: COLORS.gray400, writingMode: "vertical-rl", transform: "rotate(180deg)", marginTop: 4 }}>{hours[i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Triage distribution */}
          <div style={{ background: COLORS.white, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Triage Distribution</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Routine", value: triageData.routine, color: COLORS.green, bg: "#E8F5E9" },
                { label: "Priority", value: triageData.priority, color: COLORS.amber, bg: "#FFF3E0" },
                { label: "Emergency", value: triageData.emergency, color: COLORS.red, bg: "#FFEBEE" },
              ].map(t => (
                <div key={t.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{t.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.value}%</span>
                  </div>
                  <div style={{ background: COLORS.gray100, borderRadius: 6, height: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${t.value}%`, background: t.color, borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: 14, background: COLORS.gray50, borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 4 }}>AI routing accuracy</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.tealDark, fontFamily: "'Syne', sans-serif" }}>94.2%</div>
            </div>
          </div>
        </div>

        {/* Department comparison */}
        <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.gray100}` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy }}>Department Comparison</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: COLORS.gray50 }}>
                  {["Department", "Registered", "Completed", "Avg Consult", "Load", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: COLORS.gray400, letterSpacing: "0.5px" }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deptData.map((d, i) => (
                  <tr key={d.name} style={{ borderTop: `1px solid ${COLORS.gray100}` }}>
                    <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: COLORS.navy }}>{d.name}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: COLORS.gray800 }}>{d.registered}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: COLORS.gray800 }}>{d.completed}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: COLORS.gray800 }}>{d.avg}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, background: COLORS.gray100, borderRadius: 4, height: 6, maxWidth: 80, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${d.load}%`, background: d.load > 75 ? COLORS.amber : COLORS.teal, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{d.load}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                        background: d.load > 75 ? "#FFF3E0" : "#E8F5E9",
                        color: d.load > 75 ? COLORS.amber : COLORS.green,
                      }}>{d.load > 75 ? "Busy" : "Normal"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MediQueueApp() {
  const [active, setActive] = useState("landing");

  const pages = {
    landing: <LandingPage setActive={setActive} />,
    patient: <PatientPortal setActive={setActive} />,
    triage: <TriagePage />,
    doctor: <DoctorDashboard />,
    admin: <AdminAnalytics />,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Nav active={active} setActive={setActive} />
      {pages[active]}
    </div>
  );
}
