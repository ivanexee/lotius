/**
 * Laureates — Lotius
 * Design: Year filter tabs, portrait grid, expandable winner detail panel
 * Mirrors LVMH Prize Winners page structure
 */
import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const years = ["ALL", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019"];

const laureates = [
  {
    id: 1,
    year: "2026",
    name: "ELARA VOSS",
    brand: "Elara Voss Studio",
    prize: "LOTIUS AWARD",
    nationality: "German",
    bio: "Elara Voss founded her Berlin-based label in 2021 after graduating from Central Saint Martins. Her work explores the tension between industrial manufacturing and artisanal craft, producing garments that feel simultaneously mass-produced and deeply personal. Her 2026 collection, 'Residue,' was praised for its radical approach to deadstock materials.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_1-WeiDQC86h9VwSYYn4MZQL4.webp",
  },
  {
    id: 2,
    year: "2026",
    name: "MARCO DELACROIX",
    brand: "Delacroix",
    prize: "CRAFT PRIZE",
    nationality: "French-Brazilian",
    bio: "Marco Delacroix trained under master tailors in Naples before establishing his Paris atelier. His label is known for its obsessive attention to construction — each garment is a study in the relationship between the body and the cloth that surrounds it. His 2026 collection challenged the very notion of a finished garment.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_2-ikWiuC6TeVwsBY6cDMSycB.webp",
  },
  {
    id: 3,
    year: "2026",
    name: "SEREN NAKAMURA",
    brand: "Seren",
    prize: "INNOVATION PRIZE",
    nationality: "Japanese-Welsh",
    bio: "Seren Nakamura's practice sits at the intersection of fashion, architecture, and material science. Her Tokyo studio develops proprietary fabrics using bio-based processes, producing textiles with structural properties previously impossible in woven goods. Her 2026 collection introduced a self-cooling membrane fabric developed in collaboration with a materials laboratory.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_3-bhCK7gbsg9tGBiakXFZzFb.webp",
  },
  {
    id: 4,
    year: "2025",
    name: "YUI TANAKA",
    brand: "Tanaka",
    prize: "LOTIUS AWARD",
    nationality: "Japanese",
    bio: "Yui Tanaka's label is rooted in the Japanese concept of 'ma' — the meaningful pause, the space between. Her garments are defined by what is absent as much as what is present: strategic voids, deliberate incompleteness, and an embrace of impermanence that draws from wabi-sabi philosophy. Her 2025 collection was acquired in its entirety by the Costume Institute.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_4-gmt7chQWnUAwoEKjADFzcS.webp",
  },
  {
    id: 5,
    year: "2025",
    name: "ELARA VOSS",
    brand: "Elara Voss Studio",
    prize: "CRAFT PRIZE",
    nationality: "German",
    bio: "A second recognition for Elara Voss, this time for her extraordinary technical achievements in zero-waste pattern cutting. Her 2025 collection demonstrated that sustainability and couture-level craft are not mutually exclusive.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_1-WeiDQC86h9VwSYYn4MZQL4.webp",
  },
  {
    id: 6,
    year: "2024",
    name: "MARCO DELACROIX",
    brand: "Delacroix",
    prize: "LOTIUS AWARD",
    nationality: "French-Brazilian",
    bio: "Marco Delacroix's 2024 collection 'Palimpsest' was a meditation on memory and inheritance — garments layered with the traces of previous garments, creating objects that carried their own history visibly in their construction.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_2-ikWiuC6TeVwsBY6cDMSycB.webp",
  },
];

type Laureate = typeof laureates[0];

// Extracted portrait card component to avoid hooks-in-loop
function PortraitCard({
  laureate,
  delay,
  isSelected,
  onSelect,
}: {
  laureate: Laureate;
  delay: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal portrait-card"
      style={{
        transitionDelay: `${delay}ms`,
        cursor: "pointer",
        outline: isSelected ? "1px solid oklch(0.08 0 0)" : "none",
        outlineOffset: 3,
      }}
      onClick={onSelect}
      role="button"
      aria-label={`View details for ${laureate.name}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <img
        src={laureate.image}
        alt={`Portrait of ${laureate.name}`}
        style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

export default function Laureates() {
  const [activeYear, setActiveYear] = useState("ALL");
  const [selected, setSelected] = useState<Laureate | null>(laureates[0]);

  const filtered = activeYear === "ALL"
    ? laureates
    : laureates.filter((l) => l.year === activeYear);

  const handleSelect = (laureate: Laureate) => {
    setSelected(selected?.id === laureate.id ? null : laureate);
  };

  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigation />

      <main style={{ paddingTop: "6rem", flex: 1 }}>
        {/* Year filter */}
        <div
          style={{
            borderBottom: "0.5px solid oklch(0.08 0 0 / 0.15)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 0,
              padding: "0 1.5rem",
              maxWidth: 1440,
              margin: "0 auto",
            }}
          >
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: 400,
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  padding: "1.25rem 1rem",
                  background: "none",
                  border: "none",
                  borderBottom: activeYear === year ? "1px solid oklch(0.08 0 0)" : "1px solid transparent",
                  color: activeYear === year ? "oklch(0.08 0 0)" : "oklch(0.08 0 0 / 0.4)",
                  transition: "color 200ms, border-color 200ms",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  marginBottom: "-0.5px",
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Page title */}
        <div style={{ padding: "3rem 1.5rem 2rem", maxWidth: 1440, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(36px, 6vw, 80px)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Laureates
          </h1>
        </div>

        {/* Portrait grid */}
        <div style={{ padding: "0 1.5rem", maxWidth: 1440, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {filtered.map((laureate, i) => (
              <PortraitCard
                key={laureate.id}
                laureate={laureate}
                delay={(i % 6) * 60}
                isSelected={selected?.id === laureate.id}
                onSelect={() => handleSelect(laureate)}
              />
            ))}
          </div>
        </div>

        {/* Selected laureate detail */}
        {selected && (
          <div
            style={{
              borderTop: "0.5px solid oklch(0.08 0 0 / 0.15)",
              borderBottom: "0.5px solid oklch(0.08 0 0 / 0.15)",
              padding: "3rem 1.5rem",
              maxWidth: 1440,
              margin: "0 auto 4rem",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            <div style={{ width: "clamp(160px, 20vw, 260px)" }}>
              <img
                src={selected.image}
                alt={selected.name}
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }}
              />
            </div>
            <div>
              <p className="label-caps" style={{ opacity: 0.45, marginBottom: "0.5rem" }}>
                {selected.prize} — {selected.year}
              </p>
              <h2
                style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: 400,
                  fontSize: "clamp(28px, 4vw, 52px)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                {selected.name}
              </h2>
              <p className="label-caps" style={{ opacity: 0.45, marginBottom: "1.5rem" }}>
                by {selected.brand}
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(16px, 1.6vw, 20px)",
                  lineHeight: 1.9,
                  color: "oklch(0.25 0 0)",
                  maxWidth: 620,
                  marginBottom: "2rem",
                }}
              >
                {selected.bio}
              </p>
              <button className="btn-lotius">FIND OUT MORE →</button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
