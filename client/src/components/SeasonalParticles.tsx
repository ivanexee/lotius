/**
 * SeasonalParticles — Lotius
 * Scroll-triggered atmospheric particle effects for each season:
 * - Spring: Sakura petals falling gracefully from top-right
 * - Summer: Golden fireflies / sun motes floating upward
 * - Fall: Autumn leaves drifting down with rotation
 *
 * Uses IntersectionObserver to activate when the section approaches viewport.
 * Canvas-based for smooth 60fps performance.
 */
import { useEffect, useRef, useState } from "react";

type Season = "spring" | "summer" | "fall";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  // For leaves: wobble phase
  wobblePhase: number;
  wobbleSpeed: number;
}

const COLORS: Record<Season, string[]> = {
  spring: ["#ffb7c5", "#ffc1cc", "#ff9eb5", "#ffd1dc", "#fff0f3"],
  summer: ["#ffd700", "#ffec8b", "#fff8dc", "#ffe4b5", "#ffefd5"],
  fall: ["#d2691e", "#cd853f", "#b8860b", "#8b4513", "#a0522d", "#daa520", "#cc5500"],
};

function createParticle(season: Season, canvasWidth: number, canvasHeight: number): Particle {
  const colors = COLORS[season];
  const color = colors[Math.floor(Math.random() * colors.length)];

  if (season === "spring") {
    // Sakura petals: fall from top-right area, drift left
    return {
      x: canvasWidth * 0.4 + Math.random() * canvasWidth * 0.7,
      y: -20 - Math.random() * 100,
      size: 6 + Math.random() * 10,
      speedX: -0.3 - Math.random() * 0.6,
      speedY: 0.8 + Math.random() * 1.2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: 0.4 + Math.random() * 0.5,
      color,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
    };
  } else if (season === "summer") {
    // Fireflies: float upward from bottom, gentle drift
    return {
      x: Math.random() * canvasWidth,
      y: canvasHeight + 20 + Math.random() * 50,
      size: 2 + Math.random() * 4,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -0.4 - Math.random() * 0.8,
      rotation: 0,
      rotationSpeed: 0,
      opacity: 0.3 + Math.random() * 0.6,
      color,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.03 + Math.random() * 0.02,
    };
  } else {
    // Fall leaves: drift down with rotation and wobble
    return {
      x: Math.random() * canvasWidth * 1.2 - canvasWidth * 0.1,
      y: -30 - Math.random() * 80,
      size: 8 + Math.random() * 14,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: 1.0 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3,
      opacity: 0.5 + Math.random() * 0.4,
      color,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.015 + Math.random() * 0.02,
    };
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;

  // Petal shape
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner detail
  ctx.globalAlpha = p.opacity * 0.3;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.2, p.size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawFirefly(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalAlpha = p.opacity;

  // Glow
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
  gradient.addColorStop(0, p.color);
  gradient.addColorStop(0.4, p.color + "80");
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
  ctx.fill();

  // Core
  ctx.globalAlpha = p.opacity * 1.2;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawLeaf(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;

  // Leaf shape
  ctx.beginPath();
  ctx.moveTo(0, -p.size);
  ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.6, p.size * 0.6, p.size * 0.3, 0, p.size);
  ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.3, -p.size * 0.6, -p.size * 0.6, 0, -p.size);
  ctx.fill();

  // Vein
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -p.size * 0.8);
  ctx.lineTo(0, p.size * 0.8);
  ctx.stroke();

  ctx.restore();
}

interface SeasonalParticlesProps {
  season: Season;
  active: boolean;
}

export default function SeasonalParticles({ season, active }: SeasonalParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (active) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const maxParticles = season === "summer" ? 30 : 25;
    let frameCount = 0;

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (!active) {
        // Fade out existing particles
        particlesRef.current = particlesRef.current.filter((p) => {
          p.opacity -= 0.01;
          return p.opacity > 0;
        });
      }

      // Spawn new particles
      if (active && particlesRef.current.length < maxParticles) {
        frameCount++;
        if (frameCount % 8 === 0) {
          particlesRef.current.push(createParticle(season, w, h));
        }
      }

      // Update and draw
      particlesRef.current = particlesRef.current.filter((p) => {
        // Update position
        p.wobblePhase += p.wobbleSpeed;
        const wobble = Math.sin(p.wobblePhase) * 1.5;

        p.x += p.speedX + wobble * 0.3;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Draw based on season
        if (season === "spring") {
          drawPetal(ctx, p);
        } else if (season === "summer") {
          // Fireflies pulse
          p.opacity = 0.3 + Math.sin(p.wobblePhase * 2) * 0.3;
          drawFirefly(ctx, p);
        } else {
          drawLeaf(ctx, p);
        }

        // Remove if out of bounds
        if (season === "summer") {
          return p.y > -50 && p.opacity > 0;
        }
        return p.y < h + 50 && p.x > -50 && p.x < w + 50 && p.opacity > 0;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [season, active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
        opacity,
        transition: "opacity 1.5s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    />
  );
}
