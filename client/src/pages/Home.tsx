import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeasonalParticles from "@/components/SeasonalParticles";
import OceanWaves from "@/components/OceanWaves";

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
    bgColor: "#e8f6fd",
    textColor: "rgba(0, 130, 200, 0.07)",
    subtitleColor: "rgba(0, 130, 200, 0.4)",
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
    textColor: "rgba(139, 69, 19, 0.07)",
    subtitleColor: "rgba(139, 69, 19, 0.45)",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_1-StcMkgsqPMudxk9GEgzvW4.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_2-egqQEdUWRTBzfrpxJJXWeT.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_3-jVR7xQ3cNPvXZ7ihsrktaM.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_4-JFCnR5peQi9ixh35KnsV6A.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_5-MyWnwoxdz5qJUnLRkhLvu2.webp",
    ],
  },
  {
    id: "winter",
    season: "WINTER" as const,
    seasonKey: "winter" as const,
    year: "2026",
    subtitle: "Glacial Reverie",
    bgColor: "#eef4f9",
    textColor: "rgba(30, 80, 140, 0.07)",
    subtitleColor: "rgba(30, 80, 140, 0.38)",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_winter_1-6cpR3iXpsKszZBtME2X8dm.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_winter_2-a2zdPfRriymjXs7CmKWCDy.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_winter_3-KMtbqHEBfjp6eHc4GxBGye.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_winter_4-45CkQY9spakyGkpczjxUn7.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_winter_5-VMYxYADbqyW2bTDwMBwtqc.webp",
    ],
  },
];

/* ─── Hooks ─── */
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
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useScrollReveal();
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

function useOrganicFloat(active: boolean) {
  const [floatY, setFloatY] = useState(0);
  const [floatRot, setFloatRot] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(frameRef.current);
      return;
    }
    const tick = (t: number) => {
      const y = Math.sin(t * 0.0008) * 6 + Math.sin(t * 0.0013) * 3;
      const rot = Math.sin(t * 0.0006) * 0.4 + Math.sin(t * 0.001) * 0.2;
      setFloatY(y);
      setFloatRot(rot);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);

  return { floatY, floatRot };
}

/* ─── Card with Shop the Look hover ─── */
function CollectionCard({
  img,
  season,
  index,
  active,
  total,
  onClick,
  isDragging,
  floatY,
}: {
  img: string;
  season: string;
  index: number;
  active: number;
  total: number;
  onClick: () => void;
  isDragging: React.MutableRefObject<boolean>;
  floatY: number;
}) {
  const [hovered, setHovered] = useState(false);
  const offset = index - active;
  const wrappedOffset = offset > total / 2 ? offset - total : offset < -total / 2 ? offset + total : offset;
  const isActive = index === active;
  const translateX = wrappedOffset * 50;
  const translateZ = isActive ? 0 : -150 - Math.abs(wrappedOffset) * 30;
  const rotateY = wrappedOffset * -12;
  const opacity = Math.abs(wrappedOffset) > 2 ? 0 : isActive ? 1 : 0.5 - Math.abs(wrappedOffset) * 0.15;
  const scale = isActive ? 1 : 0.82 - Math.abs(wrappedOffset) * 0.05;
  const cardFloat = isActive ? 0 : Math.sin(Date.now() * 0.001 + index * 1.2) * 4;

  return (
    <div
      onClick={() => { if (!isDragging.current) onClick(); }}
      onMouseEnter={() => isActive && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "clamp(240px, 36vw, 380px)",
        aspectRatio: "3/4",
        transform: `translate(-50%, calc(-50% + ${isActive ? floatY : cardFloat}px)) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity: Math.max(0, opacity),
        transition: "transform 800ms cubic-bezier(0.23, 1, 0.32, 1), opacity 800ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 400ms",
        cursor: isActive ? "grab" : "pointer",
        zIndex: isActive ? 10 : 5 - Math.abs(wrappedOffset),
        boxShadow: isActive
          ? "0 40px 100px rgba(0,0,0,0.18), 0 8px 30px rgba(0,0,0,0.10)"
          : "0 10px 40px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <img
        src={img}
        alt={`${season} collection look ${index + 1}`}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          pointerEvents: "none",
          transition: "transform 600ms cubic-bezier(0.23, 1, 0.32, 1)",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      />

      {/* Shop the Look overlay — fades in on hover of active card */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "2rem",
            background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 350ms cubic-bezier(0.23, 1, 0.32, 1)",
            pointerEvents: hovered ? "auto" : "none",
          }}
        >
          <a
            href={`mailto:i.cxc@icloud.com?subject=Shop the Look — ${season} 2026 Look ${index + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-block",
              fontFamily: "'Bodoni Moda', serif",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#fff",
              textDecoration: "none",
              padding: "0.75rem 1.75rem",
              border: "0.5px solid rgba(255,255,255,0.7)",
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)",
              transition: "all 250ms cubic-bezier(0.23, 1, 0.32, 1)",
              transform: hovered ? "translateY(0)" : "translateY(8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.95)";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.35)";
              e.currentTarget.style.color = "#fff";
            }}
          >
            SHOP THE LOOK
          </a>
        </div>
      )}
    </div>
  );
}

/* ─── Floating 3D Collection Carousel ─── */
function CollectionCarousel({ collection, index }: { collection: typeof collections[0]; index: number }) {
  const [active, setActive] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const total = collection.images.length;
  const isEven = index % 2 === 0;
  const { ref: sectionRef, inView } = useInView(0.15);
  const { floatY, floatRot } = useOrganicFloat(inView);

  const dragRef = useRef<{ startX: number } | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(interval);
  }, [total, inView]);

  // Track scroll progress for Summer section sunray intensity
  useEffect(() => {
    if (!sectionRef.current) return;
    const handleScroll = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Calculate progress: 0 at top, 1 at center, 0 at bottom
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      const maxDistance = window.innerHeight / 2 + rect.height / 2;
      const progress = Math.max(0, 1 - distance / maxDistance);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX };
    isDragging.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    if (Math.abs(e.clientX - dragRef.current.startX) > 8) isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 40) {
      setActive((prev) => dx < 0 ? (prev + 1) % total : (prev - 1 + total) % total);
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
      {isSummer && <OceanWaves active={inView} scrollProgress={scrollProgress} />}
      <SeasonalParticles season={collection.seasonKey} active={inView} />

      {/* Background text — behind images */}
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

      {/* Floating 3D Carousel */}
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
          transform: `translateY(${floatY}px) rotate(${floatRot}deg)`,
          transition: "transform 0.1s linear",
        }}
      >
        {collection.images.map((img, i) => (
          <CollectionCard
            key={i}
            img={img}
            season={collection.season}
            index={i}
            active={active}
            total={total}
            onClick={() => setActive(i)}
            isDragging={isDragging}
            floatY={floatY}
          />
        ))}
      </div>

      {/* Foreground text — in front of images */}
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

  // Cursor spotlight state
  const [spotlight, setSpotlight] = useState({ x: -9999, y: -9999, visible: false });
  const heroRef = useRef<HTMLElement>(null);

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    setSpotlight((s) => ({ ...s, visible: false }));
  }, []);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % finalists.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + finalists.length) % finalists.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [goNext, isPaused]);

  const { floatY: heroFloatY } = useOrganicFloat(true);
  const finalist = finalists[current];

  return (
    <div className="page-enter" style={{ minHeight: "100vh" }}>
      <Navigation />

      {/* Hero */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          background: "#080808",
          cursor: "none",
        }}
      >
        {/* Cursor spotlight */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            pointerEvents: "none",
            zIndex: 20,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {/* Radial glow that follows cursor */}
          <div
            style={{
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 35%, transparent 70%)",
              transform: `translate(${spotlight.x - 260}px, ${spotlight.y - 260}px)`,
              opacity: spotlight.visible ? 1 : 0,
              transition: "opacity 400ms cubic-bezier(0.23,1,0.32,1), transform 80ms linear",
              pointerEvents: "none",
            }}
          />
          {/* Inner tight glow */}
          <div
            style={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
              transform: `translate(${spotlight.x - 60}px, ${spotlight.y - 60}px)`,
              opacity: spotlight.visible ? 1 : 0,
              transition: "opacity 300ms cubic-bezier(0.23,1,0.32,1), transform 50ms linear",
              pointerEvents: "none",
            }}
          />
          {/* Custom cursor dot */}
          <div
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.7)",
              transform: `translate(${spotlight.x - 3}px, ${spotlight.y - 3}px)`,
              opacity: spotlight.visible ? 1 : 0,
              transition: "opacity 200ms, transform 30ms linear",
              pointerEvents: "none",
            }}
          />
          {/* Cursor ring */}
          <div
            style={{
              position: "absolute",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "0.5px solid rgba(255,255,255,0.25)",
              transform: `translate(${spotlight.x - 16}px, ${spotlight.y - 16}px)`,
              opacity: spotlight.visible ? 1 : 0,
              transition: "opacity 200ms, transform 90ms cubic-bezier(0.23,1,0.32,1)",
              pointerEvents: "none",
            }}
          />
        </div>
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
          {["LOTIUS", "COLLECTIONS", "2026", "SOON"].map((word, i) => (
            <span
              key={word}
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: i === 0 ? "clamp(80px, 18vw, 220px)" : "clamp(60px, 14vw, 180px)",
                letterSpacing: "-0.02em",
                lineHeight: 0.9,
                color: "rgba(255,255,255,0.06)",
                whiteSpace: "nowrap",
                paddingLeft: "2vw",
                userSelect: "none",
              }}
            >
              {word}
            </span>
          ))}
        </div>

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

        <div
          style={{
            position: "absolute",
          bottom: "8rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
          textAlign: "center",
          mixBlendMode: "normal" as const,
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
          <button onClick={goPrev} aria-label="Previous" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 11, letterSpacing: "0.2em", opacity: 0.45, background: "none", border: "none", color: "inherit", padding: "0.25rem" }}>←</button>
          <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 9, letterSpacing: "0.35em", opacity: 0.35 }}>
            {current + 1} / {finalists.length}
          </span>
          <button onClick={goNext} aria-label="Next" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 11, letterSpacing: "0.2em", opacity: 0.45, background: "none", border: "none", color: "inherit", padding: "0.25rem" }}>→</button>
          <button onClick={() => setIsPaused((p) => !p)} aria-label={isPaused ? "Resume" : "Pause"} style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.5, background: "none", border: "none", color: "inherit", padding: "0.25rem" }}>
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>

        <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.4, animation: "floatDown 2s ease-in-out infinite" }}>
          <span className="label-caps-sm" style={{ color: "rgba(255,255,255,0.5)" }}>SCROLL</span>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.3)" }} />
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding: "10rem 0", background: "#0d0d0d" }}>
        <RevealSection>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(18px, 3vw, 28px)", letterSpacing: "0.04em", lineHeight: 1.6, color: "rgba(255,255,255,0.75)" }}>
              Add inspiration and idea planning here- later.
            </p>
          </div>
        </RevealSection>
      </section>

      {/* Collection Carousels */}
      {collections.map((col, i) => (
        <CollectionCarousel key={col.season} collection={col} index={i} />
      ))}

      {/* About Me */}
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
                            creativity behind it, clothing inspo, etc.
            </p>

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

      {/* CTA */}
      <section style={{ padding: "8rem 0", background: "#faf8f5" }}>
        <RevealSection>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: "clamp(32px, 6vw, 64px)", letterSpacing: "-0.02em", marginBottom: "2rem" }}>
              Empower the confidence
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(14px, 1.8vw, 18px)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 3rem", color: "rgba(0,0,0,0.6)" }}>
              Discover the laureates, meet the council, and learn about our
              commitment to nurturing the next generation of fashion visionaries.
            </p>
            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/discover">
                <button className="btn-lotius">Discover your taste→</button>
              </Link>
              <Link href="/laureates">
                <button className="btn-lotius-ghost">VIEW LAUREATES →</button>
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>

      <Footer />
    </div>
  );
}
