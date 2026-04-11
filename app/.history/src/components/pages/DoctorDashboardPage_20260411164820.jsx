import { useState } from "react";
import { COLORS } from "../constants";
import { Badge, StatCard } from "../components";

const QUEUE_DATA = {
  "General Medicine": [
    { token: "GM-42", name: "Priya 'Heart-Throb' Patel", age: 34, urgency: "emergency", reason: "AI says: 'Fix it now or else'", wait: 2 },
    { token: "GM-43", name: "Arun 'Spicy Fever' Kumar", age: 56, urgency: "priority", reason: "Probably just ate a ghost pepper", wait: 18 },
    { token: "GM-44", name: "Sunita 'Professional Sneezer' Devi", age: 28, urgency: "routine", reason: "Sneezed 47 times in the lobby", wait: 32 },
    { token: "GM-45", name: "Rajan 'My Back is 100' Singh", age: 45, urgency: "priority", reason: "Tried to do a backflip at his age", wait: 38 },
    { token: "GM-46", name: "Meena 'Coffee-Addict' Kumari", age: 62, urgency: "routine", reason: "Blood pressure is basically espresso", wait: 45 },
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

const DEPT_LOAD = { "General Medicine": 92, "Paediatrics": 45, "Orthopaedics": 55 };

const URGENCY_COLOR = { emergency: COLORS.red, priority: COLORS.amber, routine: COLORS.green };

// ── Hilarious Emergency Modal ───────────────────────────────────────────────

const EmergencyModal = ({ onAcknowledge }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(229,57,53,0.25)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
    <div style={{ background: COLORS.white, borderRadius: 30, padding: 40, maxWidth: 450, width: "90%", border: `4px dashed ${COLORS.red}`, textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}>
      <div style={{ fontSize: 60, marginBottom: 15 }}>🚑💨</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.red, fontFamily: "'Syne', sans-serif", marginBottom: 10 }}>DROP YOUR COFFEE!</div>
      <div style={{ fontSize: 16, color: COLORS.navy, fontWeight: 700 }}>A patient is waiting and the AI is panicking.</div>
      <p style={{ fontSize: 14, color: COLORS.gray600, background: "#FFF3F3", borderRadius: 12, padding: "15px", margin: "15px 0" }}>
        "Subject claims their chest feels like a heavy elephant is sitting on it. Also, the elephant is dancing."
      </p>
      <button onClick={onAcknowledge} style={{ width: "100%", background: COLORS.red, color: COLORS.white, border: "none", padding: "16px", borderRadius: 15, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
        I'm Going, Keep Your Lab Coat On!
      </button>
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────────────────────────

const DoctorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("General Medicine");
  const [showEmergency, setShowEmergency] = useState(true);

  const queue = QUEUE_DATA[activeTab] || [];
  const load = DEPT_LOAD[activeTab] || 50;
  const loadColor = load > 85 ? COLORS.red : load > 60 ? COLORS.amber : COLORS.green;

  return (
    <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'DM Sans', sans-serif", paddingTop: 64, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* ── 1. FIXED BACKGROUND LAYER (2% Blur) ── */}
      <div 
        style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          backgroundImage: "url('/doctor.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      >
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(248, 250, 252, 0.82)", 
            backdropFilter: "blur(2px)", 
            WebkitBackdropFilter: "blur(2px)",
          }}
        />
      </div>

      {showEmergency && <EmergencyModal onAcknowledge={() => setShowEmergency(false)} />}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        
        {/* Hilarious Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 900, color: COLORS.navy, margin: 0 }}>
              The Fix-It Station 🩺
            </h1>
            <p style={{ color: COLORS.gray600, fontSize: 16, fontWeight: 500, margin: "4px 0 0" }}>
              Welcome back, Doc. Try not to Google the symptoms this time.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <Badge type="routine">Coffee Level: 12% ☕</Badge>
            <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 5 }}>Status: Slightly Overwhelmed</div>
          </div>
        </div>

        {/* Humanized Stats row with Glassmorphism */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          <StatCard label="Humans Waiting"   value={queue.length} />
          <StatCard label="Fixed Today"  value="38"    accent={COLORS.green} />
          <StatCard label="Lunch Countdown" value="42m" accent={COLORS.amber} />
          <StatCard label="Patient Patience" value="Critical"  accent={COLORS.red}  />
        </div>

        {/* Dept Selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {Object.keys(QUEUE_DATA).map((dept) => (
            <button
                key={dept}
                onClick={() => setActiveTab(dept)}
                style={{
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                background: activeTab === dept ? COLORS.navy : "rgba(255,255,255,0.7)",
                color: activeTab === dept ? COLORS.white : COLORS.gray600,
                border: "none",
                backdropFilter: "blur(5px)",
                transition: "all 0.2s"
                }}
            >
                {dept} ({QUEUE_DATA[dept].length})
            </button>
            ))}
        </div>

        {/* Stress Bar (Chaos Level) */}
        <div style={{ background: "rgba(255, 255, 255, 0.75)", borderRadius: 16, padding: "16px 20px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20, backdropFilter: "blur(10px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 14, color: COLORS.navy, fontWeight: 800 }}>CURRENT CHAOS LEVEL: {activeTab.toUpperCase()}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: loadColor }}>
                {load > 85 ? "ABSOLUTE MAYHEM" : load > 60 ? "PRETTY BUSY" : "CHILL VIBES"}
            </span>
          </div>
          <div style={{ background: COLORS.gray100, borderRadius: 10, height: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${load}%`, background: `linear-gradient(90deg, ${COLORS.teal}, ${loadColor})`, transition: "width 1s ease-in-out" }} />
          </div>
        </div>

        {/* Queue Table */}
        <div style={{ background: "rgba(255, 255, 255, 0.85)", borderRadius: 24, border: `1px solid ${COLORS.gray200}`, overflow: "hidden", backdropFilter: "blur(15px)", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.gray100}`, background: "rgba(255,255,255,0.4)", fontWeight: 800, color: COLORS.navy }}>
            Who's Complaining Now?
          </div>

          {queue.map((p, i) => (
            <div key={i} style={{ padding: "20px", display: "flex", alignItems: "center", gap: 20, borderBottom: i === queue.length - 1 ? "none" : `1px solid ${COLORS.gray100}`, background: p.urgency === 'emergency' ? 'rgba(255,0,0,0.05)' : 'transparent' }}>
                <div style={{ fontSize: 24 }}>{p.urgency === 'emergency' ? '🧨' : '🧍'}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 16 }}>{p.name} · {p.token}</div>
                    <div style={{ fontSize: 13, color: COLORS.gray600, marginTop: 4 }}>🤖 {p.reason}</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ background: COLORS.navy, color: "white", padding: "10px 22px", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Fix Them</button>
                    <button style={{ background: "white", color: COLORS.gray400, padding: "10px 15px", borderRadius: 12, border: "1px solid #ddd", cursor: "pointer", fontSize: 13 }}>Hide</button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;