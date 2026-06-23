/**
 * LoadingScreen — Lotius
 * Design: Bodoni Moda wave animation, left-to-right letter illumination
 * Adapts text color to dark/light mode so letters are always visible.
 */
import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface LoadingScreenProps {
  fadeOut: boolean;
}

export default function LoadingScreen({ fadeOut }: LoadingScreenProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const pctRef = useRef<HTMLSpanElement>(null);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const DURATION = 5500;

  // Base and full opacity values per theme
  const baseAlpha = 0.07;
  const fullAlpha = 0.93;

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  useEffect(() => {
    // Re-run animation when theme changes so colors update immediately
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min((now - startRef.current) / DURATION, 1);
      const v = ease(t);
      const dark = document.documentElement.classList.contains("dark");
      const channel = dark ? "255,255,255" : "0,0,0";

      lettersRef.current.forEach((l, i) => {
        if (!l) return;
        const lp = Math.min(1, Math.max(0, v * lettersRef.current.length - i));
        l.style.color = `rgba(${channel},${(baseAlpha + lp * fullAlpha).toFixed(3)})`;
      });

      if (pctRef.current) {
        pctRef.current.textContent = Math.round(v * 100) + "%";
        pctRef.current.style.color = dark
          ? `rgba(255,255,255,0.35)`
          : `rgba(0,0,0,0.22)`;
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDark]);

  const letters = ["l", "o", "t", "i", "u", "s"];
  const delays = [0, 0.14, 0.28, 0.42, 0.56, 0.70];

  return (
    <div
      className={`loading-screen${fadeOut ? " fade-out" : ""}`}
      aria-label="Lotius loading screen"
      style={{
        background: isDark ? "oklch(0.08 0 0)" : "#fff",
        transition: "background 450ms cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline" }}>
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) lettersRef.current[i] = el;
            }}
            style={{
              display: "inline-block",
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(56px, 12vw, 96px)",
              letterSpacing: "0.08em",
              padding: "0 2px",
              // Start dim in the correct theme color
              color: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
              willChange: "transform",
              animation: `wv 1.9s ease-in-out infinite`,
              animationDelay: `${delays[i]}s`,
              transition: "color 300ms cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <span
        ref={pctRef}
        style={{
          fontFamily: "'Bodoni Moda', serif",
          fontWeight: 400,
          fontSize: "11px",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.22)",
          transition: "color 300ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        0%
      </span>

      <style>{`
        @keyframes wv {
          0%   { transform: translateY(0); }
          25%  { transform: translateY(-22px); }
          50%  { transform: translateY(0); }
          75%  { transform: translateY(11px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
