/**
 * Home — Lotius
 * Design: Smooth scroll-driven experience with seasonal atmospheric transitions
 * - Hero section with auto-rotating finalists in 3D perspective
 * - Spring / Summer / Fall collections with FLOATING spring-physics 3D carousels
 * - Summer section: animated translucent waves clashing behind the gallery
 * - Seasonal particle effects: sakura petals, fireflies, autumn leaves
 * - Background color transitions to match each season
 * - About Me section with Instagram link
 * - Section IDs for nav scroll-to links
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeasonalParticles from "@/components/SeasonalParticles";
import SummerWaves from "@/components/SummerWaves";

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
    id: "spring",
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
    id: "summer",
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
    id: "fall",
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

/* ─── Spring physics hook ─── */
function useSpringFloat(active: boolean) {
  const [floatY, setFloatY] = useState(0);
  const [floatRot, setFloatRot] = useState(0);
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(frameRef.current);
      return;
    }
    const animate = (t: number) => {
      timeRef.current = t;
      // Gentle sine-based floating — multiple harmonics for organic feel
      const y = Math.sin(t * 0.0008) * 6 + Math.sin(t * 0.0013) * 3;
      const rot = Math.sin(t * 0.0006) * 0.4 + Math.sin(t * 0.001) * 0.2;
      setFloatY(y);
      setFloatRot(rot);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);

  return { floatY, floatRot };
}

/* ─── Floating 3D Collection Carousel ─── */
function CollectionCarousel({ collection, index }: { collection: typeof collections[0]; index: number }) {
  const [active, setActive] = useState(0);
  const total = collection.images.length;
  const isEven = index % 2 === 0;
  const { ref: sectionRef, inView } = useInView(0.15);

  // Spring float animation
  const { floatY, floatRot } = useSpringFloat(inView);

  // Drag state
  const dragRef = useRef<{ startX: number; startActive: number } | null>(null);
  const isDragging = useRef(false);

  // Auto-advance
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(interval);
  }, [total, inView]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startActive: active };
    isDragging.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 8) isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) {
        setActive((prev) => (prev + 1) % total);
      } else {
        setActive((prev) => (prev - 1 + total) % total);
      }
    }
    dragRef.current = null;
  };

  const isSummer = collection.seasonKey === "summer";

  return (
    <section
      id={collection.id}
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
      {/* Summer: animated wave layers behind gallery */}
      {isSummer && <SummerWaves active={inView} />}

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

      {/* ─── FLOATING 3D Carousel container ─── */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "900px",
          height: "clamp(400px, 70vh, 700px)",
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          cursor: "grab",
          userSelect: "none",
          // Apply the spring float to the whole carousel group
          transform: `translateY(${floatY}px) rotate(${floatRot}deg)`,
          transition: "transform 0.1s linear",
        }}
      >
        {collection.images.map((img, i) => {
          const offset = i - active;
          const wrappedOffset = offset > total / 2 ? offset - total : offset < -total / 2 ? offset + total : offset;
          const isActive = i === active;
          const translateX = wrappedOffset * 50;
          const translateZ = isActive ? 0 : -150 - Math.abs(wrappedOffset) * 30;
          const rotateY = wrappedOffset * -12;
          const opacity = Math.abs(wrappedOffset) > 2 ? 0 : isActive ? 1 : 0.5 - Math.abs(wrappedOffset) * 0.15;
          const scale = isActive ? 1 : 0.82 - Math.abs(wrappedOffset) * 0.05;

          // Each card also gets a subtle individual float offset for organic feel
          const cardFloatOffset = Math.sin(Date.now() * 0.001 + i * 1.2) * 4;

          return (
            <div
              key={i}
              onClick={() => { if (!isDragging.current) setActive(i); }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "clamp(240px, 36vw, 380px)",
                aspectRatio: "3/4",
                transform: `translate(-50%, calc(-50% + ${isActive ? 0 : cardFloatOffset}px)) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: Math.max(0, opacity),
                transition: "transform 800ms cubic-bezier(0.23, 1, 0.32, 1), opacity 800ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 400ms",
                cursor: isActive ? "grab" : "pointer",
                zIndex: isActive ? 10 : 5 - Math.abs(wrappedOffset),
                boxShadow: isActive
                  ? "0 40px 100px rgba(0,0,0,0.18), 0 8px 30px rgba(0,0,0,0.10)"
                  : "0 10px 40px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={img}
                alt={`${collection.season} collection look ${i + 1}`}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: "none",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Foreground text — IN FRONT of images */}
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

  // Hero float
  const { floatY: heroFloatY } = useSpringFloat(true);

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
          {["2026", "LOTIUS", "AWARD", "FINALISTS"].map((word, i) => (
            <span
              key={word}
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: i === 0 ? "clamp(80px, 18vw, 220px)" : "clamp(60px, 14vw, 180px)",
                letterSpacing: "-0.02em",
                lineHeight: 0.9,
                color: "rgba(0,0,0,0.05)",
                whiteSpace: "nowrap",
                paddingLeft: "2vw",
                userSelect: "none",
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Portrait carousel — floating */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            perspective: "1000px",
            transform: `translateY(${heroFloatY * 0.5}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          {finalists.map((f, i) => {
            const offset = i - current;
            const wrapped = offset > finalists.length / 2 ? offset - finalists.length : offset < -finalists.length / 2 ? offset + finalists.length : offset;
            const isActive = i === current;
            return (
              <div
                key={f.id}
                onClick={() => { if (!isActive) setCurrent(i); }}
                style={{
                  position: "absolute",
                  width: "clamp(220px, 32vw, 360px)",
                  aspectRatio: "3/4",
                  transform: `translateX(${wrapped * 48}%) translateZ(${isActive ? 0 : -120 - Math.abs(wrapped) * 40}px) rotateY(${wrapped * -10}deg) scale(${isActive ? 1 : 0.8 - Math.abs(wrapped) * 0.06})`,
                  opacity: Math.abs(wrapped) > 2 ? 0 : isActive ? 1 : 0.45 - Math.abs(wrapped) * 0.1,
                  transition: "all 900ms cubic-bezier(0.23, 1, 0.32, 1)",
                  zIndex: isActive ? 10 : 5 - Math.abs(wrapped),
                  boxShadow: isActive ? "0 40px 100px rgba(0,0,0,0.15)" : "0 8px 30px rgba(0,0,0,0.06)",
                  cursor: isActive ? "default" : "pointer",
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

        {/* Finalist label */}
        <div
          style={{
            position: "absolute",
            bottom: "8rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 4,
            textAlign: "center",
          }}
        >
          <p
            key={finalist.name}
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(14px, 2vw, 20px)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              animation: "fadeUp 500ms cubic-bezier(0.23,1,0.32,1) both",
            }}
          >
            {finalist.name}
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(11px, 1.4vw, 14px)",
              letterSpacing: "0.15em",
              opacity: 0.5,
              marginTop: "0.25rem",
            }}
          >
            {finalist.brand}
          </p>
        </div>

        {/* Controls */}
        <div
          style={{
            position: "absolute",
            bottom: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <button onClick={goPrev} aria-label="Previous finalist" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 11, letterSpacing: "0.2em", opacity: 0.45, background: "none", border: "none", color: "inherit", padding: "0.25rem" }}>←</button>
          <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 9, letterSpacing: "0.35em", opacity: 0.35 }}>
            {current + 1} / {finalists.length}
          </span>
          <button onClick={goNext} aria-label="Next finalist" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 11, letterSpacing: "0.2em", opacity: 0.45, background: "none", border: "none", color: "inherit", padding: "0.25rem" }}>→</button>
          <button onClick={() => setIsPaused((p) => !p)} aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"} style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.5, background: "none", border: "none", color: "inherit", padding: "0.25rem" }}>
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.4, animation: "floatDown 2s ease-in-out infinite" }}>
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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
