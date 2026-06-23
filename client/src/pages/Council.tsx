/**
 * Council — Work in Progress
 * Replace placeholder sections with real content when ready.
 */
import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTheme } from "@/contexts/ThemeContext";

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

const WIPBlock = ({ label, note, tall, isDark }: { label: string; note?: string; tall?: boolean; isDark?: boolean }) => (
  <div
    style={{
      border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)"}`,
      borderRadius: 4,
      padding: tall
        ? "clamp(4rem, 10vw, 7rem) clamp(1.5rem, 4vw, 3rem)"
        : "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)",
      textAlign: "center",
      background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)",
      transition: "background 450ms cubic-bezier(0.23,1,0.32,1), border-color 450ms cubic-bezier(0.23,1,0.32,1)",
    }}
  >
    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(11px, 1.4vw, 13px)", letterSpacing: "0.18em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", marginBottom: note ? "0.5rem" : 0, transition: "color 450ms cubic-bezier(0.23,1,0.32,1)" }}>
      ✦ {label} ✦
    </p>
    {note && (
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(12px, 1.5vw, 14px)", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.22)", letterSpacing: "0.06em", fontStyle: "italic", transition: "color 450ms cubic-bezier(0.23,1,0.32,1)" }}>
        {note}
      </p>
    )}
  </div>
);

export default function Council() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div data-page="inner" style={{ minHeight: "100vh", background: isDark ? "oklch(0.09 0 0)" : "#fafaf8", color: isDark ? "oklch(0.92 0 0)" : "#111", transition: "background 450ms cubic-bezier(0.23,1,0.32,1), color 450ms cubic-bezier(0.23,1,0.32,1)" }}>
      <Navigation />

      {/* Page Header */}
      <section style={{ paddingTop: "clamp(7rem, 14vw, 12rem)", paddingBottom: "clamp(3rem, 6vw, 5rem)", paddingLeft: "clamp(1.5rem, 6vw, 8rem)", paddingRight: "clamp(1.5rem, 6vw, 8rem)", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`, transition: "border-color 450ms cubic-bezier(0.23,1,0.32,1)" }}>
        <RevealSection>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(10px, 1.2vw, 12px)", letterSpacing: "0.22em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginBottom: "1.5rem", transition: "color 450ms cubic-bezier(0.23,1,0.32,1)" }}>
            Lotius — Council
          </p>
          <h1 style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(40px, 8vw, 100px)", letterSpacing: "-0.02em", lineHeight: 0.95 }}>
            Council
          </h1>
        </RevealSection>
      </section>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 6vw, 8rem)" }}>

        {/* Intro */}
        <RevealSection>
          <WIPBlock
            label="Add prompt here"
            note="Council intro — who they are, their role in the selection process — work in progress"
            isDark={isDark}
          />
        </RevealSection>

        <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", margin: "clamp(3rem, 6vw, 5rem) 0", transition: "background 450ms cubic-bezier(0.23,1,0.32,1)" }} />

        {/* Member grid */}
        <RevealSection delay={100}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
              gap: "2rem",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <WIPBlock
                key={i}
                label={`Member ${i + 1} — Add prompt here`}
                note="Portrait, name, title, bio — work in progress"
                tall
                isDark={isDark}
              />
            ))}
          </div>
        </RevealSection>

      </main>

      <Footer />
    </div>
  );
}
