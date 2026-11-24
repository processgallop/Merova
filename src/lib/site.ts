/**
 * Central site configuration.
 *
 * Contact details come from environment variables. Where Merova has not yet supplied a verified value, a SAMPLE
 * value is used so the full design can be reviewed. SAMPLE values are deliberately non-working (an invalid phone
 * range and a reserved .example domain) so no stranger can be contacted by mistake. While any SAMPLE value is in
 * use, `site.sample` is true and the footer shows a sample-data notice. Replace them in Vercel env (see .env.example).
 */

const env = (key: string) => {
  const v = process.env[key];
  return v && v.trim().length > 0 ? v.trim() : undefined;
};

const SAMPLE = {
  whatsapp: "911234567890",
  phone: "+91 12345 67890",
  email: "hello@merova.example",
  salesEmail: "sales@merova.example",
  careersEmail: "careers@merova.example",
  officeAddress: "Merova House, 4th Floor, Sample Business Park, Andheri East, Mumbai 400 093, India",
  plantAddress: "Plot 00, Sample Industrial Estate, Bhiwandi, Thane 421 302, India",
  hours: "Monday to Saturday, 9:30 am – 6:30 pm IST",
  legalName: "Merova Printpack Private Limited",
  gstin: "27AAAAA0000A1Z5",
};

const pick = <K extends keyof typeof SAMPLE>(k: K, envKey: string) => {
  const v = env(envKey);
  return { value: v ?? SAMPLE[k], sample: !v };
};

const c = {
  whatsapp: pick("whatsapp", "NEXT_PUBLIC_WHATSAPP_NUMBER"),
  phone: pick("phone", "NEXT_PUBLIC_CONTACT_PHONE"),
  email: pick("email", "NEXT_PUBLIC_CONTACT_EMAIL"),
  salesEmail: pick("salesEmail", "NEXT_PUBLIC_SALES_EMAIL"),
  careersEmail: pick("careersEmail", "NEXT_PUBLIC_CAREERS_EMAIL"),
  officeAddress: pick("officeAddress", "NEXT_PUBLIC_OFFICE_ADDRESS"),
  plantAddress: pick("plantAddress", "NEXT_PUBLIC_PLANT_ADDRESS"),
  hours: pick("hours", "NEXT_PUBLIC_BUSINESS_HOURS"),
  legalName: pick("legalName", "NEXT_PUBLIC_LEGAL_NAME"),
  gstin: pick("gstin", "NEXT_PUBLIC_GSTIN"),
};

export const site = {
  name: "Merova Printpack",
  shortName: "Merova",
  tagline: "Packaging, Perfected.",
  proposition: "Engineered to Protect. Designed to Perform.",
  description:
    "Merova Printpack is a multi-material printing and packaging partner: paper, plastic and film, compostable, and corrugated packaging, specified to your product and sampled before production.",
  url: (env("NEXT_PUBLIC_SITE_URL") ?? "https://merova-printpack.vercel.app").replace(/\/$/, ""),
  locale: "en_IN",
  contact: {
    whatsapp: c.whatsapp.value.replace(/\D/g, ""),
    phone: c.phone.value,
    email: c.email.value,
    salesEmail: c.salesEmail.value,
    careersEmail: c.careersEmail.value,
    officeAddress: c.officeAddress.value,
    plantAddress: c.plantAddress.value,
    hours: c.hours.value,
    legalName: c.legalName.value,
    gstin: c.gstin.value,
  },
  /** True while any contact detail is a SAMPLE value. */
  sample: Object.values(c).some((x) => x.sample) || env("NEXT_PUBLIC_SAMPLE_CONTENT") !== "off",
  social: { linkedin: env("NEXT_PUBLIC_LINKEDIN_URL"), instagram: env("NEXT_PUBLIC_INSTAGRAM_URL") },
  analytics: { gaId: env("NEXT_PUBLIC_GA_ID"), gtmId: env("NEXT_PUBLIC_GTM_ID"), gscVerification: env("NEXT_PUBLIC_GSC_VERIFICATION") },
  turnstileSiteKey: env("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
  /** Production indexing only when explicitly enabled. */
  indexable: env("NEXT_PUBLIC_INDEXABLE") === "true",
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export const DEFAULT_WA_MESSAGE = "Hello Merova team, I would like to discuss a packaging requirement.";
export const productWaMessage = (name: string, category: string, url: string) =>
  `I am interested in ${name} (${category}) from Merova Printpack. Please share product details and quotation information. ${absoluteUrl(url)}`;

export function whatsappHref(message: string = DEFAULT_WA_MESSAGE) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
