/**
 * LoadingScreen — Lotius
 * Design: Bodoni Moda wave animation, left-to-right letter illumination
 * Matches the provided lotius_loading_final.html exactly
 */
import { useEffect, useRef } from "react";

interface LoadingScreenProps {
  fadeOut: boolean;
}

export default function LoadingScreen({ fadeOut }: LoadingScreenProps) {
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const pctRef = useRef<HTMLSpanElement>(null);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const DURATION = 5500;

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  useEffect(() => {
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min((now - startRef.current) / DURATION, 1);
      const v = ease(t);

      lettersRef.current.forEach((l, i) => {
        if (!l) return;
        const lp = Math.min(1, Math.max(0, v * lettersRef.current.length - i));
        l.style.color = `rgba(0,0,0,${(0.07 + lp * 0.93).toFixed(3)})`;
      });

      if (pctRef.current) {
        pctRef.current.textContent = Math.round(v * 100) + "%";
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const letters = ["l", "o", "t", "i", "u", "s"];
  const delays = [0, 0.14, 0.28, 0.42, 0.56, 0.70];

  return (
    <div
      className={`loading-screen${fadeOut ? " fade-out" : ""}`}
      aria-label="Lotius loading screen"
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
              color: "rgba(0,0,0,0.07)",
              willChange: "transform",
              animation: `wv 1.9s ease-in-out infinite`,
              animationDelay: `${delays[i]}s`,
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
          color: "rgba(0,0,0,0.22)",
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
