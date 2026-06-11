import { useEffect, useRef, useState } from "react";

type Season = "spring" | "summer" | "fall" | "winter";

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
  wobblePhase: number;
  wobbleSpeed: number;
  arms?: number; // for snowflakes
}

const COLORS: Record<Season, string[]> = {
  spring: ["#ffb7c5", "#ffc1cc", "#ff9eb5", "#ffd1dc", "#fff0f3", "#f9a8c9"],
  summer: [], // summer uses waves only — no particles
  fall: ["#d2691e", "#cd853f", "#b8860b", "#8b4513", "#a0522d", "#daa520", "#cc5500", "#e07b39"],
  winter: ["#e8f4fd", "#cce7f7", "#b3d9f0", "#ddeeff", "#f0f8ff", "#c9e6f5"],
};

function createParticle(season: Season, canvasWidth: number, canvasHeight: number): Particle {
  const colors = COLORS[season];
  const color = colors[Math.floor(Math.random() * colors.length)];

  if (season === "spring") {
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
  } else if (season === "fall") {
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
  } else {
    // Winter snowflakes — fall from top, gentle drift
    return {
      x: Math.random() * canvasWidth * 1.1 - canvasWidth * 0.05,
      y: -20 - Math.random() * 80,
      size: 3 + Math.random() * 9,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: 0.5 + Math.random() * 1.0,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.8,
      opacity: 0.3 + Math.random() * 0.55,
      color,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.015,
      arms: [6, 8][Math.floor(Math.random() * 2)],
    };
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = p.opacity * 0.3;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.2, p.size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLeaf(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.moveTo(0, -p.size);
  ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.6, p.size * 0.6, p.size * 0.3, 0, p.size);
  ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.3, -p.size * 0.6, -p.size * 0.6, 0, -p.size);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -p.size * 0.8);
  ctx.lineTo(0, p.size * 0.8);
  ctx.stroke();
  ctx.restore();
}

function drawSnowflake(ctx: CanvasRenderingContext2D, p: Particle) {
  const arms = p.arms ?? 6;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity;
  ctx.strokeStyle = p.color;
  ctx.lineWidth = Math.max(0.5, p.size * 0.12);
  ctx.lineCap = "round";

  for (let i = 0; i < arms; i++) {
    const angle = (i / arms) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const len = p.size;

    // Main arm
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cos * len, sin * len);
    ctx.stroke();

    // Branch 1
    const b1x = cos * len * 0.55;
    const b1y = sin * len * 0.55;
    const bAngle1 = angle + Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(b1x, b1y);
    ctx.lineTo(b1x + Math.cos(bAngle1) * len * 0.28, b1y + Math.sin(bAngle1) * len * 0.28);
    ctx.stroke();

    // Branch 2 (mirror)
    const bAngle2 = angle - Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(b1x, b1y);
    ctx.lineTo(b1x + Math.cos(bAngle2) * len * 0.28, b1y + Math.sin(bAngle2) * len * 0.28);
    ctx.stroke();
  }

  // Center dot
  ctx.globalAlpha = p.opacity * 0.8;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(0, 0, p.size * 0.12, 0, Math.PI * 2);
  ctx.fill();

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

  // Summer has no particles — just waves
  const hasParticles = season !== "summer";

  useEffect(() => {
    if (active && hasParticles) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [active, hasParticles]);

  useEffect(() => {
    if (!hasParticles) return;

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

    const maxParticles = season === "winter" ? 40 : 25;
    let frameCount = 0;

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (!active) {
        particlesRef.current = particlesRef.current.filter((p) => {
          p.opacity -= 0.008;
          return p.opacity > 0;
        });
      }

      if (active && particlesRef.current.length < maxParticles) {
        frameCount++;
        const spawnRate = season === "winter" ? 6 : 8;
        if (frameCount % spawnRate === 0) {
          particlesRef.current.push(createParticle(season, w, h));
        }
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.wobblePhase += p.wobbleSpeed;
        const wobble = Math.sin(p.wobblePhase) * (season === "winter" ? 1.0 : 1.5);

        p.x += p.speedX + wobble * 0.3;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (season === "spring") {
          drawPetal(ctx, p);
        } else if (season === "fall") {
          drawLeaf(ctx, p);
        } else if (season === "winter") {
          drawSnowflake(ctx, p);
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
  }, [season, active, hasParticles]);

  if (!hasParticles) return null;

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
