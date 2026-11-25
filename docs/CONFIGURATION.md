# Configuration & deployment

## 1. Database (required for production)
The platform needs PostgreSQL to persist admin changes and enquiries.

| Mode | When | Persistence |
|---|---|---|
| `DATABASE_URL` set | Production | Persistent PostgreSQL (Neon, Supabase, RDS, Vercel Marketplace Postgres, …) |
| No `DATABASE_URL`, local dev | `npm run dev` / `next start` locally | Embedded PostgreSQL in `.data/pglite` |
| No `DATABASE_URL`, on Vercel or during `next build` | Demonstration only | **In-memory, not persistent.** Each server instance has its own copy; changes and sign-ins can be lost. The dashboard shows a warning banner. Website enquiries are refused (503) unless `ALLOW_DEMO_ENQUIRIES=1`. |

**Set up on Vercel:** Project → Storage → Create Database → Neon (Postgres) → connect to the project for Production and Preview. This adds `DATABASE_URL`. Redeploy. On first boot the app runs migrations and seeds the initial content automatically (guarded by a Postgres advisory lock, so concurrent cold starts are safe). Use the pooled connection string; the client disables prepared statements for PgBouncer compatibility.

Schema changes: edit `src/db/schema.ts`, run `npm run db:generate`, commit `drizzle/` and `src/db/migrations.generated.ts`. Migrations apply automatically at start-up.

## 2. Environment variables
| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Production | PostgreSQL connection string |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First boot | Initial Super Administrator (created only when no users exist). Without `ADMIN_PASSWORD` a random password is printed to the server log and must be changed at first sign-in. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL for metadata, sitemap and emails |
| `RESEND_API_KEY`, `LEAD_EMAIL_FROM` | Recommended | Email notifications to the team and acknowledgements to customers (recipients are set in Admin → Settings) |
| `LEAD_EMAIL_DEFAULT` | Optional | Fallback recipient if none is set in Settings |
| `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` | Optional | POST every enquiry as JSON to a CRM / Zapier / Make; signed with HMAC-SHA256 in `X-Merova-Signature` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional | Cloudflare Turnstile on forms (honeypot, timing and rate limits are always on) |
| `ANTHROPIC_API_KEY`, `MIRA_MODEL` | Optional | MIRA AI answers. Without a key MIRA runs in guided mode over the same approved data. |
| `ENQUIRY_RATE_LIMIT`, `LOGIN_RATE_LIMIT` | Optional | Per-IP limits (defaults 6/min and 10/10 min) |
| `ALLOW_DEMO_ENQUIRIES` | Never in production | Accept enquiries on the non-persistent demo database |

Contact details, WhatsApp number, social links, analytics IDs and enquiry recipients are **not** environment variables any more: manage them in Admin → Settings. (`NEXT_PUBLIC_CONTACT_*` values, if present, only pre-fill the first seed.)

## 3. Deploying
1. Connect PostgreSQL (above) and set the variables.
2. Deploy (Vercel: framework preset Next.js, no custom build settings).
3. Sign in at `/admin`, change the initial password, enable two-step verification, create staff accounts.
4. Complete Admin → Settings (verified contact details, WhatsApp, enquiry recipients, analytics IDs).
5. Verify: submit a test enquiry and confirm it appears in Admin → Enquiries (and email/CRM if configured); open `/sitemap.xml` and `/robots.txt`.

Preview deployments are automatically `noindex`.

## 4. Media storage
Uploaded images, PDFs and enquiry attachments are stored in PostgreSQL (`media.data`, max 4 MB per file — the serverless request limit) and served from `/media/{id}/{name}`; images are converted to WebP (max 2400 px) on upload. Enquiry attachments are private and served only to signed-in staff with enquiry access. Bundled assets (logos, product renders, stock photography, seeded PDFs) are served from `public/`. If volumes grow, move binary storage to object storage (e.g. Vercel Blob/S3) behind `src/lib/admin/media.ts` — the rest of the app only uses URLs.

## 5. Security notes
- Passwords: scrypt; sessions: random 256-bit tokens stored as SHA-256 hashes, HTTP-only `SameSite=Lax` cookies, 12-hour lifetime; 5 failed attempts lock an account for 15 minutes; optional TOTP two-step verification.
- Every server action and admin API checks the role on the server (`authorize()`); the proxy only performs an optimistic redirect.
- Server actions are origin-checked by Next.js; admin upload/enquiry APIs check the `Origin` header.
- CSV exports neutralise spreadsheet formulas. SVG uploads are refused. Theme colours are validated before being written into CSS.
- Rate limits are per server instance; for strict global limits add a Vercel Firewall rule on `/api/enquiry` and `/admin/login`.
