import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LOGO_PATH } from "@/components/Navigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Drop configuration ─── */
// Hero media: "stills" drives a cursor-following split-wipe between two looks.
// When two loopable clips are on the CDN, switch type to "video" — the scrub
// logic (§5D) maps cursor X to currentTime instead.
const HERO_MEDIA = {
  type: "stills" as "stills" | "video",
  // A = right side, B = left side
  a: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_1-WeiDQC86h9VwSYYn4MZQL4.webp",
  b: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_hero_2-ikWiuC6TeVwsBY6cDMSycB.webp",
};

const GALLERY_IMAGES = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_spring_1-ijPg7iU3QnhdEjyMcixuwD.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_winter_3-KMtbqHEBfjp6eHc4GxBGye.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_2-egqQEdUWRTBzfrpxJJXWeT.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_summer_4-BaqcLXvXDhvBvJWUiMMsQ8.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_spring_3-TnXvW4TzCfV3bPxbbndqcZ.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_winter_1-6cpR3iXpsKszZBtME2X8dm.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_fall_4-JFCnR5peQi9ixh35KnsV6A.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_summer_2-362jnR6ddyKSU6G5SKpZHr.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_spring_5-b39mxzW8yUpbdN6GTJ4RaS.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030255758/RcnPXDZTQnE94Vkt8qjKEi/lotius_winter_5-VMYxYADbqyW2bTDwMBwtqc.webp",
];

const MANIFESTO =
  "Archive 001 — a single run at a single price. Prep tailoring in street proportion; the luxury of restraint, made reachable. When the run ends, the archive seals.";

const SYMBOLS = ["8", "$", "^^", "%", "/"];
const CTA_DESTINATION = "/discover";
const ENTRANCE_EASE = [0.25, 0.1, 0.25, 1] as const;

/* ─── Scattered grid layout (§6) ─── */
// Returns rows of GALLERY_IMAGES indices; -1 cells render as empty spacers.
function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = [];
  let placed = 0;
  let r = 0;
  while (placed < count) {
    const row: number[] = new Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = placed++;
    if (r % 3 === 0 && placed < count) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = placed++;
    }
    rows.push(row);
    r++;
  }
  return rows;
}

function getCols(width: number) {
  if (width < 640) return 2;
  if (width < 1024) return 3;
  return 4;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ─── Main experience ─── */
export default function Archive() {
  const [, navigate] = useLocation();

  const [cols, setCols] = useState(() => getCols(window.innerWidth));
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const isDesktop = useMemo(
    () => window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches,
    []
  );
  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  /* DOM refs */
  const spacerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const galleryInnerRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLSpanElement>(null);

  /* hero media refs */
  const wipeLayerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  /* scroll/scrub state (mutated per-frame, never re-renders) */
  const vhRef = useRef(window.innerHeight);
  const maxScrollRef = useRef(0);
  const cardMeta = useRef<{ el: HTMLDivElement; top: number; h: number }[]>([]);
  const cursorX = useRef(window.innerWidth / 2);
  const activeSide = useRef<"left" | "right">("right");
  const wipePos = useRef(0.5);
  const wipeTarget = useRef(0.5);
  const mobileFlip = useRef(false);
  const outroOffsetRef = useRef(166);
  outroOffsetRef.current = isMobile ? 132 : 166;

  const inset = isMobile ? 16 : 32;
  const rows = useMemo(() => buildLayout(GALLERY_IMAGES.length, cols), [cols]);

  /* ── Route chrome: lock dark, hide native cursor, restore on unmount ── */
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    root.classList.add("dark");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    return () => {
      if (!hadDark) root.classList.remove("dark");
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
  }, []);

  /* ── Resize: columns, mobile flag ── */
  useEffect(() => {
    const onResize = () => {
      setCols(getCols(window.innerWidth));
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Measure gallery + spacer height (§4), re-run on layout changes ── */
  const measure = useCallback(() => {
    const inner = galleryInnerRef.current;
    const spacer = spacerRef.current;
    if (!inner || !spacer) return;
    const vh = window.innerHeight;
    vhRef.current = vh;
    cardMeta.current = cardEls.current
      .filter((el): el is HTMLDivElement => Boolean(el))
      .map((el) => ({ el, top: el.offsetTop, h: el.offsetHeight }));
    const maxScroll = Math.max(0, inner.scrollHeight - vh);
    maxScrollRef.current = maxScroll;
    spacer.style.height = `${vh + maxScroll + 2 * vh}px`;
    ScrollTrigger.refresh();
  }, []);

  useLayoutEffect(() => {
    cardEls.current = cardEls.current.slice(0, GALLERY_IMAGES.length);
    measure();
  }, [measure, cols]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  /* ── GSAP owns ONLY the panel translateY scrub across the first 100vh ── */
  useGSAP(
    () => {
      gsap.fromTo(
        panelRef.current,
        { y: () => vhRef.current },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: "top top",
            end: () => `+=${vhRef.current}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: spacerRef }
  );

  /* ── Cursor-scrub input (desktop) ── */
  useEffect(() => {
    if (!isDesktop) return;
    const onMove = (e: MouseEvent) => {
      cursorX.current = e.clientX;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isDesktop]);

  /* ── Mobile stills: alternate looks A/B (autoplay analog, §5E) ── */
  useEffect(() => {
    if (HERO_MEDIA.type !== "stills" || isDesktop || reducedMotion) return;
    const interval = setInterval(() => {
      mobileFlip.current = !mobileFlip.current;
      wipeTarget.current = mobileFlip.current ? 1 : 0;
    }, 5000);
    return () => clearInterval(interval);
  }, [isDesktop, reducedMotion]);

  /* ── Mobile video: play A → ended → play B → ended → A ── */
  useEffect(() => {
    if (HERO_MEDIA.type !== "video" || isDesktop || reducedMotion) return;
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;
    const playB = () => {
      a.style.display = "none";
      b.style.display = "block";
      b.currentTime = 0;
      b.play().catch(() => {});
    };
    const playA = () => {
      b.style.display = "none";
      a.style.display = "block";
      a.currentTime = 0;
      a.play().catch(() => {});
    };
    a.addEventListener("ended", playB);
    b.addEventListener("ended", playA);
    playA();
    return () => {
      a.removeEventListener("ended", playB);
      b.removeEventListener("ended", playA);
    };
  }, [isDesktop, reducedMotion]);

  /* ── Master RAF loop: reads scrollY each frame, drives every phase (§4) ── */
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const vh = vhRef.current;
      const y = window.scrollY;
      const maxScroll = maxScrollRef.current;
      const panelY = Math.max(0, vh - y);
      const innerScroll = Math.max(0, y - vh);

      if (galleryInnerRef.current) {
        galleryInnerRef.current.style.transform = `translate3d(0, ${-innerScroll}px, 0)`;
      }

      /* cards: scale from vertical position against the live panel offset */
      if (!reducedMotion) {
        for (const { el, top: ot, h } of cardMeta.current) {
          const top = panelY - innerScroll + ot;
          const bottom = top + h;
          let scale = 0;
          if (bottom > 0 && top < vh) {
            const enter = Math.min(1, (vh - top) / (vh * 0.6));
            const exit = Math.min(1, bottom / (vh * 0.4));
            scale = Math.min(enter, exit);
          }
          el.style.transform = `scale(${scale})`;
        }
      }

      /* hero media off past the first viewport (perf) */
      if (canvasRef.current) {
        canvasRef.current.style.visibility = y > vh ? "hidden" : "visible";
      }

      /* hero scrub (§5D) */
      if (y <= vh) {
        if (isDesktop && !reducedMotion) {
          const w = window.innerWidth;
          const center = w / 2;
          const dead = Math.max(30, w * 0.05);
          const x = cursorX.current;
          let progress = 0;
          if (x < center - dead) {
            activeSide.current = "left";
            progress = clamp01((center - dead - x) / (center - dead));
          } else if (x > center + dead) {
            activeSide.current = "right";
            progress = clamp01((x - center - dead) / (w - center - dead));
          }
          if (HERO_MEDIA.type === "video") {
            const video = activeSide.current === "left" ? videoBRef.current : videoARef.current;
            const other = activeSide.current === "left" ? videoARef.current : videoBRef.current;
            if (video && other) {
              video.style.display = "block";
              other.style.display = "none";
              // only seek once the previous seek has settled — prevents jitter
              if (!video.seeking && video.duration) {
                video.currentTime = progress * video.duration;
              }
            }
          } else {
            // stills fallback: the split edge is pushed away from the cursor,
            // so left of dead zone reveals look B, right reveals look A
            wipeTarget.current =
              progress === 0 ? 0.5 : activeSide.current === "left" ? 0.5 + progress * 0.5 : 0.5 - progress * 0.5;
          }
        }
        if (HERO_MEDIA.type === "stills" && !reducedMotion) {
          wipePos.current += (wipeTarget.current - wipePos.current) * 0.12;
          const wp = wipePos.current;
          if (wipeLayerRef.current) {
            wipeLayerRef.current.style.clipPath = `inset(0 ${(1 - wp) * 100}% 0 0)`;
          }
          if (dividerRef.current) {
            dividerRef.current.style.left = `${wp * 100}%`;
            dividerRef.current.style.opacity = wp <= 0.02 || wp >= 0.98 ? "0" : "0.6";
          }
        }
      }

      /* outro (§7) */
      const progress = clamp01((y - vh - maxScroll) / (vh - 100));
      if (overlayRef.current) overlayRef.current.style.opacity = `${progress}`;
      if (infoRef.current) {
        infoRef.current.style.transform = `translateY(${-outroOffsetRef.current * progress}px)`;
      }
      if (buyRef.current) {
        buyRef.current.style.transform = `scale(${progress})`;
        buyRef.current.style.pointerEvents = progress > 0.5 ? "auto" : "none";
      }
      if (footerRef.current) footerRef.current.style.opacity = `${progress}`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDesktop, reducedMotion]);

  /* ── Circle symbol randomizes on scroll, throttled 80ms ── */
  useEffect(() => {
    if (reducedMotion) return;
    let last = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - last < 80) return;
      last = now;
      if (symbolRef.current) {
        symbolRef.current.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  /* ── Custom cursor: Lotius lerp dot/ring/glow (desktop only) ── */
  const dotEl = useRef<HTMLDivElement>(null);
  const ringEl = useRef<HTMLDivElement>(null);
  const innerGlowEl = useRef<HTMLDivElement>(null);
  const rawPos = useRef({ x: -9999, y: -9999 });
  const dotPos = useRef({ x: -9999, y: -9999 });
  const ringPos = useRef({ x: -9999, y: -9999 });
  const cursorVisible = useRef(false);

  useEffect(() => {
    if (!isDesktop || reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY };
      cursorVisible.current = true;
    };
    const onLeave = () => {
      cursorVisible.current = false;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let raf = 0;
    const tick = () => {
      const raw = rawPos.current;
      const vis = cursorVisible.current;
      dotPos.current.x = lerp(dotPos.current.x, raw.x, 0.85);
      dotPos.current.y = lerp(dotPos.current.y, raw.y, 0.85);
      ringPos.current.x = lerp(ringPos.current.x, raw.x, 0.18);
      ringPos.current.y = lerp(ringPos.current.y, raw.y, 0.18);
      if (dotEl.current) {
        dotEl.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
        dotEl.current.style.opacity = vis ? "1" : "0";
      }
      if (ringEl.current) {
        ringEl.current.style.transform = `translate(${ringPos.current.x - 22}px, ${ringPos.current.y - 22}px)`;
        ringEl.current.style.opacity = vis ? "0.7" : "0";
      }
      if (innerGlowEl.current) {
        innerGlowEl.current.style.transform = `translate(${dotPos.current.x - 70}px, ${dotPos.current.y - 70}px)`;
        innerGlowEl.current.style.opacity = vis ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [isDesktop, reducedMotion]);

  /* ── Hero media load tracking (fade container in) ── */
  const loadedCount = useRef(0);
  const handleMediaLoad = useCallback(() => {
    loadedCount.current += 1;
    if (loadedCount.current >= 2) setMediaLoaded(true);
  }, []);

  const entrance = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: ENTRANCE_EASE, delay },
  });

  const hideCursor = isDesktop && !reducedMotion;

  return (
    <div
      ref={spacerRef}
      id="archive-spacer"
      className="archive-root"
      style={{
        position: "relative",
        height: "500vh",
        userSelect: "none",
        background: "#fff",
        cursor: hideCursor ? "none" : undefined,
      }}
    >
      {/* ═══ PHASE 1 — hero media (#main-canvas) ═══ */}
      <div
        ref={canvasRef}
        id="main-canvas"
        style={{
          position: "fixed",
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
          opacity: mediaLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
          background: "#000",
          ...(isMobile
            ? { left: 0, top: 220, width: "100vw", height: "calc(100vh - 220px)" }
            : { inset: 0, width: "100%", height: "100%" }),
        }}
      >
        {HERO_MEDIA.type === "video" ? (
          <>
            <video
              ref={videoARef}
              src={HERO_MEDIA.a}
              muted
              playsInline
              preload="auto"
              onLoadedData={handleMediaLoad}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "none" }}
            />
            <video
              ref={videoBRef}
              src={HERO_MEDIA.b}
              muted
              playsInline
              preload="auto"
              onLoadedData={handleMediaLoad}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </>
        ) : (
          <>
            {/* look A — base layer (right of the split) */}
            <img
              src={HERO_MEDIA.a}
              alt="Archive 001 — look A"
              draggable={false}
              onLoad={handleMediaLoad}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* look B — clipped layer, revealed from the left as the split moves */}
            <div
              ref={wipeLayerRef}
              style={{ position: "absolute", inset: 0, clipPath: "inset(0 50% 0 0)", willChange: "clip-path" }}
            >
              <img
                src={HERO_MEDIA.b}
                alt="Archive 001 — look B"
                draggable={false}
                onLoad={handleMediaLoad}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              ref={dividerRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                width: 1,
                background: "rgba(255,255,255,0.9)",
                opacity: 0.6,
              }}
            />
          </>
        )}
      </div>

      {/* ═══ PHASE 2 — black panel with scattered gallery ═══ */}
      <div
        ref={panelRef}
        className="archive-panel"
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 10,
          transform: "translateY(100vh)",
          overflow: "hidden",
        }}
      >
        <div
          ref={galleryInnerRef}
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "min(400px, 40vh)",
            paddingBottom: "15vh",
            transform: "translate3d(0, 0, 0)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: "clamp(24px, 8vh, 96px) clamp(12px, 2vw, 32px)",
              padding: "0 clamp(16px, 3vw, 48px)",
            }}
          >
            {rows.flatMap((row, r) =>
              row.map((imgIdx, c) =>
                imgIdx === -1 ? (
                  <div key={`spacer-${r}-${c}`} aria-hidden="true" />
                ) : (
                  <div
                    key={`card-${imgIdx}`}
                    ref={(el) => {
                      cardEls.current[imgIdx] = el;
                    }}
                    className="bp-card"
                    style={{
                      aspectRatio: "2/3",
                      overflow: "hidden",
                      transform: reducedMotion ? "none" : "scale(0)",
                      transformOrigin: c < cols / 2 ? "right bottom" : "left bottom",
                    }}
                  >
                    <img
                      src={GALLERY_IMAGES[imgIdx]}
                      alt={`Archive 001 — piece ${imgIdx + 1}`}
                      loading="lazy"
                      draggable={false}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* ═══ OUTRO — white overlay ═══ */}
      <div
        ref={overlayRef}
        id="outro-overlay"
        style={{ position: "fixed", inset: 0, background: "#fff", opacity: 0, zIndex: 12, pointerEvents: "none" }}
      />

      {/* ═══ Overlay UI — fixed, exclusion-blend white ═══ */}
      {/* logo + caption (top-left) */}
      <div
        style={{
          position: "fixed",
          top: inset,
          left: inset,
          zIndex: 20,
          pointerEvents: "none",
          mixBlendMode: "exclusion",
          color: "#fff",
          maxWidth: isMobile ? "calc(100vw - 32px)" : "min(692px, calc(50vw - 48px))",
        }}
      >
        <motion.div {...entrance(0)} style={{ display: "flex", alignItems: "flex-end", gap: "0.6em" }}>
          <svg
            viewBox="0 0 391 708"
            aria-label="lotius"
            style={{ height: isMobile ? 44 : "clamp(56px, 6.5vw, 92px)", width: "auto", fill: "#fff", display: "block" }}
          >
            <path fillRule="evenodd" d={LOGO_PATH} />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: isMobile ? 34 : "clamp(44px, 5.5vw, 80px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.85,
            }}
          >
            LOTIUS
          </span>
        </motion.div>
        <motion.p
          {...entrance(0.3)}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: 12,
            lineHeight: "140%",
            letterSpacing: "-0.04em",
            marginTop: "1rem",
          }}
        >
          {MANIFESTO}
        </motion.p>
      </div>

      {/* header nav (top-right) */}
      <motion.div
        {...entrance(0.15)}
        style={{
          position: "fixed",
          top: inset,
          right: inset,
          zIndex: 20,
          pointerEvents: "none",
          mixBlendMode: "exclusion",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: isMobile ? "auto" : 330,
          gap: isMobile ? 20 : 0,
        }}
      >
        {!isMobile && (
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 15, textTransform: "uppercase" }}>
            ABOUT
          </span>
        )}
        <svg width={isMobile ? 24 : 30} height={isMobile ? 24 : 30} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M0 14H40" stroke="#fff" strokeWidth="2.5" />
          <path d="M0 26H40" stroke="#fff" strokeWidth="2.5" />
        </svg>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: isMobile ? 13 : 15 }}>
          [ CART ]
        </span>
      </motion.div>

      {/* drop info (bottom-right) — RAF slides the outer div up during outro */}
      <div
        ref={infoRef}
        id="outro-info"
        data-outro-offset={isMobile ? 132 : 166}
        style={{ position: "fixed", bottom: inset, right: inset, zIndex: 20, pointerEvents: "none" }}
      >
        <motion.div
          {...entrance(0.45)}
          style={{
            mixBlendMode: "exclusion",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.5rem",
            textAlign: "right",
          }}
        >
          <div
            style={{
              width: isMobile ? 20 : 30,
              height: isMobile ? 20 : 30,
              border: "2px solid #fff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              ref={symbolRef}
              id="circle-symbol"
              style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 10 : 14, lineHeight: 1 }}
            >
              8
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: isMobile ? 20 : 30,
              textTransform: "uppercase",
              lineHeight: 1.15,
            }}
          >
            ARCHIVE 001
            <br />
            &ldquo;LOTIUS&rdquo;
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: isMobile ? 60 : 80, lineHeight: 1 }}>
            $92
          </div>
        </motion.div>
      </div>

      {/* CTA pill — scales 0→1 from right bottom during outro */}
      <button
        ref={buyRef}
        id="outro-buy"
        onClick={() => navigate(CTA_DESTINATION)}
        style={{
          position: "fixed",
          bottom: inset,
          right: inset,
          zIndex: 20,
          transform: "scale(0)",
          transformOrigin: "right bottom",
          background: "#fff",
          border: "none",
          borderRadius: 1335,
          padding: "0.05em 0.5em 0.12em",
          pointerEvents: "none",
          cursor: hideCursor ? "none" : "pointer",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: isMobile ? 72 : "clamp(80px, 9vw, 110px)",
            lineHeight: 1.1,
            mixBlendMode: "exclusion",
            color: "#fff",
            display: "block",
          }}
        >
          view
        </span>
      </button>

      {/* footer (bottom-left) */}
      <div
        ref={footerRef}
        id="outro-footer"
        style={{
          position: "fixed",
          bottom: inset,
          left: inset,
          zIndex: 20,
          opacity: 0,
          pointerEvents: "none",
          mixBlendMode: "exclusion",
          color: "#fff",
          display: "flex",
          gap: 24,
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: isMobile ? 11 : 13,
          textTransform: "uppercase",
        }}
      >
        <span>LOTIUS (R) 2026</span>
        <span>PRIVACY POLICY</span>
      </div>

      {/* custom cursor — Lotius lerp dot/ring/glow, exclusion white */}
      {hideCursor && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            pointerEvents: "none",
            overflow: "hidden",
            mixBlendMode: "exclusion",
          }}
        >
          <div
            ref={innerGlowEl}
            style={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 50%, transparent 75%)",
              opacity: 0,
              willChange: "transform, opacity",
              transition: "opacity 300ms cubic-bezier(0.23,1,0.32,1)",
            }}
          />
          <div
            ref={ringEl}
            style={{
              position: "absolute",
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "0.75px solid rgba(255,255,255,0.5)",
              opacity: 0,
              willChange: "transform, opacity",
              transition: "opacity 250ms cubic-bezier(0.23,1,0.32,1)",
            }}
          />
          <div
            ref={dotEl}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 0 8px rgba(255,255,255,0.5)",
              opacity: 0,
              willChange: "transform, opacity",
              transition: "opacity 200ms cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        </div>
      )}
    </div>
  );
}
