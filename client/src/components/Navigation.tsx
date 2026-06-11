import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Instagram } from "lucide-react";

const mainLinks = [
  { label: "HOME", href: "/" },
  { label: "DISCOVER THE AWARD", href: "/discover" },
  { label: "LAUREATES", href: "/laureates" },
  { label: "COUNCIL", href: "/council" },
  { label: "MENTORS", href: "/mentors" },
];

const seasonLinks = [
  { label: "SPRING 2026", href: "/#spring", color: "rgba(200, 100, 120, 0.7)" },
  { label: "SUMMER 2026", href: "/#summer", color: "rgba(30, 120, 200, 0.7)" },
  { label: "FALL 2026", href: "/#fall", color: "rgba(160, 80, 20, 0.7)" },
  { label: "WINTER 2026", href: "/#winter", color: "rgba(30, 80, 160, 0.7)" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Scroll to section on homepage
  const handleSeasonClick = (href: string) => {
    setOpen(false);
    const sectionId = href.replace("/#", "");
    // If already on homepage, scroll to section
    if (location === "/") {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  };

  return (
    <>

      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{ padding: "1.25rem 1.5rem" }}
      >
        {/* Hamburger / X toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          style={{
            zIndex: 51,
            background: "none",
            border: "none",
            padding: "4px",
            cursor: "pointer",
            width: 32,
            height: 24,
            position: "relative",
            display: open ? 'none' : 'flex',
            flexDirection: "column",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {/* Line 1 */}
          <span
            style={{
              display: "block",
              width: 24,
              height: "0.5px",
              background: "currentColor",
              transformOrigin: "center",
              transition: "transform 350ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms, width 300ms cubic-bezier(0.23,1,0.32,1)",
              transform: open ? "translateY(5px) rotate(45deg)" : "translateY(0) rotate(0deg)",
              marginBottom: open ? 0 : "5px",
            }}
          />
          {/* Line 2 */}
          <span
            style={{
              display: "block",
              width: open ? 0 : 16,
              height: "0.5px",
              background: "currentColor",
              transition: "width 250ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms",
              opacity: open ? 0 : 1,
              marginBottom: open ? 0 : "5px",
            }}
          />
          {/* Line 3 */}
          <span
            style={{
              display: "block",
              width: 24,
              height: "0.5px",
              background: "currentColor",
              transformOrigin: "center",
              transition: "transform 350ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms",
              transform: open ? "translateY(-5px) rotate(-45deg)" : "translateY(0) rotate(0deg)",
            }}
          />
        </button>

        {/* Centered logo */}
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
              zIndex: 51,
            }}
          >
            LOTIUS
          </span>
        </Link>

        {/* Right: Instagram + language */}
        <div className="flex items-center gap-4" style={{ zIndex: 51 }}>
          <a
            href="https://www.instagram.com/i.cxccc?igsh=MTUxYm45amdsdmo3bw%3D%3D&utm_source=qr"
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


      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: "fixed",
          inset: 0,
          background: "#fff",
          zIndex: 200,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 480ms cubic-bezier(0.23, 1, 0.32, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar inside overlay */}
        <div
          className="flex items-center justify-between"
          style={{ padding: "1.25rem 1.5rem", flexShrink: 0 }}
        >
          {/* Invisible spacer matching hamburger width */}
          <div style={{ width: 32 }} />
          <Link href="/" onClick={() => setOpen(false)}>
            <span
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: "clamp(14px, 2vw, 18px)",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
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

        {/* Hairline */}
        <hr style={{ border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "0 1.5rem" }} />

        {/* Content: two columns */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "3rem 2rem 2rem",
            gap: "3rem",
            overflowY: "auto",
          }}
        >
          {/* Main nav links */}
          <nav>
            {mainLinks.map((link, i) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                <span
                  className="block"
                  style={{
                    fontFamily: "'Bodoni Moda', serif",
                    fontWeight: 400,
                    fontSize: "clamp(24px, 4.5vw, 44px)",
                    letterSpacing: "0.04em",
                    lineHeight: 1.25,
                    paddingTop: "0.4rem",
                    paddingBottom: "0.4rem",
                    color: location === link.href ? "oklch(0.08 0 0)" : "oklch(0.08 0 0 / 0.3)",
                    transition: "color 200ms, transform 200ms",
                    display: "block",
                    animation: open ? `staggerIn 500ms cubic-bezier(0.23,1,0.32,1) ${i * 55}ms both` : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "oklch(0.08 0 0)";
                    e.currentTarget.style.transform = "translateX(6px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = location === link.href ? "oklch(0.08 0 0)" : "oklch(0.08 0 0 / 0.3)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Hairline separator */}
          <hr style={{ border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)" }} />

          {/* Seasonal collections */}
          <div>
            <p
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontSize: 9,
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.35)",
                marginBottom: "1.25rem",
                animation: open ? "staggerIn 500ms cubic-bezier(0.23,1,0.32,1) 330ms both" : "none",
              }}
            >
              COLLECTIONS
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {seasonLinks.map((s, i) => (
                <Link
                  key={s.href}
                  href={location === "/" ? s.href : "/"}
                  onClick={() => handleSeasonClick(s.href)}
                >
                  <span
                    className="block"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 300,
                      fontSize: "clamp(20px, 3.5vw, 32px)",
                      letterSpacing: "0.08em",
                      color: "rgba(0,0,0,0.5)",
                      transition: "color 200ms, transform 200ms",
                      display: "block",
                      animation: open ? `staggerIn 500ms cubic-bezier(0.23,1,0.32,1) ${380 + i * 50}ms both` : "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = s.color;
                      e.currentTarget.style.transform = "translateX(6px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(0,0,0,0.5)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {s.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Hairline separator */}
          <hr style={{ border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)" }} />

          {/* Contact Us */}
          <div
            style={{
              animation: open ? "staggerIn 500ms cubic-bezier(0.23,1,0.32,1) 540ms both" : "none",
            }}
          >
            <p
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontSize: 9,
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.35)",
                marginBottom: "1rem",
              }}
            >
              GET IN TOUCH
            </p>
            <a
              href="mailto:i.cxc@icloud.com?subject=Lotius Enquiry"
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: "clamp(18px, 3vw, 28px)",
                letterSpacing: "0.04em",
                color: "rgba(0,0,0,0.7)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                transition: "color 200ms, transform 200ms",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "oklch(0.08 0 0)";
                e.currentTarget.style.transform = "translateX(6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(0,0,0,0.7)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              {/* Mail icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
              CONTACT US
            </a>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 13,
                color: "rgba(0,0,0,0.35)",
                marginTop: "0.4rem",
                letterSpacing: "0.03em",
              }}
            >
              i.cxc@icloud.com
            </p>
          </div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            padding: "1.25rem 2rem",
            borderTop: "0.5px solid rgba(0,0,0,0.08)",
            display: "flex",
            gap: "2rem",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.35,
            flexShrink: 0,
          }}
        >
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Legal Terms</a>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Privacy</a>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Accessibility</a>
        </div>
      </div>
    </>
  );
}
