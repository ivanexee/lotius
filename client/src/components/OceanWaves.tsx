/**
 * OceanWaves — Realistic animated ocean with layered sine waves, foam crests,
 * and a warm golden sunray beam casting over the gallery.
 * Used exclusively in the Summer collection section.
 */
import { useEffect, useRef } from "react";

interface OceanWavesProps {
  active?: boolean;
}

export default function OceanWaves({ active = true }: OceanWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Wave layer definitions — deeper = darker, more transparent
    const layers = [
      { amp: 28, freq: 0.012, speed: 0.018, y: 0.72, alpha: 0.18, color: "38,120,200" },
      { amp: 22, freq: 0.018, speed: 0.024, y: 0.76, alpha: 0.22, color: "30,100,180" },
      { amp: 18, freq: 0.022, speed: 0.032, y: 0.80, alpha: 0.28, color: "20,80,160" },
      { amp: 14, freq: 0.028, speed: 0.042, y: 0.84, alpha: 0.35, color: "15,65,145" },
      { amp: 10, freq: 0.035, speed: 0.055, y: 0.88, alpha: 0.45, color: "10,50,130" },
    ];

    const drawWave = (
      layer: typeof layers[0],
      w: number,
      h: number,
      time: number
    ) => {
      const baseY = h * layer.y;
      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x <= w; x += 3) {
        const y =
          baseY +
          Math.sin(x * layer.freq + time * layer.speed * 60) * layer.amp +
          Math.sin(x * layer.freq * 1.7 + time * layer.speed * 45) * (layer.amp * 0.4) +
          Math.sin(x * layer.freq * 0.5 + time * layer.speed * 30) * (layer.amp * 0.6);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, baseY - layer.amp, 0, h);
      grad.addColorStop(0, `rgba(${layer.color},${layer.alpha})`);
      grad.addColorStop(1, `rgba(${layer.color},${layer.alpha * 0.4})`);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const drawFoam = (layer: typeof layers[0], w: number, h: number, time: number) => {
      const baseY = h * layer.y;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y =
          baseY +
          Math.sin(x * layer.freq + time * layer.speed * 60) * layer.amp +
          Math.sin(x * layer.freq * 1.7 + time * layer.speed * 45) * (layer.amp * 0.4) +
          Math.sin(x * layer.freq * 0.5 + time * layer.speed * 30) * (layer.amp * 0.6);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255,255,255,${layer.alpha * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const drawSunray = (w: number, h: number, time: number) => {
      // Sunray origin — upper right area
      const ox = w * 0.78;
      const oy = -h * 0.05;

      const rays = [
        { angle: 0.55, width: 0.18, alpha: 0.07 },
        { angle: 0.62, width: 0.10, alpha: 0.10 },
        { angle: 0.70, width: 0.22, alpha: 0.06 },
        { angle: 0.78, width: 0.08, alpha: 0.12 },
        { angle: 0.85, width: 0.14, alpha: 0.08 },
        { angle: 0.92, width: 0.06, alpha: 0.09 },
      ];

      const pulse = 0.85 + Math.sin(time * 0.4) * 0.15;

      rays.forEach((ray) => {
        const halfW = ray.width / 2;
        const len = Math.sqrt(w * w + h * h) * 1.2;

        const a1 = (ray.angle - halfW) * Math.PI;
        const a2 = (ray.angle + halfW) * Math.PI;

        const x1 = ox + Math.cos(a1) * len;
        const y1 = oy + Math.sin(a1) * len;
        const x2 = ox + Math.cos(a2) * len;
        const y2 = oy + Math.sin(a2) * len;

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, len);
        grad.addColorStop(0, `rgba(255,220,100,${ray.alpha * pulse})`);
        grad.addColorStop(0.4, `rgba(255,200,60,${ray.alpha * pulse * 0.5})`);
        grad.addColorStop(1, `rgba(255,180,30,0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Central sun glow
      const sunGlow = ctx.createRadialGradient(ox, oy, 0, ox, oy, h * 0.55);
      sunGlow.addColorStop(0, `rgba(255,240,160,${0.18 * pulse})`);
      sunGlow.addColorStop(0.3, `rgba(255,200,80,${0.08 * pulse})`);
      sunGlow.addColorStop(1, "rgba(255,180,30,0)");
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, w, h);
    };

    const drawDeepOcean = (w: number, h: number) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(8,40,90,0)");
      grad.addColorStop(0.6, "rgba(8,40,90,0.12)");
      grad.addColorStop(1, "rgba(5,25,70,0.25)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      drawDeepOcean(w, h);
      drawSunray(w, h, t);

      // Draw waves back to front
      [...layers].reverse().forEach((layer) => {
        drawWave(layer, w, h, t);
        drawFoam(layer, w, h, t);
      });

      t += 0.016;
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
