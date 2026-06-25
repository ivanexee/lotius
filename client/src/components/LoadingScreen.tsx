/**
 * LoadingScreen — Lotius
 * Uses an inline SVG hand-drawn 'lotius' logo as the centrepiece.
 * The logo fades in, gently pulses, and the progress counter counts up.
 * Adapts: dark mode → logo inverted to white; light mode → black ink.
 */
import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface LoadingScreenProps {
  fadeOut: boolean;
}

export default function LoadingScreen({ fadeOut }: LoadingScreenProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pctRef  = useRef<HTMLSpanElement>(null);
  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number | null>(null);
  const DURATION = 5500;

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  useEffect(() => {
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min((now - startRef.current) / DURATION, 1);
      const v = ease(t);
      const dark = document.documentElement.classList.contains("dark");

      if (pctRef.current) {
        pctRef.current.textContent = Math.round(v * 100) + "%";
        pctRef.current.style.color = dark
          ? "rgba(255,255,255,0.4)"
          : "rgba(0,0,0,0.28)";
      }

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isDark]);

  return (
    <div
      className={`loading-screen${fadeOut ? " fade-out" : ""}`}
      aria-label="Lotius loading screen"
      style={{
        background: "#fff",
        transition: "background 450ms cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      {/* Hand-drawn logo — inline SVG with dark mode inversion */}
      <svg
        viewBox="0 0 391 708"
        width="clamp(180px, 38vw, 340px)"
        height="auto"
        style={{
          display: "block",
          filter: isDark ? "invert(1)" : "none",
          transition: "filter 450ms cubic-bezier(0.23,1,0.32,1), opacity 450ms cubic-bezier(0.23,1,0.32,1)",
          animation: "logoBreath 3s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      >
        {/* Left vertical line */}
        <path d="M 35 20 L 35 680" stroke="black" strokeWidth="18" fill="none" strokeLinecap="round" />
        
        {/* Center vertical line */}
        <path d="M 195 80 L 195 650" stroke="black" strokeWidth="18" fill="none" strokeLinecap="round" />
        
        {/* Horizontal cross line */}
        <path d="M 110 300 L 280 300" stroke="black" strokeWidth="18" fill="none" strokeLinecap="round" />
        
        {/* "o" circle */}
        <circle cx="135" cy="380" r="35" stroke="black" strokeWidth="16" fill="none" />
        
        {/* "t" vertical line */}
        <path d="M 195 280 L 195 450" stroke="black" strokeWidth="14" fill="none" strokeLinecap="round" />
        
        {/* "i" dot */}
        <circle cx="195" cy="240" r="8" fill="black" />
        
        {/* "u" curve */}
        <path d="M 240 330 L 240 420 Q 240 450 270 450 L 270 330" stroke="black" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* "s" curves */}
        <path d="M 310 350 Q 310 330 330 330 Q 350 330 350 350 Q 350 370 330 370 Q 310 370 310 390 Q 310 410 330 410 Q 350 410 350 430" stroke="black" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Small "l" accent */}
        <path d="M 215 200 L 235 180" stroke="black" strokeWidth="12" fill="none" strokeLinecap="round" />
      </svg>

      {/* Progress counter */}
      <span
        ref={pctRef}
        style={{
          marginTop: "2.5rem",
          fontFamily: "'Bodoni Moda', serif",
          fontWeight: 400,
          fontSize: "11px",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.28)",
          transition: "color 300ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        0%
      </span>

      <style>{`
        @keyframes logoBreath {
          0%   { transform: scale(1);       opacity: 0.88; }
          50%  { transform: scale(1.018);   opacity: 1;    }
          100% { transform: scale(1);       opacity: 0.88; }
        }
      `}</style>
    </div>
  );
}
