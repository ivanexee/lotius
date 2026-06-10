/**
 * SummerWaves — Lotius
 * Design: Animated translucent wave layers that clash and flow behind the Summer gallery.
 * Uses SVG + CSS animation for silky smooth 60fps waves at multiple speeds and opacities.
 * Three wave layers at different frequencies create a liquid, oceanic depth effect.
 */
import { useEffect, useRef } from "react";

interface SummerWavesProps {
  active: boolean;
}

export default function SummerWaves({ active }: SummerWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.opacity = active ? "1" : "0";
  }, [active]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
        transition: "opacity 2s cubic-bezier(0.23, 1, 0.32, 1)",
        opacity: 0,
      }}
    >
      {/* Wave layer 1 — deep slow wave, teal-blue */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: "110%",
          height: "55%",
          animation: "waveFlow1 9s ease-in-out infinite",
          transformOrigin: "center bottom",
        }}
      >
        <defs>
          <linearGradient id="wave1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(100,180,230,0.18)" />
            <stop offset="100%" stopColor="rgba(60,140,200,0.08)" />
          </linearGradient>
        </defs>
        <path
          d="M0,160 C180,100 360,220 540,160 C720,100 900,220 1080,160 C1260,100 1380,180 1440,160 L1440,320 L0,320 Z"
          fill="url(#wave1Grad)"
        />
      </svg>

      {/* Wave layer 2 — mid speed, lighter cyan, offset phase */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: "18%",
          left: "-8%",
          width: "116%",
          height: "50%",
          animation: "waveFlow2 12s ease-in-out infinite",
          transformOrigin: "center bottom",
        }}
      >
        <defs>
          <linearGradient id="wave2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(140,210,240,0.14)" />
            <stop offset="100%" stopColor="rgba(80,170,220,0.05)" />
          </linearGradient>
        </defs>
        <path
          d="M0,200 C200,130 400,270 600,200 C800,130 1000,270 1200,200 C1320,150 1400,220 1440,200 L1440,320 L0,320 Z"
          fill="url(#wave2Grad)"
        />
      </svg>

      {/* Wave layer 3 — fast shallow ripple, near top */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: "15%",
          left: "-10%",
          width: "120%",
          height: "40%",
          animation: "waveFlow3 7s ease-in-out infinite",
          transformOrigin: "center top",
        }}
      >
        <defs>
          <linearGradient id="wave3Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(180,225,245,0.10)" />
            <stop offset="100%" stopColor="rgba(100,180,230,0.03)" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 C120,40 240,120 360,80 C480,40 600,120 720,80 C840,40 960,120 1080,80 C1200,40 1320,100 1440,80 L1440,200 L0,200 Z"
          fill="url(#wave3Grad)"
        />
      </svg>

      {/* Wave layer 4 — rising clash wave from bottom-left */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: "0%",
          left: "-3%",
          width: "106%",
          height: "45%",
          animation: "waveFlow4 15s ease-in-out infinite",
          transformOrigin: "left bottom",
        }}
      >
        <defs>
          <linearGradient id="wave4Grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(50,130,200,0.12)" />
            <stop offset="50%" stopColor="rgba(120,200,240,0.08)" />
            <stop offset="100%" stopColor="rgba(50,130,200,0.12)" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 C240,60 480,160 720,100 C960,40 1200,140 1440,100 L1440,320 L0,320 Z"
          fill="url(#wave4Grad)"
        />
      </svg>

      {/* Shimmer highlight — diagonal light streak */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "-20%",
          width: "60%",
          height: "30%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(180,230,255,0.12) 40%, transparent 70%)",
          borderRadius: "50%",
          animation: "shimmerDrift 11s ease-in-out infinite",
          filter: "blur(30px)",
        }}
      />

      <style>{`
        @keyframes waveFlow1 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          33% { transform: translateX(-3%) scaleY(1.08); }
          66% { transform: translateX(3%) scaleY(0.94); }
        }
        @keyframes waveFlow2 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          40% { transform: translateX(4%) scaleY(1.12); }
          70% { transform: translateX(-2%) scaleY(0.9); }
        }
        @keyframes waveFlow3 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-5%) scaleY(1.15); }
        }
        @keyframes waveFlow4 {
          0%, 100% { transform: translateX(0) scaleY(1) rotate(0deg); }
          25% { transform: translateX(2%) scaleY(1.05) rotate(0.3deg); }
          50% { transform: translateX(-3%) scaleY(0.95) rotate(-0.3deg); }
          75% { transform: translateX(1%) scaleY(1.08) rotate(0.2deg); }
        }
        @keyframes shimmerDrift {
          0%, 100% { transform: translate(0, 0) rotate(-5deg); opacity: 0.7; }
          50% { transform: translate(40%, 10%) rotate(5deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
