## Performance Audit & Plan – Nitin Surendran Portfolio

This document captures the current performance baseline and a concrete, prioritized plan to optimize this Next.js App Router portfolio for real-world devices and slow networks.

Scope: **no visual redesign, no content or URL changes, preserve all existing routes and behaviors.**

---

## 1. Baseline: How to Measure

Run these consistently against **production** (preferred) and **local** builds.

### 1.1. Local dev URLs

- Home: `http://localhost:3000/`
- About: `http://localhost:3000/about`
- Example project detail pages:
  - `http://localhost:3000/projects/rotera`
  - `http://localhost:3000/projects/beat`
  - `http://localhost:3000/projects/newten`

### 1.2. Lighthouse (Mobile)

Use Chrome DevTools Lighthouse in **Incognito** with no extensions, device emulation set to mobile (e.g. Moto G4 / 3G throttling):

1. Open DevTools → Lighthouse tab.
2. Mode: **Navigation**.
3. Device: **Mobile**.
4. Categories: Performance (plus SEO/Best Practices if desired).
5. Run on:
   - `/`
   - `/about`
   - `/projects/rotera`
   - `/projects/beat`

Capture:

- **Performance score**
- **Core Web Vitals proxies**:
  - LCP (largest contentful paint)
  - INP (interaction to next paint)
  - CLS (cumulative layout shift)
- Total JS transfer size & main-thread time.

CLI alternative (from `portfolio` folder, once `next build` is done and `next start` running on port 3000):

```bash
npx lighthouse http://localhost:3000/ \
  --preset=mobile \
  --throttling.cpuSlowdownMultiplier=4 \
  --output=json,html \
  --output-path=./.lighthouse/home-mobile
```

Repeat for key project URLs.

### 1.3. WebPageTest (Optional but recommended)

Run from `webpagetest.org` or private instance:

- Test URL: `https://www.nitinsurendran.com/`
- Location: a realistic target region (e.g. EU West, US East).
- Connection: `4G` and `3G Fast`.
- Device: “Moto G4” or similar mid-tier Android.
- Metrics to inspect:
  - **TTFB**
  - **LCP**
  - **Start Render / Speed Index**
  - **Total bytes** (especially JS and video)
  - **Number of requests**

Focus on waterfalls to see:

- Render-blocking CSS/JS.
- Early-loading media (videos, 3D, large images).

### 1.4. Local build / bundle checks

From `portfolio` root:

```bash
# Already used in this audit
npm run build

# Approximate build output size
du -sh .next
```

Current observation:

- `.next` size is ~**5.5 GB** (includes server output, static assets, and potentially large media copied into the build). This is unusually large and worth targeting as a **P0** for deploy / caching / storage concerns.
- `public/media` is ~**462 MB** (all projects), with many `.mov`/`.mp4` files.

---

## 2. Key Findings (High-Level)

### 2.1. Heavy client components / JS hotspots

- **Project cards (`src/sections/home/ProjectCard.tsx`)**
  - Client component with:
    - `gsap` animations (`useLayoutEffect`).
    - IntersectionObserver-driven autoplay video previews.
    - Theme storage (`setStoredThemeBeforeDetail`) and pointer-based “magnetic” arrow.
  - Used for every project on home, so this code is in the **critical path** for `/`.

- **Detail media frames (`src/components/media/MediaFrame.tsx` + `src/components/media/SmartVideo.tsx`)**
  - Client-only components with:
    - `next/image` plus `SmartVideo` controlling lazy video mounting.
    - Multiple IntersectionObservers (container and video).
    - Bandwidth detection via `prefersLowBandwidth` + `usePrefersReducedMotion`.
  - Overall pattern is good (lazy video, poster-only on low bandwidth), but still **JS-heavy per media block**.

- **3D model viewer (`src/components/three/ModelViewer.tsx`, `src/sections/home/Description.tsx`)**
  - Uses `@react-three/fiber`, `@react-three/drei`, `three`, `Canvas`, `OrbitControls`.
  - Dynamically imported with `ssr: false` from `Description`:
    - `src/sections/home/Description.tsx`:
      - Dynamic import of `ModelViewer` (`next/dynamic` with `ssr: false`).
  - Even with dynamic import, this is **a large client bundle** for a small home hero treatment.

- **Analytics client components**
  - `src/components/analytics/GoogleAnalytics.tsx`:
    - Injects GA4 (`gtag.js`) with `afterInteractive` scripts in `layout.tsx`.
  - `src/components/analytics/AnalyticsPageView.tsx`:
    - `usePathname` + `useEffect` to send `page_view` events on route changes.
  - These add extra JS but are mostly unavoidable; they should be **guarded by env flags** (already done).

- **Motion / debugging layers**
  - `src/components/motion/CursorLayer.tsx`:
    - Global cursor interaction layer, mounted from `src/app/client-providers.tsx`.
  - `src/components/dev/OverflowDebug.tsx`:
    - Debug overlay also mounted from `client-providers`.
  - Both are **global client-side features** present on all pages.

### 2.2. Render-blocking / global assets

- **Fonts**
  - `src/app/layout.tsx` uses `GeistSans` and `GeistMono` from `geist/font/*`.
  - These use CSS variables and should be reasonably optimized; they still contribute to initial CSS, but there’s no obvious misuse.

- **Global CSS**
  - `src/app/layout.tsx` imports `./globals.css`.
  - Needs review for unused CSS rules and heavy animations (future P1).

- **Analytics scripts**
  - GA script via `<Script strategy="afterInteractive">` is **not render-blocking**, but still adds bytes and can impact INP if misconfigured.

### 2.3. Media usage

- `public/media/projects` ≈ **462 MB** total.
  - Multiple `.mov` and `.mp4` hero videos (e.g. IKEA 3D, BEAT, Embedded Storage).
  - Posters and section imagery as `.png`/`.jpg`.
  - Detail pages generally use `MediaFrame` + `SmartVideo`, which:
    - Avoids mounting video when `prefers-reduced-motion` or low bandwidth is detected (good).
    - Uses IntersectionObserver to lazy-mount near viewport (also good).

- Homepage project cards:
  - Videos used as **auto-playing thumbnails** in `ProjectCard` with:
    - `<video ... autoPlay preload="metadata" muted loop playsInline>`.
  - These fetch video data early; on slow networks this can dominate **LCP and total bytes** for `/`.

### 2.4. Hydration / client-only pages

- **`src/app/page.tsx` (Home)**:
  - `"use client"` + `useTheme`, IntersectionObserver (`initReveal` in `lib/gsap/reveal`), and other client-only behaviors.
  - Entire home page is **client-rendered**, even though much content is static.

- **`src/app/about/page.tsx`**:
  - `"use client"` + `initReveal`.

- **All project detail pages** under `src/app/projects/*`:
  - Are client components, using `initReveal`, `ProjectMediaBaseProvider`, and other client behaviors.

Observation: many pages could potentially have **server components as shells** with client islands for motion/GSAP, but this plan does **not** refactor yet—just notes opportunity.

### 2.5. Potentially unused / always-on code paths

- `OverflowDebug` and `CursorLayer` are imported and rendered in `src/app/client-providers.tsx` and thus **mount on every page**:
  - `OverflowDebug` appears to be a **dev-only** tool but is currently part of the production client tree.
  - `CursorLayer` is a global cursor effect that may not be essential for first paint.

These are strong candidates for **lazy-loading or environment-gating**.

---

## 3. Prioritized Backlog (P0 / P1 / P2)

### P0 – High impact, low-to-medium risk (do next)

1. **Reduce home route JS and visual complexity on first load**
   - **Why:** `/` is the primary entry, fully client-side, with GSAP animations, video previews, 3D model, cursor layer, and debug overlay. This affects **LCP, INP, and TBT** on real devices.
   - **Where (key files):**
     - `src/app/page.tsx`
     - `src/sections/home/ProjectCard.tsx`
     - `src/sections/home/Description.tsx`
     - `src/components/three/ModelViewer.tsx`
     - `src/app/client-providers.tsx` (for `CursorLayer`, `OverflowDebug`)
   - **Direction:** 
     - Convert home to a **server component shell** (where possible) with smaller client islands (P1 refactor), but **P0** is to identify which client bits can be deferred (e.g. only mount ModelViewer on interaction, gate CursorLayer + OverflowDebug behind a flag, or move them out of default render).

2. **Constrain home-page video thumbnails to be network-aware**
   - **Why:** Auto-playing video cards with `preload="metadata"` for multiple projects can heavily affect **LCP** and **total bytes** on slow networks.
   - **Where:**
     - `src/sections/home/ProjectCard.tsx`
     - `src/sections/home/SelectProjects.tsx`
   - **Direction:**
     - Introduce a lightweight **poster-image-first** strategy on `/` (e.g. image hero for cards, video only on hover / when in viewport / on desktop).
     - Reuse the `prefersLowBandwidth` helper (already used in `SmartVideo`) to disable home video thumbs on slow networks.

3. **Slim down always-on global client providers**
   - **Why:** Global motion/debug layers increase JS + layout work on every route, harming **INP** and sometimes **CLS**.
   - **Where:**
     - `src/app/client-providers.tsx`
     - `src/components/motion/CursorLayer.tsx`
     - `src/components/dev/OverflowDebug.tsx`
   - **Direction:**
     - Gate `OverflowDebug` behind `process.env.NODE_ENV === "development"` (or a similar guard) so it never ships to production.
     - Consider lazy-loading `CursorLayer` or mounting only on large screens / pointer devices.

4. **Control 3D model viewer impact on `/`**
   - **Why:** `ModelViewer` pulls in `three`, `@react-three/fiber`, `@react-three/drei` and GLTF model assets; even with dynamic import (`ssr: false`), this is a **heavy bundle** for one small decorative element, affecting **JS transfer size** and **INP**.
   - **Where:**
     - `src/sections/home/Description.tsx`
     - `src/components/three/ModelViewer.tsx`
   - **Direction:**
     - At P0, ensure dynamic import is **only triggered when in viewport** or behind user interaction (e.g. “View 3D” button) rather than immediately on home render.

5. **Audit and cap media payloads per route**
   - **Why:** `public/media/projects` is ~462 MB; `.next` is ~5.5 GB. While not all ships to the browser, careless use of multiple large `.mov` videos can quickly dominate **LCP** and **total bytes**.
   - **Where:**
     - `public/media/projects/**`
     - `src/content/mediaResolver.ts`
     - `src/components/media/MediaFrame.tsx`
     - `src/components/media/SmartVideo.tsx`
   - **Direction:**
     - For P0, document max allowed hero video size and ensure hero media uses compressed formats (`.mp4` with `h.264`/`h.265`, reasonable bitrates), and verify that **only one primary hero video** loads above the fold per project page.

### P1 – Medium impact, higher effort

1. **Server/Client split for pages**
   - Convert `app/page.tsx` and `app/about/page.tsx` to server components that render mostly static markup, with client islands for:
     - Theme toggle
     - Motion/GSAP (reveal, hover effects)
     - 3D viewer
   - Reduce hydration cost and improve **TTI/INP**.

2. **Optimize GSAP usage & motion**
   - Move heavy GSAP timelines and cursor effects so they:
     - Only mount on pointer/hover-capable devices.
     - Don’t run on initial paint for mobile.

3. **Refine SmartVideo / MediaFrame**
   - Ensure consistent `loading` / `priority` usage for `next/image`.
   - Confirm IntersectionObserver thresholds are tuned for **above-the-fold** vs **below-the-fold** blocks.

4. **Refine GA loading**
   - Confirm GA is only loaded in production (`shouldLoad` already implemented).
   - Consider delaying GA script even further for very slow networks (e.g. only after idle).

### P2 – Nice-to-haves / cleanup

1. **Dead code / unused components**
   - After P0/P1, find any components no longer referenced and remove them.

2. **Global CSS pruning**
   - Use tooling (e.g. `@next/bundle-analyzer`, PurgeCSS-like analysis) to find unused CSS selectors in `globals.css`.

3. **Fine-grained image optimization**
   - Replace any `.png` that could be `.webp` where appropriate, especially for large hero posters.

---

## 4. P0 Fix Set (Top 5, Next Steps)

These are the **next 5 concrete P0 changes** to implement (in later steps), each with why/where/how-to-validate.

1. **Gate debug and cursor layers** ✅ *Implemented*
   - **Why:** Reduce global JS and layout work → improves **INP** and general responsiveness across all routes.
   - **Where:** `src/app/client-providers.tsx`, `src/components/dev/OverflowDebug.tsx`, `src/components/motion/CursorLayer.tsx`.
   - **Change (done):** CursorLayer and OverflowDebug are loaded only when `NODE_ENV !== "production"` or `NEXT_PUBLIC_DEBUG_UI=1` or `?debug=1` (persisted in sessionStorage). Both are dynamically imported with `ssr: false` so they never run on the server and their chunks load only when debug UI is enabled. See *Enabling debug UI in production* below.
   - **Validate:**
     - Compare Lighthouse INP on `/` before/after.
     - Use Chrome Performance panel to verify fewer event listeners and less JS on initial load.

2. **Make home project videos respect low-bandwidth and only autoplay when necessary**
   - **Why:** Heavy thumbnails can delay **LCP** and consume bandwidth on slow/mobile connections.
   - **Where:** `src/sections/home/ProjectCard.tsx`, `src/sections/home/SelectProjects.tsx`, `src/lib/media/bandwidth.ts`.
   - **Change (planned):**
     - Reuse `prefersLowBandwidth` (like `SmartVideo`) to:
       - Disable video preview or switch to static thumbnail when Save-Data / 2g / 3g is detected.
       - Optionally switch to image-only thumbnails on mobile.
   - **Validate:**
     - Lighthouse mobile on `/` with simulated slow 3G:
       - Expect lower total bytes and faster LCP.
     - Network tab: verify fewer `.mov` / `.mp4` requests on initial page load.

3. **Delay or gate the 3D ModelViewer on home**
   - **Why:** `three` + `@react-three/fiber` are large; loading them immediately for a decorative element can harm **INP/TBT**.
   - **Where:** `src/sections/home/Description.tsx`, `src/components/three/ModelViewer.tsx`.
   - **Change (planned):**
     - Keep dynamic import but only trigger it:
       - On intersection (when the container is scrolled into view), or
       - On explicit user action (“View 3D”).
   - **Validate:**
     - Bundle analyzer (if added later) should show reduced JS on `/`.
     - Lighthouse mobile → better main-thread time and INP.

4. **Confirm only one hero video is above-the-fold per project page**
   - **Why:** Multiple simultaneous hero videos can dramatically increase LCP and bytes on project pages.
   - **Where:** `src/content/mediaResolver.ts`, `src/components/media/MediaFrame.tsx`, `src/components/media/SmartVideo.tsx`, manifests under `public/media/projects/**`.
   - **Change (planned):**
     - Audit each project’s manifest to ensure:
       - A single hero video (with poster) above the fold.
       - Additional videos are below the fold and lazy-mounted.
   - **Validate:**
     - Lighthouse on `/projects/rotera`, `/projects/beat`:
       - Confirm only the hero video and its poster are requested early.
       - Check LCP and total bytes.

5. **Collect a proper baseline with Lighthouse reports checked into repo (optional extension of this doc)**
   - **Why:** Without stable baselines, it’s hard to know if changes help or regress **Core Web Vitals**.
   - **Where:** Measurement outputs (e.g. `.lighthouse/` folder) and updates to `PERF_PLAN.md`.
   - **Change (planned):**
     - Run Lighthouse (mobile) against `/`, `/about`, `/projects/rotera`, `/projects/beat`.
     - Record scores and key metrics in a small table in this doc.
   - **Validate:**
     - Re-run after each P0 batch; expect incremental improvements in:
       - LCP
       - INP
       - Total JS execution time.

### Enabling debug UI in production (P0 #1)

CursorLayer and OverflowDebug are gated: they do not run in production unless explicitly enabled.

- **Build-time:** Set `NEXT_PUBLIC_DEBUG_UI=1` before `next build` (e.g. in `.env.production` or CI) to ship the opt-in; the runtime still only mounts the components when the flag or query is used.
- **Runtime (no rebuild):** Append `?debug=1` to any page URL (e.g. `https://www.nitinsurendran.com/?debug=1`). The first visit with `?debug=1` persists the choice in `sessionStorage` under the key `debug-ui`, so later navigations in the same tab/session keep debug UI on. Use `?debug=0` to turn it off and clear the stored flag.

In development, debug UI (cursor layer + overflow outlines) is always enabled.

---

This plan is **audit + roadmap only**. P0 #1 (gate debug/cursor layers) has been implemented; other items remain. Subsequent steps should implement the remaining P0 items in small, reviewable PRs, re-running the baseline measurements after each batch.

