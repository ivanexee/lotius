# LOTIUS

Editorial fashion site — post-minimalist brutalism meets haute couture. Seasonal
collections, laureates, and the **Archive 001** scroll-cinema drop experience.

**Live site:** https://lotius.vercel.app
**Archive drop experience:** https://lotius.vercel.app/archive

## Routes

| Route | Page |
|---|---|
| `/` | Home — hero carousel, seasonal collections (Spring/Summer/Fall/Winter 2026) |
| `/archive` | Archive 001 — scroll-driven drop experience (cursor-scrubbed dual-media hero, black-panel gallery, outro CTA) |
| `/discover` | Discover the award |
| `/laureates` | Laureates |
| `/council` | Council |
| `/mentors` | Mentors |

## Stack

- React 19 + TypeScript, Vite 7
- Tailwind CSS 4, design tokens in `client/src/index.css` (Bodoni Moda / Cormorant Garamond, oklch monochrome)
- Framer Motion 12 for entrance animation, GSAP ScrollTrigger for the `/archive` panel scrub
- Wouter for client-side routing
- Media served from CDN (CloudFront) — no local assets in the repo

## Development

```bash
pnpm install
pnpm dev        # dev server on http://localhost:3000
pnpm check      # typecheck
pnpm build      # production build → dist/public
```

## Deployment

Deployed on Vercel as a static SPA. Every push to `main` on
[ivanexee/lotius](https://github.com/ivanexee/lotius) auto-deploys.
Build config lives in `vercel.json` (`vite build` → `dist/public`, SPA rewrites).

## The `/archive` experience

Three scroll phases driven by one RAF loop off `scrollY`:

1. **Hero** — full-viewport dual-media stage scrubbed by cursor X
   (stills split-wipe today; swap `HERO_MEDIA.type` to `"video"` in
   `client/src/pages/Archive.tsx` when clips are on the CDN).
2. **Gallery** — black panel slides over the hero (GSAP ScrollTrigger),
   scattered 2/3/4-column grid whose cards scale in/out with viewport position.
3. **Outro** — white overlay fades in, drop info slides up, oversized CTA pill
   scales in and links to `/discover`.

Respects `prefers-reduced-motion`, locks dark chrome while mounted, and
restores the global theme on unmount.
