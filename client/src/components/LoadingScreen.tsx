/**
 * LoadingScreen — Lotius
 * Wipe-in logo animation: vertical stem anchors first, then each letter
 * reveals top-down in sequence. Progress bar + crop marks + grain texture.
 * Adapts: dark mode → dark ink on dark paper; light mode → warm paper (#F2EEE4).
 */
import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Logo data (paths, timing windows, geometry) ────────────────────────────
const LOGO = {
  vb: { x: -30, y: -20, w: 444, h: 740 },
  glyphs: {
    l:      { d: "M20.0 12.0L15.0 15.0L12.0 21.0L12.0 75.0L13.0 76.0L13.0 125.0L14.0 126.0L14.0 307.0L13.0 308.0L13.0 388.0L12.0 389.0L13.0 390.0L13.0 431.0L14.0 432.0L15.0 448.0L18.0 453.0L23.0 453.0L27.0 448.0L30.0 432.0L30.0 395.0L29.0 394.0L29.0 361.0L28.0 360.0L28.0 294.0L27.0 293.0L28.0 134.0L29.0 133.0L30.0 47.0L29.0 46.0L28.0 19.0L25.0 13.0Z", y0: 12,  y1: 453 },
    o:      { d: "M99.0 306.0L87.0 305.0L79.0 307.0L73.0 310.0L61.0 318.0L56.0 323.0L49.0 335.0L47.0 344.0L47.0 352.0L50.0 363.0L53.0 369.0L63.0 380.0L75.0 386.0L89.0 387.0L97.0 385.0L105.0 381.0L118.0 371.0L122.0 366.0L127.0 355.0L128.0 338.0L123.0 325.0L113.0 313.0L107.0 309.0ZM76.0 320.0L85.0 318.0L97.0 322.0L105.0 330.0L110.0 339.0L112.0 348.0L111.0 358.0L106.0 367.0L100.0 372.0L86.0 373.0L79.0 370.0L71.0 363.0L65.0 353.0L64.0 336.0L68.0 327.0Z", y0: 305, y1: 387 },
    t:      { d: "M158.0 41.0L155.0 41.0L151.0 45.0L148.0 61.0L148.0 81.0L147.0 82.0L147.0 208.0L148.0 209.0L147.0 216.0L148.0 217.0L148.0 234.0L146.0 238.0L141.0 241.0L110.0 240.0L109.0 239.0L101.0 240.0L94.0 245.0L92.0 250.0L93.0 257.0L104.0 257.0L105.0 256.0L123.0 255.0L124.0 254.0L142.0 254.0L146.0 255.0L148.0 258.0L148.0 296.0L149.0 297.0L148.0 299.0L149.0 301.0L149.0 306.0L148.0 307.0L149.0 310.0L148.0 311.0L149.0 312.0L149.0 468.0L148.0 469.0L148.0 561.0L147.0 562.0L147.0 642.0L146.0 643.0L146.0 658.0L147.0 659.0L146.0 660.0L147.0 661.0L148.0 684.0L151.0 688.0L156.0 688.0L160.0 685.0L163.0 675.0L163.0 660.0L162.0 659.0L163.0 657.0L162.0 483.0L161.0 482.0L162.0 480.0L161.0 479.0L161.0 302.0L162.0 301.0L162.0 258.0L167.0 254.0L230.0 255.0L238.0 252.0L243.0 246.0L243.0 239.0L239.0 237.0L207.0 239.0L206.0 240.0L166.0 240.0L162.0 236.0L162.0 70.0L161.0 69.0L161.0 45.0Z", y0: 41,  y1: 688 },
    accent: { d: "M209.0 176.0L207.0 175.0L204.0 176.0L199.0 181.0L187.0 198.0L184.0 205.0L187.0 210.0L205.0 208.0L217.0 205.0L220.0 203.0L219.0 199.0L217.0 198.0L210.0 198.0L198.0 201.0L197.0 200.0L209.0 184.0L211.0 179.0Z", y0: 175, y1: 210 },
    i:      { d: "M199.0 310.0L194.0 310.0L190.0 312.0L186.0 319.0L187.0 334.0L188.0 335.0L188.0 379.0L187.0 380.0L188.0 382.0L187.0 383.0L188.0 392.0L191.0 395.0L194.0 396.0L199.0 395.0L204.0 389.0L203.0 353.0L202.0 352.0L203.0 322.0L202.0 321.0L202.0 314.0Z", y0: 310, y1: 396 },
    u:      { d: "M281.0 308.0L278.0 308.0L274.0 310.0L271.0 313.0L269.0 318.0L270.0 326.0L275.0 341.0L276.0 360.0L273.0 371.0L270.0 377.0L263.0 383.0L254.0 383.0L249.0 381.0L243.0 376.0L238.0 367.0L237.0 353.0L243.0 328.0L243.0 322.0L241.0 318.0L238.0 316.0L232.0 316.0L226.0 319.0L222.0 323.0L221.0 326.0L223.0 329.0L228.0 328.0L232.0 329.0L232.0 337.0L226.0 361.0L226.0 376.0L231.0 387.0L236.0 392.0L242.0 395.0L259.0 396.0L271.0 391.0L282.0 381.0L287.0 372.0L291.0 359.0L292.0 340.0L287.0 316.0L284.0 310.0Z", y0: 308, y1: 396 },
    s:      { d: "M351.0 278.0L336.0 279.0L324.0 285.0L315.0 294.0L309.0 308.0L309.0 323.0L311.0 330.0L322.0 349.0L344.0 378.0L353.0 395.0L356.0 405.0L356.0 420.0L351.0 430.0L348.0 433.0L342.0 436.0L329.0 436.0L318.0 431.0L313.0 426.0L308.0 416.0L309.0 406.0L311.0 402.0L317.0 396.0L317.0 394.0L314.0 392.0L310.0 393.0L300.0 401.0L294.0 413.0L293.0 418.0L294.0 429.0L298.0 437.0L307.0 445.0L317.0 449.0L324.0 449.0L325.0 450.0L335.0 449.0L350.0 443.0L357.0 438.0L364.0 430.0L368.0 423.0L371.0 414.0L371.0 408.0L372.0 407.0L371.0 396.0L365.0 379.0L353.0 360.0L330.0 329.0L325.0 320.0L323.0 313.0L323.0 304.0L325.0 298.0L331.0 292.0L336.0 290.0L346.0 291.0L350.0 293.0L357.0 301.0L356.0 315.0L360.0 316.0L366.0 311.0L370.0 302.0L369.0 290.0L362.0 282.0Z", y0: 278, y1: 450 },
  } as Record<string, { d: string; y0: number; y1: number }>,
  stem:  { x: 138, w: 34, y: 41, h: 647 },
  cross: { y: 229, h: 34, cx: 155, reach: 300 },
};

// Timing windows: each letter wipes in during this fraction of the total progress
const WINDOWS: Record<string, [number, number]> = {
  cross:  [0,    0.14],
  l:      [0.10, 0.30],
  o:      [0.22, 0.42],
  u:      [0.36, 0.56],
  s:      [0.50, 0.72],
  i:      [0.66, 0.84],
  accent: [0.80, 1.00],
};

const LETTERS = ["l", "o", "u", "s", "i", "accent"] as const;
const NS = "http://www.w3.org/2000/svg";

// ─── Easing helpers ──────────────────────────────────────────────────────────
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const eIO   = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const lf    = (q: number, s: number, e: number) => clamp((q-s)/(e-s), 0, 1);

interface LoadingScreenProps {
  fadeOut: boolean;
}

export default function LoadingScreen({ fadeOut }: LoadingScreenProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const svgRef   = useRef<SVGSVGElement>(null);
  const numRef   = useRef<HTMLSpanElement>(null);
  const fillRef  = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number | null>(null);
  const initRef  = useRef(false);

  // Colours derived from theme
  const paper = isDark ? "#15120C" : "#F2EEE4";
  const ink   = isDark ? "#F2EEE4" : "#15120C";
  const muted = isDark ? "#7A7060" : "#A89E89";

  // ── Build SVG DOM once on mount ──────────────────────────────────────────
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || initRef.current) return;
    initRef.current = true;

    const { vb, glyphs, stem, cross } = LOGO;
    svgEl.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);

    // defs + clip paths
    const defs = document.createElementNS(NS, "defs");
    svgEl.appendChild(defs);

    const rects: Record<string, SVGRectElement> = {};

    const mkClip = (id: string) => {
      const cp = document.createElementNS(NS, "clipPath");
      cp.setAttribute("id", id);
      cp.setAttribute("clipPathUnits", "userSpaceOnUse");
      defs.appendChild(cp);
      return cp;
    };

    // Per-letter clip rects (wipe top-down)
    LETTERS.forEach(n => {
      const cp = mkClip("cp-" + n);
      const r  = document.createElementNS(NS, "rect");
      r.setAttribute("x", "-60");
      r.setAttribute("width", "560");
      r.setAttribute("y",  String(glyphs[n].y0 - 6));
      r.setAttribute("height", "0");
      cp.appendChild(r);
      rects[n] = r;
    });

    // t clip = full stem (always visible) + growing crossbar
    const cpt    = mkClip("cp-t");
    const rStem  = document.createElementNS(NS, "rect");
    rStem.setAttribute("x",      String(stem.x));
    rStem.setAttribute("width",  String(stem.w));
    rStem.setAttribute("y",      String(stem.y));
    rStem.setAttribute("height", String(stem.h));

    const rCross = document.createElementNS(NS, "rect");
    rCross.setAttribute("y",      String(cross.y));
    rCross.setAttribute("height", String(cross.h));
    rCross.setAttribute("x",      String(cross.cx));
    rCross.setAttribute("width",  "0");
    cpt.appendChild(rStem);
    cpt.appendChild(rCross);

    // Render paths
    const mkPath = (n: string) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("fill", ink);
      p.setAttribute("d", glyphs[n].d);
      p.setAttribute("clip-path", `url(#cp-${n})`);
      svgEl.appendChild(p);
    };
    ["l", "o", "t", "u", "s", "i", "accent"].forEach(mkPath);

    // ── Animation loop ───────────────────────────────────────────────────
    const T = { form: 3200, holdFull: 850, unform: 2800, holdBase: 420 };
    type Phase = "form" | "holdFull" | "unform" | "holdBase";
    let phase: Phase = "form";
    let t0 = performance.now();

    const drawForm = (q: number) => {
      // Crossbar grows from centre outward
      const fc = eIO(lf(q, WINDOWS.cross[0], WINDOWS.cross[1]));
      const w  = fc * cross.reach;
      rCross.setAttribute("width", String(w));
      rCross.setAttribute("x",     String(cross.cx - w / 2));

      // Letters wipe in top-down
      LETTERS.forEach(n => {
        const g = LOGO.glyphs[n];
        const f = eIO(lf(q, WINDOWS[n][0], WINDOWS[n][1]));
        rects[n].setAttribute("y",      String(g.y0 - 6));
        rects[n].setAttribute("height", String(f * (g.y1 - g.y0 + 12)));
      });

      if (numRef.current)  numRef.current.textContent  = String(Math.round(q * 100)).padStart(2, "0");
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${q})`;
    };

    const loop = (now: number) => {
      const el = now - t0;
      let q: number;
      if (phase === "form") {
        q = clamp(el / T.form, 0, 1);
        if (el >= T.form) { phase = "holdFull"; t0 = now; q = 1; }
      } else if (phase === "holdFull") {
        q = 1;
        if (el >= T.holdFull) { phase = "unform"; t0 = now; }
      } else if (phase === "unform") {
        q = 1 - clamp(el / T.unform, 0, 1);
        if (el >= T.unform) { phase = "holdBase"; t0 = now; q = 0; }
      } else {
        q = 0;
        if (el >= T.holdBase) { phase = "form"; t0 = now; }
      }
      drawForm(q);
      rafRef.current = requestAnimationFrame(loop);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      drawForm(1);
    } else {
      drawForm(0);
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update SVG path fill colours when theme changes
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    svgEl.querySelectorAll("path").forEach(p => p.setAttribute("fill", ink));
  }, [ink]);

  return (
    <div
      className={`loading-screen${fadeOut ? " fade-out" : ""}`}
      aria-label="Lotius loading screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "background 450ms cubic-bezier(0.23,1,0.32,1)",
        fontFamily: "'Jura', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Grain texture overlay */}
      <svg
        style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: 0.045, mixBlendMode: "multiply", zIndex: 5 }}
        aria-hidden="true"
      >
        <filter id="gr-loader">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#gr-loader)" />
      </svg>

      {/* Stage */}
      <div
        style={{
          position: "relative",
          width: "min(86vw, 420px)",
          height: "min(80vh, 720px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Crop marks */}
        {(["tl","tr","bl","br"] as const).map(pos => (
          <span
            key={pos}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 16,
              height: 16,
              pointerEvents: "none",
              zIndex: 2,
              ...(pos === "tl" ? { top: 0, left: 0 } :
                  pos === "tr" ? { top: 0, right: 0, transform: "scaleX(-1)" } :
                  pos === "bl" ? { bottom: 0, left: 0, transform: "scaleY(-1)" } :
                               { bottom: 0, right: 0, transform: "scale(-1,-1)" }),
            }}
          >
            {/* horizontal arm */}
            <span style={{ position: "absolute", width: "100%", height: 1, top: 0, left: 0, background: ink, opacity: 0.28 }} />
            {/* vertical arm */}
            <span style={{ position: "absolute", width: 1, height: "100%", top: 0, left: 0, background: ink, opacity: 0.28 }} />
          </span>
        ))}

        {/* Percentage counter */}
        <div
          style={{
            position: "absolute",
            top: -2,
            right: 0,
            display: "flex",
            alignItems: "baseline",
            gap: "0.2em",
            fontWeight: 300,
            letterSpacing: "0.05em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span ref={numRef} style={{ fontSize: 14, color: ink, transition: "color 450ms" }}>00</span>
          <span style={{ fontSize: 9, color: muted, transition: "color 450ms" }}>%</span>
        </div>

        {/* Logo SVG */}
        <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <svg
            ref={svgRef}
            aria-label="LOTIUS loading"
            style={{ height: "100%", maxHeight: 560, width: "auto", overflow: "visible", display: "block" }}
          />
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "min(240px, 68%)",
            margin: "34px 0 10px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 2,
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
              background: isDark ? "rgba(242,238,228,0.13)" : "rgba(21,18,12,0.13)",
              transition: "background 450ms",
            }}
          >
            <div
              ref={fillRef}
              style={{
                position: "absolute",
                inset: 0,
                background: ink,
                borderRadius: 2,
                transformOrigin: "left center",
                transform: "scaleX(0)",
                transition: "background 450ms",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: muted,
              transition: "color 450ms",
            }}
          >
            LOTIUS
          </span>
        </div>
      </div>
    </div>
  );
}
