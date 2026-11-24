# Issue register

Central register of open items. **Owner:** M = Merova management, D = development, L = legal. **Priority:** P0 = blocks launch, P1 = before or at launch, P2 = after launch.

| # | Issue | Owner | Priority | Status | Where to resolve | Resolution |
|---|---|---|---|---|---|---|
| 1 | No enquiry delivery channel configured; forms return "not connected" (503) | M + D | P0 | Open: needs credentials | Vercel env: Resend and/or `CRM_WEBHOOK_URL` | Verified locally with the lead store: 18 Playwright journeys pass |
| 2 | Verified contact details (phone, email, addresses, hours, legal name, GSTIN) not supplied; the previous site had placeholders | M | P0 | Open | Vercel env `NEXT_PUBLIC_*` | Placeholders removed; details hidden until supplied |
| 3 | Verified WhatsApp Business number not supplied | M | P0 | Open | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Fallback panel works; contextual wa.me links verified with a test build |
| 4 | Confirm which products Merova manufactures in-house vs supplies via partners, and remove any it cannot supply (e.g. rigid boxes, barrier films, compostable films) | M | P0 | Open | `src/data/products/*.ts` | Copy says "supplies/offers"; rigid boxes flagged "subject to capability" |
| 5 | Product-specific specifications (GSM ranges, micron ranges, flute availability, size limits, tolerances, MOQ) not confirmed | M | P1 | Open | `specs` arrays in `src/data/products/*.ts`, changing `tbc(...)` to `opt(...)` | Unconfirmed values marked "Confirmed at quotation" |
| 6 | Food-contact documentation per material (foodservice, films) | M | P1 | Open | Product specs, Quality page | Stated as "confirmed per material at quotation" |
| 7 | Certifications (numbers, scopes, validity) | M | P1 | Open | `src/app/(site)/quality/page.tsx` (certifications section) | Policy statement plus "awaiting confirmation" panel; no logos shown |
| 8 | Machinery, plant location and size, capacity, authentic facility photos | M | P1 | Open | Manufacturing and Capabilities pages, capabilities brochure | "Awaiting confirmation" panels; representative images captioned |
| 9 | Leadership profiles and photographs (with consent) | M | P2 | Open | `src/app/(site)/company/leadership/page.tsx` | Function-based content shown |
| 10 | Client logos, testimonials and case studies (with written permission) | M | P2 | Open | Clients and Case Studies pages (case studies noindex until published) | Reference policy published; nothing invented |
| 11 | Sustainability evidence (recycled-content %, waste data, compostability certificates) | M | P1 | Open | Sustainability page, `CLAIM_DEFINITIONS`, compostable product specs | Claims defined precisely; no figures shown |
| 12 | Technical review of the 20 knowledge-centre articles (named reviewer) | M | P1 | Open | `review` field in `src/data/blog/*.ts` | Articles live but `noindex` and out of the sitemap until reviewed |
| 13 | Original product photography for 49 products | M | P2 | Open | `public/assets/products`, product `image` fields | Labelled format illustrations and representative photos in use (see ASSET-REGISTER) |
| 14 | Provenance of the 18 previous-site images unverified (appear AI-generated) | M | P1 | Open | ASSET-REGISTER | Always captioned "Representative image"; never presented as Merova's own |
| 15 | Privacy Policy and Terms need legal review | L | P0 | Open | `src/app/(site)/privacy-policy`, `terms` | Drafted, DPDP-aware; review before launch |
| 16 | GA4 / GTM / Search Console IDs | M | P1 | Open | Vercel env | Consent-gated loader implemented |
| 17 | Mira AI mode requires `ANTHROPIC_API_KEY` | M | P2 | Open | Vercel env | Guided mode functional and tested; AI mode compiles against the SDK; not exercised without a key |
| 18 | Cloudflare Turnstile keys (optional) | M | P2 | Open | Vercel env | Honeypot, timing and rate limit active |
| 19 | Vercel deployment | D | P0 | Resolved | Vercel project `merova-printpack` | Deployed to https://merova-printpack.vercel.app and verified. Auto-deploy on push needs the Vercel GitHub integration (`vercel git connect` / dashboard) |
| 20 | Custom domain and regenerating PDFs for it; the old merova.vercel.app prototype lives in a different Vercel account and still shows placeholders | M + D | P1 | Open | `NEXT_PUBLIC_SITE_URL`, `npm run pdfs` | PDFs and canonical URLs point to merova-printpack.vercel.app |
| 21 | Uploaded files are emailed, not stored; add object storage if CRM file storage is needed | D | P2 | Open | `deliverLead()` in `src/lib/enquiry.ts` | 4 MB attachment limit enforced |
| 22 | In-memory rate limiter is per instance | D | P2 | Open | Vercel Firewall rule on `/api/enquiry` | Documented |
