/**
 * Discover — Work in Progress
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
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
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
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const WIPBlock = ({ label, note, isDark }: { label: string; note?: string; isDark?: boolean }) => (
  <div
    style={{
      border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)"}`,
      borderRadius: 4,
      padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)",
      textAlign: "center",
      background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)",
      transition: "background 450ms cubic-bezier(0.23,1,0.32,1), border-color 450ms cubic-bezier(0.23,1,0.32,1)",
    }}
  >
    <p
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 400,
        fontSize: "clamp(11px, 1.4vw, 13px)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
        marginBottom: note ? "0.5rem" : 0,
        transition: "color 450ms cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      ✦ {label} ✦
    </p>
    {note && (
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(12px, 1.5vw, 14px)",
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.22)",
          letterSpacing: "0.06em",
          fontStyle: "italic",
          transition: "color 450ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        {note}
      </p>
    )}
  </div>
);

const SectionDivider = ({ isDark }: { isDark?: boolean }) => (
  <div style={{ width: "100%", height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", margin: "clamp(3rem, 6vw, 5rem) 0", transition: "background 450ms cubic-bezier(0.23,1,0.32,1)" }} />
);

export default function Discover() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div data-page="inner" style={{ minHeight: "100vh", background: isDark ? "oklch(0.09 0 0)" : "#fafaf8", color: isDark ? "oklch(0.92 0 0)" : "#111", transition: "background 450ms cubic-bezier(0.23,1,0.32,1), color 450ms cubic-bezier(0.23,1,0.32,1)" }}>
      <Navigation />

      {/* Page Header */}
      <section
        style={{
          paddingTop: "clamp(7rem, 14vw, 12rem)",
          paddingBottom: "clamp(3rem, 6vw, 5rem)",
          paddingLeft: "clamp(1.5rem, 6vw, 8rem)",
          paddingRight: "clamp(1.5rem, 6vw, 8rem)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
          transition: "border-color 450ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <RevealSection>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: "clamp(10px, 1.2vw, 12px)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
              marginBottom: "1.5rem",
              transition: "color 450ms cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            Lotius — Discover
          </p>
          <h1
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(40px, 8vw, 100px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              maxWidth: "14ch",
            }}
          >
            Discover
          </h1>
        </RevealSection>
      </section>

      {/* Main Content */}
      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 6vw, 8rem)",
        }}
      >

        {/* Mission / Intro */}
        <RevealSection>
          <h2
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(24px, 4vw, 48px)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}
          >
            Our Story
          </h2>
          <WIPBlock
            label="Add prompt here"
            note="Mission statement, brand origin, creative philosophy — work in progress"
            isDark={isDark}
          />
        </RevealSection>

        <SectionDivider isDark={isDark} />

        {/* Materials / Awards */}
        <RevealSection delay={100}>
          <h2
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(24px, 4vw, 48px)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}
          >
            Materials &amp; Fabrics
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "1.5rem",
            }}
          >
            {["Fabric 01", "Fabric 02", "Fabric 03", "Fabric 04"].map((label) => (
              <WIPBlock
                key={label}
                label={`${label} — Add prompt here`}
                note="Fabric name, sourcing, texture description"
                isDark={isDark}
              />
            ))}
          </div>
        </RevealSection>

        <SectionDivider isDark={isDark} />

        {/* Timeline */}
        <RevealSection delay={100}>
          <h2
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(24px, 4vw, 48px)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}
          >
            The Journey
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {["Chapter 01", "Chapter 02", "Chapter 03"].map((step, i) => (
              <WIPBlock
                key={step}
                label={`${step} — Add prompt here`}
                note={`Timeline milestone ${i + 1} — date, event, description`}
                isDark={isDark}
              />
            ))}
          </div>
        </RevealSection>

        <SectionDivider isDark={isDark} />

        {/* Team / People */}
        <RevealSection delay={100}>
          <h2
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(24px, 4vw, 48px)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}
          >
            The People
          </h2>
          <WIPBlock
            label="Add prompt here"
            note="Team portraits, collaborators, modeling credits — work in progress"
            isDark={isDark}
          />
        </RevealSection>

        <SectionDivider isDark={isDark} />

        {/* CTA */}
        <RevealSection delay={100}>
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 5vw, 60px)",
                letterSpacing: "-0.02em",
                marginBottom: "1.5rem",
              }}
            >
              Empower the confidence
            </h2>
            <WIPBlock
              label="Add prompt here"
              note="CTA copy, call-to-action description — work in progress"
              isDark={isDark}
            />
          </div>
        </RevealSection>

      </main>

      <Footer />
    </div>
  );
}
