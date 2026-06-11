/**
 * Discover — Lotius
 * Design: Mission statement, materials breakdown, timeline, team section
 * Generous whitespace, hairline dividers, scroll-reveal animations
 */
import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const awards = [
  {
    title: "fabric title",
    description: "Material #1",
  },
  {
    title: "add something here",
    description: "add text here as well",
  },
  {
    title: "something here",
    description: "add text here as well",
  },
  {
    title: "display",
    description: "display",
  },
];

const timeline = [
  {
    step: "SELECTION",
    desc: "describing our way to making this happen",
  },
  {
    step: "SEMI-FINAL",
    desc: "more explaining",
  },
  {
    step: "FINAL",
    desc: "how it became a reality",
  },
];

function useReveal() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Discover() {
  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigation />

      <main style={{ paddingTop: "6rem", flex: 1 }}>
        {/* Mission statement */}
        <section style={{ padding: "4rem 1.5rem 5rem", maxWidth: 1440, margin: "0 auto" }}>
          <RevealSection>
            <p
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: "clamp(14px, 2.2vw, 22px)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: 1.7,
                textAlign: "center",
                maxWidth: 800,
                margin: "0 auto",
                color: "oklch(0.08 0 0)",
              }}
            >
              Fabrics? about me?
            </p>
          </RevealSection>
        </section>

        <hr className="hairline" style={{ maxWidth: 1440, margin: "0 auto" }} />

        {/* Materials section */}
        <section style={{ padding: "5rem 1.5rem", maxWidth: 1440, margin: "0 auto" }}>
          <RevealSection>
            <h2
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 5vw, 64px)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "3rem",
              }}
            >
              Here will list out the materials
            </h2>
          </RevealSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "3rem 4rem",
            }}
          >
            {awards.map((award, i) => (
              <RevealSection key={award.title + i} delay={i * 80}>
                <div>
                  <h3
                    className="label-caps"
                    style={{ marginBottom: "1rem", color: "oklch(0.08 0 0)" }}
                  >
                    {award.title}
                  </h3>
                  <hr className="hairline" style={{ marginBottom: "1rem" }} />
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 300,
                      fontSize: "clamp(15px, 1.5vw, 18px)",
                      lineHeight: 1.8,
                      color: "oklch(0.25 0 0)",
                    }}
                  >
                    {award.description}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* Atelier image */}
        <section style={{ maxWidth: 1440, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
          <RevealSection>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_discover_bg-aGbSVCsTC9dnMVgwdk2xUE.webp"
                alt="Luxury fashion atelier interior"
                style={{
                  width: "100%",
                  height: "clamp(300px, 45vw, 600px)",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "2rem",
                  left: "2rem",
                }}
              >
                <span
                  className="label-caps"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    background: "rgba(0,0,0,0.3)",
                    padding: "0.4rem 0.8rem",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  The Lotius Atelier, Paris
                </span>
              </div>
            </div>
          </RevealSection>
        </section>

        <hr className="hairline" style={{ maxWidth: 1440, margin: "0 auto" }} />

        {/* Timeline */}
        <section style={{ padding: "5rem 1.5rem", maxWidth: 1440, margin: "0 auto" }}>
          <RevealSection>
            <h2
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: "15px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "3rem",
              }}
            >
              Here will add a timeline section explaining the journey
            </h2>
          </RevealSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            {timeline.map((item, i) => (
              <RevealSection key={item.step} delay={i * 100}>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <span
                    style={{
                      fontFamily: "'Bodoni Moda', serif",
                      fontWeight: 400,
                      fontSize: "clamp(40px, 6vw, 72px)",
                      lineHeight: 1,
                      color: "oklch(0.08 0 0 / 0.08)",
                      minWidth: "2ch",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="label-caps" style={{ marginBottom: "0.75rem" }}>
                      {item.step}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300,
                        fontSize: "clamp(15px, 1.5vw, 18px)",
                        lineHeight: 1.8,
                        color: "oklch(0.25 0 0)",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        <hr className="hairline" style={{ maxWidth: 1440, margin: "0 auto" }} />

        {/* Team / modeling section */}
        <section
          style={{
            padding: "5rem 1.5rem",
            maxWidth: 1440,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          <RevealSection>
            <div>
              <h2
                style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  lineHeight: 1.1,
                }}
              >
                i was thinking here will add the people modeling or just myself along with coworkers
              </h2>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(16px, 1.6vw, 20px)",
                  lineHeight: 1.9,
                  color: "oklch(0.25 0 0)",
                  marginBottom: "2rem",
                }}
              >
                describing ourselves and our inspo
              </p>
              <a href="/laureates" className="btn-lotius">
                DISCOVER LAUREATES →
              </a>
            </div>
          </RevealSection>

          <RevealSection delay={150}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_1-WeiDQC86h9VwSYYn4MZQL4.webp"
                alt="Portrait"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }}
              />
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_3-bhCK7gbsg9tGBiakXFZzFb.webp"
                alt="Portrait"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", marginTop: "2rem" }}
              />
            </div>
          </RevealSection>
        </section>

        {/* Mentorship */}
        <section
          style={{
            background: "oklch(0.08 0 0)",
            color: "#fff",
            padding: "5rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: 1440, margin: "0 auto" }}>
            <RevealSection>
              <h2
                style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: 400,
                  fontSize: "clamp(32px, 5vw, 64px)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "2rem",
                  color: "#fff",
                }}
              >
                The Mentorship
              </h2>
            </RevealSection>
            <RevealSection delay={100}>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(16px, 1.8vw, 22px)",
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,0.75)",
                  maxWidth: 720,
                }}
              >
                The winners of the Lotius Award, the Craft Prize, and the Innovation Prize
                enjoy a one-year mentorship programme. Lotius experts mentor the winners
                across sustainable development, communication, copyright and corporate
                legal aspects, as well as marketing and finance — preparing them to build
                enduring, globally relevant brands.
              </p>
            </RevealSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
