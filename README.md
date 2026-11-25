# Merova Printpack — website & content platform

**Packaging, Perfected.** Engineered to Protect. Designed to Perform.

A database-driven B2B website and administration system for Merova Printpack: an industry-first packaging discovery experience across five product segments, product-dependent quotation journeys, MIRA (AI requirements assistant), and a secure `/admin` dashboard that manages every product, industry, page, article, document, image, colour, menu, redirect and enquiry without code changes.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · PostgreSQL via Drizzle ORM (embedded PGlite for local development) · Sharp · Zod · Anthropic SDK (MIRA) · Playwright.

## Quick start
```bash
npm install
npm run dev
```
Open http://localhost:3000 and http://localhost:3000/admin. Without `DATABASE_URL` the app uses an embedded PostgreSQL stored in `.data/pglite`, creates the schema, seeds the initial content and creates `admin@merova.local` / `ChangeMe2026` (you must change the password at first sign-in). Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` to choose your own.

## Scripts
| Script | Purpose |
|---|---|
| `dev` · `build` · `start` | Develop · production build · serve |
| `lint` · `typecheck` | ESLint · TypeScript |
| `db:generate` | After editing `src/db/schema.ts`: create a SQL migration and embed it |
| `db:check` | Boot an in-memory database, migrate, seed and print record counts |
| `db:backup` | JSON backup of every table (`DATABASE_URL` required) |
| `test:build` then `test:e2e` | Build to `.next-qa`, then run 35 Playwright tests (admin acceptance, journeys A–G, SEO, 11-breakpoint overflow) |
| `brand:lockup` | Rebuild the horizontal header lockup from the official logo artwork |
| `stock:fetch` | Download registered Unsplash images (`src/db/seed/stock.ts`) |

## Where things live
- `src/db/` — schema, client (Postgres / PGlite), migrations, first-run seed, seed content (`seed/`).
- `src/lib/content.ts` — every public read; `src/lib/admin/*` — admin writes (validated, authorised, audited).
- `src/app/(site)/` — public routes; `src/app/admin/` — dashboard; `src/app/api/` — enquiry, MIRA, admin media/export.
- `src/components/sections/` — page-builder blocks; `src/lib/sections.ts` — their editable fields.
- `docs/` — configuration, admin guide, technical handover, backup & recovery, platform strategy, registers.

## Content integrity rules
- Never publish metrics, certifications, client names, capacities or specifications unless Merova has verified them. Statistics, testimonials and logos render only when ticked as verified/approved.
- Unconfirmed specification values use “Confirmed at quotation”. Products with unconfirmed capability are classified “Capability under confirmation” and say so on the site.
- Stock (Unsplash) and rendered imagery is captioned as representative / product visualisation, never presented as Merova facilities, people, clients or products.
- Knowledge-centre articles stay `noindex` until a named Merova reviewer approves them.

See `docs/CONFIGURATION.md` to deploy, and `docs/ADMIN-GUIDE.md` to manage content.
