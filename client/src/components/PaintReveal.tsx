/**
 * PaintReveal — Interactive Paint Brush Reveal
 *
 * Users paint away the overlay using mouse or touch.
 * Features:
 * - Smooth brush interpolation between pointer positions (no gaps)
 * - Pressure simulation based on pointer speed
 * - Organic brush stamps with feathered edges and noise
 * - Coverage detection — auto-completes when 75% is revealed
 * - Animated hint to guide users to start painting
 * - Full touch support (multi-touch, stylus pressure)
 * - Respects prefers-reduced-motion (auto-reveals instantly)
 * - Cleans up all event listeners and canvas on completion
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface PaintRevealProps {
  onComplete?: () => void;
  /** 0–1 fraction of screen that must be painted before auto-complete (default 0.75) */
  completionThreshold?: number;
}

// ─── Brush Stamp ─────────────────────────────────────────────────────────────

function createBrushStamp(radius: number): HTMLCanvasElement {
  const size = radius * 2;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;

  // Soft radial gradient core
  const g = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
  g.addColorStop(0,    "rgba(0,0,0,1)");
  g.addColorStop(0.45, "rgba(0,0,0,0.98)");
  g.addColorStop(0.65, "rgba(0,0,0,0.7)");
  g.addColorStop(0.82, "rgba(0,0,0,0.3)");
  g.addColorStop(1,    "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2);
  ctx.fill();

  // Organic noise on the feathered edge
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) {
    if (d[i] > 0) {
      const px = ((i - 3) / 4) % size;
      const py = Math.floor(((i - 3) / 4) / size);
      const dist = Math.sqrt((px - radius) ** 2 + (py - radius) ** 2) / radius;
      const noiseAmt = Math.max(0, dist - 0.5) * 0.7;
      d[i] = Math.max(0, d[i] - Math.random() * noiseAmt * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

// ─── Coverage Sampler ─────────────────────────────────────────────────────────
// Samples a downscaled version of the canvas to estimate % revealed

function sampleCoverage(canvas: HTMLCanvasElement): number {
  const sampleW = 80;
  const sampleH = 60;
  const tmp = document.createElement("canvas");
  tmp.width = sampleW;
  tmp.height = sampleH;
  const ctx = tmp.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0, sampleW, sampleH);
  const data = ctx.getImageData(0, 0, sampleW, sampleH).data;
  let transparent = 0;
  const total = sampleW * sampleH;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 20) transparent++;
  }
  return transparent / total;
}

// ─── Lerp helper ─────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PaintReveal({
  onComplete,
  completionThreshold = 0.75,
}: PaintRevealProps) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayColor = theme === "dark" ? "#0a0a0a" : "#f5f0eb";

  const [isDone, setIsDone] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Pointer state
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const speedRef = useRef(0);
  const coverageCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoCompleteRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-generate brush stamps at multiple sizes
  const stampsRef = useRef<HTMLCanvasElement[]>([]);

  // ── Initialize canvas ──────────────────────────────────────────────────────
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, w, h);

    // Pre-generate brush stamps
    stampsRef.current = [40, 55, 70, 90, 110].map(createBrushStamp);
  }, [overlayColor]);

  // ── Paint a stroke between two points ─────────────────────────────────────
  const paintStroke = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x0: number, y0: number,
      x1: number, y1: number,
      pressure: number
    ) => {
      const stamps = stampsRef.current;
      if (!stamps.length) return;

      const dist = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
      // Step size — smaller = smoother but more expensive
      const step = Math.max(4, dist / 20);
      const steps = Math.ceil(dist / step);

      // Brush size based on pressure (faster = smaller, slower = larger)
      const baseSize = lerp(90, 140, Math.min(pressure, 1));

      ctx.globalCompositeOperation = "destination-out";

      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps;
        const x = lerp(x0, x1, t);
        const y = lerp(y0, y1, t);

        // Slight size variation per stamp for organic feel
        const sizeJitter = 0.85 + Math.random() * 0.3;
        const drawSize = baseSize * sizeJitter;

        // Pick stamp closest to desired size
        const stampIdx = Math.min(
          Math.floor((drawSize / 140) * stamps.length),
          stamps.length - 1
        );
        const stamp = stamps[stampIdx];

        // Slight angle jitter
        const angle = (Math.random() - 0.5) * 0.3;

        ctx.save();
        ctx.globalAlpha = 0.85 + Math.random() * 0.15;
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(stamp, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    },
    []
  );

  // ── Get canvas-relative coordinates ───────────────────────────────────────
  const getPos = (e: MouseEvent | Touch) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // ── Pointer down ──────────────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas || isDone) return;

      isDrawingRef.current = true;
      setHasStarted(true);
      setShowHint(false);

      const pos =
        "touches" in e ? getPos(e.touches[0]) : getPos(e as MouseEvent);
      lastPosRef.current = pos;
      lastTimeRef.current = Date.now();

      // Paint a single stamp on click/tap
      const ctx = canvas.getContext("2d")!;
      paintStroke(ctx, pos.x, pos.y, pos.x, pos.y, 0.5);
    },
    [isDone, paintStroke]
  );

  // ── Pointer move ──────────────────────────────────────────────────────────
  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (isDone) return;
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;

      // Hide hint on first movement
      setHasStarted(true);
      setShowHint(false);

      const touches = "touches" in e ? e.touches : null;
      const pointsToProcess = touches ? Array.from(touches) : [e as MouseEvent];

      for (const point of pointsToProcess) {
        const pos = getPos(point as Touch | MouseEvent);
        const last = lastPosRef.current;

        if (last) {
          // Calculate speed for pressure simulation
          const now = Date.now();
          const dt = Math.max(1, now - lastTimeRef.current);
          const dist = Math.sqrt((pos.x - last.x) ** 2 + (pos.y - last.y) ** 2);
          const speed = dist / dt; // px/ms
          // Smooth speed
          speedRef.current = lerp(speedRef.current, speed, 0.4);
          // Invert: slow movement = more pressure = larger brush
          const pressure = Math.max(0, 1 - speedRef.current * 0.8);

          paintStroke(ctx, last.x, last.y, pos.x, pos.y, pressure);
          lastTimeRef.current = now;
        }

        lastPosRef.current = pos;
      }
    },
    [isDone, paintStroke]
  );

  // ── Pointer up ────────────────────────────────────────────────────────────
  const handlePointerUp = useCallback(() => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
    speedRef.current = 0;
  }, []);

  // ── Complete reveal ────────────────────────────────────────────────────────
  const completeReveal = useCallback(() => {
    if (isDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Animate the remaining overlay fading out
    let alpha = 1;
    const fade = () => {
      alpha -= 0.06;
      if (alpha <= 0) {
        setIsDone(true);
        onComplete?.();
        return;
      }
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);
  }, [isDone, onComplete]);

  // ── Setup ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isDone) return;

    // Instant reveal for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsDone(true);
      onComplete?.();
      return;
    }

    initCanvas();

    const canvas = canvasRef.current!;

    // Mouse hover reveals — no click required
    window.addEventListener("mousemove", handlePointerMove as EventListener);

    // Touch drag reveals
    canvas.addEventListener("touchmove", handlePointerMove as EventListener, { passive: false });
    canvas.addEventListener("touchstart", handlePointerMove as EventListener, { passive: false });

    // Coverage check every 400ms — auto-complete when threshold reached
    coverageCheckRef.current = setInterval(() => {
      if (!hasStarted) return;
      const coverage = sampleCoverage(canvas);
      if (coverage >= completionThreshold) {
        if (coverageCheckRef.current) clearInterval(coverageCheckRef.current);
        completeReveal();
      }
    }, 400);

    // Auto-complete fallback after 30s in case user doesn't paint enough
    autoCompleteRef.current = setTimeout(() => {
      completeReveal();
    }, 30000);

    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove as EventListener);
      canvas.removeEventListener("touchmove", handlePointerMove as EventListener);
      canvas.removeEventListener("touchstart", handlePointerMove as EventListener);
      window.removeEventListener("resize", handleResize);
      if (coverageCheckRef.current) clearInterval(coverageCheckRef.current);
      if (autoCompleteRef.current) clearTimeout(autoCompleteRef.current);
    };
  }, [
    isDone,
    initCanvas,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    completeReveal,
    completionThreshold,
    hasStarted,
    onComplete,
  ]);

  if (isDone) return null;

  const hintColor = theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(30,20,10,0.6)";
  const hintBorder = theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(30,20,10,0.12)";

  return (
    <>
      {/* Canvas overlay — users paint on this */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 10000,
          cursor: "none",
          touchAction: "none",
          willChange: "transform",
        }}
      />

      {/* Animated hint — fades out once user starts painting */}
      {showHint && (
        <div
          style={{
            position: "fixed",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10001,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            animation: "hintPulse 2s ease-in-out infinite",
            opacity: hasStarted ? 0 : 1,
            transition: "opacity 0.6s ease",
          }}
        >
          {/* Brush icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            style={{ color: hintColor }}
          >
            <path
              d="M4 28 C8 24, 14 18, 20 12 L24 8 C26 6, 28 6, 28 8 C28 10, 26 12, 24 12 L20 16 C14 22, 8 26, 4 28Z"
              fill="currentColor"
              opacity="0.8"
            />
            <path
              d="M4 28 C5 25, 7 23, 9 24 C10 25, 8 27, 4 28Z"
              fill="currentColor"
            />
          </svg>

          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "13px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: hintColor,
              border: `1px solid ${hintBorder}`,
              padding: "8px 20px",
              backdropFilter: "blur(4px)",
              background: theme === "dark"
                ? "rgba(10,10,10,0.3)"
                : "rgba(245,240,235,0.4)",
              borderRadius: "2px",
            }}
          >
            Paint to reveal
          </span>

          {/* Animated dots indicating drag */}
          <div style={{ display: "flex", gap: "6px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: hintColor,
                  animation: `hintDot 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom cursor that follows the mouse */}
      <InteractiveCursor theme={theme} isDone={isDone} />

      {/* Keyframe styles */}
      <style>{`
        @keyframes hintPulse {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.9; }
          50% { transform: translateX(-50%) translateY(-6px); opacity: 0.6; }
        }
        @keyframes hintDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes cursorPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </>
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────

function InteractiveCursor({ theme, isDone }: { theme: string; isDone: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (isDone) return;

    const move = (e: MouseEvent | TouchEvent) => {
      const point = "touches" in e ? e.touches[0] : e as MouseEvent;
      posRef.current = { x: point.clientX, y: point.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (cursorRef.current) cursorRef.current.style.opacity = "1";
      }
    };

    const tick = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${posRef.current.x}px`;
        cursorRef.current.style.top = `${posRef.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move as EventListener, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move as EventListener);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isDone]);

  const ringColor = theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(20,15,10,0.5)";
  const dotColor = theme === "dark" ? "#ffffff" : "#1a1008";

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10002,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          width: "48px",
          height: "48px",
          border: `1.5px solid ${ringColor}`,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          animation: "cursorPulse 2s ease-in-out infinite",
          backdropFilter: "blur(1px)",
        }}
      />
      {/* Inner dot */}
      <div
        style={{
          position: "absolute",
          width: "8px",
          height: "8px",
          background: dotColor,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
