/**
 * Central site configuration.
 *
 * Every business contact detail comes from environment variables. Nothing is
 * hardcoded or invented: when a value is not configured the UI shows an honest
 * fallback (route to the enquiry form) instead of a fake number or address.
 * See .env.example and docs/CONFIGURATION.md.
 */

const env = (key: string) => {
  const v = process.env[key];
  return v && v.trim().length > 0 ? v.trim() : undefined;
};

export const site = {
  name: "Merova Printpack",
  shortName: "Merova",
  tagline: "Packaging, Perfected.",
  proposition: "Engineered to Protect. Designed to Perform.",
  description:
    "Merova Printpack is a multi-material packaging partner for corrugated, paperboard, foodservice, flexible and custom packaging — specified, sampled and supplied to your application.",
  url: (env("NEXT_PUBLIC_SITE_URL") ?? "https://merova-printpack.vercel.app").replace(/\/$/, ""),
  locale: "en_IN",
  contact: {
    // Digits only, with country code, e.g. 919876543210. Supplied by Merova.
    whatsapp: env("NEXT_PUBLIC_WHATSAPP_NUMBER")?.replace(/\D/g, ""),
    phone: env("NEXT_PUBLIC_CONTACT_PHONE"),
    email: env("NEXT_PUBLIC_CONTACT_EMAIL"),
    salesEmail: env("NEXT_PUBLIC_SALES_EMAIL"),
    careersEmail: env("NEXT_PUBLIC_CAREERS_EMAIL"),
    officeAddress: env("NEXT_PUBLIC_OFFICE_ADDRESS"),
    plantAddress: env("NEXT_PUBLIC_PLANT_ADDRESS"),
    hours: env("NEXT_PUBLIC_BUSINESS_HOURS"),
    legalName: env("NEXT_PUBLIC_LEGAL_NAME") ?? "Merova Printpack",
    gstin: env("NEXT_PUBLIC_GSTIN"),
  },
  social: {
    linkedin: env("NEXT_PUBLIC_LINKEDIN_URL"),
    instagram: env("NEXT_PUBLIC_INSTAGRAM_URL"),
  },
  analytics: {
    gaId: env("NEXT_PUBLIC_GA_ID"),
    gtmId: env("NEXT_PUBLIC_GTM_ID"),
    gscVerification: env("NEXT_PUBLIC_GSC_VERIFICATION"),
  },
  turnstileSiteKey: env("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
} as const;

export const absoluteUrl = (path = "/") =>
  `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export const DEFAULT_WA_MESSAGE =
  "Hello Merova Team, I am interested in your packaging solutions. I would like to discuss my requirements.";

export function whatsappHref(message: string = DEFAULT_WA_MESSAGE) {
  if (!site.contact.whatsapp) return undefined;
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telHref(phone?: string) {
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined;
}
