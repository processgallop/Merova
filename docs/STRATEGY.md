# Merova Printpack — website audit and digital strategy

This document covers the pre-development deliverables from the project brief (Part 16, items 1–25) and records the decisions taken in the build. Generated companions:
- [SEO-MAP.md](SEO-MAP.md): page-level SEO mapping.
- [TAXONOMY.md](TAXONOMY.md): product taxonomy and industry-to-product mapping.
- [TRACKING-PLAN.md](TRACKING-PLAN.md), [ASSET-REGISTER.md](ASSET-REGISTER.md), [ISSUE-REGISTER.md](ISSUE-REGISTER.md), [IMPLEMENTATION-CHECKLIST.md](IMPLEMENTATION-CHECKLIST.md), [CONFIGURATION.md](CONFIGURATION.md).

---

## 1. Website audit (merova.vercel.app, inspected 24 Nov 2026)

### 1.1 Verified observations
These were observed directly on the previous build (a Next.js App Router site):

- **Pages present:** Home, About, Products, Industries, Capabilities, Sustainability, Insights, Contact, Quality, Request a quote.
- **Missing pages (404):** Privacy, Terms, Downloads ("pending" in footer), FAQs ("pending"), custom packaging. There were no product detail pages ("cards link to the quote form") and no article pages ("not built in this pass").
- **Brand assets:** red Merova glyph (`#D52B1E`, SVG) plus "Merova™" wordmark set in Sora. Body text in Manrope, labels in IBM Plex Mono. Palette: charcoal, cloud/cream, red.
- **Tagline in use:** "Packaging Made to Perform."
- **Contact details were placeholders:** `+00 000 000 0000`, `hello@merova.example`, "Address placeholder", business hours `00:00–00:00`.
- **Statistics were placeholders:** "XX+ years", "XXM+ packages", "XX% quality".
- **Placeholders elsewhere:** company milestones (`YYYY`), leadership (roles only), certification slots, insight dates, and "company news".
- **Imagery:** 23 WebP images that appear to be AI-generated renders. They show a consistent styled factory and products with red accents. They are **not** authentic Merova photography.
- **Products listed:** 15 formats across 7 categories (corrugated, cartons, flexible, protective, retail, custom, sustainable). There was no foodservice, plastic or industry-specific product range.
- **Product depth:** each card had a one-line specification chip and a "Request a quote" link. There were no flyers or downloads of any kind.
- **Quote form:** 10 linear steps, generic rather than product-dependent. The backend was unverified.
- **Not present:** WhatsApp, an AI assistant and analytics. No sitemap or schema was observed.

### 1.2 Prioritised audit

| # | Area | Existing issue | Commercial impact | Recommendation (implemented unless noted) | Priority | Dependencies |
|---|---|---|---|---|---|---|
| 1 | Credibility | Placeholder phone, email, address and statistics visible to buyers | Destroys trust immediately; risk of looking unfinished or fake | Removed all placeholders; contact details are env-driven and hidden until verified | P0 | Merova to supply verified contacts |
| 2 | Enquiry | Generic 10-step form, no product context, unverified backend | Low completion; unqualified leads | 4-step product-dependent quote engine with uploads, validation, spam control, routing, CRM/email backend and honest failure | P0 | Resend or CRM credentials |
| 3 | Product depth | No product pages, specifications or flyers | Buyers cannot evaluate, share or justify a supplier; weak SEO | 49 product landing pages, spec tables, FAQs, 49 PDF flyers | P0 | Merova to confirm specs |
| 4 | Taxonomy | No foodservice or plastic verticals; ranges don't match the brief | Misses cinema, QSR and FMCG film demand | Five verticals with full taxonomy | P0 | Management to confirm which products are made in-house vs partner-supplied |
| 5 | Discovery | Industry list was static text | Visitors can't self-serve by sector | Interactive "What are you looking to pack?" engine plus 10 industry pages | P0 | — |
| 6 | Legal | Privacy and Terms returned 404 | Compliance and trust risk | Privacy (DPDP-aware) and Terms pages | P0 | Legal review |
| 7 | Imagery | AI-styled renders presented as if they were the company's own | Misrepresentation risk | Product formats shown as labelled illustrations; photos captioned "Representative image" | P1 | Original photography (asset register) |
| 8 | Downloads | None | No sales collateral | Catalogue, company profile, capabilities and sustainability brochures, flyers — all real PDFs with QR codes | P1 | — |
| 9 | Corporate | Empty milestones, leadership and certification slots | Looks incomplete | Process-based corporate pages; clearly labelled "awaiting confirmation" panels | P1 | Merova facts |
| 10 | SEO | No product or article URLs, sitemap or schema | Little organic visibility | Indexable URL architecture, unique metadata, canonical tags, sitemap, robots, Organization/Product/FAQ/Article/Breadcrumb schema | P1 | GSC verification |
| 11 | Engagement | No WhatsApp or assistant | Lost conversational leads | Contextual WhatsApp and Mira | P1 | WhatsApp number; optional API key |
| 12 | Content | Six placeholder insight cards | Thin content | 20 technical articles (noindex until reviewed) | P2 | Technical reviewer |
| 13 | Analytics | None | No funnel visibility | Consent-gated GA4/GTM with a full event plan | P2 | GA4/GTM IDs |
| 14 | Performance | Acceptable on the previous build | — | Static generation, AVIF/WebP, no heavy libraries; Lighthouse 93–100 | P2 | — |

**Retained:** logo glyph, wordmark, Sora/Manrope/Plex Mono type system, red accent, warm-white background, the sample-first manufacturing philosophy, and the no-blanket-claims sustainability stance.
**Improved:** colour system (navy added for structure), navigation, product presentation, quote journey.
**Removed:** placeholder metrics and contacts, certification slots and fake dates.
**Rebuilt:** information architecture, product system, enquiry engine, corporate section.

### 1.3 Information requiring confirmation from Merova management
See [ISSUE-REGISTER.md](ISSUE-REGISTER.md) for the full list. Key items: verified contact details and WhatsApp number; registered name and addresses; which products are manufactured in-house versus partner-supplied; product-specific specifications (GSM, micron, flute, size ranges, tolerances, MOQ); machinery and capacity; certifications; leadership profiles; client permissions; sustainability evidence; original photography.

---

## 2. Brand strategy and positioning

### 2.1 Tagline evaluation

| Option | Memorability | Differentiation | International appeal | Fits all verticals | Verdict |
|---|---|---|---|---|---|
| **Packaging, Perfected.** | High: short, alliterative | Medium–high: implies process and precision | High | Yes | **Recommended master tagline** |
| Packaging Made to Perform. (previous) | Medium | Low: common category language | High | Yes | Retire; echoed in the proposition |
| Engineered to Protect. Designed to Perform. | Medium | Medium | High | Yes | **Supporting proposition** |
| Specified, Not Guessed. | High | High | Medium (needs context) | Yes | Use as a campaign or B2B line |
| Every Pack, Properly Made. | Medium | Medium | High | Yes | Alternative |
| One Partner. Every Material. | Medium | High: multi-material | High | Yes | Use in corporate and sales copy |

**Recommendation:** "Packaging, Perfected." as the master tagline, with "Engineered to Protect. Designed to Perform." as the proposition. It is memorable, works for every vertical, and "perfected" is earned through the visible process (specify → sample → approve → check) rather than claimed.

### 2.2 Positioning statement
For B2B buyers who need packaging that performs on their line, in transit and on the shelf, Merova Printpack is the multi-material packaging partner that specifies corrugated, paperboard, foodservice, flexible and custom packaging against the application, proves it on a sample, and checks it at every stage — so one accountable partner replaces several single-process suppliers.

### 2.3 Corporate introduction
Merova Printpack brings corrugated, paperboard, foodservice, flexible and custom packaging together under one accountable partner. Every pack is specified to the application, sampled before production and checked against the approved reference.

### 2.4 Brand promise, mission and vision
- **Promise:** Packaging, Perfected: engineered to protect your product, designed to perform on your line, on the shelf and in transit.
- **Mission:** To supply every packaging format a customer needs through one accountable partner, on one agreed specification, to a date we have committed to.
- **Vision:** Packaging that is specified rather than guessed, so every pack is only as heavy, as printed and as costly as the job requires.

### 2.5 Personality and tone of voice
- **Personality:** established, capable, precise, candid, quietly confident.
- **Tone:** plain, technical where useful, never inflated. Lead with the buyer's problem. Use numbers only when verified. Prefer "we specify / we check" to superlatives.
- **Avoid:** "world-class", "leading", "best-in-class", unverifiable claims, and blanket environmental claims.

### 2.6 Messaging framework
| Pillar | Message | Proof on site |
|---|---|---|
| Understands packaging | We start from what you pack and how it travels | Discovery engine, industry pages, technical guides |
| Serves many industries | Ten industries, one partner | Industry pages, industry-to-product mapping |
| Structured manufacturing & quality | Specified, sampled, approved, checked | Process, Manufacturing, Quality pages |
| Custom capability | When nothing standard fits, we start from your product | Custom vertical, custom requirement form |
| Easy to engage | Quote in four steps, or just chat | Quote engine, WhatsApp, Mira, contact routing |

### 2.7 Visual identity, typography and colour
- **Logo:** the original red glyph and the Merova wordmark (Sora, with ™) plus a "PRINTPACK" descriptor in Plex Mono. Proportions are unaltered. There are red, cream and white glyph variants for light and dark backgrounds. Square favicon, apple-touch icon and 512 px logo were rendered from the original glyph.
- **Colour tokens:** Navy 950–50 for structure (`#08162a` … `#f1f4f9`); warm paper `#fbf8f3` / `#f5efe5` / `#ece3d5`; Merova red `#d52b1e` (accent only, AA on white and paper); ink `#161a22`; muted `#5b6270`.
- **Typography:** Sora for display (600), Manrope for body, IBM Plex Mono for eyebrows and specification labels. The type scale is fluid (`clamp`). Body text is at least 16 px.

### 2.8 Photography and illustration guidelines
- Original Merova photography first: actual products, actual facility, actual people (with consent).
- Product shots on neutral warm-grey or paper backgrounds, soft directional light, 4:3 crop with the product filling about 70% of the frame. Supply at 2× (minimum 2400 px on the long edge).
- Never present stock or AI images as Merova's factory, staff or clients. Caption them "Representative image".
- Format illustrations (isometric, paper palette, one red brand accent) stand in until photography exists. They are labelled "Format illustration".

---

## 3. Sitemap and information architecture

```
/                               Home (discovery engine)
/industries                     → 10 × /industries/{slug}
/products                       → 5 verticals → 49 × /{vertical}/{product}
  /corrugated-packaging  /paper-packaging  /foodservice-packaging  /plastic-packaging  /custom-packaging
/custom-packaging               (Custom vertical; primary nav "Custom Packaging")
/custom-requirement             Custom requirement engine
/manufacturing   /manufacturing/capabilities   /process
/quality                        (#certifications)
/sustainability
/resources   /resources/downloads   /resources/faqs
/blog   /blog/category/{slug}   /blog/{slug}            (20 articles)
/company   /company/leadership   /company/clients   /company/case-studies
/company/client-service   /company/careers   /company/partnerships   /company/suppliers
/contact (?topic=sales|technical|orders|suppliers|careers|partnerships)
/request-a-quote (?product=&industry=)   /enquiry-received
/privacy-policy   /terms
```

- **Primary navigation:** Industries (mega menu), Products (mega menu), Custom Packaging, Manufacturing (Manufacturing, Capabilities, Process), Quality, Sustainability, Resources, Company, Contact, plus a persistent **Request a Quote** button. Home is the logo.
- The Products mega menu shows five vertical columns (up to 7 products each, then "View all") and a "Find your packaging" card. The Industries mega menu shows 10 industry tiles and a "different requirement" card.
- **Persistent everywhere:** the "Chat with Merova" (WhatsApp) button and "Ask Mira".
- Old URLs from the previous build are 301-redirected (`/about`, `/capabilities`, `/insights`, `/request-quote`, …).

## 4. Product taxonomy and industry mapping
See [TAXONOMY.md](TAXONOMY.md), which is generated from data. Decisions taken to avoid thin or duplicate pages:
- B/C/E/BC/EB flutes are covered as options on the ply pages plus a dedicated guide, not as separate products.
- "Retail cartons" fold into Folding Cartons. Hot and cold cups share the Beverage Cups page with variants. "Delivery boxes" share Takeaway & Delivery Boxes. "Shrink wrapping films" are covered by POF Shrink Film. "Flexible packaging rolls" and "printed films" are covered by Laminated & Printed Packaging Rolls. Industrial transit boxes share Heavy-Duty & Industrial Transit Boxes.
- Product copy says Merova "supplies/offers" rather than claiming in-house manufacture, pending confirmation of the manufacturing route.

## 5. Wireframes (as built)

**Homepage:** hero (tagline, proposition, two CTAs, six proof chips, representative image with a "five verticals" card) → **What are you looking to pack?** (10 industry tabs, or a select on mobile; product cards with View / Quote / Flyer; a "different requirement" card; "show all") → verticals grid (5 cards plus a flyers card) → process (9 steps) → "Why Merova" pillars → custom and sustainability split → knowledge centre (3 articles plus downloads) → FAQs → CTA band.

**Industry page:** dark hero (headline, intro, CTAs: view solutions, quote with industry pre-filled, WhatsApp) → 3 challenges plus considerations → product grid from the mapping → custom requirement band (industry pre-filled) → FAQs → further reading → CTA.

**Product page:** breadcrumb → hero (name, headline, summary; CTAs: Request a Quote, Download Flyer, WhatsApp enquiry or Speak with Our Team; a custom-requirement link) with the image → sticky in-page nav → overview plus applications/formats/materials → specification table with status legend → printing and customisation → quality and related industries → FAQs → related products → custom band → CTA.

## 6. Quotation journey
Four steps with a progress bar (three for custom requirements):
1. **Requirement:** industry, category, product (or "something else").
2. **Specifications:** fields depend on the product's quote profile (corrugated: dimensions, ply, flute, style, strength, print; carton: style, board, GSM, finish; cup: capacity, hot/cold, wall, stock, lids; foodservice: format, dimensions, food and temperature, contact; film: material, micron, width, format, machine; pouch: type, fill, features, barrier; custom: description, current packaging, priorities) plus quantity band.
3. **Delivery & files:** location, timeline, notes, up to 5 files (4 MB in total).
4. **Your details:** contact person, company, business email, mobile, location, consent.

Only name, email and consent are mandatory, plus either a product or a description. Product and industry are carried from any page (`?product=&industry=`). After submission, the server validates and routes the enquiry to a team, creates the CRM lead (webhook), emails the team with the files and acknowledges the customer, and the confirmation page shows the reference. **Nothing reports success unless a delivery channel accepted the lead.**

## 7. Mobile navigation
A full-screen drawer below the header with accordion groups (Industries, Products, Manufacturing, Resources, Company), plus Request a Quote, Custom Requirement and Speak With Our Team buttons. It closes on route change and on Escape. The discovery engine becomes a native select on mobile. Quote steps stack to a single column with 44 px+ touch targets.

## 8. Design system
Tokens live in `src/app/globals.css` (`@theme`). Shared components: `Header`, `Footer`, `FloatingDock`, `PageHero`, `SectionHeading`, `Breadcrumbs`, `FaqList`, `Media`, `CtaBand`, `CustomRequirementBand`, `ProductCard`/`ProductGrid`, `SpecTable`, `IndustryDiscovery`, `QuoteEngine`, `ContactForm`, `ArticleCard`, `TrackedLink`, `Pending`. Buttons: primary (red), navy, outline, ghost-light, small. Cards: 6 px radius, line border, card shadow on hover. Motion: a single 600 ms reveal and hover transitions, disabled under `prefers-reduced-motion`.

## 9. Content frameworks
- **Product page:** name · headline · summary · overview (2 paragraphs) · applications · formats · materials · spec rows (option / industry reference / confirmed at quotation) · printing · customisation · quality · industries · 3 FAQs · related products · SEO keywords. The schema is in `src/data/types.ts`.
- **Industry page:** headline · intro · 3 challenges · considerations · featured products · FAQs · SEO.
- **Article:** search headline · intro · sections (paragraphs, lists, tables, notes) · recommendations · applications · FAQs · related products · CTA · reviewer status.

## 10. Blog strategy
- **Categories:** Corrugated, Paper, Foodservice, Plastic & Flexible, Pharmaceutical, Automotive, Sustainable, Engineering, Procurement, Innovations.
- **Calendar:** all 20 topics from the brief are drafted.
- **Workflow:** draft → technical review by a named Merova reviewer → set `review.status = "reviewed"` → the article becomes indexable and enters the sitemap.
- **Cadence after launch:** 2 articles a month.

**Repurposing each article:**
- LinkedIn: one post with a key table as an image, linking to the article.
- Instagram: a 6–8 slide carousel (problem → 3–4 facts → recommendation → CTA).
- Short video: 45–60 s explainer using samples.
- Email newsletter: monthly digest of two articles and one product spotlight.

## 11. Corporate content architecture
About (positioning, philosophy, mission, vision, promise, values) · Manufacturing (processes, formats, infrastructure: pending) · Capabilities (matrix by vertical) · Quality (8 stages, certification policy) · Process (9 stages) · Client Servicing (7 services) · Leadership (6 functions; profiles pending) · Clients (industries served, reference policy) · Case Studies (framework; noindex until published) · Careers (culture, areas, CV form) · Business Partnerships (no investor claims) · Suppliers (categories, registration form) · Contact (6 routed channels). Every page ends with a relevant CTA.

## 12. Mira conversation flows
| Visitor intent | Flow |
|---|---|
| Identify industry | Detect industry → list 3–5 mapped products → offer industry page plus quote with industry → ask what they pack and volume |
| Find a product | Match product → summary plus applications → links: product page, flyer, quote |
| Compare formats | e.g. 3/5/7-ply: plain explanation → guide link → product links |
| Flyers / catalogue | Product flyer if a product is matched; otherwise catalogue, profile and Downloads Centre |
| Quote requirements | Explain the 4-step form → quote link (pre-filled where possible) |
| Custom packaging | Explain → custom requirement link |
| Price / lead time / MOQ / capacity | Decline to estimate → explain why → quote or contact → handoff |
| Certifications | State none are published → contact technical → handoff |
| Human / WhatsApp | Contact and quote links; WhatsApp link in the panel footer when configured → handoff |
| Unknown | Ask a clarifying question, offer industries, products and quote |

## 13. Technical architecture
Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, lucide-react, the Anthropic SDK (Mira) and qrcode. All 180+ pages are statically generated from typed data in `src/data`. Two Node API routes (`/api/enquiry`, `/api/mira`). Print routes (`/print/*`) render the PDFs via Playwright (`scripts/generate-pdfs.mjs`). Images go through `next/image` (AVIF/WebP), with JPEG print derivatives for the PDFs. Security headers are set and the `x-powered-by` header is disabled. Robots blocks non-production Vercel environments from being indexed.

```
src/app/(site)/…     public pages (shared header/footer/dock)
src/app/print/…      PDF source pages (noindex)
src/app/api/…        enquiry + mira
src/components/…     UI, forms, product, industry, blog, print, analytics
src/data/…           products, industries, verticals, quote schemas, company, blog
src/lib/…            site config, SEO, enquiry delivery, Mira, tracking
scripts/…            illustrations, brand assets, PDFs, docs, QA (crawl, overflow)
tests/e2e/…          Playwright journeys
```

## 14. Integration requirements
Resend (email) and/or a CRM webhook; WhatsApp number; Anthropic API key (optional); GA4/GTM/GSC; Cloudflare Turnstile (optional); Vercel project and domain. Details are in [CONFIGURATION.md](CONFIGURATION.md).

## 15. Conversion tracking plan
See [TRACKING-PLAN.md](TRACKING-PLAN.md).

## 16. Content and photography requirements
Photography shot list (per product: hero 4:3, detail, in-use), facility (exterior, each process area, QC lab, warehouse), people (leadership portraits, team at work, with consent). Also required: verified specification sheet per product, certificates, client logo permissions, and case-study interviews. See [ASSET-REGISTER.md](ASSET-REGISTER.md).

## 17. Launch and QA checklist
See [IMPLEMENTATION-CHECKLIST.md](IMPLEMENTATION-CHECKLIST.md) for the status of every acceptance criterion in Part 17.
