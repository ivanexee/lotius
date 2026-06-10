/**
 * Navigation — Lotius
 * Design: Hamburger menu (left), centered logo, Instagram + language (right)
 * Full-screen overlay nav with staggered link animation
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { X, Menu, Instagram } from "lucide-react";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "DISCOVER THE AWARD", href: "/discover" },
  { label: "LAUREATES", href: "/laureates" },
  { label: "COUNCIL", href: "/council" },
  { label: "MENTORS", href: "/mentors" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Top bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          padding: "1.25rem 1.5rem",
          background: "transparent",
          mixBlendMode: "normal",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="flex flex-col gap-[5px] p-1"
          style={{ zIndex: 51 }}
        >
          <span style={{ display: "block", width: 24, height: "0.5px", background: "currentColor" }} />
          <span style={{ display: "block", width: 16, height: "0.5px", background: "currentColor" }} />
          <span style={{ display: "block", width: 24, height: "0.5px", background: "currentColor" }} />
        </button>

        {/* Logo */}
        <Link href="/">
          <span
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(14px, 2vw, 18px)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            LOTIUS
          </span>
        </Link>

        {/* Right: Instagram + language */}
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={16} strokeWidth={1} />
          </a>
          <div className="flex items-center gap-1" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
            <span style={{ opacity: 0.4 }}>FR</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <span style={{ fontWeight: 500 }}>EN</span>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <div
        className={`nav-overlay${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div
          className="flex flex-col h-full"
          style={{ padding: "1.25rem 1.5rem" }}
        >
          {/* Close button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="p-1"
            >
              <X size={20} strokeWidth={1} />
            </button>
            <Link href="/">
              <span
                style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: 400,
                  fontSize: "clamp(14px, 2vw, 18px)",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                LOTIUS
              </span>
            </Link>
            <div className="flex items-center gap-1" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
              <span style={{ opacity: 0.4 }}>FR</span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span style={{ fontWeight: 500 }}>EN</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col justify-center flex-1" style={{ paddingLeft: "0.5rem" }}>
            {navLinks.map((link, i) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="block"
                  style={{
                    fontFamily: "'Bodoni Moda', serif",
                    fontWeight: 400,
                    fontSize: "clamp(28px, 5vw, 48px)",
                    letterSpacing: "0.05em",
                    lineHeight: 1.3,
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    color: location === link.href ? "oklch(0.08 0 0)" : "oklch(0.08 0 0 / 0.35)",
                    transition: "color 200ms",
                    animation: open ? `staggerIn 500ms cubic-bezier(0.23,1,0.32,1) ${i * 60}ms both` : "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.08 0 0)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = location === link.href ? "oklch(0.08 0 0)" : "oklch(0.08 0 0 / 0.35)")}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer links */}
          <div
            className="flex gap-6"
            style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 }}
          >
            <a href="#">Legal Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </>
  );
}
