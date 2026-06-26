/**
 * LoadingScreen — Lotius
 * Uses the hand-drawn 'lotius' logo as the centrepiece.
 * The logo fades in, gently pulses, and the progress counter counts up.
 * Adapts: dark mode → logo white; light mode → black ink.
 */
import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// Inline SVG path traced from the hand-drawn lotius logo
const LOGO_PATH = "M 201 312 L 198 312 L 193 314 L 189 320 L 189 330 L 191 340 L 190 394 L 191 396 L 195 399 L 201 399 L 203 398 L 206 395 L 208 388 L 206 372 L 206 319 L 204 314 Z M 285 311 L 282 310 L 279 311 L 275 314 L 272 319 L 272 326 L 276 336 L 278 344 L 279 361 L 278 368 L 274 378 L 272 381 L 266 386 L 257 386 L 249 382 L 244 376 L 241 369 L 241 352 L 246 334 L 246 323 L 243 319 L 241 318 L 237 318 L 231 320 L 226 324 L 224 328 L 224 330 L 226 332 L 235 333 L 234 343 L 231 351 L 229 361 L 228 375 L 232 388 L 235 392 L 240 396 L 247 399 L 253 400 L 258 400 L 269 397 L 278 392 L 284 386 L 289 378 L 294 363 L 295 357 L 295 343 L 292 324 L 289 315 Z M 103 309 L 98 308 L 88 308 L 77 312 L 66 319 L 57 328 L 52 338 L 50 347 L 50 355 L 52 364 L 57 374 L 61 379 L 70 386 L 77 389 L 81 390 L 93 390 L 103 387 L 109 384 L 115 380 L 124 371 L 129 362 L 131 354 L 131 341 L 128 331 L 123 323 L 114 314 Z M 83 322 L 93 322 L 100 325 L 109 334 L 112 339 L 114 345 L 114 360 L 111 367 L 104 374 L 100 376 L 90 376 L 82 373 L 73 365 L 68 356 L 67 352 L 67 339 L 71 330 L 76 325 Z M 356 281 L 342 281 L 335 283 L 329 286 L 319 295 L 315 301 L 312 310 L 312 326 L 315 336 L 327 355 L 337 367 L 347 381 L 356 398 L 359 408 L 359 422 L 356 430 L 347 438 L 344 439 L 333 439 L 326 437 L 321 434 L 315 428 L 313 425 L 311 419 L 312 410 L 314 406 L 320 400 L 321 398 L 320 396 L 313 395 L 304 402 L 301 406 L 297 415 L 296 420 L 296 429 L 297 433 L 300 439 L 307 446 L 319 452 L 325 453 L 334 453 L 348 449 L 357 444 L 362 440 L 368 432 L 373 422 L 375 413 L 375 404 L 373 394 L 369 384 L 359 367 L 331 329 L 326 315 L 326 308 L 329 300 L 333 296 L 340 293 L 349 294 L 353 296 L 358 301 L 360 305 L 360 311 L 358 314 L 359 319 L 365 319 L 369 315 L 372 310 L 373 306 L 373 294 L 371 290 L 367 286 L 362 283 Z M 212 178 L 207 178 L 202 183 L 190 200 L 187 206 L 187 211 L 189 213 L 200 213 L 222 208 L 224 206 L 223 202 L 221 201 L 212 201 L 205 203 L 202 202 L 202 200 L 214 184 L 214 180 Z M 161 43 L 158 43 L 155 45 L 153 48 L 151 60 L 150 77 L 149 147 L 151 238 L 150 240 L 145 244 L 106 242 L 99 245 L 97 247 L 94 255 L 95 260 L 97 261 L 103 261 L 117 258 L 132 257 L 148 257 L 151 260 L 151 541 L 149 629 L 149 669 L 150 686 L 151 689 L 154 692 L 159 692 L 163 689 L 166 681 L 166 577 L 164 430 L 165 260 L 169 257 L 193 257 L 225 259 L 235 258 L 242 255 L 247 249 L 247 243 L 244 240 L 231 240 L 206 243 L 168 243 L 165 240 L 166 127 L 165 49 L 163 44 Z M 21 15 L 15 22 L 15 84 L 17 164 L 17 283 L 15 404 L 17 448 L 19 455 L 22 457 L 25 457 L 29 454 L 31 450 L 33 439 L 33 397 L 31 359 L 31 149 L 33 79 L 33 46 L 31 19 L 30 17 L 27 15 Z";

interface LoadingScreenProps {
  fadeOut: boolean;
}

export default function LoadingScreen({ fadeOut }: LoadingScreenProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pctRef  = useRef<HTMLSpanElement>(null);
  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number | null>(null);
  const DURATION = 5500;

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  useEffect(() => {
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min((now - startRef.current) / DURATION, 1);
      const v = ease(t);
      const dark = document.documentElement.classList.contains("dark");

      if (pctRef.current) {
        pctRef.current.textContent = Math.round(v * 100) + "%";
        pctRef.current.style.color = dark
          ? "rgba(255,255,255,0.4)"
          : "rgba(0,0,0,0.28)";
      }

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isDark]);

  return (
    <div
      className={`loading-screen${fadeOut ? " fade-out" : ""}`}
      aria-label="Lotius loading screen"
      style={{
        background: isDark ? "oklch(0.08 0 0)" : "#fff",
        transition: "background 450ms cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      {/* Hand-drawn logo — inline SVG, switches black/white with theme */}
      <svg
        viewBox="0 0 391 708"
        aria-label="lotius"
        style={{
          width: "clamp(180px, 38vw, 340px)",
          height: "auto",
          display: "block",
          fill: isDark ? "white" : "black",
          transition: "fill 450ms cubic-bezier(0.23,1,0.32,1)",
          animation: "logoBreath 3s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      >
        <path fillRule="evenodd" d={LOGO_PATH} />
      </svg>

      {/* Progress counter */}
      <span
        ref={pctRef}
        style={{
          marginTop: "2.5rem",
          fontFamily: "'Bodoni Moda', serif",
          fontWeight: 400,
          fontSize: "11px",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.28)",
          transition: "color 300ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        0%
      </span>

      <style>{`
        @keyframes logoBreath {
          0%   { transform: scale(1);       opacity: 0.88; }
          50%  { transform: scale(1.018);   opacity: 1;    }
          100% { transform: scale(1);       opacity: 0.88; }
        }
      `}</style>
    </div>
  );
}
