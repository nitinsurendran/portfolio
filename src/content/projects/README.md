# Project content (copy)

Body copy and section text for project detail pages that are driven by content files rather than only a manifest.

## Layout

- **One file per project** when copy is substantial: e.g. `ikea-complementary-sets.ts` for the "From Single Products to Complementary Sets at IKEA" page.
- Export a named object (e.g. `ikeaComplementarySetsCopy`) with keys for each section; values are either `{ heading?, content }` or a string (e.g. for quotes).
- The corresponding page (`src/app/projects/<slug>/page.tsx`) imports this file and maps block `contentKey` to these sections.

## Naming

- Use a clear, slug-like name for the file: `ikea-complementary-sets.ts`, `beat.ts`, etc.
- Export a type for content keys (e.g. `IkeaComplementarySetsContentKey`) so blocks stay type-safe.

## Media

- Image and video paths are not stored here; they live in `public/media/projects/<slug>/` and are referenced by the page or manifest.
