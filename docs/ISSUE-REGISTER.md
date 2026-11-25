# Issue register (outstanding items)

**Owner:** M = Merova management, D = development, L = legal. **Priority:** P0 = before production launch, P1 = at launch, P2 = after launch.

| # | Issue | Owner | Priority | Where to resolve |
|---|---|---|---|---|
| 1 | Connect a persistent PostgreSQL database (`DATABASE_URL`); without it the deployment is a non-persistent demo | M + D | P0 | Vercel → Storage → Neon (see CONFIGURATION.md) |
| 2 | Approve promotion of the new platform to production (merova-printpack.vercel.app currently serves the previous build) | M | P0 | Vercel |
| 3 | Change the initial admin password, enable two-step verification, create staff accounts | M | P0 | /admin/account, /admin/users |
| 4 | Verified contact details, WhatsApp Business number, addresses, hours, legal name, GSTIN | M | P0 | Admin → Settings |
| 5 | Enquiry notifications: Resend API key + sending domain, or CRM webhook | M + D | P1 | Environment variables; recipients in Admin → Settings |
| 6 | Confirm which products are manufactured in-house vs sourced; update each product's availability classification (3 are marked “capability pending”: rigid boxes, compostable shrink and cling films) | M | P0 | Admin → Products → Technical |
| 7 | Product-specific specifications (GSM, micron, flute, size ranges, tolerances, MOQ, lead time) | M | P1 | Admin → Products → Technical |
| 8 | Review industry ↔ product mappings for the 5 new industries (construction, corporates, hospitality, agriculture, other) | M | P1 | Admin → Industries → Product mapping |
| 9 | Certifications, plant/machinery/capacity, leadership profiles, client references (with permission), sustainability evidence | M | P1 | “Awaiting confirmation” sections on About pages (Admin → Pages) |
| 10 | Authentic product and facility photography to replace renders and stock images | M | P2 | Media library → Replace everywhere |
| 11 | Flyers for products without a PDF (3 custom-solution records and any new products); regenerate catalogue/company profile after catalogue changes. The automated PDF renderer from the earlier build (`git show 4286794:scripts/generate-pdfs.mjs`, `/print` routes) must be re-pointed at the database to regenerate collateral automatically | D | P1 | Admin → Products → Media & flyer; development |
| 12 | Technical review of the 20 knowledge-centre articles (named reviewer) so they can be indexed | M | P1 | Admin → Knowledge centre → Review |
| 13 | Legal review of Privacy Policy and Terms | L | P0 | Admin → Pages |
| 14 | Brand-owner approval of the horizontal header lockup (built from the official mark and wordmark) and ™/® usage | M | P1 | public/assets/brand |
| 15 | GA4 / GTM / Search Console IDs | M | P1 | Admin → Settings |
| 16 | `ANTHROPIC_API_KEY` to enable MIRA's AI mode (guided mode works without it) | M | P2 | Environment variables |
| 17 | Optional Cloudflare Turnstile keys | M | P2 | Environment variables |
| 18 | Custom domain; then update `NEXT_PUBLIC_SITE_URL` (QR codes in existing PDFs point to merova-printpack.vercel.app) | M + D | P1 | Vercel, PDFs |
| 19 | Rate limits are per server instance; add Vercel Firewall rules for `/api/enquiry` and `/admin/login` for global limits | D | P2 | Vercel Firewall |
| 20 | Media is stored in PostgreSQL (4 MB/file). Move to object storage if the library grows large | D | P2 | `src/lib/admin/media.ts` |
| 21 | Measure Lighthouse on the production deployment and tune if any score is below target | D | P1 | — |
