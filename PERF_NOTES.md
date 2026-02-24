# Performance notes – portfolio

## How to establish baselines (run locally)

1. **Build and run production:**
   ```bash
   npm run build && npm run start
   ```
2. **Lighthouse (mobile):**
   - Open Chrome DevTools → Lighthouse tab.
   - Select “Mobile”, “Performance” (and optionally Accessibility, Best Practices).
   - Run against:
     - Homepage: `http://localhost:3000/`
     - Heavy project page: `http://localhost:3000/projects/rotera`
   - Throttling: “Simulated slow 4G” (or “Slow 4G” in Network).

## Baseline (pre-optimization) – suspected bottlenecks

- **LCP / CLS / TBT:** To be filled from your Lighthouse run. Target: LCP < 2.5s, CLS < 0.1, TBT minimized.
- **Largest assets (from codebase):**
  - **Videos (Rotera):** `hero/hero.mov`, `sections/section1.mov`, `section1-left.mov`, `section1-right.mov`, `section2.mov`, `section2-left.mov`, `section2-right.mov`, `section3.mov`, `section3.1.mov`, `section4-left.mov`, `section4-right.mov`, etc. All under `/media/projects/rotera/`. Videos are the #1 mobile cost if loaded eagerly.
  - **Images:** `section3-centre.jpg`, poster images (`posters/hero.jpg`, `posters/section1.jpg`, …). Poster images currently loaded via raw `<img>` (no Next Image optimization).
- **JS:** GSAP + ScrollTrigger used on home and project pages. Reveal runs on mount; no code-splitting for heavy sections. No dynamic import for project detail page.
- **Top suspected bottlenecks:**
  1. **Videos:** Multiple `<video src="...">` in DOM on Rotera page; browser can preload/request them. No lazy-mount of video elements.
  2. **Posters:** Raw `<img>` for video posters (no `next/image`, no responsive `sizes`).
  3. **Above-the-fold hero:** Hero video and poster requested immediately; no priority hint for LCP image.
  4. **Layout:** Fixed heights (e.g. `h-[623px]`) and fixed widths on blocks can cause overflow or layout shift on small viewports.
  5. **Fonts:** Geist loaded via `next/font`; ensure `display: 'swap'` and only needed weights.
  6. **Main thread:** GSAP ScrollTrigger and reveal run at mount; can defer until after first paint or when section is near viewport.

## After optimizations

- **Changes made:**
  1. **Media (images):** All images use `next/image` with `sizes` for responsive loading; `priority` only on hero; below-fold lazy. Raw `<img>` posters replaced with `next/image` in SmartVideo/MediaFrame.
  2. **Videos:** New `SmartVideo` component: lazy-mounts `<video>` only when near viewport (IntersectionObserver); off-screen shows skeleton (no video/poster request); `preload="metadata"`; poster via `next/image`; hero uses `priority` and mounts immediately. `Media` and `MediaFrame` use SmartVideo for video. Respects `prefers-reduced-motion` (poster only).
  3. **Fonts:** Geist already uses `font-display: swap` via CSS variables; noted in layout.
  4. **JS/GSAP:** `initReveal` deferred with double `requestAnimationFrame` on home and Rotera page so it runs after first paint (reduces TBT). Reduced-motion already supported in `reveal.ts`.
  5. **Responsiveness:** Image blocks and project-detail sections use `max-w-full`, `aspect-ratio`, `min-w-0`; no fixed pixel heights that break on small screens. Container padding and gaps use responsive breakpoints (`gap-6 md:gap-[53px]`, etc.). About intro: flex-col on mobile, max-widths with `min-w-0`. `overflow-x: hidden` on html/body as safeguard.
  6. **Tap targets:** Theme toggle has `min-h-[44px] min-w-[44px]`.
  7. **Caching:** `next.config.ts` adds `Cache-Control: public, max-age=0, must-revalidate` for `/media/*` and `/images/*` (assets not content-hashed).

## Final hardening (stabilization)

- **Cache:** Public assets are not content-hashed → `Cache-Control: public, max-age=0, must-revalidate` for `/media/*` and `/images/*` to avoid stale assets after deploy.
- **SmartVideo:** (A) `hasMountedRef` — once video mounts, never unmount (no toggling on scroll). (B) Poster only via `next/image`; no `poster` attribute on `<video>` to avoid double fetch. (C) Network-aware: `navigator.connection.saveData` or `effectiveType` slow-2g/2g/3g → poster-only, no video load (feature-detect). (D) Reduced motion: early branch, poster-only render, no video logic.
- **Layout overflow:** Removed `overflow-x: hidden` from html/body. Fixed causes: `min-w-0`, `max-w-full` on Impact, OtherProjects, HeaderBlock overview, ProjectOverview, Team; responsive flex/grid (flex-col md:flex-row) where needed. Dev-only `OverflowDebug` component outlines elements exceeding viewport width (no production overhead).
- **GSAP:** `initReveal` runs only if `root.querySelectorAll("[data-reveal]").length > 0`; still deferred with double rAF. No blocking of LCP; prefers-reduced-motion unchanged.
- **Bandwidth-aware:** `prefersLowBandwidth()` in `@/lib/media/bandwidth` (Save-Data or effectiveType ≤ 3g). SmartVideo and ProjectCard skip video autoplay when true; SmartVideo degrades to poster-only.
- **Bundle analyzer:** `npm run analyze` (Webpack build + report) or `npm run analyze:turbo` (`npx next experimental-analyze`). Dev only; no runtime overhead.

## Verification

1. **Build and run:** `npm run build && npm run start`
2. **Lighthouse (Mobile, Slow 4G):** Run on `http://localhost:3000/` and `http://localhost:3000/projects/rotera`. Record below.
3. **Bundle size:** Run `npm run analyze` (or `npm run analyze:turbo`) and note largest JS chunks.

### Results (fill after running)

| Metric | Home (/) | Rotera (/projects/rotera) |
|--------|----------|----------------------------|
| Performance score | — | — |
| LCP | — | — |
| CLS | — | — |
| TBT | — | — |
| Largest LCP element | — | — |
| Total JS (from analyzer) | — | — |

Before vs after: Compare with your baseline Lighthouse run. Goals: LCP &lt; 2.5s, CLS &lt; 0.1, TBT minimized, no unexpected large chunks.
