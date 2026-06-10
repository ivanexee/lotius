/**
 * Home — Lotius
 * Design: Smooth scroll-driven experience with seasonal atmospheric transitions
 * - Hero section with auto-rotating finalists in 3D perspective
 * - Spring / Summer / Fall collections with 3D carousels (5 images each)
 * - Seasonal particle effects: sakura petals, fireflies, autumn leaves
 * - Background color transitions to match each season
 * - About Me section with Instagram link
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeasonalParticles from "@/components/SeasonalParticles";

/* ─── Data ─── */
const finalists = [
  {
    id: 1,
    name: "ELARA VOSS",
    brand: "by Elara Voss",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_1-WeiDQC86h9VwSYYn4MZQL4.webp",
  },
  {
    id: 2,
    name: "MARCO DELACROIX",
    brand: "by Marco Delacroix",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_2-ikWiuC6TeVwsBY6cDMSycB.webp",
  },
  {
    id: 3,
    name: "SEREN NAKAMURA",
    brand: "by Seren Nakamura",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_3-bhCK7gbsg9tGBiakXFZzFb.webp",
  },
  {
    id: 4,
    name: "YUI TANAKA",
    brand: "by Yui Tanaka",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_4-gmt7chQWnUAwoEKjADFzcS.webp",
  },
];

const collections = [
  {
    season: "SPRING" as const,
    seasonKey: "spring" as const,
    year: "2026",
    subtitle: "Ephemeral Bloom",
    bgColor: "#fef7f0",
    textColor: "rgba(180, 100, 120, 0.08)",
    subtitleColor: "rgba(180, 100, 120, 0.45)",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_spring_1-ijPg7iU3QnhdEjyMcixuwD.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_spring_2-jxukn5mApUGppWXkTvYsuM.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_spring_3-TnXvW4TzCfV3bPxbbndqcZ.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_spring_4-ayiTF3tAtMPHAtQLv2Tdvy.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_spring_5-b39mxzW8yUpbdN6GTJ4RaS.webp",
    ],
  },
  {
    season: "SUMMER" as const,
    seasonKey: "summer" as const,
    year: "2026",
    subtitle: "Azure Meridian",
    bgColor: "#f0f7fd",
    textColor: "rgba(30, 100, 180, 0.06)",
    subtitleColor: "rgba(30, 100, 180, 0.4)",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_summer_1-44dMeJXFkLUfeJM7U3FCrc.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_summer_2-362jnR6ddyKSU6G5SKpZHr.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_summer_3-gqbVoUg3poLi7cxkaBSW9K.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_summer_4-BaqcLXvXDhvBvJWUiMMsQ8.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_summer_5-eDYW4jyJaDP9BX8NDvUpro.webp",
    ],
  },
  {
    season: "FALL" as const,
    seasonKey: "fall" as const,
    year: "2026",
    subtitle: "Amber Reverie",
    bgColor: "#faf3eb",
    textColor: "rgba(139, 69, 19, 0.06)",
    subtitleColor: "rgba(139, 69, 19, 0.45)",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_1-StcMkgsqPMudxk9GEgzvW4.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_2-egqQEdUWRTBzfrpxJJXWeT.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_3-jVR7xQ3cNPvXZ7ihsrktaM.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_4-JFCnR5peQi9ixh35KnsV6A.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_5-MyWnwoxdz5qJUnLRkhLvu2.webp",
    ],
  },
];

/* ─── Hooks ─── */
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
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin: "100px 0px 100px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── 3D Collection Carousel ─── */
function CollectionCarousel({ collection, index }: { collection: typeof collections[0]; index: number }) {
  const [active, setActive] = useState(0);
  const total = collection.images.length;
  const isEven = index % 2 === 0;
  const { ref: sectionRef, inView } = useInView(0.15);

  // Auto-advance
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [total, inView]);

  return (
    <section
      ref={sectionRef}
      className="collection-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "6rem 0",
        background: collection.bgColor,
        transition: "background 1.2s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      {/* Seasonal particles */}
      <SeasonalParticles season={collection.seasonKey} active={inView} />

      {/* Background text — BEHIND images */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isEven ? "flex-start" : "flex-end",
          pointerEvents: "none",
          zIndex: 1,
          padding: "0 3vw",
        }}
      >
        <span
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontWeight: 400,
            fontSize: "clamp(100px, 22vw, 320px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.85,
            color: collection.textColor,
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          {collection.season}
        </span>
        <span
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontWeight: 400,
            fontSize: "clamp(40px, 8vw, 100px)",
            letterSpacing: "0.1em",
            lineHeight: 1,
            color: collection.textColor,
            whiteSpace: "nowrap",
            userSelect: "none",
            marginTop: "-1rem",
          }}
        >
          {collection.year}
        </span>
      </div>

      {/* 3D Carousel container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "900px",
          height: "clamp(400px, 70vh, 700px)",
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {collection.images.map((img, i) => {
          const offset = i - active;
          // Wrap around for smooth cycling
          const wrappedOffset = offset > total / 2 ? offset - total : offset < -total / 2 ? offset + total : offset;
          const isActive = i === active;
          const translateX = wrappedOffset * 50;
          const translateZ = isActive ? 0 : -150 - Math.abs(wrappedOffset) * 30;
          const rotateY = wrappedOffset * -12;
          const opacity = Math.abs(wrappedOffset) > 2 ? 0 : isActive ? 1 : 0.5 - Math.abs(wrappedOffset) * 0.15;
          const scale = isActive ? 1 : 0.82 - Math.abs(wrappedOffset) * 0.05;

          return (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "clamp(240px, 36vw, 380px)",
                aspectRatio: "3/4",
                transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: Math.max(0, opacity),
                transition: "all 800ms cubic-bezier(0.23, 1, 0.32, 1)",
                cursor: isActive ? "default" : "pointer",
                zIndex: isActive ? 10 : 5 - Math.abs(wrappedOffset),
                boxShadow: isActive ? "0 30px 80px rgba(0,0,0,0.15)" : "0 10px 40px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={img}
                alt={`${collection.season} collection look ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Foreground text — IN FRONT of images, partially visible */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isEven ? "flex-end" : "flex-start",
          pointerEvents: "none",
          zIndex: 6,
          padding: "0 4vw",
        }}
      >
        <span
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontWeight: 400,
            fontSize: "clamp(60px, 14vw, 200px)",
            letterSpacing: "-0.02em",
            lineHeight: 0.85,
            color: collection.textColor,
            whiteSpace: "nowrap",
            userSelect: "none",
            mixBlendMode: "multiply",
          }}
        >
          {collection.season}
        </span>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "clamp(14px, 2vw, 22px)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: collection.subtitleColor,
            marginTop: "0.5rem",
          }}
        >
          {collection.subtitle}
        </span>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 7,
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        {collection.images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View look ${i + 1}`}
            style={{
              width: i === active ? 24 : 6,
              height: 6,
              borderRadius: 3,
              background: i === active ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.12)",
              border: "none",
              transition: "all 400ms cubic-bezier(0.23,1,0.32,1)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Main Component ─── */
export default function Home() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % finalists.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + finalists.length) % finalists.length);
  }, []);

  // Auto-advance hero
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [goNext, isPaused]);

  const finalist = finalists[current];

  return (
    <div className="page-enter" style={{ minHeight: "100vh" }}>
      <Navigation />

      {/* ═══════════════════════════════════════════════════════
          SECTION 1: Hero — Full-screen with rotating finalists
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          background: "#faf8f5",
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
          <span style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(80px, 18vw, 220px)", letterSpacing: "-0.02em", lineHeight: 0.9, color: "rgba(0,0,0,0.05)", whiteSpace: "nowrap", paddingLeft: "2vw", userSelect: "none" }}>
            2026
          </span>
          <span style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(60px, 14vw, 180px)", letterSpacing: "-0.02em", lineHeight: 0.9, color: "rgba(0,0,0,0.05)", whiteSpace: "nowrap", paddingLeft: "2vw", userSelect: "none" }}>
            LOTIUS
          </span>
          <span style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(40px, 9vw, 120px)", letterSpacing: "-0.02em", lineHeight: 0.9, color: "rgba(0,0,0,0.05)", whiteSpace: "nowrap", paddingLeft: "2vw", userSelect: "none" }}>
            AWARD
          </span>
          <span style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(30px, 7vw, 90px)", letterSpacing: "-0.02em", lineHeight: 0.9, color: "rgba(0,0,0,0.05)", whiteSpace: "nowrap", paddingLeft: "2vw", userSelect: "none" }}>
            FINALISTS
          </span>
        </div>

        {/* Portrait cards — 3D perspective */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            perspective: "1000px",
          }}
        >
          {finalists.map((f, i) => {
            const offset = i - current;
            const isActive = i === current;
            const translateX = offset * 55;
            const translateZ = isActive ? 0 : -150;
            const rotateY = offset * -12;
            const opacity = Math.abs(offset) > 1 ? 0.15 : isActive ? 1 : 0.4;
            const scale = isActive ? 1 : 0.78;

            return (
              <div
                key={f.id}
                onClick={() => !isActive && goTo(i)}
                style={{
                  position: "absolute",
                  width: "clamp(200px, 32vw, 380px)",
                  aspectRatio: "3/4",
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  transition: "all 900ms cubic-bezier(0.23, 1, 0.32, 1)",
                  cursor: isActive ? "default" : "pointer",
                  zIndex: isActive ? 10 : 5 - Math.abs(offset),
                  boxShadow: isActive ? "0 40px 100px rgba(0,0,0,0.12)" : "none",
                }}
              >
                <img
                  src={f.image}
                  alt={f.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            );
          })}
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
            padding: "1.5rem 2rem",
            borderTop: "0.5px solid rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button onClick={goPrev} aria-label="Previous finalist" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 10, letterSpacing: "0.3em", opacity: 0.5, background: "none", border: "none", color: "inherit", padding: "0.25rem" }}>←</button>
            <span className="label-caps" style={{ opacity: 0.5 }}>{current + 1} / {finalists.length}</span>
            <button onClick={goNext} aria-label="Next finalist" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 10, letterSpacing: "0.3em", opacity: 0.5, background: "none", border: "none", color: "inherit", padding: "0.25rem" }}>→</button>
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(14px, 2vw, 20px)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
              {finalist.name}
            </p>
            <p className="label-caps" style={{ opacity: 0.5, marginTop: "0.25rem" }}>{finalist.brand}</p>
          </div>

          <button onClick={() => setIsPaused((p) => !p)} aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"} style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.5, background: "none", border: "none", color: "inherit", padding: "0.25rem" }}>
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "5rem", left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.4, animation: "floatDown 2s ease-in-out infinite" }}>
          <span className="label-caps-sm">SCROLL</span>
          <div style={{ width: 1, height: 24, background: "rgba(0,0,0,0.3)" }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: Intro text
          ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: "10rem 0", background: "#fff" }}>
        <RevealSection>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(18px, 3vw, 28px)", letterSpacing: "0.04em", lineHeight: 1.6, color: "rgba(0,0,0,0.8)" }}>
              THE LOTIUS AWARD WAS CREATED TO CELEBRATE AND SUPPORT CREATIVE
              TALENT FROM AROUND THE WORLD. EACH SEASON, WE PRESENT COLLECTIONS
              THAT DEFINE THE FUTURE OF FASHION.
            </p>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3-5: Collection Carousels (Spring, Summer, Fall)
          ═══════════════════════════════════════════════════════ */}
      {collections.map((col, i) => (
        <CollectionCarousel key={col.season} collection={col} index={i} />
      ))}

      {/* ═══════════════════════════════════════════════════════
          SECTION 6: About Me
          ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: "8rem 0", background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
        <RevealSection>
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
            <span className="label-caps" style={{ opacity: 0.4, display: "block", marginBottom: "2rem" }}>
              ABOUT THE DESIGNER
            </span>
            <h2
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 5vw, 52px)",
                letterSpacing: "-0.01em",
                marginBottom: "2rem",
              }}
            >
              The Vision Behind Lotius
            </h2>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: "clamp(16px, 2vw, 20px)",
                lineHeight: 1.8,
                color: "rgba(0,0,0,0.65)",
                marginBottom: "3rem",
              }}
            >
              Lotius is a creative expression born from the intersection of art, fashion,
              and culture. Each collection tells a story — from the delicate bloom of spring
              to the rich warmth of autumn. We believe in the power of design to transform,
              inspire, and connect people across the world.
            </p>

            {/* Instagram link */}
            <a
              href="https://www.instagram.com/i.cxccc?igsh=MTUxYm45amdsdmo3bw%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                fontFamily: "'Bodoni Moda', serif",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.7)",
                textDecoration: "none",
                padding: "1rem 2rem",
                border: "0.5px solid rgba(0,0,0,0.2)",
                transition: "all 300ms cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,0,0,0.9)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(0,0,0,0.7)";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              @i.cxccc
            </a>

            <div style={{ marginTop: "2rem" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 14, color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em" }}>
                Follow for behind-the-scenes, new collections, and creative inspiration.
              </p>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7: CTA / Explore
          ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: "8rem 0", background: "#faf8f5" }}>
        <RevealSection>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(32px, 6vw, 64px)", letterSpacing: "-0.02em", marginBottom: "2rem" }}>
              Explore the Award
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(14px, 1.8vw, 18px)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 3rem", color: "rgba(0,0,0,0.6)" }}>
              Discover the laureates, meet the council, and learn about our
              commitment to nurturing the next generation of fashion visionaries.
            </p>
            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/discover">
                <button className="btn-lotius">DISCOVER THE AWARD →</button>
              </Link>
              <Link href="/laureates">
                <button className="btn-lotius">VIEW LAUREATES →</button>
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>

      <Footer />

      <style>{`
        @keyframes floatDown {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
