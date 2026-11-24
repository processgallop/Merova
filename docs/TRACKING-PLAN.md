# Conversion tracking plan

Events are sent by `track()` in `src/lib/track.ts` to `window.dataLayer` (GTM) and `gtag` (GA4), **only after the visitor accepts analytics cookies**. Every event includes `page_path`.

| Event | Fires when | Parameters | GA4 key event |
|---|---|---|---|
| `quote_submit` | Quote form accepted by the API (redirect to confirmation) | `product`, `industry`, `type` | ✅ |
| `enquiry_submit` | Custom requirement or contact form accepted by the API | `type` (custom/sales/technical/orders/suppliers/careers/partnerships), `product`, `industry` | ✅ |
| `quote_step` | Visitor advances a quote step | `step`, `mode` | — (funnel) |
| `whatsapp_click` | Any WhatsApp link or button | `context` / `product` / `industry`, `configured` | ✅ |
| `phone_click` | `tel:` link | `href` | ✅ |
| `email_click` | `mailto:` link | `href` | — |
| `flyer_download` | Product flyer link | `product`, `href` | ✅ |
| `catalogue_download` | Catalogue link | `href` | ✅ |
| `profile_download` | Company profile link | `href` | — |
| `document_download` | Capabilities or sustainability brochure | `href` | — |
| `industry_select` | Industry chosen in the discovery engine | `industry` | — |
| `mira_open` / `mira_message` / `mira_handoff` | Assistant opened, message sent, or a reply flagged for human handoff | — | — |

**Source attribution:** the enquiry itself records the source page, referrer and UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) in the lead sent to email and CRM. This works even without analytics consent, because it is first-party data the visitor submits with their enquiry.

**Recommended GA4 setup:**
1. Funnel exploration: `industry_select` → product page view → `quote_step` (1–4) → `quote_submit`.
2. Custom dimensions: `product`, `industry`.
3. Link Search Console.

**Verification:** with GTM Preview / GA4 DebugView open, accept cookies, then trigger each event above and confirm it arrives with parameters. Without consent, confirm that no `gtm.js` or `gtag` request is made.
