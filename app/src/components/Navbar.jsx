import React, { useState } from "react";

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

  // High-end Typography Pairing
  const headingFont = "'Inter', sans-serif";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800&display=swap" rel="stylesheet" />

      <style>{`
        /* Mobile Menu Logic */
        @media (max-width: 1024px) {
          .nav-links-container {
            display: ${isOpen ? "flex" : "none"} !important;
            flex-direction: column !important;
            position: fixed !important;
            top: 60px !important; /* Matches new height */
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
            font-size: 16px !important;
          }
          .hamburger {
            display: flex !important;
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
          height: 60, // Smaller Navbar
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          background: "rgba(10, 25, 47, 0.95)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          boxSizing: "border-box"
        }}
      >
        {/* Logo Section */}
        <div 
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => { setActive("landing"); setIsOpen(false); }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "6px",
              background: "linear-gradient(135deg, #00BFA6 0%, #0077ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: "#fff"
            }}
          >
            ⚕
          </div>
          <span
            style={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "-0.5px",
              fontFamily: headingFont
            }}
          >
            Medi<span style={{ color: "#00BFA6" }}>Queue</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
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
                  padding: "6px 16px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: headingFont,
                  position: "relative"
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

        {/* Global Hamburger Menu Icon (Far Right) */}
        <div 
          className="hamburger-container"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            width: "36px",
            height: "36px",
            borderRadius: "6px",
            transition: "0.3s",
            background: isOpen ? "rgba(0, 191, 166, 0.1)" : "transparent"
          }}
        >
          <div style={{ width: "20px", height: "2px", background: "#00BFA6", borderRadius: "2px", transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none", transition: "0.3s" }} />
          <div style={{ width: "20px", height: "2px", background: "#00BFA6", borderRadius: "2px", opacity: isOpen ? 0 : 1, transition: "0.3s" }} />
          <div style={{ width: "20px", height: "2px", background: "#00BFA6", borderRadius: "2px", transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none", transition: "0.3s" }} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;