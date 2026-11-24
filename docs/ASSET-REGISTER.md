# Asset register and replacement list

| Asset | Location | Source | Licence / status | Shown as | Replace with |
|---|---|---|---|---|---|
| Merova glyph (red, cream) | `public/assets/brand/merova-glyph-*.svg`, `src/components/brand/glyph.ts` | Previous site `merova.vercel.app/logos/` | Merova brand asset | Logo | Master vector from Merova (confirm ™/® usage) |
| Glyph (white) | `public/assets/brand/merova-glyph-white.svg` | Recoloured copy of the original path | Derived | Logo on dark backgrounds | — |
| Favicon, apple icon, 512 px logo, OG image | `src/app/icon.svg`, `src/app/apple-icon.png`, `public/assets/brand/*.png` | Rendered from the original glyph (`scripts/brand-assets.mjs`) | Derived | Brand | — |
| 7 product photographs (`corrugated-shippers`, `printed-folding-cartons`, `stand-up-pouches`, `protective-inserts`, `shelf-ready-packaging`, `bespoke-dielines`, `recycled-content-board-packs`) | `public/assets/products/*.webp` | Previous site `/images/merova/` | Provenance unverified; appear AI-generated | Captioned **"Representative image"** | Original Merova product photography |
| 11 facility and context images (`hero-factory-packaging`, `about-production-floor`, `capabilities-press-hall`, `sustainability-*`, `contact-logistics`, `insight-*`) | `public/assets/manufacturing/*.webp` | Previous site | Provenance unverified; appear AI-generated; **not** Merova's facility | Captioned "Representative image" (manufacturing hero: "not a Merova facility") | Authentic facility photography |
| 42 format illustrations | `public/assets/products/illustrations/*.svg` | Generated for this project (`scripts/illustrations.mjs`) | Original, owned | Labelled **"Format illustration"** | Original product photography (keep illustrations for diagrams) |
| Print JPEG derivatives | `public/assets/print/*.jpg` | Generated from the WebP files (`scripts/print-images.mjs`) | Derived | PDFs only | Regenerate after replacing photos |
| PDFs (catalogue, profile, 2 brochures, 49 flyers) | `public/assets/downloads/` | Generated from `/print/*` (`scripts/generate-pdfs.mjs`) | Original | Downloads | Regenerate after data or domain changes |
| Leadership role images from the previous site | Not used | Previous site | Show anonymous people | — | Real portraits with consent |

**Not used on purpose:** any image that could be read as a real Merova employee, client or facility.

## Photography shot list (to replace illustrations)
For each of the 49 products: a 4:3 hero on a neutral background, one detail or texture shot, and one in-use or application shot. Supply at least 2400 px on the long edge, sRGB.

Facility: exterior; each process (printing, corrugation, die-cutting, finishing, film conversion); QC lab and inspection; warehouse and dispatch.

People: leadership portraits, team at work (with written consent).
