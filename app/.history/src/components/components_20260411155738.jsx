import { COLORS } from "./constants";
 
export const Badge = ({ type, children }) => {
  const styles = {
    routine:   { bg: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7" },
    priority:  { bg: "#FFF3E0", color: "#E65100", border: "#FFCC80" },
    emergency: { bg: "#FFEBEE", color: "#B71C1C", border: "#EF9A9A" },
    general:   { bg: "#E3F2FD", color: "#0D47A1", border: "#90CAF9" },
    paeds:     { bg: "#F3E5F5", color: "#4A148C", border: "#CE93D8" },
    ortho:     { bg: "#E0F2F1", color: "#004D40", border: "#80CBC4" },
  };
  const s = styles[type] || styles.general;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
};
 
export const StatCard = ({ label, value, sub, accent }) => (
  <div
    style={{
      background: COLORS.white,
      borderRadius: 14,
      padding: "20px 24px",
      border: `1px solid ${COLORS.gray200}`,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 4,
        height: "100%",
        background: accent || COLORS.teal,
        borderRadius: "14px 0 0 14px",
      }}
    />
    <div style={{ paddingLeft: 8 }}>
      <div style={{ fontSize: 13, color: COLORS.gray400, fontWeight: 500, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.navy, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  </div>
);