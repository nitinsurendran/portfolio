# Project media folder structure

Each project that has a dedicated page or uses media should have a folder under `public/media/projects/` named by **project slug** (e.g. `ikea-embedded-storage`, `from-single-products-to-complementary-sets-at-ikea`).

## Recommended layout

```
public/media/projects/
├── <slug>/
│   ├── hero/           # Hero image or video for card/detail (e.g. hero-placeholder.svg, hero.mov)
│   ├── sections/      # Section images and placeholders (e.g. placeholder-large.svg, placeholder-small.svg)
│   ├── posters/       # Optional video poster images
│   └── manifest.json  # Optional: block layout for manifest-driven pages (e.g. ikea-embedded-storage)
└── README.md          # This file
```

## Notes

- **Slug** must match the project `slug` in `src/data/projects.ts` (and the route `/projects/[slug]` where applicable).
- **Manifest-driven pages** (e.g. IKEA Embedded Storage) load `manifest.json` from this folder; block types include `header`, `divider`, `text`, `imageLarge`, `imageSmall`, `impact`, `otherProjects`, `footer`.
- **Copy-driven pages** (e.g. From Single Products to Complementary Sets) keep body copy in `src/content/projects/<name>.ts` and reference media paths relative to this folder (e.g. `sections/placeholder-large.svg`).
- Replace placeholder SVGs with final assets when ready; paths in manifests or content stay the same.
- **Section images** can be named by section, e.g. `sections/why-this-mattered.jpg` for the image above "Why this mattered"; use the same path in the page’s block config.
