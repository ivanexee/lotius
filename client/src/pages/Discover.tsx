/**
 * Discover — Lotius
 * Design: Mission statement, awards breakdown, timeline, mentorship
 * Generous whitespace, hairline dividers, scroll-reveal animations
 */
import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const awards = [
  {
    title: "THE LOTIUS AWARD",
    description:
      "The winner of the Lotius Award receives a €400,000 endowment and is mentored for one year by a team of Lotius experts across sustainable development, communication, legal, marketing, and finance.",
  },
  {
    title: "THE CRAFT PRIZE",
    description:
      "Created in 2022, the Craft Prize honours excellence in craftsmanship and technical innovation at the service of creativity. The winner receives a €200,000 allocation and a one-year mentorship.",
  },
  {
    title: "THE INNOVATION PRIZE",
    description:
      "Launched in 2024, the Innovation Prize rewards pioneering approaches to materials, process, and sustainability. The winner receives a €200,000 allocation and a one-year mentorship.",
  },
  {
    title: "THE GRADUATE AWARD",
    description:
      "The Lotius Award also distinguishes three young fashion school graduates. Each winner, along with their school, receives €10,000 and joins the design studio of a partner house for one year.",
  },
];

const timeline = [
  {
    step: "SELECTION",
    desc: "Each year, 20 semi-finalists are selected from online applications submitted by designers worldwide.",
  },
  {
    step: "SEMI-FINAL",
    desc: "During the semi-final, Mentors and Experts from the world of fashion choose the finalists.",
  },
  {
    step: "FINAL",
    desc: "During the final ceremony, Council members deliberate and select the award winners.",
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
              THE LOTIUS AWARD WAS CREATED IN 2013 TO CELEBRATE AND SUPPORT
              CREATIVE TALENT FROM AROUND THE WORLD. THIS COMPETITION IS OPEN
              TO ALL DESIGNERS AGED 18 TO 40 WHO HAVE CREATED AT LEAST TWO
              READY-TO-WEAR COLLECTIONS.
            </p>
          </RevealSection>
        </section>

        <hr className="hairline" style={{ maxWidth: 1440, margin: "0 auto" }} />

        {/* Awards section */}
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
              The Awards
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
              <RevealSection key={award.title} delay={i * 80}>
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
                fontSize: "clamp(32px, 5vw, 64px)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "3rem",
              }}
            >
              The Timeline
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

        {/* Supporting young talent */}
        <section
          style={{
            padding: "5rem 1.5rem",
            maxWidth: 1440,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
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
                  fontSize: "clamp(28px, 4vw, 52px)",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  lineHeight: 1.1,
                }}
              >
                Supporting Young Talent
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
                Driven by a passion for creativity, Lotius launched its award in 2013.
                This patronage embodies our commitment to today's young designers —
                the talents of tomorrow. Through financial support, mentorship, and
                access to our global network, we empower the next generation of
                fashion visionaries.
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
                alt="Finalist portrait"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }}
              />
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_3-bhCK7gbsg9tGBiakXFZzFb.webp"
                alt="Finalist portrait"
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
