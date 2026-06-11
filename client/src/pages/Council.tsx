/**
 * Council — Lotius
 * Design: Grid of council members with B&W portraits, name, title, expandable bio
 * Mirrors LVMH Prize Jury page
 */
import { useState, useEffect, useRef } from "react";
import { Plus, Minus, Instagram } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const members = [
  {
    id: 1,
    name: "Isabelle Fontaine",
    title: "Creative Director, Maison Fontaine",
    instagram: "https://instagram.com",
    bio: "Isabelle Fontaine has been at the helm of Maison Fontaine for over two decades, transforming it from a niche Parisian house into one of the most globally recognised luxury brands. Her tenure has been defined by a commitment to radical craft and a refusal to compromise on quality. She has been a Lotius Council member since the award's inception.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Ryo Hashimoto",
    title: "Founder, Hashimoto",
    instagram: "https://instagram.com",
    bio: "Ryo Hashimoto established his Tokyo-based label in 2008 after a decade working with the most demanding ateliers in Paris. His work is characterised by an obsessive attention to the relationship between garment and body — each piece is designed to move with the wearer rather than constrain them.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Amara Osei",
    title: "Head Designer, Studio Osei",
    instagram: "https://instagram.com",
    bio: "Amara Osei's practice is rooted in the textile traditions of West Africa, reinterpreted through a rigorous contemporary lens. Her collections have been acquired by major museum collections worldwide, and her influence on the broader fashion industry — particularly in the areas of colour and surface treatment — is widely acknowledged.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Lars Eriksson",
    title: "Artistic Director, Nordhaus",
    instagram: "https://instagram.com",
    bio: "Lars Eriksson joined Nordhaus in 2015 and has since repositioned the Scandinavian house as a global leader in sustainable luxury. His collections are defined by an almost austere restraint — a commitment to doing more with less that has become one of the defining aesthetics of contemporary fashion.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Sofia Marchetti",
    title: "CEO, Lotius Group",
    instagram: "https://instagram.com",
    bio: "Sofia Marchetti has led the Lotius Group since 2018, overseeing a period of significant expansion while maintaining the group's founding commitment to supporting independent creative talent. Under her leadership, the Lotius Award has grown from a single prize to a comprehensive programme of support for emerging designers.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Jean-Baptiste Moreau",
    title: "Director of Creative Patronage, Lotius",
    instagram: "https://instagram.com",
    bio: "Jean-Baptiste Moreau has been instrumental in shaping the Lotius Award's approach to mentorship and support. His background spans both the commercial and cultural dimensions of fashion, giving him a unique perspective on what emerging designers need to build sustainable creative practices.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop",
  },
];

function MemberCard({ member, delay }: { member: typeof members[0]; delay: number }) {
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
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "clamp(1rem, 3vw, 2rem)",
          alignItems: "start",
          padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
          borderBottom: "0.5px solid oklch(0.08 0 0 / 0.12)",
        }}
      >
        {/* Portrait */}
        <div className="portrait-card" style={{ aspectRatio: "3/4", overflow: "hidden" }}>
          <img
            src={member.image}
            alt={`Portrait of ${member.name}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%)",
              transition: "filter 400ms, transform 600ms cubic-bezier(0.23,1,0.32,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)";
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)";
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
            }}
          />
        </div>

        {/* Info */}
        <div style={{ paddingTop: "0.5rem" }}>
          <h3
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 400,
              fontSize: "clamp(20px, 2.5vw, 32px)",
              letterSpacing: "0.03em",
              marginBottom: "0.5rem",
            }}
          >
            {member.name}
          </h3>
          <p className="label-caps" style={{ opacity: 0.45, marginBottom: "1rem" }}>
            {member.title}
          </p>

          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram of ${member.name}`}
            style={{ display: "inline-flex", marginBottom: "1.5rem", opacity: 0.5 }}
          >
            <Instagram size={14} strokeWidth={1} />
          </a>

          {/* Expand button */}
          <div>
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
              {expanded ? <Minus size={12} strokeWidth={1} /> : <Plus size={12} strokeWidth={1} />}
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
                  marginTop: "1rem",
                  animation: "staggerIn 400ms cubic-bezier(0.23,1,0.32,1) both",
                }}
              >
                {member.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Council() {
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
            2026 Council
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
            The Lotius Council is composed of the world's most influential figures in fashion,
            culture, and commerce. Together, they deliberate and select the award winners
            each year.
          </p>
          <hr className="hairline" />
        </div>

        <div style={{ padding: "0 1.5rem 4rem", maxWidth: 1440, margin: "0 auto" }}>
          {members.map((member, i) => (
            <MemberCard key={member.id} member={member} delay={i * 60} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
