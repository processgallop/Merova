# Asset register and replacement list

| Asset | Location | Source | Licence / status | Shown as | Replace with |
|---|---|---|---|---|---|
| Master logo artwork | `public/assets/brand/source/Merova_Logo.ai`, `Merova_Logo.pdf`, page SVGs | Supplied by Merova (Nov 2026) | Merova brand asset | Source of all logo files | — |
| Logo variants: primary, reverse, mark-red, mark-cream (+ on-cloud, on-red, square) | `public/assets/brand/merova-*.{svg,png,@2x.png,@4x.png,webp}` | Extracted unaltered from the PDF (`scripts/brand-logos.mjs`: background removed, viewBox trimmed) | Merova brand asset | Header, footer, PDFs | — (confirm ™ usage) |
| Favicon, apple icon, 192/512 px icons | `src/app/icon.svg`, `src/app/apple-icon.png`, `public/assets/brand/merova-icon-192.png`, `merova-logo-512.png` | Square mark from the master artwork | Derived | Brand | — |
| Default OG image | `public/assets/brand/og-default.png` | `scripts/brand-assets.mjs` (reverse logo + hero render) | Derived | Social sharing | — |
| 44 studio product visualisations | `public/assets/products/renders/*.webp`, print JPEGs in `public/assets/print/renders/` | Rendered for this project in Blender/Cycles (`scripts/render/`, processed by `scripts/process-renders.mjs`) | Original, owned | Captioned **"Product visualisation"** | Original product photography |
| 7 product photographs (`corrugated-shippers`, `printed-folding-cartons`, `stand-up-pouches`, `protective-inserts`, `shelf-ready-packaging`, `bespoke-dielines`, `recycled-content-board-packs`) | `public/assets/products/*.webp` | Previous site `/images/merova/` | Provenance unverified; appear AI-generated | Captioned **"Representative image"** | Original Merova product photography |
| 11 facility and context images (`hero-factory-packaging`, `about-production-floor`, `capabilities-press-hall`, `sustainability-*`, `contact-logistics`, `insight-*`) | `public/assets/manufacturing/*.webp` | Previous site | Provenance unverified; appear AI-generated; **not** Merova's facility | Captioned "Representative image" (manufacturing hero: "not a Merova facility") | Authentic facility photography |
| Print JPEG derivatives | `public/assets/print/*.jpg` | Generated from the WebP files (`scripts/print-images.mjs`) | Derived | PDFs only | Regenerate after replacing photos |
| PDFs (catalogue, profile, 2 brochures, 49 flyers) | `public/assets/downloads/` | Generated from `/print/*` (`scripts/generate-pdfs.mjs`) | Original | Downloads | Regenerate after data or domain changes |
| Leadership role images from the previous site | Not used | Previous site | Show anonymous people | — | Real portraits with consent |

**Not used on purpose:** any image that could be read as a real Merova employee, client or facility.

## Photography shot list (to replace visualisations)
For each of the 49 products: a 4:3 hero on a neutral background, one detail or texture shot, and one in-use or application shot. Supply at least 2400 px on the long edge, sRGB.

Facility: exterior; each process (printing, corrugation, die-cutting, finishing, film conversion); QC lab and inspection; warehouse and dispatch.

People: leadership portraits, team at work (with written consent).
