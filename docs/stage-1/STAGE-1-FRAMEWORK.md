# Merova Printpack: Stage 1 strategic framework and creative direction

**Status:** For review. Approval is required before Stage 2. **Date:** 24 November 2026.

**Companion files**

- [`merova-stage1-register.xlsx`](merova-stage1-register.xlsx): the full product register, matrices, sitemap, redirects, verification register and decisions, as spreadsheet tabs with an approval column.
- [`REGISTERS.md`](REGISTERS.md): the same registers as Markdown tables.
- [`register.json`](register.json): a machine-readable copy. Stage 2 imports it directly into `src/data`, so nothing is entered twice.
- [`source/register.py`](source/register.py): the single source for all three files above. It validates IDs, slugs, related links and that every product maps to at least one operator.
- `public/assets/brand/master/`: logo variants extracted from the supplied `Merova_Logo.ai`.

---

## 0. What we inspected, and what it changes

| Source | Finding | Consequence |
|---|---|---|
| Supplied `Merova_Logo.ai` / `.pdf` | Genuine vector artwork on four artboards: a primary lockup on Cloud Dancer, a reverse lockup on red, and the mark on each background. The wordmark is outlined vector, not live text. Exact colours: **Red #D52B1E, Charcoal #454040, Cloud Dancer #FFFAF3**. The reverse mark is **#F1F0EC**, not white. | We extracted the four variants as SVG, unaltered, plus transparent copies cropped to the artwork. No compact horizontal header lockup exists (V-13). |
| Repository (`processgallop/merova`) | A complete earlier build: Next.js 16 / React 19 / Tailwind 4. It has 49 products across **five** verticals (corrugated, paper, foodservice, flexible, custom), 10 industries, 53 PDFs, a product-dependent quote engine, an enquiry API with Resend/CRM delivery and honest 503 handling, Mira (guided mode, plus an AI mode that has never run), contextual WhatsApp, consent-gated analytics, and Playwright tests. | **Keep the engineering, rebuild the structure and design.** The enquiry API, rate limiting, upload handling, SEO helpers, PDF pipeline and test harness are sound. The taxonomy, navigation, data model, visual system and all collateral are replaced. |
| Current design | Palette is **navy-led** (`navy-950` to `navy-50`), with red used only as a "signal" accent. Card radius is 6 px. | The navy problem named in the brief is confirmed. It is removed entirely in Stage 2. |
| Imagery | 18 earlier-site images appear AI-generated and are captioned "Representative image". 42 products use flat SVG "format illustrations". | The brief rules out illustrations in place of product photography, so all of them are replaced. See the image-source dependency, **V-26**. |
| Live sites | `merova.vercel.app` is the older prototype in another Vercel account, still showing placeholder statistics ("XX+ years"). `merova-printpack.vercel.app` is the current build in the connected Vercel account. | Neither is changed in Stage 1. Production target is decision **D-12**. |
| Contact data | No verified phone, email, address or WhatsApp number exists anywhere. | Nothing is invented. These are P0 items V-01 to V-03. |

### Compliance finding (P0)

India's **single-use plastic prohibition** has been in force since 1 July 2022 under the Plastic Waste Management (Amendment) Rules, 2021. It bans the manufacture, import, stocking, distribution, sale and use of plastic **"plates, cups, glasses, cutlery… trays, wrapping or packing films around sweet boxes"** and other items. Plastic carry bags must be at least 120 µm thick ([MoEFCC/PIB](https://pib.gov.in/PressReleasePage.aspx?PRID=1837518), [CPCB](https://www.cpcb.nic.in/uploads/Press-release-SUP-ban-17062022.pdf)).

The brief lists PET glasses, PP glasses, plastic cups and plastic trays, and maps cling film to sweet shops. **We have held these items (flag `SUP`) and propose not to publish them until Merova confirms the legal basis for supplying them** (decision D-03, verification item V-05). Examples of a legal basis would be export-only supply or a format outside the prohibition. Cling film stays listed, but must not be marketed for wrapping sweet boxes. Compostable plastic products separately require CPCB certification (V-06).

---

## 1. Business positioning

**Category:** a multi-material printing and packaging partner. Merova is not a stationery supplier, a hygiene-paper company or a disposables trader.

**Proposition:** **Packaging, Perfected.**
**Support line:** **Engineered to Protect. Designed to Perform.**

**Positioning statement (internal):**
> For manufacturers, food businesses, retailers and procurement teams that buy packaging across several materials, Merova Printpack is the printing and packaging partner that specifies paper, plastic, compostable and corrugated packaging around the product, prints it to brand standard, and confirms it on a sample before production. Buyers get one accountable partner and one specification discipline across every material, instead of four vendors and four sets of assumptions.

**Proof pillars.** The site will claim each pillar only to the extent it can be shown.

| Pillar | What we say | What proves it (Stage 2) |
|---|---|---|
| One portfolio, four materials | "Every material has a purpose." | The four-category portfolio and the industry matrix, both visible and navigable |
| Specified, not sold | Products are specified around the product, the line and the route | Configurable-parameter tables and product-dependent RFQs |
| Print as a discipline | Brand colour, registration and finish are controlled | Print and finish options per product, plus the proofing process. Facility proof waits for V-10 and V-11. |
| Sample before production | Fit, handling and print are approved before a run | The Process Excellence page |
| Material honesty | Compostable, recyclable and conventional are never blurred | The claim-definitions system and certification shown per grade |

**Voice:** confident, exact and brief. The writing is technically literate without jargon, and every headline names a benefit a buyer can test. Banned phrases include "trusted partner", "one-stop", "best-in-class", "quality is our priority", "we deliver excellence", and any statistic Merova has not supplied.

**Headline system (draft copy):**

| Surface | Headline | Support |
|---|---|---|
| Home hero | Packaging, Perfected. | Engineered to Protect. Designed to Perform. |
| Product discovery | Every material has a purpose. Find the right one. | Four materials, one specification discipline. |
| Paper | Make the first impression count. | Cartons, rigid boxes, foodservice and print that carry the brand. |
| Plastic & Films | Film that seals, wraps and protects at line speed. | BOPP, shrink, cling and flexible packaging specified to your machine. |
| Compostable | Compostable, stated precisely. | Certified grades, with the certificate behind every claim. |
| Corrugated | Strength that moves business forward. | Boxes, boards and inserts specified to load, stack and route. |
| Food & beverage | Packaging that performs at every point of service. | From the counter to the delivery rider. |
| Industry discovery | Tell us what you run. We'll show you what you need. | Choose your business to see the packaging it uses, by material. |
| Quote | Build your packaging enquiry. | Add products from any category. Send one request. |

---

## 2. Master product taxonomy

There are four master categories, 21 subcategories and **71 product types**. Sizes, thicknesses and finishes are variants, not separate products. The full register, with every field the brief requires, is in the spreadsheet.

| Category (URL) | Subcategories | Product types |
|---|---|---|
| **Paper Products** `/products/paper-products/` | Paperboard & Folding Cartons · Rigid & Premium Boxes · Foodservice Paper Packaging · Paper Carry Bags · Labels & Stickers · Food Wraps & Specialty Papers · Commercial Printing | 31 |
| **Plastic Products & Films** `/products/plastic-products-films/` | BOPP Films · Shrink Films · Cling, Stretch & Protective Films · Flexible Plastic Packaging · Plastic Containers & Trays · Plastic Cups & Glasses | 16 |
| **Compostable Products** `/products/compostable-products/` | Compostable Bags · Compostable Flexible Packaging · Compostable Shrink & Cling Films · Compostable Foodservice | 13 |
| **Corrugated & Fluted Products** `/products/corrugated-fluted-products/` | Corrugated Boxes · Corrugated Boards & Sheets · Corrugated Inserts & Components · Retail-Ready & Display | 11 |

**Status:**

- **60** products are listed by Merova and become "Confirmed" when ticked at sign-off.
- **4** are subject to confirmation ("where available").
- **7** are agency proposals that need approval.
- **4** carry an SUP flag. Three of these are held, and cling film is restricted in use.

Product pages to publish on approval: 71 − 3 held = 68, less any products Merova rejects.

### Proposed additions (omissions in the brief)

| ID | Product | Why it matters |
|---|---|---|
| PA-03 | Sweet Boxes | The Sweet Shops mapping depends on them. "Sweet box manufacturer" is a high-intent search. |
| PA-04 | Cake & Bakery Boxes | The Bakeries mapping depends on them. |
| PA-31 | Cup Carriers | Needed wherever takeaway beverages are sold. |
| PL-05 | PE Shrink Film (collation) | The main shrink format for beverage and FMCG bundling. |
| PL-06 | Stretch Film (pallet wrap) | The core transit material for logistics and industrial buyers. |
| PL-08 | Air Bubble Film | The brief maps "protective wrapping" with no product behind it. |
| PL-10 | Courier & Mailer Bags | The conventional counterpart to compostable courier bags. |

### Boundary rules (enforced in data)

1. **Material decides the category, and the industry never does.** A corrugated shipper for a cinema still lives in Corrugated.
2. **Certification decides compostable.** PE-lined cups go in Paper (PA-07). Certified-compostable cups go in Compostable (CO-12). The two are cross-linked and never listed twice.
3. **Customisation is a journey, not a product.** "Custom corrugated boxes" and its siblings route to `/custom-packaging/`.
4. **A product record exists once.** Industries reference product IDs and never copy product records.

---

## 3–6. Deduplication, inventory and matrices

These are in the spreadsheet and in `REGISTERS.md`.

- **Dedup Register:** 29 resolutions. Examples: butter paper and greaseproof paper were each listed twice, compostable wrapping film was listed three times, and export or heavy-duty cartons appeared in both 4A and 4D. Six exclusions are recorded with reasons.
- **Product Register:** 71 rows with 22 fields each, ending in an approval column.
- **Industry-Operator Matrix:** 9 industries and 31 operators, with products split into the four material columns. ● marks a primary application and ○ a secondary one.
- **Product×Operator grid:** a 71 × 31 grid of P/S marks that shows reach at a glance. Every product maps to at least one operator, and the build fails otherwise.

**Industry structure.** The brief's additional sectors were evaluated (Part 4.8):

| Industry | Operators (pages) | Decision |
|---|---|---|
| Food & Beverage | 9 (all pages) | As briefed |
| Pharmaceuticals & Healthcare | 2 pages + 3 sections | Distributors, hospitals/labs and pharmacies are too thin for standalone pages. Copy states that validated or sterile packaging is out of scope unless Merova confirms otherwise. |
| Retail & Consumer Goods | 4 pages + 1 section | Electronics & Appliances is folded in here. Supermarkets live once, under Food & Beverage. |
| E-commerce & Logistics | 2 pages + 1 section | Marketplace sellers and D2C are merged, as are fulfilment, 3PL and warehousing. |
| Automotive & Industrial | 2 pages + 1 section | Industrial distribution is folded in. |
| Corporate, Publishing & Marketing | 2 pages + 1 section | No stationery, books or diaries. |
| Hospitality & Catering | 1 | Added: laundry bags, garbage bags, cling film and catering foodservice. |
| Gifting & Celebrations | 1 | Added: a strong India-specific search and purchase pattern. |
| Agriculture & Horticulture | 1 (Phase 2) | Only if nursery bags and produce trays are confirmed. |
| Home furnishings, personal care, industrial distribution | none | Covered as operators or sections elsewhere. No thin pages. |

---

## 7. Website sitemap

The full sitemap has 152 rows (Sitemap tab), with a 301 redirect map for 33 current URLs (Redirects tab).

```
/                                   Home
/products/                          All products (filterable index)
  /products/{category}/             4 category landings
    /products/{category}/{product}/ 71 product pages (68 publishable)
/industries/                        All industries
  /industries/{industry}/           9 industry pages
    /industries/{industry}/{op}/    24 operator pages (7 more as sections)
/about/                             Company overview
  manufacturing · quality · process · client-servicing · sustainability · leadership* · careers · partnerships
/resources/                         Resources hub
  downloads (catalogue · 4 brochures · flyers · profile) · technical · faqs
/insights/                          Blog index → 15 articles (noindex until technically reviewed)
/custom-packaging/                  Custom requirement journey
/request-a-quote/  (+ /basket/)     RFQ and multi-product basket
/contact/  /search/  /privacy-policy/  /terms/  /enquiry-received/
```

\* Leadership is published only once genuine names and photographs are supplied (V-15).

**URL decisions (D-06):**

- Products use `/products/{category}/{product}/` with **no subcategory segment**. This keeps URLs shallow, and a product never moves if a subcategory is renamed.
- Subcategories are anchored sections on the category page (`#foodservice-paper-packaging`).
- All plastic products use `/products/plastic-products-films/`. The brief's `/products/plastic-products/` example is unified to the category slug.
- Trailing slashes are used throughout, with a canonical on every page.

---

## 8. Navigation architecture

**Header (desktop, 72 px, sticky):**

- Logo.
- **Products**, **Industries**, **About Merova**, **Resources**, **Contact**.
- On the right: Search (⌘K), a Quote basket with a count badge, and the primary **Request a Quote** button in solid Merova Red.

**Products mega menu.** Four equal columns, one per category. Each column has a 4:3 product photograph, the category name, a one-line promise and its subcategories as links. The footer row reads "View all 68 products" (the count is live from data), followed by "Not sure what you need? Describe your requirement →".

**Industries mega menu.** The left rail lists the 9 industries. Hovering or focusing an industry shows its operators on the right as cards with thumbnails. The footer row links to "Find packaging for your business" (the industry finder).

**About and Resources** use compact dropdowns with descriptions. **Contact** is a direct link.

**Mobile (<1024 px):**

- The header shows the logo, search, basket and a menu button.
- The menu is a full-screen sheet with accordion sections, using the same hierarchy as desktop.
- A **sticky bottom action bar** appears on product, industry and operator pages. It holds two buttons, "Add to enquiry" and "Get quote", which together fill the full width with 48 px targets. WhatsApp moves into this bar instead of floating over content.

**Footer:**

- Four category columns with their products.
- An Industries column.
- A Company column and a Resources column.
- Contact details, shown only once verified.
- Legal links.

---

## 9. Customer journeys

| Journey | Path | Context carried |
|---|---|---|
| **A · Product-first** | Products → Category → (subcategory anchor) → Product → *Add to enquiry* or *Request quote* | The product ID, variant and configured parameters prefill the RFQ |
| **B · Industry-first** | Industries → Industry → Operator → products grouped by four materials → *Add all primary to enquiry* | Industry and operator are stored on the basket. Products are multi-selected across categories. |
| **C · Custom requirement** | Header or any page "Describe your requirement" → `/custom-packaging/` → description, photo of current pack, application, quantity, contact | Source page and any viewed products |
| **D · Research & download** | Product or industry → *Download flyer* (instant, no gate) → the flyer QR code returns to the product page with `?src=flyer` → quote | Download events and the flyer source are attributed to the eventual lead |
| **E · Direct quote** | Header *Request a Quote* → choose category or product, or "I'm not sure" (switches to C) | — |
| **F · Conversational** | Mira → recommendations with links → "Add these to my enquiry" → basket | The Mira transcript summary is attached to the lead with consent |

Every product, industry, article and download page cross-links into at least two other journeys. This is enforced by components, not left to copywriting.

---

## 10. Page wireframes (section order)

### Home

1. **Header**.
2. **Hero:** a full-bleed red field with the reverse mark as a large cropped graphic, the headline set at 96–128 px, and a product composition on Cloud Dancer revealed through a mask. Two CTAs follow: *Explore products* and *Request a Quote*.
3. **Material selector:** a bento of four category cards in mixed sizes, each with a photograph, the category promise and a count of products.
4. **Industry finder:** a choice of 9 industries opens an operator strip, and an operator opens a live preview of its products grouped by material.
5. **Featured products:** a horizontal rail of 8 products with an *Add to enquiry* button on each.
6. **Why Merova:** five proof pillars as a 2-1-2 bento.
7. **Manufacturing & infrastructure teaser:** genuine media only. Until V-10 and V-11 arrive, this becomes the "How we specify" process strip.
8. **Quality & process:** a 9-step horizontal timeline, scroll-linked on desktop and a vertical list on mobile.
9. **Applications:** an editorial grid of products in use (cinema, sweet shop, delivery, warehouse).
10. **Sustainability:** "Compostable, recyclable, recycled-content: not the same thing." Three definitions link to the Compostable category.
11. **Customisation & client servicing:** a split layout. A spec sheet visual sits on one side, and the service promises on the other.
12. **Downloads:** catalogue, four brochures and company profile as cover thumbnails.
13. **Insights:** three articles.
14. **Closing CTA band (red):** "Build your packaging enquiry", with Quote, WhatsApp and Mira.
15. **Footer**.

### Category landing

1. Category hero: a split layout with the headline, promise, product count, and *Download brochure* and *Request a Quote* buttons.
2. Sticky subcategory chips with anchors.
3. One bento section per subcategory. The lead product takes a 2×2 card and the rest 1×1. Every card has a photograph, name, one-line description and two actions.
4. A "Choose by application" strip of industry links.
5. A material explainer, shown on the Compostable and Plastic pages only: claims and the regulatory note.
6. Category FAQs.
7. The brochure download card and a closing CTA.

### Product page

1. Breadcrumb.
2. **Product hero:** a gallery (hero, detail and in-use images) on the left, and on the right the name, a conversion headline, a summary, a variant selector with chips, and the *Add to enquiry* (primary), *Request quote* and *WhatsApp about this product* buttons.
3. **At a glance:** the material, the key configurable parameters and the status badge ("Specifications confirmed at quotation" where applicable).
4. **Overview:** what the product is and what it is for, in 2–3 short paragraphs.
5. **Variants:** cards with images where they differ visually.
6. **Material & construction.**
7. **Technical parameters:** an expandable table with Merova-confirmed values, configurable values and reference values marked as such.
8. **Customisation & printing.**
9. **Applications → industries & operators:** linked chips grouped by industry.
10. **Quality considerations.**
11. **Related products:** a cross-category rail.
12. **FAQs:** product-specific, in an accordion, rendered in HTML for SEO.
13. **Flyer download card.**
14. **Closing RFQ:** an inline short form, prefilled with the product.

### Industry page

1. Hero with the industry, headline and its operator chips.
2. Operator cards in a bento.
3. "What this industry needs from packaging": 3–4 challenge cards.
4. **Products by material:** four colour-coded columns on desktop and tabs on mobile, each showing primary products and then optional ones.
5. FAQs.
6. Downloads.
7. CTA.

### Operator page

This uses the industry template, scoped to one operator:

1. An operator-specific introduction and the *points of use*. For a cinema these are the concession counter, combo, cafe and storage.
2. **Four material sections**, which stay visually distinct through a coloured rule and icon, not through a change of colour scheme.
3. **"Add the complete kit to my enquiry"**, which adds all primary products to the basket.
4. Custom requirements.
5. FAQs.
6. CTA.

### Corporate pages

About, Manufacturing, Quality, Process, Client Servicing, Sustainability, Careers and Partnerships share an editorial template:

- A full-width red or charcoal hero.
- Alternating text and media sections.
- "Awaiting confirmation" content is **not shown**. Sections render only when their data exists.
- Every page closes with a contextual CTA.

### Resources

- **Download centre:** filter by type, category and industry. Each item shows its cover thumbnail, page count and file size.
- **FAQs:** grouped and searchable.
- **Insights:** an index with category filters. Article pages have a table of contents, product cards in the flow, and an end CTA.

### Enquiry pages

- **RFQ:** progressive steps covering products and specifications, quantities and delivery, uploads, then contact.
- **Basket:** one card per product with its parameters.
- **Custom requirement.**
- **Contact:** routed by topic.
- **Enquiry received:** shown only after the server confirms receipt.

---

## 11. Design system

### 11.1 Colour tokens

**Brand colours** (exact, from the logo file):

| Token | HEX | Use |
|---|---|---|
| `--merova-red` | **#D52B1E** | Primary brand colour, primary CTA, hero fields, key headings, active states |
| `--charcoal` | **#454040** | Wordmark colour, secondary headings, body text on light surfaces |
| `--cloud-dancer` | **#FFFAF3** | Default page background |
| `--reverse` | **#F1F0EC** | Mark and type on red, exactly as in the reverse logo |

**Derived tokens:**

| Token | HEX | Use |
|---|---|---|
| `--red-700` | #B32217 | Hover/pressed on primary buttons (white text 6.6:1) |
| `--red-900` | #7A160E | Deep red sections and footer accents |
| `--red-50` | #FCEDEA | Tinted chips, selected rows |
| `--graphite` | #2A2626 | Dark sections and the footer (red reads warmer on graphite than on black) |
| `--ink` | #1E1B1B | Body text on Cloud Dancer (16.3:1) |
| `--stone` | #6F6866 | Secondary text (5.2:1 on Cloud Dancer) |
| `--sand` | #F4EDE3 | Alternate section background |
| `--line` | #E6DDD1 | Hairlines and card borders |

**Material accents.** These are thin rules and icons only, never page themes:

| Material | HEX |
|---|---|
| Paper | #B8875A (kraft) |
| Plastic | #5E7E8C (film steel) |
| Compostable | #6B7F4E (fibre olive) |
| Corrugated | #8A5A3C (liner brown) |

**Contrast.**

| Pair | Ratio | Result |
|---|---|---|
| Red on white | 5.0:1 | AA for body text |
| Red on Cloud Dancer | 4.8:1 | AA |
| White on red | 5.0:1 | AA |
| `#F1F0EC` on red | 4.4:1 | Large text (≥24 px) only, so button labels on red use white |

**No navy, and no blue anywhere in the system.** Red should cover roughly 15–25 % of a typical viewport, with hero fields and the closing CTA band as full-bleed red moments. The remaining surface is Cloud Dancer, Sand and Graphite.

### 11.2 Typography (D-08)

| Role | Font | Settings |
|---|---|---|
| Display / headings | **Sora** 600–700 | Tracking −0.035em at display sizes, −0.02em at H3 and below |
| Body / UI | **Inter** 400–600 | `font-feature-settings: "ss01", "cv11"`. Tabular numerals (`tnum`) in spec tables. |

**Why this pair:** Sora's geometry and open apertures sit close to the wordmark's construction. Inter is the most legible option on the list for dense specification content. Manrope and Plus Jakarta were close seconds, but both look softer at small sizes. Space Grotesk was too quirky for procurement audiences. If Merova licenses the wordmark typeface (V-14), it replaces Sora for display.

**Fluid type scale:**

| Level | Size (`clamp`) | Line height |
|---|---|---|
| Display | 56 → 128 px | 0.95 |
| H1 | 40 → 72 px | 1.0 |
| H2 | 30 → 48 px | 1.08 |
| H3 | 22 → 28 px | 1.2 |
| H4 | 18 → 20 px | 1.3 |
| Body-L | 18 → 20 px | 1.55 |
| Body | 16 → 17 px | 1.6 |
| Small | 14 px | 1.5 |
| Eyebrow | 12–13 px | uppercase, +0.12em, Inter 600 |
| Spec table | 14–15 px | Inter, `tnum` |
| Button | 15–16 px | Inter 600, −0.005em |

### 11.3 Layout, spacing and shape

**Grid:**

- Content width is 1320 px, or 1440 px for wide bento sections. Text is capped at 68 ch.
- 12 columns on desktop, 8 on tablet and 4 on mobile.
- Gutters are 24 px on desktop, 20 px on tablet and **16 px on mobile**.

**Spacing:** a 4 px base with the tokens 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 and 160. Vertical section padding is 128 px on desktop, 96 px on tablet and 64 px on mobile.

**Radii:**

| Element | Radius |
|---|---|
| Bento cards | 28 px (20 px on mobile) |
| Image wells inside cards | 20 px |
| Inputs | 14 px |
| Buttons | 999 px (pill) |
| Chips | 999 px |
| Tables | 16 px |

**Elevation:**

- Rest: `0 1px 2px rgb(42 38 38 / .06)`.
- Hover: `0 24px 48px -24px rgb(42 38 38 / .28)` plus a 4 px lift.
- Red cards add `0 24px 60px -28px rgb(213 43 30 / .55)`.

**Image ratios:**

| Use | Ratio |
|---|---|
| Product hero | 4:5 |
| Card | 4:3, or 1:1 for compact cards |
| Category | 3:2 |
| Editorial | 16:9 |
| Mobile hero | 4:5 |

### 11.4 Bento system

- **Card sizes:** S (1×1), M (2×1), T (1×2) and L (2×2) on a 4-column bento grid at 1280 px and wider. The grid drops to 2 columns on tablet and 1 on mobile, where L becomes full-width 4:5.
- **Card anatomy:** image well, eyebrow (subcategory), name, one line of description, and an action row with a primary text link and an icon button for *Add to enquiry*.
- **Colourways:** Cloud, Sand, Graphite, and Red for the single hero card in a section.
- **Composition rules:**
  - Each section has one L card at most.
  - No two adjacent rows share the same pattern.
  - The red card is used once per viewport at most.
  - Every card is a link.

### 11.5 Motion language

**Easing and durations:**

- **Easing:** `cubic-bezier(.2,.7,.1,1)` ("Merova out") for entrances, and `cubic-bezier(.6,0,.2,1)` for state changes.
- **Durations:** micro 160 ms, UI 240 ms, reveal 600 ms, hero sequence ≤1,100 ms in total.

**Patterns:**

| Pattern | Spec |
|---|---|
| Section reveal | 24 px rise plus fade, staggered 60 ms per child, triggered at 15 % visibility, once only |
| Image reveal | A `clip-path` inset from 8 % to 0 combined with a 1.06 → 1 scale |
| Hero | The headline rises line by line through a mask. The mark draws as an SVG stroke over 900 ms. Product imagery parallaxes at 0.15× scroll. |
| Card hover | Lift 4 px, shadow deepens, image scales 1.04, arrow moves 4 px |
| Buttons | Background fill sweeps from the left over 240 ms. A press scales to 0.98. |
| Mega menu | Panel opens 0 → 1 with an 8 px drop. Columns stagger 40 ms. |
| Page transitions | View Transitions API: a 200 ms cross-fade with shared-element morphs from card image to product hero |
| Basket | The product thumbnail flies to the basket icon and the badge counter ticks |

**Implementation:** CSS and the View Transitions API, plus one IntersectionObserver hook, with **no animation library**. `prefers-reduced-motion` disables transforms and parallax and keeps opacity changes only. All content is present in the HTML, so nothing depends on JavaScript for visibility.

### 11.6 Components

**Buttons:**

| Variant | Style | Use |
|---|---|---|
| Primary | Red pill with white text | One per view |
| Secondary | Charcoal outline | — |
| Tertiary | Text with an arrow | — |
| On-red | Cloud pill with red text | On red backgrounds |
| Icon button | 44 px | Basket, WhatsApp |

**Other components:**

- **Inputs:** 52 px tall, 14 px radius, a red 2 px focus ring with a 2 px offset, and inline validation with a message and an icon.
- **Chips:** variant selectors and filters.
- **Status badges:** "Configurable", "Confirmed at quotation" and "Certified grade", the last shown only with evidence.
- **Spec table:** zebra rows on Sand, with a legend for the status of each value.

### 11.7 Photography direction

| Element | Direction |
|---|---|
| Hero product shots | Warm Cloud Dancer or Sand sweep. A single large soft key from 45° above-left with a fill card. Natural contact shadow. A 50–85 mm equivalent perspective, with no wide-angle distortion. |
| Detail shots | Macro on material truth: flute edges, board caliper, crease lines, print registration, film gloss and clarity, fibre texture. |
| In-use shots | Real commercial settings: a cinema counter, a mithai display, a delivery handover, warehouse racking. Warm and natural, and never sterile. |
| Colour grade | Neutral-warm whites, rich but not saturated reds. A red brand element appears only where Merova printing would plausibly be. |
| Compostable | No leaves, globes, green swooshes or "eco" props. The fibre texture tells the story. |
| Specification | 4:5 and 4:3 crops. Master files at least 4,000 px on the long edge. Delivered as AVIF/WebP at 640 to 2,560 px widths. |
| Integrity | Generated imagery is labelled "Representative image" (D-10). Generated factories, people or clients are never shown as Merova's own. |

### 11.8 Mira and WhatsApp interface

**Mira:**

- The launcher is a pill on the bottom right labelled "Ask Mira". On mobile it moves into the action bar.
- The panel is 420 × 640 px on desktop and a full-height sheet on mobile.
- Header: "Mira · Merova packaging assistant · AI". A disclosure line reads "Mira is an AI assistant. It can make mistakes; specifications and prices are confirmed by our team."
- Messages render **product cards** with links and *Add to enquiry*, alongside quick-reply chips such as "I run a cinema", "Compare POF vs PVC" and "Talk to a person".
- Human handover offers three options: WhatsApp, a callback form, or attaching the transcript to an enquiry.

**WhatsApp:**

- A 52 px charcoal disc with the WhatsApp glyph sits beside Mira on desktop and in the action bar on mobile.
- On product pages a tooltip offers "Ask about BOPP HST Rolls". The prefilled message carries the product, category and page URL.
- From the basket, the message lists every product in the basket.

### 11.9 Responsive rules

Layouts are designed at 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920 and 2560 px, with a 3,840 px check.

| Breakpoint | Rule |
|---|---|
| Above 1920 px | Content stays at 1440 px while hero and colour fields bleed |
| Below 1024 px | Mega menus become the sheet, product galleries become swipe carousels, and the four-material columns become tabs |
| Mobile | Touch targets are at least 44 px. Floating controls never overlap the action bar or form fields. |

---

## 12. Collateral architecture

All collateral is rendered by the same Next.js components from the same data, at `/print/*` routes, to PDF with Playwright. **Every page is rasterised (`pdftocairo`) and inspected before publication.** Inspection covers clipping, widows and orphans, empty gaps over 20 % of a page, table breaks and image resolution of at least 200 dpi at print size.

| Item | Count | Format | Structure |
|---|---|---|---|
| Product flyers | One per approved product (≤68) | A4 portrait, 1 page | A red header band with the reverse lockup. A 55 % product photograph, then name and headline. Benefits, variants and materials. A configurable-parameter table. Applications and industry chips. Customisation. A red footer with a QR code to the product page, the contact details and a *Request a Quote* call to action. |
| Category brochures | 4 | A4, 12–20 pp | A red cover with the category photograph. An introduction, contents and a divider per subcategory (full-bleed red or graphite). Product spreads of 1–2 products per page. A "by industry" index and a closing contact page. |
| Master catalogue | 1 | A4, ~60–72 pp | Cover, contents and how to use the catalogue. Four category sections with tabbed edge markers in the material accent. Product pages and an index. Contact details and a back cover. |
| Company profile | 1 | A4 landscape, 12–16 pp | Positioning, portfolio, industries and process. Manufacturing and quality pages are included only where verified. Sustainability, client servicing, how to engage, and contact. |

**Red is dominant on every cover, divider and flyer band. Navy does not appear anywhere.** The existing 53 PDFs are withdrawn and their URLs redirect to the new files.

---

## 13. SEO architecture

**Keyword clusters.** Each page owns one primary term, and secondary terms go to sections, not to new pages.

| Cluster (hub page) | Example owned terms (spoke pages) |
|---|---|
| Paper packaging (category) | folding cartons · mono cartons · sweet box manufacturer · cake box · rigid box manufacturer · gift box · paper cups manufacturer · popcorn tub · nachos tray · french fries box · burger box · paper bowl · paper carry bags · premium paper bags · product labels · barcode labels · butter paper · greaseproof paper · brochure printing |
| Plastic packaging & films | BOPP HST roll · BOPP film · POF shrink film · PVC shrink film · PE shrink film · stretch film · cling film · bubble wrap roll · LDPE pouches · courier bags · laminated pouches · plastic food containers |
| Compostable packaging | compostable carry bags · compostable garbage bags · compostable courier bags · compostable nursery bags · compostable pouches · compostable cling wrap · compostable food containers · compostable cutlery |
| Corrugated packaging | 3 ply corrugated box · 5 ply corrugated box · 7 ply box · die cut box · export cartons · e-commerce boxes · corrugated sheets / roll · corrugated partitions · corrugated trays · shelf ready packaging |
| Industry intent | packaging for sweet shops · cinema concession packaging · restaurant takeaway packaging · QSR packaging · cloud kitchen packaging · pharmaceutical carton · e-commerce packaging supplier · automotive packaging |
| Informational (insights) | 3 ply vs 5 ply · POF vs PVC · compostable vs biodegradable · butter paper vs greaseproof · India SUP rules for packaging |

**Templates:**

- **Title:** `{Product} | {Primary modifier} | Merova Printpack`, at most 60 characters. Example: "BOPP HST Rolls | Heat-Sealable BOPP Film | Merova Printpack".
- **Meta description:** 140–155 characters, with the benefit, the key variants and a call to action.
- **H1:** the product name. H2 headings follow the fixed section order.

**Internal linking rules (automated from data):**

- Product → category, related products (3–4), operators (primary), its flyer, and one article.
- Operator → every product in its row.
- Article → 3–6 products plus 1 operator.
- Category → all of its products.

The automated link check fails the build on any orphan page.

**Structured data:**

- `Organization` (and `LocalBusiness` once the address is verified).
- `BreadcrumbList` on every page.
- `Product` **without offers, prices or ratings**.
- `Article` (only once reviewed).
- `FAQPage` markup is used sparingly. Google now shows FAQ rich results only for authoritative sites, so FAQs stay in HTML for users and AI search regardless.
- `ItemList` on category pages.

**Technical:**

- `sitemap.xml` generated from data, excluding held, unapproved and noindex pages.
- `robots.txt` that noindexes Vercel preview builds.
- Canonicals and Open Graph images per page, generated with the product photograph and red band.
- `hreflang` is not needed (single locale, en-IN).
- Image alt text comes from data.

**Blog:** 15 briefed articles are listed in the register. The earlier build's 20 drafts are reused where accurate. All articles stay noindex until a named technical reviewer signs off (V-24). **No rankings or rich results are promised.**

---

## 14. Conversion architecture

**CTA hierarchy:**

| Level | CTAs |
|---|---|
| Primary | *Request a Quote* or *Add to enquiry* (red) |
| Secondary | *Download flyer*, *Explore products* |
| Tertiary | *Ask Mira*, *WhatsApp us*, *Describe your requirement* |

Every page has one primary CTA per viewport and a closing CTA band.

**Page objectives:**

| Page | Primary objective | CTA language |
|---|---|---|
| Home | Explore products / start enquiry | "Explore products" · "Request a Quote" |
| Category | Open a product | "Explore this product" · "Add to enquiry" |
| Product | Enquire about this product | "Add to enquiry" · "Request a custom quote" · "Ask about {product} on WhatsApp" |
| Industry / operator | Build a multi-product enquiry | "Add the complete kit" · "Find packaging for your business" |
| Corporate | Build confidence and convert | "Speak to our packaging team" |
| Resources | Download, then enquire | "Download product specifications" → "Request a Quote" |
| Insights | Move to a product | Inline product cards plus "Discuss your packaging requirement" |
| Contact | Qualified enquiry | "Send enquiry" |

**RFQ and quote basket:**

- **The basket is the centre of the system.** Any product can be added with variant and parameter context. The basket persists in `localStorage` for up to 30 days and works without login.
- **Industry and operator context** is captured once, at the basket level.
- **RFQ steps:**
  1. Products and specifications. Each product shows its own field set from the register's *Quote fields* column, with progressive disclosure behind a "Specify more" link.
  2. Quantities and timing.
  3. Delivery location.
  4. Uploads: artwork, references and photographs.
  5. Company and contact details, with a consent checkbox.
- **Server:**
  - Validation uses one shared schema for client and server.
  - File checks cover type, size and count. Files go to Vercel Blob or the CRM (V-21).
  - Spam protection combines a honeypot, a timing check, a rate limit and Turnstile.
  - Leads route by the category mix (paper, plastic, compostable, corrugated or mixed) to team inboxes or the CRM.
  - A customer acknowledgement is sent with an enquiry reference.
  - **A success page appears only after a 2xx response** from the delivery channel. This logic already exists and is retained.

**Mira (real AI, D-11):**

- **Model:** Claude (Anthropic API), server-side only, with the key held in Vercel env.
- **Grounding:** the register JSON (products, variants, parameters, operators, FAQs, flyers) is the only knowledge source. A tool-use loop lets Mira call:
  - `search_products(query, category?, industry?)`
  - `get_operator_kit(operator)`
  - `compare_products(ids)`
  - `get_downloads(ids)`
  - `add_to_enquiry(ids)` (client action)
  - `handover(reason)`
- **Guardrails:** the system prompt forbids prices, lead times, certifications, capacities, or any specification not in the register. Out-of-scope questions lead to a handover. Answers include product links rendered as cards.
- **Operations:**
  - Streaming responses.
  - Per-IP and per-session rate limits, plus a daily token budget.
  - Transcripts kept in `sessionStorage`.
  - Analytics events track opens, messages, recommendations, adds to enquiry and handovers.
  - An evaluation set of 30 questions covers the three example scenarios in the brief, out-of-scope probes and claims probes. It runs before deployment.
- **Without a key** Mira still works in guided mode over the same data, and the interface says so. Without a key it is not described as an AI assistant.

**WhatsApp:**

- The verified number is required (V-03). Until it is supplied the module is hidden, never shown with a fake number.
- Prefilled messages follow the template "I am interested in {Product} ({Category}) from Merova Printpack. Please share product details and quotation information. {URL}".
- A basket variant lists every product in the basket.
- Clicks are tracked.

**Analytics:**

- GA4 through GTM, loaded only after consent.
- Events: `view_product`, `view_category`, `view_industry`, `view_operator`, `add_to_enquiry`, `basket_view`, `rfq_start`, `rfq_step`, `rfq_submit_success`, `rfq_submit_error`, `download` (type, id), `whatsapp_click`, `phone_click`, `email_click`, `mira_open`, `mira_message`, `mira_recommendation_click`, `mira_handover`, `search` (term, results), `search_click`.
- Conversions: RFQ success, WhatsApp click, Mira handover.
- Nothing is reported as live until it is verified in GA4 DebugView.

---

## 15. Verification register

There are 26 items in the spreadsheet, each with an owner, priority and what it blocks. The P0 items are:

- **V-01 to V-03:** legal entity and contact details, including the WhatsApp number.
- **V-04:** product sign-off.
- **V-05:** SUP legal basis.
- **V-06:** compostable certificates.
- **V-18:** enquiry channel.
- **V-19:** Mira API key.
- **V-22:** domain.
- **V-23:** legal review.
- **V-25:** production project.
- **V-26:** image source.

**Policy in Stage 2:** a section whose verified data is missing does not render. "Awaiting confirmation" placeholders are never shown to buyers.

---

## 16. Implementation roadmap

| Phase | Scope | Depends on | Exit check |
|---|---|---|---|
| **0 · Approval** (this document) | Sign-off on the register, decisions D-01 to D-12 and creative direction | Merova | Approved register returned |
| **1 · Foundations** (~1 week) | Import `register.json` into typed `src/data`. Design tokens, type, grid, motion primitives and components. Header, mega menus, mobile sheet, footer. | Phase 0 | Component QA at 11 widths |
| **2 · Templates** (~1.5 weeks) | Home, category, product, industry, operator, corporate, resources, article, search | Phase 1 | Every route builds; link check clean |
| **3 · Conversion** (~1 week) | Basket, RFQ v2, custom requirement, WhatsApp, Mira with AI tool use and evaluations, analytics events | V-03, V-18, V-19, V-20 | E2E journeys A–F pass; Mira evaluations pass |
| **4 · Imagery** (parallel) | 71 product hero, detail and in-use sets, the hero composition, category images | **V-26** | Contact-sheet review |
| **5 · Collateral** (~1 week) | ≤68 flyers, 4 brochures, catalogue, company profile | Phases 2 and 4 | Every PDF page rasterised and inspected |
| **6 · SEO & content** (~1 week) | Metadata, schema, sitemap, redirects, FAQs, 15 articles | Phase 2, V-24 | Rich Results Test, crawl clean |
| **7 · QA** | Playwright (journeys, forms, uploads, basket, Mira, downloads), axe accessibility, overflow at 11 widths, Lighthouse on mobile and desktop, console and hydration checks | All | Results reported as measured |
| **8 · Deploy** | Vercel preview, then verification, then approval, then promotion to production with the 301 map | V-22, V-25, approval | Live URL verified |

**Reused from the current build:** `api/enquiry` (delivery, routing, rate limit, honeypot), `lib/seo`, `lib/track`, the consent banner, the PDF generation script and the Playwright harness.
**Rebuilt:** the data model, design system, every page template, Mira (from guided-only to AI tool use), the basket (new), and every image and PDF.

---

## 17. Creative direction summary (for the creative approval gate)

**Concept: "The Red Line."** The Merova mark is a single continuous stroke. A line that rises, dips and resolves reads naturally as a production line, a seal and a signature. The site borrows that gesture and nothing else from it. The logo itself is never redrawn.

- **Hero fields** are full-bleed Merova Red. The reverse mark is cropped large off-canvas as a graphic device, using the supplied artwork scaled and positioned without alteration.
- **Section transitions** use a thin red rule that draws itself as the reader scrolls. The rule acts as a progress line on long pages and as the divider in PDFs.
- **The rhythm** is editorial: a big typographic statement, then a dense bento of evidence, then a calm full-bleed photograph, then a red CTA band.
- **Contrast** comes from Cloud Dancer and Sand surfaces with Graphite for depth. Red is reserved for moments that matter, so it stays memorable.
- **Products** are always shown as photographs in material-true light. Icons are reserved for interface functions.

The accompanying review page renders this direction as working HTML: the logo set, colour tokens, type scale, a home hero, the bento system, the product mega menu, a product card, the Mira panel and a flyer cover. Full high-fidelity page prototypes for home, category, product and operator pages are the first deliverable of Phase 1. They are presented for creative approval before the remaining templates are built.
