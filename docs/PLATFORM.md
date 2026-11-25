# Merova digital platform — strategy, design system & delivery register (Nov 2026)

This document records the 2026 rebuild: a new creative concept, a database-driven CMS and an admin dashboard. The audit of the earlier merova.vercel.app prototype and the first rebuild is in [STRATEGY.md](STRATEGY.md) (its findings — placeholder contacts/metrics, no product depth, no enquiry backend — remain the baseline this platform resolves).

## 1. Audit summary (existing deployment, merova-printpack.vercel.app)
| Existing issue | Commercial impact | Solution in this platform | Priority | Classification |
|---|---|---|---|---|
| Content hard-coded in source files | Every change needs a developer | Database + `/admin` CMS for all content, settings and media | P0 | Rebuild |
| 10 industries; brief requires 15 with sectors and sub-industries | Buyers in construction, hospitality, agriculture, corporates had no pathway | 15 industries in 5 sectors with sub-industries; “Other industries” catch-all | P0 | Rebuild |
| Industry → product lists maintained per industry | Inconsistency, duplication | Many-to-many `product_industries`, managed from either side | P0 | Rebuild |
| Single-product quote form | Multi-format buyers had to submit several forms | Multi-product consolidated enquiry with per-product specifications | P0 | Rebuild |
| Enquiries only emailed / no channel configured | Leads lost; no pipeline | Stored in DB, status pipeline, assignment, notes, export; email/CRM optional | P0 | Rebuild |
| Visual design | Brief requires a new, more distinctive concept | New art direction (below) | P0 | Rebuild |
| Product data, articles, renders, PDFs, legal copy | Verified, high-quality | Migrated as seed content | — | Retain |
| Contact details, certifications, capacity, clients | Not supplied | Hidden / “awaiting confirmation” blocks; manageable in Settings | P0 | Requires confirmation |

## 2. Brand positioning
- **Positioning:** Merova Printpack is a multi-material packaging solutions and manufacturing partner that specifies corrugated, paperboard, foodservice, flexible and custom packaging against the application, proves it on a sample and supplies it to an approved reference.
- **Master tagline:** Packaging, Perfected. **Proposition:** Engineered to Protect. Designed to Perform.
- **Mission / vision / promise / tone:** see About page content (editable) and STRATEGY.md §2.
- **Headline system:** “Packaging Solutions That Move Businesses Forward.” · “Every Packaging Requirement. A Clearly Defined Solution.” · “Packaging Expertise Across Industries.” · “Manufacturing Precision. Packaging Performance.” · “Consistency Is Engineered. Quality Is Accountable.” · “Your Requirements. Our Packaging Expertise.” · “Built Around Packaging. Driven by Business Partnerships.” · “Making More Responsible Packaging Decisions.” · “Let’s Define the Right Packaging Solution for Your Business.”

## 3. Visual identity system — “The Merova Line”
- **Concept:** the emblem is a single continuous stroke. The site uses it as a line that draws itself (hero, 404, login, industry finder) — one partner, one continuous process across materials — and as cropped low-opacity watermarks on red and charcoal surfaces. The exact master path is used (`src/components/brand/emblem-path.ts`, generated from `Merova_Logo.pdf`); the logo itself is never redrawn.
- **Logo:** official artwork. A horizontal header lockup (`merova-lockup-horizontal*.svg`) places the exact mark and wordmark glyphs side by side with uniform scaling, because the stacked master lockup's wordmark is illegible at header size. *Requires brand-owner approval.*
- **Colour:** Merova Red #D52B1E (dominant: CTAs, hero block, segment codes, rules, CTA bands, footer strip), Charcoal #454040 (body), Ink #1F1B1B (headings, dark bands), Cloud Dancer #FFFAF3 (page), white surfaces, warm neutral borders. No navy.
- **Typography:** Manrope (display, 700–800, tight tracking) + Inter (body/UI). Alternatives selectable in the admin: Sora, Plus Jakarta Sans, DM Sans.
- **Editorial devices:** segment codes A–E as large index numerals; numbered highlights; hairline grids instead of rounded cards; red rules on hover; industry photography with an ink→red gradient treatment.
- **Motion:** headline line reveals, emblem line-draw (2.6 s), scroll reveals (fade-rise 700 ms, mask 900 ms), image zoom on hover (900 ms), red top-rule wipe on cards, expanding segment panels, eased mega menus (300 ms), button fill transitions (300 ms), marquee band. All disabled under `prefers-reduced-motion`.
- **Imagery:** Merova product visualisations (studio renders) for product formats; Unsplash photography for industries, captioned “Representative image”; register in ASSET-REGISTER.md.

## 4. Information architecture
Primary navigation: **Products · Industries · About Merova · Resources · Contact** + **Request a Quote**.
```
/                                   Homepage (CMS sections)
/products                           5 segments → /products/{segment} → /products/{segment}/{product} (52)
/industries                         Industry finder (filters) → /industries/{slug} (15)
/about (+ manufacturing, capabilities, quality, process, sustainability, leadership, clients, careers, business-enquiries)   CMS pages
/resources  /resources/faqs         Catalogue, profile, brochures, flyers, FAQs
/knowledge  /knowledge/{slug}  /knowledge/category/{slug}
/request-a-quote  /custom-requirement  /contact  /enquiry-received
/privacy-policy  /terms             CMS pages
/admin/*                            Dashboard (noindex)
```
## 5. Taxonomy
Segments A Corrugated (families A1–A4), B Paperboard & Paper (B1–B4), C Foodservice & QSR (C1–C4), D Plastic & Flexible (D1–D6), E Custom & Specialised (E1–E2, solution-led records that link to canonical products). Every product has one canonical ID (`MRV-<family>-<nn>`), one primary segment and one page. Sectors: Food, Beverage & Hospitality · Consumer & Retail · Industrial & Manufacturing · Healthcare · Corporate & Institutional. Live counts and mappings are visible in the admin.

## 6. Deliverables register
**C** = completed and verified · **A** = implemented, awaiting credentials or business information · **N** = not completed (reason given).

| # | Deliverable | Status | Notes |
|---|---|---|---|
| 1 | Existing website audit | C | §1 + STRATEGY.md |
| 2 | Brand strategy | C | §2 |
| 3 | Visual identity system | C | §3; header lockup needs brand approval |
| 4 | Sitemap | C | §4; `/sitemap.xml` generated |
| 5–6 | Product segmentation & taxonomy | C | 5 segments, 20 families, 52 products |
| 7–8 | Industry classification & mapping | C | 15 industries, 5 sectors, 220+ mappings; relevance needs management review |
| 9 | Central product database | C | PostgreSQL schema |
| 10–11 | Industry discovery & cross-segment filters | C | Tested (journeys E, filters) |
| 12–15 | Homepage, category, industry, product pages | C | |
| 16 | Product flyers | A | 49 existing PDFs; 3 new custom-solution products and any new product need a flyer uploaded |
| 17–18 | Catalogue & company profile | A | Existing PDFs retained; regenerate after catalogue changes |
| 19 | Corporate pages | A | Live; plant, leadership, certifications, clients await confirmation |
| 20 | Quotation engine | C | Multi-product, files, tested end-to-end |
| 21 | MIRA | A | Guided mode tested; AI mode needs `ANTHROPIC_API_KEY` |
| 22 | WhatsApp | A | Contextual links ready; needs verified number in Settings |
| 23–24 | SEO & blog architecture | C | Metadata, canonical, schema, sitemap, robots, redirects, knowledge centre |
| 25 | Technical architecture | C | TECHNICAL-HANDOVER.md |
| 26 | Responsive implementation | C | 11 breakpoints tested |
| 27 | Integrations | A | Email/CRM/Turnstile/analytics need credentials |
| 28 | Analytics | A | Consent-gated GA4/GTM + event plan; needs IDs |
| 29 | QA report | C | 35 automated tests passing; lint & types clean |
| 30 | Deployment URL | A | Preview deployment; production promotion awaits approval and a database |
| 31 | Configuration requirements | C | CONFIGURATION.md |
| 32 | Issue register | C | ISSUE-REGISTER.md |
| — | Admin dashboard & CMS (all modules) | C | 15 acceptance tests passing |
| — | Backup documentation / admin guide / handover | C | BACKUP-RECOVERY.md, ADMIN-GUIDE.md, TECHNICAL-HANDOVER.md |
| — | Lighthouse targets | N | Not measured in this session; static generation, AVIF/WebP and font preloading are in place — measure after production deployment |
