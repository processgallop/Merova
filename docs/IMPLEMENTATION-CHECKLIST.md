# Implementation checklist (Part 17 acceptance criteria)

Verification is from the local production build (`next build` + `next start`).

**Legend:**
- ✅ **Completed and verified**
- 🟡 **Implemented, awaiting credentials or business information**
- ❌ **Not completed, with the reason**

| Criterion | State | Evidence / reason |
|---|---|---|
| Every published product has a dedicated page | ✅ | 49 static product routes; crawl returned 200 for all |
| Every product has a functioning flyer download | ✅ | 49 PDFs generated; crawl and Playwright check HTTP 200, `application/pdf`, `%PDF` header |
| Every product has a working quotation CTA | ✅ | `/request-a-quote?product=…` pre-fills the product (e2e) |
| Every industry displays relevant products | ✅ | `validateCatalog()`: each of the 10 industries has ≥10 mapped products, and featured products are tagged |
| Every industry has a custom requirement route | ✅ | Industry pages → `/custom-requirement?industry=…` (e2e verifies the industry is recorded on the lead) |
| Master catalogue downloads correctly | ✅ | 34 pages, 2.0 MB |
| Company profile downloads correctly | ✅ | 5 pages, 0.5 MB |
| All contact details are verified | 🟡 | Merova has supplied none, and the previous site showed placeholders. Details are env-driven and hidden until set (ISSUE-REGISTER #2) |
| WhatsApp works on desktop and mobile | 🟡 | With a test number: contextual wa.me links verified on desktop and mobile for home, product and industry pages. Without a number: fallback panel verified (e2e). Needs the real number (#3) |
| Mira uses approved product information | ✅ / 🟡 | Guided mode answers only from `src/data` and its links are allow-listed (e2e). AI mode is implemented with the same knowledge base and link allow-list but not exercised without `ANTHROPIC_API_KEY` (#17) |
| All forms submit successfully | ✅ / 🟡 | Quote, custom and contact forms submit end to end with the local lead store, including file upload (e2e on desktop and mobile). Production needs Resend or a CRM webhook (#1). Without them, a 503 and honest message are verified |
| Enquiries reach the correct team | ✅ / 🟡 | Routing verified on stored leads (Foodservice sales, Custom development, HR & careers). Inbox delivery needs credentials |
| CRM records are created correctly | 🟡 | Webhook payload implemented and documented (CONFIGURATION.md); needs a CRM endpoint |
| Unique SEO titles and meta descriptions on all major pages | ✅ | Crawler: 0 duplicates across indexable pages; every page has a canonical URL and one H1 |
| All navigation links work | ✅ | Crawl of 119 pages: 0 broken links |
| All internal links work | ✅ | Same crawl; 121 assets return 200 |
| No placeholder metrics remain | ✅ | No metrics are shown anywhere; "awaiting confirmation" panels say so explicitly |
| No dummy testimonials or certifications remain | ✅ | None exist on the site |
| No broken downloads remain | ✅ | All 53 PDFs return 200 |
| Mobile layouts are tested | ✅ | No horizontal overflow at 360/375/390/414/430/768/1024/1280/1440/1920/2560 px on 15 key templates; visual review; e2e on Pixel 7 |
| Accessibility is tested | ✅ | Lighthouse accessibility: 100 on mobile; 96–97 on desktop before fixing two findings (contrast and logo accessible name, both now fixed). Semantic landmarks, skip link, focus styles, labelled forms, `aria-invalid` errors, reduced motion |
| Page performance is tested | ✅ | Lighthouse mobile 93–98, desktop 100; CLS ≈ 0; Best Practices 100; SEO 100 |
| Analytics events are verified | 🟡 | Event calls are wired to every conversion (TRACKING-PLAN.md) and consent-gated; needs GA4/GTM IDs to verify in DebugView (#16) |
| Privacy and terms pages are functional | ✅ / 🟡 | Live pages (previously 404); legal review pending (#15) |
| Central issue register maintained | ✅ | [ISSUE-REGISTER.md](ISSUE-REGISTER.md) |
| Vercel deployment verified on a live URL | ❌ | No Vercel credentials are available in the build environment. The project is ready to import; see README → Deployment (#19) |

## Build status
`npm run lint` clean · `tsc --noEmit` clean · `next build` succeeds (182 static pages, 2 API routes) · `npm run validate:data` OK · Playwright: 18/18 passed (desktop and mobile) · crawler: 0 problems, 0 console errors.
