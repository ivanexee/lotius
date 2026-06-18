/**
 * Laureates — Work in Progress
 * Replace placeholder sections with real content when ready.
 */
import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useScrollReveal();
  return <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const WIPBlock = ({ label, note, tall }: { label: string; note?: string; tall?: boolean }) => (
  <div
    style={{
      border: "1px dashed rgba(0,0,0,0.18)",
      borderRadius: 4,
      padding: tall
        ? "clamp(4rem, 10vw, 7rem) clamp(1.5rem, 4vw, 3rem)"
        : "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)",
      textAlign: "center",
      background: "rgba(0,0,0,0.015)",
    }}
  >
    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(11px, 1.4vw, 13px)", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: note ? "0.5rem" : 0 }}>
      ✦ {label} ✦
    </p>
    {note && (
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(12px, 1.5vw, 14px)", color: "rgba(0,0,0,0.22)", letterSpacing: "0.06em", fontStyle: "italic" }}>
        {note}
      </p>
    )}
  </div>
);

const years = ["2026", "2025", "2024", "2023"];

export default function Laureates() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", color: "#111" }}>
      <Navigation />

      {/* Page Header */}
      <section style={{ paddingTop: "clamp(7rem, 14vw, 12rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)", paddingLeft: "clamp(1.5rem, 6vw, 8rem)", paddingRight: "clamp(1.5rem, 6vw, 8rem)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <RevealSection>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(10px, 1.2vw, 12px)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "1.5rem" }}>
            Lotius — Laureates
          </p>
          <h1 style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(40px, 8vw, 100px)", letterSpacing: "-0.02em", lineHeight: 0.95 }}>
            Laureates
          </h1>
        </RevealSection>
      </section>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 6vw, 8rem)" }}>

        {/* Year filter */}
        <RevealSection>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            {years.map((yr) => (
              <div
                key={yr}
                style={{
                  border: "1px dashed rgba(0,0,0,0.2)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: 2,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(11px, 1.4vw, 13px)",
                  letterSpacing: "0.14em",
                  color: "rgba(0,0,0,0.3)",
                  textTransform: "uppercase",
                }}
              >
                {yr} — Add prompt here
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Portrait grid */}
        <RevealSection delay={100}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <WIPBlock
                key={i}
                label={`Laureate ${i + 1} — Add prompt here`}
                note="Name, brand, award category, year"
                tall
              />
            ))}
          </div>
        </RevealSection>

        {/* Detail panel */}
        <RevealSection delay={150}>
          <div style={{ height: 1, background: "rgba(0,0,0,0.08)", margin: "clamp(2rem, 4vw, 3rem) 0" }} />
          <WIPBlock
            label="Detail panel — Add prompt here"
            note="Selected laureate portrait, bio, collection images, award details — work in progress"
            tall
          />
        </RevealSection>

      </main>

      <Footer />
    </div>
  );
}
