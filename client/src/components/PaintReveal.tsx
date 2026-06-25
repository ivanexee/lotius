/**
 * PaintReveal Component
 * Premium paint brush mask reveal animation inspired by Lando Norris' website.
 * Uses HTML Canvas with pre-generated brush stamps and bezier curve paths
 * for GPU-accelerated, 60 FPS organic reveal.
 *
 * Architecture:
 * 1. A full-screen canvas overlay sits on top of the page content.
 * 2. The canvas starts fully opaque (overlay color).
 * 3. Pre-computed brush stroke paths are animated using requestAnimationFrame.
 * 4. Each frame, brush stamps are drawn along the paths using "destination-out"
 *    composite mode to erase the overlay and reveal content beneath.
 * 5. After full reveal, the canvas is removed from the DOM entirely.
 */

import { useEffect, useRef, useState, useCallback } from "react";

interface PaintRevealProps {
  /** Animation duration in ms (default 2200) */
  duration?: number;
  /** Callback when reveal animation completes */
  onComplete?: () => void;
  /** Overlay color (default white) */
  overlayColor?: string;
  /** Whether to use dark overlay (for dark backgrounds) */
  darkOverlay?: boolean;
}

// ─── Brush Stamp Generator ───────────────────────────────────────────────────
// Creates a reusable offscreen canvas with a soft, noisy brush tip

function createBrushStamp(radius: number): HTMLCanvasElement {
  const size = radius * 2;
  const stamp = document.createElement("canvas");
  stamp.width = size;
  stamp.height = size;
  const ctx = stamp.getContext("2d")!;

  // Base radial gradient — soft feathered edges
  const gradient = ctx.createRadialGradient(
    radius, radius, 0,
    radius, radius, radius
  );
  gradient.addColorStop(0, "rgba(0,0,0,1)");
  gradient.addColorStop(0.5, "rgba(0,0,0,0.95)");
  gradient.addColorStop(0.7, "rgba(0,0,0,0.6)");
  gradient.addColorStop(0.85, "rgba(0,0,0,0.25)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2);
  ctx.fill();

  // Add organic noise to break up the perfect circle
  const imageData = ctx.getImageData(0, 0, size, size);
  const d = imageData.data;
  for (let i = 3; i < d.length; i += 4) {
    // Only affect pixels that have some alpha
    if (d[i] > 0) {
      const px = ((i - 3) / 4) % size;
      const py = Math.floor(((i - 3) / 4) / size);
      const distFromCenter = Math.sqrt((px - radius) ** 2 + (py - radius) ** 2) / radius;

      // More noise at edges, less at center
      const noiseStrength = distFromCenter * 0.5;
      const noise = (Math.random() - 0.5) * noiseStrength;
      d[i] = Math.max(0, Math.min(255, d[i] + noise * 255));
    }
  }
  ctx.putImageData(imageData, 0, 0);

  return stamp;
}

// ─── Stroke Path Generator ───────────────────────────────────────────────────
// Pre-computes organic brush stroke paths using bezier curves

interface StrokePoint {
  x: number;
  y: number;
  size: number;
  rotation: number;
  alpha: number;
}

function generateStrokePaths(
  width: number,
  height: number,
  strokeCount: number
): StrokePoint[][] {
  const paths: StrokePoint[][] = [];
  const seed = Date.now();

  // Pseudo-random with seed for consistency
  const seededRandom = (i: number) => {
    const x = Math.sin(seed + i * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  };

  for (let s = 0; s < strokeCount; s++) {
    const points: StrokePoint[] = [];
    const r = seededRandom;

    // Each stroke sweeps across a portion of the screen
    const startX = r(s * 100) * width * 0.3 - width * 0.1;
    const startY = r(s * 200) * height;
    const endX = width * 0.8 + r(s * 300) * width * 0.3;
    const endY = r(s * 400) * height;

    // Control points for bezier curve
    const cp1x = startX + (endX - startX) * 0.3 + (r(s * 500) - 0.5) * width * 0.3;
    const cp1y = startY + (r(s * 600) - 0.5) * height * 0.4;
    const cp2x = startX + (endX - startX) * 0.7 + (r(s * 700) - 0.5) * width * 0.3;
    const cp2y = endY + (r(s * 800) - 0.5) * height * 0.4;

    // Sample points along the bezier curve
    const pointCount = 30 + Math.floor(r(s * 900) * 20);
    for (let i = 0; i <= pointCount; i++) {
      const t = i / pointCount;

      // Cubic bezier interpolation
      const mt = 1 - t;
      const x = mt ** 3 * startX + 3 * mt ** 2 * t * cp1x + 3 * mt * t ** 2 * cp2x + t ** 3 * endX;
      const y = mt ** 3 * startY + 3 * mt ** 2 * t * cp1y + 3 * mt * t ** 2 * cp2y + t ** 3 * endY;

      // Organic size variation — larger in the middle, smaller at edges
      const sizeCurve = Math.sin(t * Math.PI) * 0.6 + 0.4;
      const baseSize = 80 + r(s * 1000 + i) * 120;
      const size = baseSize * sizeCurve;

      // Slight rotation variation
      const rotation = (r(s * 1100 + i) - 0.5) * 0.4;

      // Alpha variation — pressure simulation
      const alpha = 0.6 + Math.sin(t * Math.PI) * 0.4;

      points.push({ x, y, size, rotation, alpha });
    }

    paths.push(points);
  }

  return paths;
}

// ─── Easing Functions ────────────────────────────────────────────────────────

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PaintReveal({
  duration = 2200,
  onComplete,
  overlayColor,
  darkOverlay = false,
}: PaintRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDone, setIsDone] = useState(false);
  const animFrameRef = useRef<number>(0);
  const brushStampsRef = useRef<HTMLCanvasElement[]>([]);
  const strokePathsRef = useRef<StrokePoint[][]>([]);
  const startTimeRef = useRef<number>(0);

  // Determine overlay color based on theme
  const resolvedOverlay = overlayColor || (darkOverlay ? "#0a0a0a" : "#ffffff");

  // Initialize brush stamps and stroke paths
  const initialize = useCallback((w: number, h: number) => {
    // Pre-generate brush stamps at different sizes for variety
    brushStampsRef.current = [
      createBrushStamp(60),
      createBrushStamp(80),
      createBrushStamp(100),
      createBrushStamp(130),
      createBrushStamp(160),
    ];

    // Generate 6-8 organic stroke paths that cover the screen
    strokePathsRef.current = generateStrokePaths(w, h, 7);
  }, []);

  // Main render loop
  const render = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = timestamp - startTimeRef.current;
    const rawProgress = Math.min(elapsed / duration, 1);
    const progress = easeInOutCubic(rawProgress);

    const w = canvas.width;
    const h = canvas.height;
    const stamps = brushStampsRef.current;
    const paths = strokePathsRef.current;

    // Start fresh each frame — fill with overlay color
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = resolvedOverlay;
    ctx.fillRect(0, 0, w, h);

    // Switch to eraser mode — stamps will punch through the overlay
    ctx.globalCompositeOperation = "destination-out";

    // Draw each stroke path up to the current progress
    for (let s = 0; s < paths.length; s++) {
      const path = paths[s];
      // Stagger each stroke's start time
      const strokeDelay = s * 0.08;
      const strokeProgress = Math.max(0, Math.min(1, (progress - strokeDelay) / (1 - strokeDelay * 0.5)));

      if (strokeProgress <= 0) continue;

      const easedStroke = easeOutExpo(strokeProgress);
      const pointsToRender = Math.floor(easedStroke * path.length);

      for (let i = 0; i < pointsToRender; i++) {
        const pt = path[i];
        const stamp = stamps[s % stamps.length];

        ctx.save();
        ctx.globalAlpha = pt.alpha * Math.min(1, strokeProgress * 2);
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rotation);

        // Draw the pre-rendered brush stamp
        const drawSize = pt.size;
        ctx.drawImage(stamp, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
      }
    }

    // Add a final full-screen fade at the end for clean finish
    if (progress > 0.7) {
      const fadeProgress = (progress - 0.7) / 0.3;
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = easeOutExpo(fadeProgress);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);
    }

    // Reset composite mode
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    if (rawProgress < 1) {
      animFrameRef.current = requestAnimationFrame(render);
    } else {
      // Animation complete — clean up
      setIsDone(true);
      onComplete?.();
    }
  }, [duration, resolvedOverlay, onComplete]);

  // Setup and start animation
  useEffect(() => {
    if (isDone) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsDone(true);
      onComplete?.();
      return;
    }

    // Size canvas to device pixel ratio for crisp rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Initialize brush assets
    initialize(w, h);

    // Fill initial overlay
    if (ctx) {
      ctx.fillStyle = resolvedOverlay;
      ctx.fillRect(0, 0, w, h);
    }

    // Start animation after a brief delay for page to settle
    const timer = setTimeout(() => {
      startTimeRef.current = 0;
      animFrameRef.current = requestAnimationFrame(render);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isDone, initialize, render, resolvedOverlay, onComplete]);

  // Handle resize
  useEffect(() => {
    if (isDone) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      initialize(w, h);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDone, initialize]);

  // Don't render anything after animation completes
  if (isDone) return null;

  return (
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
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
