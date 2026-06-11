/**
 * Mentors — Lotius
 * Design: Expert mentors grid with portraits, names, specialisms
 * Mirrors LVMH Prize Experts page
 */
import { useState, useEffect, useRef } from "react";
import { Plus, Minus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const mentors = [
  {
    id: 1,
    name: "Céline Aubert",
    specialism: "Sustainable Development",
    bio: "Céline Aubert leads Lotius's sustainability programme, working with award winners to embed environmental responsibility into every aspect of their business — from material sourcing to end-of-life garment strategies.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Thomas Weiss",
    specialism: "Brand Communication",
    bio: "Thomas Weiss has shaped the communications strategies of some of the most successful fashion brands of the past two decades. He works with Lotius laureates to develop authentic brand narratives that resonate across cultures and markets.",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Priya Nair",
    specialism: "Legal & Intellectual Property",
    bio: "Priya Nair specialises in intellectual property law for creative industries. She guides Lotius laureates through the complexities of protecting their creative work — from trademark registration to licensing agreements.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Marcus Chen",
    specialism: "Finance & Investment",
    bio: "Marcus Chen brings two decades of experience in fashion finance to his mentorship role. He helps laureates understand their financial position, plan for growth, and navigate the complex landscape of investment and partnership opportunities.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Valentina Russo",
    specialism: "Retail & Distribution",
    bio: "Valentina Russo's expertise spans wholesale, direct-to-consumer, and digital retail. She works with laureates to develop distribution strategies that are appropriate for their brand positioning and growth ambitions.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Kenji Watanabe",
    specialism: "Production & Manufacturing",
    bio: "Kenji Watanabe's deep knowledge of global manufacturing — from artisanal workshops to large-scale production facilities — helps laureates find the right production partners and develop efficient, ethical supply chains.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Aïda Diallo",
    specialism: "Marketing & Digital",
    bio: "Aïda Diallo is a specialist in digital marketing and community building for luxury brands. She helps laureates develop their digital presence and build engaged communities around their work.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Henrik Larsen",
    specialism: "Press & Editorial",
    bio: "Henrik Larsen's relationships with editors, stylists, and photographers across the global fashion media landscape make him an invaluable resource for laureates seeking to build their editorial presence.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop",
  },
];

function MentorCard({ mentor, delay }: { mentor: typeof mentors[0]; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        style={{
          padding: "2rem 0",
          borderBottom: "0.5px solid oklch(0.08 0 0 / 0.12)",
        }}
      >
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
          {/* Portrait */}
          <div
            style={{
              width: "clamp(80px, 10vw, 120px)",
              aspectRatio: "1",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={mentor.image}
              alt={`Portrait of ${mentor.name}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "grayscale(100%)",
                transition: "filter 400ms",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)")}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 400,
                fontSize: "clamp(18px, 2vw, 26px)",
                letterSpacing: "0.03em",
                marginBottom: "0.25rem",
              }}
            >
              {mentor.name}
            </h3>
            <p className="label-caps" style={{ opacity: 0.45, marginBottom: "0.75rem" }}>
              {mentor.specialism}
            </p>

            <button
              onClick={() => setExpanded((e) => !e)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "none",
                padding: 0,
                fontFamily: "'Bodoni Moda', serif",
                fontSize: 9,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "oklch(0.08 0 0)",
                cursor: "pointer",
              }}
              aria-expanded={expanded}
            >
              {expanded ? <Minus size={11} strokeWidth={1} /> : <Plus size={11} strokeWidth={1} />}
              {expanded ? "CLOSE" : "READ MORE"}
            </button>

            {expanded && (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(14px, 1.4vw, 17px)",
                  lineHeight: 1.9,
                  color: "oklch(0.25 0 0)",
                  marginTop: "0.75rem",
                  maxWidth: 560,
                  animation: "staggerIn 400ms cubic-bezier(0.23,1,0.32,1) both",
                }}
              >
                {mentor.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Mentors() {
  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigation />

      <main style={{ paddingTop: "6rem", flex: 1 }}>
        <div style={{ padding: "3rem 1.5rem 0", maxWidth: 1440, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(36px, 6vw, 80px)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Mentors
          </h1>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(15px, 1.5vw, 18px)",
              lineHeight: 1.8,
              color: "oklch(0.45 0 0)",
              maxWidth: 560,
              marginBottom: "2rem",
            }}
          >
            The Lotius mentorship programme pairs award winners with world-class experts
            across every dimension of building a successful fashion brand. These are the
            specialists who guide our laureates through their year of mentorship.
          </p>
          <hr className="hairline" />
        </div>

        <div
          style={{
            padding: "0 1.5rem 4rem",
            maxWidth: 1440,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "0 4rem",
          }}
        >
          {mentors.map((mentor, i) => (
            <MentorCard key={mentor.id} mentor={mentor} delay={(i % 4) * 60} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
