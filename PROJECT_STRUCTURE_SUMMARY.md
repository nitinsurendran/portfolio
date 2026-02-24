# Portfolio project structure – summary (pre–BEAT implementation)

## 1) Where project detail pages live

- **Dedicated route (manifest-driven):** `src/app/projects/rotera/page.tsx`  
  Fetches `public/media/projects/rotera/manifest.json`, renders blocks via a local `renderBlock()` (HeaderBlock, HeroBlock, ImageLargeBlock, ImageSmallBlock, TextBlock, etc.). Uses `getProjectBySlug("rotera")` for title/description/badges.
- **Dynamic route:** `src/app/projects/[slug]/page.tsx`  
  Handles any slug. For `slug === "rotera"` it uses content from `@/content/projects/rotera` (TS) + `mediaResolver`; for other slugs it uses legacy inline JSX. Next.js matches the more specific `rotera` route first, so `/projects/rotera` is served by the dedicated page.
- **Conclusion:** New case studies (e.g. BEAT) follow the same pattern as Rotera: a **dedicated page** at `src/app/projects/beat/page.tsx` that fetches `public/media/projects/beat/manifest.json` and reuses the same block components.

## 2) How project metadata is structured

- **Homepage / project list:** `src/data/projects.ts`  
  - `workProjects`, `experimentProjects`, `archiveProjects` (arrays).  
  - Type: `{ slug, title, description, badges, type?, media? }`.  
  - `getProjectBySlug(slug)` finds by slug.
- **Content blocks (used by [slug] for rotera only):** `src/content/projects/rotera.ts`  
  - `ProjectContent`: `{ slug, title, description, badges?, blocks: ProjectBlock[] }`.  
  - Used only by the dynamic `[slug]` page when slug is rotera.
- **Manifest (used by dedicated rotera page):** `public/media/projects/rotera/manifest.json`  
  - JSON: `{ blocks: [...] }`.  
  - Block types: `header`, `hero`, `imageLarge`, `imageSmall`, `text`, `impact`, `divider`, `team`, `otherProjects`, `footer`.  
  - Each block has type-specific fields (e.g. `header`: title, subtitle, badges, heroMedia, overviewLeft, overviewRight, backHref).

## 3) Media / assets

- **Folder pattern:** `public/media/projects/[projectFolder]/`  
  - Rotera: `rotera/hero/hero.mov`, `rotera/posters/hero.jpg`, `rotera/sections/section1.mov`, `rotera/posters/section1.jpg`, etc.
- **Naming:**  
  - Hero: `hero/hero.{mov|mp4|jpg}`; poster `posters/hero.jpg`.  
  - Sections: `sections/sectionN.{mov|mp4|jpg}`, posters `posters/sectionN.jpg`.  
  - ImageSmall: e.g. `sections/section1-left.mov`, `section1-right.mov`, with matching posters.
- **Videos vs images:** In manifest, each media has `kind: "video"` or `kind: "image"`, plus `src` (relative) and optional `poster` for video.
- **Components:**  
  - Blocks use `Media` (`src/components/media/Media.tsx`) for hero and section media.  
  - `Media` currently uses a hardcoded `BASE_PATH = "/media/projects/rotera"` and joins relative `src`/`poster`. So it must be made project-aware (e.g. context or prop) for BEAT.
- **Images:** `next/image` is used inside `Media` and `SmartVideo`; section images also go through `Media` with relative paths.

## 4) Homepage project ordering

- **Work tab:** `SelectProjects` maps over `workProjects` from `src/data/projects.ts`. Order = array order. Currently 3 items: rotera, from-single-products…, ikea-3d-experiences.
- **Experiments tab:** `experimentProjects`.
- **“From the archives”:** `MoreProjects` maps over `archiveProjects`.

Adding BEAT as the 4th entry in `workProjects` will make it the 4th card in the Work tab.

## 5) “More to view” / Other projects

- **Component:** `src/sections/project-details/rotera/OtherProjects.tsx` (used on both rotera and can be used on beat page).
- **Data:** `projects.slice(0, 3)` where `projects = [...workProjects, ...experimentProjects, ...archiveProjects]`. So it shows the **first three** projects (rotera, from-single-products, ikea-3d-experiences). It does **not** exclude the current project.
- Adding BEAT as 4th in `workProjects` does not change which three appear in “Other projects”; BEAT will appear when we (optionally) change logic to “first three excluding current” on detail pages.

---

**Summary for BEAT:**  
Add BEAT as 4th in `workProjects`; add `src/app/projects/beat/page.tsx` and `public/media/projects/beat/manifest.json` (and placeholder assets); make `Media` (or its usage) project-aware so beat uses `public/media/projects/beat/`. Reuse existing blocks and GSAP reveal; no new libraries or global layout/routing changes.
