import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Instagram, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Inline SVG path traced from the hand-drawn lotius logo
export const LOGO_PATH = "M 201 312 L 198 312 L 193 314 L 189 320 L 189 330 L 191 340 L 190 394 L 191 396 L 195 399 L 201 399 L 203 398 L 206 395 L 208 388 L 206 372 L 206 319 L 204 314 Z M 285 311 L 282 310 L 279 311 L 275 314 L 272 319 L 272 326 L 276 336 L 278 344 L 279 361 L 278 368 L 274 378 L 272 381 L 266 386 L 257 386 L 249 382 L 244 376 L 241 369 L 241 352 L 246 334 L 246 323 L 243 319 L 241 318 L 237 318 L 231 320 L 226 324 L 224 328 L 224 330 L 226 332 L 235 333 L 234 343 L 231 351 L 229 361 L 228 375 L 232 388 L 235 392 L 240 396 L 247 399 L 253 400 L 258 400 L 269 397 L 278 392 L 284 386 L 289 378 L 294 363 L 295 357 L 295 343 L 292 324 L 289 315 Z M 103 309 L 98 308 L 88 308 L 77 312 L 66 319 L 57 328 L 52 338 L 50 347 L 50 355 L 52 364 L 57 374 L 61 379 L 70 386 L 77 389 L 81 390 L 93 390 L 103 387 L 109 384 L 115 380 L 124 371 L 129 362 L 131 354 L 131 341 L 128 331 L 123 323 L 114 314 Z M 83 322 L 93 322 L 100 325 L 109 334 L 112 339 L 114 345 L 114 360 L 111 367 L 104 374 L 100 376 L 90 376 L 82 373 L 73 365 L 68 356 L 67 352 L 67 339 L 71 330 L 76 325 Z M 356 281 L 342 281 L 335 283 L 329 286 L 319 295 L 315 301 L 312 310 L 312 326 L 315 336 L 327 355 L 337 367 L 347 381 L 356 398 L 359 408 L 359 422 L 356 430 L 347 438 L 344 439 L 333 439 L 326 437 L 321 434 L 315 428 L 313 425 L 311 419 L 312 410 L 314 406 L 320 400 L 321 398 L 320 396 L 313 395 L 304 402 L 301 406 L 297 415 L 296 420 L 296 429 L 297 433 L 300 439 L 307 446 L 319 452 L 325 453 L 334 453 L 348 449 L 357 444 L 362 440 L 368 432 L 373 422 L 375 413 L 375 404 L 373 394 L 369 384 L 359 367 L 331 329 L 326 315 L 326 308 L 329 300 L 333 296 L 340 293 L 349 294 L 353 296 L 358 301 L 360 305 L 360 311 L 358 314 L 359 319 L 365 319 L 369 315 L 372 310 L 373 306 L 373 294 L 371 290 L 367 286 L 362 283 Z M 212 178 L 207 178 L 202 183 L 190 200 L 187 206 L 187 211 L 189 213 L 200 213 L 222 208 L 224 206 L 223 202 L 221 201 L 212 201 L 205 203 L 202 202 L 202 200 L 214 184 L 214 180 Z M 161 43 L 158 43 L 155 45 L 153 48 L 151 60 L 150 77 L 149 147 L 151 238 L 150 240 L 145 244 L 106 242 L 99 245 L 97 247 L 94 255 L 95 260 L 97 261 L 103 261 L 117 258 L 132 257 L 148 257 L 151 260 L 151 541 L 149 629 L 149 669 L 150 686 L 151 689 L 154 692 L 159 692 L 163 689 L 166 681 L 166 577 L 164 430 L 165 260 L 169 257 L 193 257 L 225 259 L 235 258 L 242 255 L 247 249 L 247 243 L 244 240 L 231 240 L 206 243 L 168 243 L 165 240 L 166 127 L 165 49 L 163 44 Z M 21 15 L 15 22 L 15 84 L 17 164 L 17 283 L 15 404 L 17 448 L 19 455 L 22 457 L 25 457 L 29 454 L 31 450 L 33 439 L 33 397 L 31 359 L 31 149 L 33 79 L 33 46 L 31 19 L 30 17 L 27 15 Z";

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
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
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
        style={{ padding: "1.25rem 1.5rem", color: "#fff", mixBlendMode: "difference" as const }}
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

        {/* Centered logo — hand-drawn wordmark, inline SVG */}
        <Link href="/">
          <svg
            viewBox="0 0 391 708"
            aria-label="lotius"
            style={{
              height: "clamp(28px, 4vw, 40px)",
              width: "auto",
              display: "block",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 51,
              fill: isDark ? "white" : "black",
              transition: "fill 450ms cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <path fillRule="evenodd" d={LOGO_PATH} />
          </svg>
        </Link>

        {/* Right: Instagram + theme toggle + language */}
        <div className="flex items-center gap-4" style={{ zIndex: 51 }}>
          <a
            href="https://www.instagram.com/i.cxccc?igsh=MTUxYm45amdsdmo3bw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={16} strokeWidth={1} />
          </a>

          {/* Dark / Light mode toggle */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                background: "none",
                border: "none",
                padding: "2px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "currentColor",
                opacity: 0.75,
                transition: "opacity 200ms cubic-bezier(0.23,1,0.32,1), transform 200ms cubic-bezier(0.23,1,0.32,1)",
                lineHeight: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1.15) rotate(15deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.75";
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.9) rotate(0deg)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.15) rotate(15deg)";
              }}
            >
              <span
                style={{
                  display: "block",
                  transition: "opacity 300ms cubic-bezier(0.23,1,0.32,1), transform 350ms cubic-bezier(0.23,1,0.32,1)",
                  opacity: isDark ? 1 : 0,
                  transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
                  position: "absolute",
                  lineHeight: 0,
                }}
              >
                <Sun size={15} strokeWidth={1} />
              </span>
              <span
                style={{
                  display: "block",
                  transition: "opacity 300ms cubic-bezier(0.23,1,0.32,1), transform 350ms cubic-bezier(0.23,1,0.32,1)",
                  opacity: isDark ? 0 : 1,
                  transform: isDark ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
                  lineHeight: 0,
                }}
              >
                <Moon size={15} strokeWidth={1} />
              </span>
            </button>
          )}

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
        background: isDark ? "oklch(0.08 0 0)" : "#fff",
        color: isDark ? "oklch(0.97 0 0)" : "oklch(0.08 0 0)",
        zIndex: 200,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 480ms cubic-bezier(0.23, 1, 0.32, 1), background-color 450ms cubic-bezier(0.23,1,0.32,1)",
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
            <svg
              viewBox="0 0 391 708"
              aria-label="lotius"
              style={{
                height: "clamp(28px, 4vw, 40px)",
                width: "auto",
                display: "block",
                fill: isDark ? "white" : "black",
                transition: "fill 450ms cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              <path fillRule="evenodd" d={LOGO_PATH} />
            </svg>
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
                    color: location === link.href
                      ? (isDark ? "oklch(0.97 0 0)" : "oklch(0.08 0 0)")
                      : (isDark ? "oklch(0.97 0 0 / 0.35)" : "oklch(0.08 0 0 / 0.3)"),
                    transition: "color 200ms, transform 200ms",
                    display: "block",
                    animation: open ? `staggerIn 500ms cubic-bezier(0.23,1,0.32,1) ${i * 55}ms both` : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isDark ? "oklch(0.97 0 0)" : "oklch(0.08 0 0)";
                    e.currentTarget.style.transform = "translateX(6px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = location === link.href
                      ? (isDark ? "oklch(0.97 0 0)" : "oklch(0.08 0 0)")
                      : (isDark ? "oklch(0.97 0 0 / 0.35)" : "oklch(0.08 0 0 / 0.3)");
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
                      color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
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
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)";
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
                color: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.7)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                transition: "color 200ms, transform 200ms",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
              e.currentTarget.style.color = isDark ? "oklch(0.97 0 0)" : "oklch(0.08 0 0)";
              e.currentTarget.style.transform = "translateX(6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.7)";
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
