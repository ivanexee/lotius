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
      {/* Wave 1 — deep ocean teal, slow rolling swell from bottom */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: "0%",
          left: "-5%",
          width: "110%",
          height: "60%",
          animation: "waveRoll1 10s ease-in-out infinite",
          transformOrigin: "center bottom",
        }}
      >
        <defs>
          <linearGradient id="w1g" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,150,200,0.38)" />
            <stop offset="60%" stopColor="rgba(0,120,180,0.22)" />
            <stop offset="100%" stopColor="rgba(0,90,160,0.12)" />
          </linearGradient>
        </defs>
        <path
          d="M0,200 C180,120 360,280 540,200 C720,120 900,280 1080,200 C1260,120 1380,220 1440,200 L1440,400 L0,400 Z"
          fill="url(#w1g)"
        />
      </svg>

      {/* Wave 2 — bright cyan clash wave, faster */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: "12%",
          left: "-8%",
          width: "116%",
          height: "55%",
          animation: "waveRoll2 7s ease-in-out infinite",
          transformOrigin: "center bottom",
        }}
      >
        <defs>
          <linearGradient id="w2g" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,200,230,0.32)" />
            <stop offset="50%" stopColor="rgba(0,180,220,0.18)" />
            <stop offset="100%" stopColor="rgba(0,150,200,0.06)" />
          </linearGradient>
        </defs>
        <path
          d="M0,240 C200,150 400,320 600,240 C800,150 1000,320 1200,240 C1320,180 1400,260 1440,240 L1440,400 L0,400 Z"
          fill="url(#w2g)"
        />
      </svg>

      {/* Wave 3 — turquoise mid-section wave, counter-phase */}
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: "25%",
          left: "-10%",
          width: "120%",
          height: "45%",
          animation: "waveRoll3 13s ease-in-out infinite",
          transformOrigin: "center center",
        }}
      >
        <defs>
          <linearGradient id="w3g" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(20,210,210,0.28)" />
            <stop offset="100%" stopColor="rgba(0,170,200,0.08)" />
          </linearGradient>
        </defs>
        <path
          d="M0,120 C120,60 240,180 360,120 C480,60 600,180 720,120 C840,60 960,180 1080,120 C1200,60 1320,140 1440,120 L1440,300 L0,300 Z"
          fill="url(#w3g)"
        />
      </svg>

      {/* Wave 4 — sapphire deep clash from bottom-left, slowest */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: "5%",
          left: "-3%",
          width: "106%",
          height: "50%",
          animation: "waveRoll4 17s ease-in-out infinite",
          transformOrigin: "left bottom",
        }}
      >
        <defs>
          <linearGradient id="w4g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(30,100,220,0.26)" />
            <stop offset="40%" stopColor="rgba(0,180,230,0.18)" />
            <stop offset="100%" stopColor="rgba(30,100,220,0.22)" />
          </linearGradient>
        </defs>
        <path
          d="M0,160 C240,80 480,240 720,160 C960,80 1200,220 1440,160 L1440,400 L0,400 Z"
          fill="url(#w4g)"
        />
      </svg>

      {/* Wave 5 — top surface ripple, vivid aqua */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: "10%",
          left: "-12%",
          width: "124%",
          height: "35%",
          animation: "waveRoll5 8s ease-in-out infinite",
          transformOrigin: "center top",
        }}
      >
        <defs>
          <linearGradient id="w5g" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,230,220,0.22)" />
            <stop offset="100%" stopColor="rgba(0,190,210,0.05)" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 C90,20 180,100 270,60 C360,20 450,100 540,60 C630,20 720,100 810,60 C900,20 990,100 1080,60 C1170,20 1260,90 1440,60 L1440,200 L0,200 Z"
          fill="url(#w5g)"
        />
      </svg>

      <style>{`
        @keyframes waveRoll1 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          35% { transform: translateX(-4%) scaleY(1.12); }
          68% { transform: translateX(4%) scaleY(0.92); }
        }
        @keyframes waveRoll2 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          45% { transform: translateX(5%) scaleY(1.18); }
          72% { transform: translateX(-3%) scaleY(0.88); }
        }
        @keyframes waveRoll3 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-6%) scaleY(1.22); }
        }
        @keyframes waveRoll4 {
          0%, 100% { transform: translateX(0) scaleY(1) rotate(0deg); }
          25% { transform: translateX(3%) scaleY(1.08) rotate(0.4deg); }
          50% { transform: translateX(-4%) scaleY(0.94) rotate(-0.4deg); }
          75% { transform: translateX(2%) scaleY(1.1) rotate(0.2deg); }
        }
        @keyframes waveRoll5 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(7%) scaleY(1.3); }
        }
      `}</style>
    </div>
  );
}
