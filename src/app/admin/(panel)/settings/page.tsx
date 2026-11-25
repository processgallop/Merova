import { requireUser } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/content";
import { dbMode } from "@/db";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { FieldDef } from "@/components/admin/types";

export const metadata = { title: "Settings" };

const status = (ok: boolean) => (ok ? "Configured" : "Not configured");

export default async function SettingsPage() {
  await requireUser("settings.edit");
  const site = await getSiteSettings();
  const fields: FieldDef[] = [
    { key: "company", label: "Company", type: "group", fields: [] },
    { key: "companyName", label: "Company name", type: "text", required: true },
    { key: "legalName", label: "Registered company name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "proposition", label: "Supporting proposition", type: "text" },
    { key: "description", label: "Company description (used by search engines and MIRA)", type: "textarea" },
    { key: "email", label: "General email", type: "text", hint: "Publish only verified details. Empty fields are hidden on the website." },
    { key: "salesEmail", label: "Sales email", type: "text" },
    { key: "phone", label: "Telephone (display format)", type: "text" },
    { key: "whatsapp", label: "WhatsApp business number (digits with country code)", type: "text", hint: "Enables the WhatsApp button. Example: 919800000000" },
    { key: "whatsappMessage", label: "Default WhatsApp message", type: "textarea" },
    { key: "officeAddress", label: "Registered office address", type: "textarea" },
    { key: "plantAddress", label: "Factory address (if verified)", type: "textarea" },
    { key: "mapUrl", label: "Google Maps embed URL (if verified)", type: "text" },
    { key: "hours", label: "Business hours", type: "text" },
    { key: "gstin", label: "GSTIN", type: "text" },
    { key: "social", label: "Social media links", type: "pairs", addLabel: "Add link", fields: [{ key: "label", label: "Network", type: "text" }, { key: "url", label: "https://…", type: "text" }] },
    { key: "enquiryRecipients", label: "Enquiry notification recipients", type: "text", hint: "Comma-separated emails. Requires email delivery to be configured (see Integrations below)." },
    { key: "notifyOnEnquiry", label: "Email the team when a new enquiry arrives", type: "checkbox" },
    { key: "analytics", label: "Analytics", type: "group", hint: "Loaded only after visitors accept analytics cookies.", fields: [{ key: "gaId", label: "Google Analytics 4 ID", type: "text", placeholder: "G-XXXXXXX" }, { key: "gtmId", label: "Google Tag Manager ID", type: "text", placeholder: "GTM-XXXXXXX" }, { key: "gscVerification", label: "Search Console verification token", type: "text" }] },
    { key: "cookieBanner", label: "Show the cookie consent banner when analytics is configured", type: "checkbox" },
  ].filter((f) => f.key !== "company") as FieldDef[];
  const integrations = [
    { name: "Database", value: dbMode() === "postgres" ? "PostgreSQL (persistent)" : dbMode() === "pglite-file" ? "Embedded PostgreSQL (local file)" : "Temporary in-memory database — set DATABASE_URL" },
    { name: "Email delivery (Resend)", value: status(Boolean(process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM)) },
    { name: "CRM webhook", value: status(Boolean(process.env.CRM_WEBHOOK_URL)) },
    { name: "Spam protection (Turnstile)", value: status(Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) },
    { name: "MIRA AI (Anthropic)", value: process.env.ANTHROPIC_API_KEY ? "Configured — AI answers" : "Not configured — guided mode over the same approved data" },
    { name: "Google Analytics / GTM", value: status(Boolean(site.analytics.gaId || site.analytics.gtmId)) },
  ];
  return (
    <div className="space-y-8">
      <SettingsForm settingKey="site" title="Settings" intro="Company details, contact channels and integrations. Changes appear across the website immediately." fields={fields} initial={JSON.parse(JSON.stringify(site))} />
      <section className="rounded-[3px] border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold">Integrations</h2>
        <p className="mt-1 text-sm">Secrets (API keys, tokens) are set as environment variables in the hosting platform and are never shown here.</p>
        <dl className="mt-4 divide-y divide-line text-sm">{integrations.map((i) => <div key={i.name} className="flex justify-between gap-4 py-2"><dt className="text-heading">{i.name}</dt><dd className={i.value.startsWith("Not") || i.value.startsWith("Temporary") ? "text-amber-700" : "text-emerald-700"}>{i.value}</dd></div>)}</dl>
      </section>
    </div>
  );
}
