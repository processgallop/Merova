import type { FooterSettings, NavItem, SeoSettings, SiteSettings, ThemeSettings } from "./types";

const env = (k: string) => (process.env[k] ?? "").trim();

/**
 * Initial site settings. Contact details come from environment variables when
 * provided; otherwise they stay empty and the site routes visitors to the
 * enquiry forms instead of showing placeholder numbers.
 */
export const DEFAULT_SITE = (): SiteSettings => ({
  companyName: "Merova Printpack",
  legalName: env("NEXT_PUBLIC_LEGAL_NAME") || "Merova Printpack",
  tagline: "Packaging, Perfected.",
  proposition: "Engineered to Protect. Designed to Perform.",
  description:
    "Merova Printpack is a multi-material packaging solutions partner for corrugated, paperboard, foodservice, flexible and custom packaging — specified to the application, sampled and supplied to an agreed reference.",
  email: env("NEXT_PUBLIC_CONTACT_EMAIL"),
  salesEmail: env("NEXT_PUBLIC_SALES_EMAIL"),
  phone: env("NEXT_PUBLIC_CONTACT_PHONE"),
  whatsapp: env("NEXT_PUBLIC_WHATSAPP_NUMBER").replace(/\D/g, ""),
  whatsappMessage: "Hello Merova Team, I would like to discuss a packaging requirement.",
  officeAddress: env("NEXT_PUBLIC_OFFICE_ADDRESS"),
  plantAddress: env("NEXT_PUBLIC_PLANT_ADDRESS"),
  mapUrl: "",
  hours: env("NEXT_PUBLIC_BUSINESS_HOURS"),
  gstin: env("NEXT_PUBLIC_GSTIN"),
  social: [
    ...(env("NEXT_PUBLIC_LINKEDIN_URL") ? [{ label: "LinkedIn", url: env("NEXT_PUBLIC_LINKEDIN_URL") }] : []),
    ...(env("NEXT_PUBLIC_INSTAGRAM_URL") ? [{ label: "Instagram", url: env("NEXT_PUBLIC_INSTAGRAM_URL") }] : []),
  ],
  enquiryRecipients: env("LEAD_EMAIL_DEFAULT"),
  notifyOnEnquiry: true,
  analytics: { gaId: env("NEXT_PUBLIC_GA_ID"), gtmId: env("NEXT_PUBLIC_GTM_ID"), gscVerification: env("NEXT_PUBLIC_GSC_VERIFICATION") },
  cookieBanner: true,
});

export const DEFAULT_THEME: ThemeSettings = {
  primary: "#d52b1e",
  primaryDeep: "#a91f15",
  charcoal: "#454040",
  ink: "#1f1b1b",
  background: "#fffaf3",
  surface: "#ffffff",
  heading: "#1f1b1b",
  body: "#454040",
  border: "#e7ddd0",
  buttonBg: "#d52b1e",
  buttonText: "#ffffff",
  footerBg: "#1f1b1b",
  footerText: "#f4ece1",
  fontPair: "manrope-inter",
  baseSize: 16,
  headingWeight: 700,
  radius: "sharp",
  container: "standard",
  spacing: "standard",
  headerStyle: "solid",
  buttonStyle: "solid",
  logoUrl: "/assets/brand/merova-logo-primary.svg",
  logoReverseUrl: "/assets/brand/merova-logo-reverse.svg",
  markUrl: "/assets/brand/merova-mark-red.svg",
  faviconUrl: "/assets/brand/merova-favicon.svg",
};

let n = 0;
const id = (p: string) => `${p}-${++n}`;

export const DEFAULT_NAV: NavItem[] = [
  { id: "nav-products", label: "Products", href: "/products", enabled: true, mega: "products" },
  { id: "nav-industries", label: "Industries", href: "/industries", enabled: true, mega: "industries" },
  {
    id: "nav-about",
    label: "About Merova",
    href: "/about",
    enabled: true,
    mega: "about",
    children: [
      { id: id("a"), group: "Company", label: "Company Overview", href: "/about", enabled: true, description: "Who we are and how we work." },
      { id: id("a"), group: "Company", label: "Leadership & Team", href: "/about/leadership", enabled: true },
      { id: id("a"), group: "Company", label: "Clients & Partnerships", href: "/about/clients", enabled: true },
      { id: id("a"), group: "Company", label: "Careers", href: "/about/careers", enabled: true },
      { id: id("a"), group: "Capability", label: "Manufacturing", href: "/about/manufacturing", enabled: true },
      { id: id("a"), group: "Capability", label: "Capabilities", href: "/about/capabilities", enabled: true },
      { id: id("a"), group: "Capability", label: "Quality Assurance", href: "/about/quality", enabled: true },
      { id: id("a"), group: "Capability", label: "Process Excellence", href: "/about/process", enabled: true },
      { id: id("a"), group: "Capability", label: "Sustainability", href: "/about/sustainability", enabled: true },
      { id: id("a"), group: "Work with us", label: "Business Enquiries", href: "/about/business-enquiries", enabled: true },
      { id: id("a"), group: "Work with us", label: "Custom Requirement", href: "/custom-requirement", enabled: true },
      { id: id("a"), group: "Work with us", label: "Contact", href: "/contact", enabled: true },
    ],
  },
  {
    id: "nav-resources",
    label: "Resources",
    href: "/resources",
    enabled: true,
    mega: "resources",
    children: [
      { id: id("r"), label: "Product Catalogue", href: "/resources#catalogue", enabled: true, description: "The complete Merova portfolio in one document." },
      { id: id("r"), label: "Product Flyers", href: "/resources#flyers", enabled: true, description: "A technical flyer for every published product." },
      { id: id("r"), label: "Company Profile", href: "/resources#company", enabled: true, description: "Positioning, process and portfolio." },
      { id: id("r"), label: "Packaging Knowledge Centre", href: "/knowledge", enabled: true, description: "Technical guides on board, flutes, films and procurement." },
      { id: id("r"), label: "FAQs", href: "/resources/faqs", enabled: true, description: "Quotations, customisation, quality and materials." },
    ],
  },
  { id: "nav-contact", label: "Contact", href: "/contact", enabled: true, mega: null },
];

export const DEFAULT_FOOTER: FooterSettings = {
  statement:
    "A multi-material packaging partner for corrugated, paperboard, foodservice, flexible and custom packaging — specified to the application, sampled, and supplied to an agreed reference.",
  showSegments: true,
  showIndustries: true,
  columns: [
    {
      id: "f-company",
      title: "Company",
      links: [
        { id: "fc1", label: "About Merova", href: "/about" },
        { id: "fc2", label: "Manufacturing", href: "/about/manufacturing" },
        { id: "fc3", label: "Quality Assurance", href: "/about/quality" },
        { id: "fc4", label: "Sustainability", href: "/about/sustainability" },
        { id: "fc5", label: "Careers", href: "/about/careers" },
      ],
    },
    {
      id: "f-resources",
      title: "Resources",
      links: [
        { id: "fr1", label: "Downloads", href: "/resources" },
        { id: "fr2", label: "Knowledge Centre", href: "/knowledge" },
        { id: "fr3", label: "FAQs", href: "/resources/faqs" },
        { id: "fr4", label: "Request a Quote", href: "/request-a-quote" },
        { id: "fr5", label: "Custom Requirement", href: "/custom-requirement" },
      ],
    },
  ],
  legal: [
    { id: "l1", label: "Privacy Policy", href: "/privacy-policy" },
    { id: "l2", label: "Terms of Use", href: "/terms" },
  ],
};

export const DEFAULT_SEO: SeoSettings = {
  titleTemplate: "%s | Merova Printpack",
  defaultTitle: "Merova Printpack — Packaging, Perfected.",
  defaultDescription:
    "Corrugated, paperboard, foodservice, flexible and custom packaging from one accountable partner. Find packaging for your industry and request a quote.",
  ogImage: "/og.png",
  robotsDisallow: ["/admin", "/api"],
  allowIndexing: true,
};
