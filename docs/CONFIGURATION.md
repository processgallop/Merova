# Configuration and launch setup

Every business detail and integration is configured through environment variables (see `.env.example`). Nothing is hard-coded, so the site never shows invented phone numbers, addresses or metrics. Until a value is set, the site shows an honest fallback.

| Area | Without configuration | To enable |
|---|---|---|
| Contact details | Hidden. Visitors are routed to the enquiry forms. | `NEXT_PUBLIC_CONTACT_*`, `NEXT_PUBLIC_*_ADDRESS` |
| WhatsApp | "Chat with Merova" opens a panel with the quote form and contact options | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| Enquiry forms | API returns **503**; the form says the enquiry was not sent and shows alternatives | Resend **or** CRM webhook (below) |
| Acknowledgement email | Not sent. The confirmation page asks the visitor to keep the reference. | Resend |
| Mira | Guided mode: deterministic answers from the approved catalogue | `ANTHROPIC_API_KEY` |
| Analytics | Not loaded, and no cookie banner | `NEXT_PUBLIC_GA_ID` and/or `NEXT_PUBLIC_GTM_ID` |
| Spam protection | Honeypot, minimum completion time and per-IP rate limit | Add Cloudflare Turnstile keys |

`NEXT_PUBLIC_*` values are read at build time, so **redeploy after changing them**.

## 1. Enquiry delivery

### Option A — Email (Resend)
1. Create a Resend account and verify the sending domain (DNS records).
2. Set `RESEND_API_KEY`, `LEAD_EMAIL_FROM` (an address on the verified domain) and `LEAD_EMAIL_DEFAULT`.
3. Optionally set team inboxes (`LEAD_EMAIL_CORRUGATED`, `…_FOODSERVICE`, `…_CAREERS`, …). Enquiries are routed like this:

| Enquiry | Team | Variable |
|---|---|---|
| Quote for a corrugated product | Corrugated sales | `LEAD_EMAIL_CORRUGATED` |
| Quote for a paperboard product | Paperboard sales | `LEAD_EMAIL_PAPER` |
| Quote for a foodservice product | Foodservice sales | `LEAD_EMAIL_FOODSERVICE` |
| Quote for a flexible product | Flexible packaging sales | `LEAD_EMAIL_FLEXIBLE` |
| Custom requirement / custom products | Custom development | `LEAD_EMAIL_CUSTOM` |
| Technical support | Technical support | `LEAD_EMAIL_TECHNICAL` |
| Existing order | Customer service | `LEAD_EMAIL_ORDERS` |
| Supplier | Procurement | `LEAD_EMAIL_SUPPLIERS` |
| Careers | HR & careers | `LEAD_EMAIL_CAREERS` |
| Business partnership | Business development | `LEAD_EMAIL_PARTNERSHIPS` |
| Sales / quote with no product | Sales | `LEAD_EMAIL_DEFAULT` |

The team email includes every field, the reference, source page, referrer, UTM tags and the uploaded files (up to 5 files, 4 MB in total). Replies go straight to the customer (`reply-to`).

### Option B — CRM webhook
Set `CRM_WEBHOOK_URL` to an endpoint in your CRM or automation tool (HubSpot/Zoho via Zapier, Make or n8n, or a custom endpoint). Each lead is posted as JSON:

```json
{
  "ref": "MRV-20261124-1A2B3C", "createdAt": "…", "status": "new",
  "type": "quote", "typeLabel": "Request a quote", "team": "Foodservice sales",
  "product": { "slug": "popcorn-tubs", "name": "Popcorn Tubs", "category": "Foodservice & QSR Packaging" },
  "industry": { "id": "cinema", "name": "Multiplexes & Cinemas" },
  "specs": { "Product format": "130 oz tub", "Food and temperature": "Hot buttered popcorn" },
  "quantity": "25,000 – 1,00,000", "delivery": "Pune, India", "timeline": "1–3 months",
  "contact": { "name": "…", "company": "…", "email": "…", "phone": "…" },
  "source": { "page": "/request-a-quote?product=popcorn-tubs", "referrer": "…", "utm": {} },
  "files": [{ "name": "artwork.pdf", "type": "application/pdf", "size": 12345 }]
}
```

Map `team` to the CRM owner or queue, use `status` for quotation status, and use `ref` as the external ID. If `CRM_WEBHOOK_SECRET` is set, verify `X-Merova-Signature` (HMAC-SHA256 hex of the raw body). Files are delivered by email (Option A). For file storage in the CRM, add an object-storage upload step. The integration point is `deliverLead()` in `src/lib/enquiry.ts`.

Both options can run together. The visitor sees success only if at least one of team email, CRM webhook or (in development) the lead store accepted the lead.

### Verify
1. Submit a test quote with a file attached.
2. Check that the team inbox and/or CRM received it with the right team and product, that the customer received the acknowledgement, and that the confirmation page shows the same reference.
3. Check the Vercel function logs for `[enquiry] MRV-… accepted via …`.

## 2. WhatsApp
Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to digits only, including the country code (for example `9198XXXXXXXX`), then redeploy. The floating "Chat with Merova" button, the product-page WhatsApp CTA and the industry-page CTA all open `https://wa.me/<number>?text=…`. The message names the product or industry being viewed. Clicks are tracked as `whatsapp_click`.

## 3. Mira (AI assistant)
Set `ANTHROPIC_API_KEY` (optionally `MIRA_MODEL`). Mira then uses Claude with a system prompt containing the approved knowledge base, which is generated automatically from `src/data`, so editing product data updates Mira. Safeguards:
- Hard rules against inventing specifications, prices, capacity, certifications, lead times and references.
- Structured JSON output. Links are filtered against the site's real URLs (`ALLOWED_HREFS`).
- Refusals, errors and timeouts fall back to guided mode.
- The visitor-facing disclosure "Mira is an AI assistant" is always shown.

## 4. Analytics, Tag Manager and Search Console
1. **GA4:** create a property and web stream, then set `NEXT_PUBLIC_GA_ID`.
2. **GTM (optional):** set `NEXT_PUBLIC_GTM_ID`. Events are pushed to `dataLayer` (see `docs/TRACKING-PLAN.md`).
3. Both load only after the visitor accepts analytics in the cookie banner.
4. **Search Console:** choose the HTML-tag verification method, copy the `content` token into `NEXT_PUBLIC_GSC_VERIFICATION`, redeploy, then click Verify. Submit `https://<domain>/sitemap.xml`.
5. In GA4, mark `quote_submit`, `enquiry_submit` and `whatsapp_click` as key events.

## 5. Spam protection (Turnstile)
Create a Turnstile widget in Cloudflare, then set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. The widget then appears on the quote and custom-requirement forms and is verified server-side. The honeypot, 3-second minimum completion time and per-IP rate limit are always active. The rate limiter keeps state in memory per instance; for strict global limits, place Vercel Firewall rate-limiting rules in front of `/api/enquiry`.

## 6. Custom domain
Add the domain in Vercel → Domains, set `NEXT_PUBLIC_SITE_URL` to it, rebuild, and **regenerate the PDFs** so their QR codes and links use the new domain:

```bash
npm run build && npx next start -p 3100 &
PDF_BASE=http://localhost:3100 npm run pdfs
```

Commit the updated files in `public/assets/downloads`.

## 7. Content updates
- Products, industries, verticals: `src/data/products/*.ts`, `industries.ts`, `verticals.ts`. Run `npm run validate:data` (cross-reference check), `npm run docs` (SEO map and taxonomy) and regenerate the PDFs.
- Articles: `src/data/blog/*.ts`. Set `review: { status: "reviewed", reviewer: "Name, Role", date: "YYYY-MM-DD" }` once a Merova technical reviewer approves an article. It then becomes indexable and is added to the sitemap.
- Company facts (certifications, machinery, people, clients): see `docs/ISSUE-REGISTER.md` for the exact places to add them.
