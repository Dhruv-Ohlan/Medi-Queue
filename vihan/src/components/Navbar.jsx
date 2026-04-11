import React, { useState } from "react";
import { COLORS } from "../constants";

const NAV_LINKS = [
  { id: "landing", label: "Home" },
  { id: "patient", label: "Patient Portal" },
  { id: "triage",  label: "AI Triage" },
  { id: "doctor",  label: "Doctor Dashboard" },
  { id: "admin",   label: "Admin Analytics" },
];

const Navbar = ({ active, setActive }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <nav
      style={{
        position: "fixed",
        top: 20, // Floating effect
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "1200px",
        zIndex: 1000,
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        borderRadius: "20px",
        // Glassmorphism with a subtle image pattern background
        background: `linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url('https://www.transparenttextures.com/patterns/pinstripe.png')`,
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Logo Section with Glow Animation */}
      <div 
        style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        onClick={() => setActive("landing")}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #00BFA6 0%, #0077ff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: "0 0 20px rgba(0, 191, 166, 0.4)",
          }}
        >
          ⚕
        </div>
        <span
          style={{
            color: COLORS.white,
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.5px",
          }}
        >
          Medi<span style={{ color: COLORS.teal }}>Queue</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: 8 }}>
        {NAV_LINKS.map((l) => {
          const isActive = active === l.id;
          const isHovered = hovered === l.id;

          return (
            <button
              key={l.id}
              onMouseEnter={() => setHovered(l.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActive(l.id)}
              style={{
                background: isActive 
                  ? "rgba(0, 191, 166, 0.15)" 
                  : isHovered 
                  ? "rgba(255, 255, 255, 0.05)" 
                  : "transparent",
                color: isActive ? COLORS.teal : isHovered ? COLORS.white : "rgba(255,255,255,0.6)",
                border: "none",
                padding: "10px 20px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {l.label}
              
              {/* Animated underline for active/hover states */}
              {(isActive || isHovered) && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    width: "20px",
                    height: "2px",
                    background: COLORS.teal,
                    borderRadius: "2px",
                    boxShadow: "0 0 10px #00BFA6",
                    animation: "fadeIn 0.3s ease forwards",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
        <button
          style={{
            background: COLORS.teal,
            color: COLORS.navy,
            border: "none",
            padding: "10px 22px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 10px 20px rgba(0, 191, 166, 0.2)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          Emergency SOS
        </button>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;