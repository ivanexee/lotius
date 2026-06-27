/**
 * SectionCurtain — Scroll-triggered staggered panel wipe
 *
 * Renders an invisible sentinel <div> in the DOM flow.
 * When the sentinel enters the viewport (scrolled into view), a fixed
 * overlay of N vertical panels sweeps upward in a staggered sequence,
 * matching the page-reveal curtain wipe aesthetic.
 *
 * Usage:
 *   <SectionCurtain color="oklch(0.08 0 0)" />
 *   — place this element between two sections in JSX.
 *
 * Props:
 *   color      — panel fill colour (default: near-black hero colour)
 *   panels     — number of vertical strips (default: 7)
 *   duration   — ms each panel takes to slide off-screen (default: 680)
 *   stagger    — ms delay between each panel (default: 55)
 *   threshold  — IntersectionObserver threshold 0–1 (default: 0.5)
 */

import { useEffect, useRef, useState, useCallback } from "react";

interface SectionCurtainProps {
  color?: string;
  panels?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
}

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export default function SectionCurtain({
  color   = "oklch(0.08 0 0)",
  panels  = 7,
  duration = 680,
  stagger  = 55,
  threshold = 0.5,
}: SectionCurtainProps) {
  const sentinelRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive]     = useState(false);
  const [visible, setVisible]   = useState(false);
  const firedRef = useRef(false); // fire only once per mount

  const fireWipe = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setVisible(true);
    setActive(false); // panels start at translateY(0) — covering screen

    // Tiny rAF to let the browser paint the panels before animating them away
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setActive(true); // triggers CSS transition → panels slide up
      });
    });

    // Hide the overlay after all panels have exited
    const totalDuration = stagger * (panels - 1) + duration + 80;
    setTimeout(() => {
      setVisible(false);
      // Allow re-fire if user scrolls back and re-enters
      firedRef.current = false;
    }, totalDuration);
  }, [duration, stagger, panels]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fireWipe();
        }
      },
      { threshold }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fireWipe, threshold]);

  return (
    <>
      {/* Sentinel — sits in normal document flow between sections */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        style={{ height: 1, pointerEvents: "none", overflow: "hidden" }}
      />

      {/* Fixed overlay — only rendered while the wipe is active */}
      {visible && (
        <div
          ref={containerRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 8000,
            display: "flex",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: panels }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "100%",
                background: color,
                transform: active ? "translateY(-100%)" : "translateY(0%)",
                transition: active
                  ? `transform ${duration}ms ${EASE} ${i * stagger}ms`
                  : "none",
                willChange: "transform",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
