/**
 * LoadingScreen — Lotius
 * Uses the hand-drawn 'lotius' logo as the centrepiece.
 * The logo fades in, gently pulses, and the progress counter counts up.
 * Adapts: dark mode → logo inverted to white; light mode → black ink.
 */
import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const LOGO_URL = "/manus-storage/lotius-logo-full_c379305f.png";

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
        background: isDark ? "oklch(0.08 0 0)" : "#fff",
        transition: "background 450ms cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      {/* Hand-drawn logo — inverted to white in dark mode */}
      <img
        src={LOGO_URL}
        alt="lotius"
        style={{
          width: "clamp(180px, 38vw, 340px)",
          height: "auto",
          display: "block",
          // Invert black ink to white when in dark mode
          filter: isDark ? "invert(1)" : "none",
          transition: "filter 450ms cubic-bezier(0.23,1,0.32,1), opacity 450ms cubic-bezier(0.23,1,0.32,1)",
          animation: "logoBreath 3s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

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
