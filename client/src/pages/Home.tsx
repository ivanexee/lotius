/**
 * Home — Lotius
 * Design: Full-screen hero with rotating designer portraits
 * Large typographic overlay: "2026 LOTIUS AWARD FINALISTS"
 * ENTER → button centered on active portrait
 * Bottom bar: designer name + navigation controls
 */
import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const finalists = [
  {
    id: 1,
    name: "ELARA VOSS",
    brand: "by Elara Voss",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_1-WeiDQC86h9VwSYYn4MZQL4.webp",
    bgColor: "#f5ede6",
  },
  {
    id: 2,
    name: "MARCO DELACROIX",
    brand: "by Marco Delacroix",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_2-ikWiuC6TeVwsBY6cDMSycB.webp",
    bgColor: "#e8ddd5",
  },
  {
    id: 3,
    name: "SEREN NAKAMURA",
    brand: "by Seren Nakamura",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_3-bhCK7gbsg9tGBiakXFZzFb.webp",
    bgColor: "#ebebeb",
  },
  {
    id: 4,
    name: "YUI TANAKA",
    brand: "by Yui Tanaka",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_4-gmt7chQWnUAwoEKjADFzcS.webp",
    bgColor: "#1a1a1a",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setPrev(current);
    setCurrent(index);
    setTimeout(() => {
      setPrev(null);
      setIsTransitioning(false);
    }, 900);
  }, [current, isTransitioning]);

  const goNext = useCallback(() => {
    goTo((current + 1) % finalists.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + finalists.length) % finalists.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [goNext, isPaused]);

  const finalist = finalists[current];
  const isDark = finalist.bgColor === "#1a1a1a";

  return (
    <div
      className="page-enter"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: isDark ? "#fff" : "#000",
      }}
    >
      <Navigation />

      {/* Hero */}
      <main
        style={{
          position: "relative",
          flex: 1,
          minHeight: "100vh",
          overflow: "hidden",
          background: finalist.bgColor,
          transition: "background 800ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        {/* Background typographic text */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(80px, 18vw, 220px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              whiteSpace: "nowrap",
              paddingLeft: "2vw",
              userSelect: "none",
            }}
          >
            2026
          </span>
          <span
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(60px, 14vw, 180px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              whiteSpace: "nowrap",
              paddingLeft: "2vw",
              userSelect: "none",
            }}
          >
            LOTIUS
          </span>
          <span
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(40px, 9vw, 120px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              whiteSpace: "nowrap",
              paddingLeft: "2vw",
              userSelect: "none",
            }}
          >
            AWARD
          </span>
          <span
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(30px, 7vw, 90px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              whiteSpace: "nowrap",
              paddingLeft: "2vw",
              userSelect: "none",
            }}
          >
            FINALISTS
          </span>
        </div>

        {/* Portrait cards */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          {/* Previous portrait (fading out) */}
          {prev !== null && (
            <div
              key={`prev-${prev}`}
              style={{
                position: "absolute",
                width: "clamp(220px, 35vw, 420px)",
                aspectRatio: "3/4",
                opacity: 0,
                transition: "opacity 800ms cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              <img
                src={finalists[prev].image}
                alt={finalists[prev].name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Current portrait */}
          <div
            key={`curr-${current}`}
            style={{
              position: "relative",
              width: "clamp(220px, 35vw, 420px)",
              aspectRatio: "3/4",
              animation: "portraitIn 900ms cubic-bezier(0.23,1,0.32,1) both",
            }}
          >
            <img
              src={finalist.image}
              alt={finalist.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Enter button overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Link href="/laureates">
                <button className={isDark ? "btn-lotius-inv" : "btn-lotius"}>
                  ENTER →
                </button>
              </Link>
            </div>
          </div>

          {/* Left side preview */}
          {(() => {
            const prevIdx = (current - 1 + finalists.length) % finalists.length;
            const f = finalists[prevIdx];
            return (
              <div
                key={`left-${prevIdx}`}
                onClick={() => goTo(prevIdx)}
                style={{
                  position: "absolute",
                  left: "clamp(20px, 6vw, 100px)",
                  width: "clamp(100px, 15vw, 200px)",
                  aspectRatio: "3/4",
                  opacity: 0.3,
                  transform: "rotate(-2deg)",
                  transition: "opacity 300ms, transform 300ms",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.transform = "rotate(-1deg) scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.3"; e.currentTarget.style.transform = "rotate(-2deg)"; }}
              >
                <img src={f.image} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            );
          })()}

          {/* Right side preview */}
          {(() => {
            const nextIdx = (current + 1) % finalists.length;
            const f = finalists[nextIdx];
            return (
              <div
                key={`right-${nextIdx}`}
                onClick={() => goTo(nextIdx)}
                style={{
                  position: "absolute",
                  right: "clamp(20px, 6vw, 100px)",
                  width: "clamp(100px, 15vw, 200px)",
                  aspectRatio: "3/4",
                  opacity: 0.3,
                  transform: "rotate(2deg)",
                  transition: "opacity 300ms, transform 300ms",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.transform = "rotate(1deg) scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.3"; e.currentTarget.style.transform = "rotate(2deg)"; }}
              >
                <img src={f.image} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            );
          })()}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
            borderTop: `0.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
          }}
        >
          {/* Finalist selector */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              onClick={goPrev}
              aria-label="Previous finalist"
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                opacity: 0.5,
                background: "none",
                border: "none",
                color: "inherit",
                padding: "0.25rem",
              }}
            >
              ←
            </button>
            <span className="label-caps" style={{ opacity: 0.5 }}>
              {current + 1} / {finalists.length}
            </span>
            <button
              onClick={goNext}
              aria-label="Next finalist"
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                opacity: 0.5,
                background: "none",
                border: "none",
                color: "inherit",
                padding: "0.25rem",
              }}
            >
              →
            </button>
          </div>

          {/* Current finalist name */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: "clamp(14px, 2vw, 20px)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {finalist.name}
            </p>
            <p className="label-caps" style={{ opacity: 0.5, marginTop: "0.25rem" }}>
              {finalist.brand}
            </p>
          </div>

          {/* Pause/play */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: 9,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              opacity: 0.5,
              background: "none",
              border: "none",
              color: "inherit",
              padding: "0.25rem",
            }}
          >
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>
      </main>

      <style>{`
        @keyframes portraitIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
