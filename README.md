# Merova Printpack — website

**Packaging, Perfected.** Engineered to Protect. Designed to Perform.

The B2B website for Merova Printpack, a multi-material packaging partner. It covers corrugated, paperboard, foodservice, flexible and custom packaging across 49 products, 10 industries, 20 technical guides and 53 downloadable PDFs. It also includes a product-dependent quote engine, contextual WhatsApp, and Mira, an AI requirements assistant.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react · Anthropic SDK (Mira) · qrcode · Playwright (PDF rendering and end-to-end tests).

## Quick start
```bash
npm install
cp .env.example .env.local      # fill in what you have; everything is optional for local dev
echo "LEAD_STORE_DIR=.data/leads" >> .env.local   # lets forms submit locally
npm run dev
```

## Scripts
| Script | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Develop / production build / serve |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm run validate:data` | Cross-reference check of products, industries and related links |
| `npm run test:e2e` | Playwright journeys (run `npm run build` first) |
| `npm run pdfs` | Render all PDFs from `/print/*` (needs a running server, see below) |
| `npm run docs` | Regenerate `docs/SEO-MAP.md` and `docs/TAXONOMY.md` from data |
| `npm run illustrations` · `npm run brand-assets` | Regenerate format illustrations / icons and OG image |
| `node scripts/crawl.mjs` · `node scripts/overflow.mjs <paths>` | QA: link, asset and metadata crawl / horizontal-overflow check at 11 widths |

Regenerate PDFs after data or domain changes:
```bash
npm run build && npx next start -p 3100 &
PDF_BASE=http://localhost:3100 npm run pdfs
```

## Where things live
- `src/data/` — **single source of truth**: products, verticals, industries (and their mapping), quote form schemas, company content, articles.
- `src/app/(site)/` — public pages. `src/app/print/` — PDF sources. `src/app/api/` — `enquiry`, `mira`.
- `src/lib/` — site config (env-driven), SEO helpers, enquiry delivery and routing, Mira, tracking.
- `docs/` — strategy and audit, SEO map, taxonomy, configuration, tracking plan, asset register, issue register, implementation checklist.

## Deployment (Vercel)
1. Import the repository in Vercel (framework preset: Next.js; no build settings needed).
2. Add environment variables from `.env.example`. At minimum, set an enquiry channel (Resend or CRM webhook) so forms deliver.
3. Deploy, then verify with the checks in `docs/CONFIGURATION.md` and `docs/IMPLEMENTATION-CHECKLIST.md`.

Preview deployments are automatically `noindex` (see `src/app/robots.ts`).

## Content integrity rules
- Never add metrics, certifications, client names or specifications unless Merova has verified them.
- Unconfirmed specification values use `tbc()` and display "Confirmed at quotation".
- Images are captioned automatically by `kind`: `illustration` → "Format illustration"; `representative` → "Representative image".
- Articles stay `noindex` until `review.status` is `"reviewed"` with a named reviewer.
