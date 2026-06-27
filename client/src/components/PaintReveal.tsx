/**
 * CurtainReveal — Staggered panel wipe transition
 *
 * Multiple vertical panels sweep upward in a staggered sequence,
 * revealing the hero content beneath. Inspired by the Lando Norris
 * website's sharp rectangular block wipe transitions.
 *
 * - N vertical panels, each sliding up with a slight stagger delay
 * - Sharp cubic-bezier easing for an energetic, editorial feel
 * - Colour matches the loading screen paper tone
 * - Respects prefers-reduced-motion (instant reveal)
 * - Calls onComplete when all panels have exited
 */

import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface PaintRevealProps {
  onComplete?: () => void;
  completionThreshold?: number; // kept for API compatibility, unused
}

const PANEL_COUNT = 7;          // number of vertical strips
const DURATION    = 680;        // ms each panel takes to slide off-screen
const STAGGER     = 55;         // ms delay between each panel
const EASE        = "cubic-bezier(0.76, 0, 0.24, 1)"; // sharp ease-in-out

export default function PaintReveal({ onComplete }: PaintRevealProps) {
  useTheme(); // keep context subscription for future use
  const containerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  // Hero near-black — creates a seamless dark-to-dark transition
  const panelColor = "oklch(0.08 0 0)";

  useEffect(() => {
    if (doneRef.current) return;

    // Instant reveal for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doneRef.current = true;
      onComplete?.();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Total animation time = last panel starts + its own duration
    const totalDuration = STAGGER * (PANEL_COUNT - 1) + DURATION;

    // Trigger the slide-up on each panel
    const panels = Array.from(container.querySelectorAll<HTMLDivElement>(".curtain-panel"));
    panels.forEach((panel, i) => {
      setTimeout(() => {
        panel.style.transform = "translateY(-100%)";
      }, i * STAGGER);
    });

    // Call onComplete after all panels have exited
    const timer = setTimeout(() => {
      doneRef.current = true;
      onComplete?.();
    }, totalDuration + 80); // small buffer

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: PANEL_COUNT }).map((_, i) => (
        <div
          key={i}
          className="curtain-panel"
          style={{
            flex: 1,
            height: "100%",
            background: panelColor,
            transform: "translateY(0%)",
            transition: `transform ${DURATION}ms ${EASE}`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
