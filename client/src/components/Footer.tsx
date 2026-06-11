/**
 * Footer — Lotius
 * Design: Concise, organized, hairline top border
 */
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "0.5px solid oklch(0.08 0 0 / 0.12)",
        padding: "clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 3vw, 1.5rem)",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Brand */}
        <Link href="/">
          <span
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(12px, 1.5vw, 14px)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            LOTIUS
          </span>
        </Link>

        {/* Links */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(1rem, 3vw, 2rem)",
            alignItems: "center",
          }}
        >
          <a href="#" className="label-caps" style={{ opacity: 0.4, textDecoration: "none", color: "inherit" }}>Privacy</a>
          <a href="#" className="label-caps" style={{ opacity: 0.4, textDecoration: "none", color: "inherit" }}>Terms</a>
          <a
            href="mailto:i.cxc@icloud.com?subject=Lotius Enquiry"
            className="label-caps"
            style={{ opacity: 0.4, textDecoration: "none", color: "inherit" }}
          >
            Contact
          </a>
        </div>

        {/* Copyright */}
        <span className="label-caps" style={{ opacity: 0.3 }}>
          © {new Date().getFullYear()} Lotius
        </span>
      </div>
    </footer>
  );
}
