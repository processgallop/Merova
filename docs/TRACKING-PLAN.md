# Conversion tracking plan

`track()` (`src/lib/track.ts`) pushes events to `window.dataLayer` (GTM) and calls `gtag` when GA4 is loaded directly. GA4/GTM load **only after the visitor accepts analytics cookies** (IDs set in Admin → Settings). Every event includes `page_path`.

| Event | Fires when | Parameters | Suggested key event |
|---|---|---|---|
| `industry_select` | Industry chosen in the finder (home, /industries) | `industry`, `location` | — |
| `filter_use` | Segment / type / material / application filter changed | `filter`, `value`, `industry` | — |
| `discovery_search` | Search in the industry finder (debounced) | `query`, `industry` | — |
| `product_click` | Product card opened | `product`, `industry` | — |
| `product_select` / `product_unselect` | Product added to / removed from the consolidated enquiry | `product`, `selected_count` | — |
| `cta_click` | Header quote, tray quote, industry quote, custom requirement CTAs | `cta`, … | — |
| `quote_start` / `quote_step` / `quote_submit` / `quote_error` | Quote engine opened / step advanced / accepted by server / rejected | `mode`, `products`, `industry`, `step` | `quote_submit` ✅ |
| `contact_submit` | Contact form accepted | `topic` | ✅ |
| `flyer_download` / `catalogue_download` / `document_download` | PDF links | `file`, `href` | `catalogue_download` ✅ |
| `whatsapp_click` / `phone_click` / `email_click` | Contact links | `href`, `context` | `whatsapp_click` ✅ |
| `mira_open` / `mira_message` / `mira_link` | Assistant opened / message sent / suggested link followed | `page`, `href` | — |

Enquiries also store source page, referrer and UTM parameters in the database (first-party, no consent needed), and the dashboard reports industries and products in enquiries. Use GA4 funnel exploration: `industry_select` → `product_click` → `quote_step` → `quote_submit`. Do not assume the largest industry converts best — compare enquiry rates per industry.
