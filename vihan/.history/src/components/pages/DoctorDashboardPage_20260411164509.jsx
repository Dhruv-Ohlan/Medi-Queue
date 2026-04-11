import { useState } from "react";
import { COLORS } from "../constants";
import { Badge, StatCard } from "../components";

const QUEUE_DATA = {
  "General Medicine": [
    { token: "GM-42", name: "Priya 'Heart-Throb' Patel", age: 34, urgency: "emergency", reason: "AI says: 'Fix it now or else'", wait: 2 },
    { token: "GM-43", name: "Arun 'Spicy Fever' Kumar", age: 56, urgency: "priority", reason: "Actually just ate a ghost pepper?", wait: 18 },
    { token: "GM-44", name: "Sunita 'Professional Sneezer' Devi", age: 28, urgency: "routine", reason: "Sneezed 47 times in the lobby", wait: 32 },
    { token: "GM-45", name: "Rajan 'My Back is 100' Singh", age: 45, urgency: "priority", reason: "Tried to do a backflip at age 45", wait: 38 },
  ],
  "Paediatrics": [
    { token: "PA-12", name: "Tiny Human #1", age: 5, urgency: "priority", reason: "Swallowed a LEGO Batman head", wait: 12 },
    { token: "PA-13", name: "Aryan 'The Screamer' Verma", age: 8, urgency: "routine", reason: "Refuses to eat broccoli, says it's poison", wait: 28 },
  ],
  "Orthopaedics": [
    { token: "OR-08", name: "Deepak 'Crunchy Bones' Jain", age: 38, urgency: "priority", reason: "Forgot he isn't 18 anymore", wait: 15 },
    { token: "OR-09", name: "Kavita 'Clicky Knee' Rao", age: 50, urgency: "routine", reason: "Knee sounds like a bowl of Rice Krispies", wait: 40 },
  ],
};

const DEPT_LOAD = { "General Medicine": 99, "Paediatrics": 45, "Orthopaedics": 55 };

const URGENCY_COLOR = { emergency: COLORS.red, priority: COLORS.amber, routine: COLORS.green };

const EmergencyModal = ({ onAcknowledge }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(229,57,53,0.3)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
    <div style={{ background: COLORS.white, borderRadius: 30, padding: 40, maxWidth: 450, width: "90%", border: `4px dashed ${COLORS.red}`, textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}>
      <div style={{ fontSize: 60, marginBottom: 15 }}>🚑💨</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.red, fontFamily: "'Syne', sans-serif", marginBottom: 10 }}>DROP YOUR COFFEE!</div>
      <div style={{ fontSize: 16, color: COLORS.navy, fontWeight: 700 }}>Priya Patel is waiting and the AI is panicking.</div>
      <p style={{ fontSize: 14, color: COLORS.gray600, background: "#FFF3F3", borderRadius: 12, padding: "15px", margin: "15px 0" }}>
        "Subject claims their chest feels like an elephant is sitting on it. Also, the elephant is dancing."
      </p>
      <button onClick={onAcknowledge} style={{ width: "100%", background: COLORS.red, color: COLORS.white, border: "none", padding: "16px", borderRadius: 15, fontSize: 16, fontWeight: 800, cursor: "pointer", transition: "0.2s" }}>
        I'm Going, Keep Your Lab Coat On!
      </button>
    </div>
  </div>
);

const DoctorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("General Medicine");
  const [showEmergency, setShowEmergency] = useState(true);

  const queue = QUEUE_DATA[activeTab] || [];
  const load = DEPT_LOAD[activeTab] || 50;

  return (
    <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'DM Sans', sans-serif", paddingTop: 40, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Syne:wght@800&display=swap" rel="stylesheet" />

      {/* ── BACKGROUND LAYER ── */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "url('/doctor.png')", backgroundSize: "cover", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(240, 244, 248, 0.8)", backdropFilter: "blur(2px)" }} />
      </div>

      {showEmergency && <EmergencyModal onAcknowledge={() => setShowEmergency(false)} />}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        
        {/* Hilarious Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 900, color: COLORS.navy, margin: 0 }}>
              The "Fix-It" Station 🩺
            </h1>
            <p style={{ color: COLORS.gray600, fontSize: 16, fontWeight: 500 }}>
              Welcome back, Doc. Try not to Google the symptoms this time.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <Badge type="routine">Coffee Level: 12% ☕</Badge>
            <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 5 }}>Status: Slightly Overwhelmed</div>
          </div>
        </div>

        {/* Humanized Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 30 }}>
          <StatCard label="Humans Waiting" value={queue.length} />
          <StatCard label="Fixed Today" value="38" accent={COLORS.green} />
          <StatCard label="Lunch Countdown" value="42m" accent={COLORS.amber} />
          <StatCard label="Patient Patience" value="Critical" accent={COLORS.red} />
        </div>

        {/* Stress Bar (formerly Load Bar) */}
        <div style={{ background: "rgba(255, 255, 255, 0.8)", borderRadius: 20, padding: "20px", border: `1px solid ${COLORS.gray200}`, marginBottom: 25, backdropFilter: "blur(10px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: COLORS.navy }}>Current Chaos Level: {activeTab}</span>
            <span style={{ fontWeight: 800, color: load > 90 ? COLORS.red : COLORS.teal }}>{load > 90 ? "ABSOLUTE MAYHEM" : "Chill-ish"}</span>
          </div>
          <div style={{ height: 12, background: COLORS.gray100, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${load}%`, background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.red})`, transition: "1s ease-in-out" }} />
          </div>
        </div>

        {/* Queue Table */}
        <div style={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: 25, border: `1px solid ${COLORS.gray200}`, overflow: "hidden", boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.gray100}`, background: "rgba(255,255,255,0.5)", fontWeight: 800 }}>
            Who's Complaining Now?
          </div>
          {queue.map((p, i) => (
            <div key={i} style={{ padding: "20px", display: "flex", alignItems: "center", gap: 20, borderBottom: i === queue.length - 1 ? "none" : `1px solid ${COLORS.gray100}`, background: p.urgency === 'emergency' ? 'rgba(255,0,0,0.05)' : 'transparent' }}>
               <div style={{ fontSize: 24 }}>{p.urgency === 'emergency' ? '🧨' : '🧍'}</div>
               <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: COLORS.navy }}>{p.name} ({p.token})</div>
                  <div style={{ fontSize: 13, color: COLORS.gray600 }}>{p.reason}</div>
               </div>
               <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ background: COLORS.navy, color: "white", padding: "10px 20px", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer" }}>Fix Them</button>
                  <button style={{ background: "white", color: COLORS.gray400, padding: "10px 20px", borderRadius: 12, border: "1px solid #ddd", cursor: "pointer" }}>Hide</button>
               </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboardPage;