import { COLORS } from "./constants";
 
const NAV_LINKS = [
  { id: "landing", label: "Home" },
  { id: "patient", label: "Patient Portal" },
  { id: "triage",  label: "AI Triage" },
  { id: "doctor",  label: "Doctor Dashboard" },
  { id: "admin",   label: "Admin Analytics" },
];
 
const Navbar = ({ active, setActive }) => {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10,22,40,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,191,166,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 64,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg, #00BFA6, #0088cc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          ⚕
        </div>
        <span
          style={{ color: COLORS.white, fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}
        >
          Medi<span style={{ color: COLORS.teal }}>Queue</span>
        </span>
      </div>
 
      {/* Links */}
      <div style={{ display: "flex", gap: 4 }}>
        {NAV_LINKS.map((l) => (
          <button
            key={l.id}
            onClick={() => setActive(l.id)}
            style={{
              background: active === l.id ? "rgba(0,191,166,0.15)" : "transparent",
              color: active === l.id ? COLORS.teal : "rgba(255,255,255,0.65)",
              border:
                active === l.id
                  ? "1px solid rgba(0,191,166,0.4)"
                  : "1px solid transparent",
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
 
export default Navbar;