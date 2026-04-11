import React, { useState } from "react";
// Assuming COLORS is defined as: { white: "#ffffff", teal: "#00BFA6", navy: "#0a192f" }
import { COLORS } from "./constants";

const NAV_LINKS = [
  { id: "landing", label: "Home" },
  { id: "patient", label: "Patient Portal" },
  { id: "triage",  label: "AI Triage" },
  { id: "doctor",  label: "Doctor Dashboard" },
  { id: "admin",   label: "Admin Analytics" },
];

const Navbar = ({ active, setActive }) => {
  const [hovered, setHovered] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        /* Mobile Menu Styling */
        @media (max-width: 992px) {
          .nav-links-container {
            display: ${isOpen ? "flex" : "none"} !important;
            flex-direction: column !important;
            position: fixed !important;
            top: 70px !important;
            left: 0 !important;
            width: 100% !important;
            background: rgba(10, 25, 47, 0.98) !important;
            padding: 10px 0 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            z-index: 999;
          }
          .nav-item-btn {
            width: 100%;
            text-align: left;
            padding: 15px 30px !important;
            border-radius: 0 !important;
          }
          .hamburger {
            display: flex !important;
            order: 2; /* Forces it to the end */
          }
          .action-section {
            display: none !important; /* Hide profile on mobile to keep it clean */
          }
          .logo-section {
            flex: 1;
          }
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          background: "rgba(10, 25, 47, 0.95)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
          fontFamily: "'Times New Roman', Times, serif",
          boxSizing: "border-box"
        }}
      >
        {/* Logo Section */}
        <div 
          className="logo-section"
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          onClick={() => { setActive("landing"); setIsOpen(false); }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "6px",
              background: "linear-gradient(135deg, #00BFA6 0%, #0077ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ⚕
          </div>
          <span
            style={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "20px",
              letterSpacing: "0.5px",
            }}
          >
            Medi<span style={{ color: "#00BFA6" }}>Queue</span>
          </span>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="nav-links-container" style={{ display: "flex", gap: 5 }}>
          {NAV_LINKS.map((l) => {
            const isActive = active === l.id;
            const isHovered = hovered === l.id;

            return (
              <button
                key={l.id}
                className="nav-item-btn"
                onMouseEnter={() => setHovered(l.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { setActive(l.id); setIsOpen(false); }}
                style={{
                  background: isActive ? "rgba(0, 191, 166, 0.1)" : "transparent",
                  color: isActive ? "#00BFA6" : isHovered ? "#ffffff" : "rgba(255,255,255,0.7)",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "4px",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  fontFamily: "inherit"
                }}
              >
                {l.label}
                {isActive && (
                  <div style={{ position: "absolute", bottom: "4px", left: "20%", width: "60%", height: "2px", background: "#00BFA6" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Section (Desktop Profile) */}
        <div className="action-section" style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer"
          }} />
        </div>

        {/* Hamburger Icon (Always pinned to the far right on mobile) */}
        <div 
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            width: "40px",
            height: "40px",
            borderRadius: "4px",
            background: isOpen ? "rgba(0, 191, 166, 0.1)" : "transparent",
            transition: "0.3s"
          }}
        >
          <div style={{ width: "22px", height: "2px", background: "#00BFA6", borderRadius: "2px", transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none", transition: "0.3s" }} />
          <div style={{ width: "22px", height: "2px", background: "#00BFA6", borderRadius: "2px", opacity: isOpen ? 0 : 1, transition: "0.3s" }} />
          <div style={{ width: "22px", height: "2px", background: "#00BFA6", borderRadius: "2px", transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none", transition: "0.3s" }} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;