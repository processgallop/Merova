/** Shared JSON shapes stored in jsonb columns. Safe to import from client components. */

export type SpecStatus = "option" | "reference" | "confirm";

export interface SpecRow {
  label: string;
  value: string;
  status?: SpecStatus;
}

export interface Faq {
  q: string;
  a: string;
}

/**
 * An image reference. `kind` drives the caption so stock or rendered imagery is
 * never presented as Merova's own facility or products:
 *  - render: original studio visualisation of a packaging format made for Merova
 *  - representative: third-party stock photography (e.g. Unsplash)
 *  - original: authentic Merova photography
 *  - illustration: diagram
 */
export interface ImageRef {
  url: string;
  alt: string;
  kind?: "render" | "representative" | "original" | "illustration";
  mediaId?: string;
  caption?: string;
  credit?: string;
}

export interface SeoMeta {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  primary?: string;
  secondary?: string[];
}

export interface CtaLink {
  label: string;
  href: string;
}

export type SectionType =
  | "hero"
  | "statement"
  | "richText"
  | "split"
  | "features"
  | "steps"
  | "stats"
  | "gallery"
  | "segmentShowcase"
  | "industryDiscovery"
  | "productGrid"
  | "industryGrid"
  | "testimonials"
  | "logos"
  | "faq"
  | "video"
  | "downloads"
  | "articles"
  | "pending"
  | "contactForm"
  | "cta";

export interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
  // Section payloads are validated by the section registry (src/lib/sections.ts).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "h3"; text: string }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "note"; text: string }
  | { type: "image"; image: ImageRef };

export interface PostBlockSection {
  heading: string;
  blocks: PostBlock[];
}

export type ContentStatus = "draft" | "pending_review" | "approved" | "published" | "archived";
export type Role = "super_admin" | "content_admin" | "product_admin" | "sales_admin" | "read_only";
export type Availability = "offered" | "manufactured" | "sourced" | "custom" | "pending";

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  offered: "Merova portfolio · manufacturing route confirmed at quotation",
  manufactured: "Merova-manufactured",
  sourced: "Supplied through partners",
  custom: "Custom-developed solution",
  pending: "Capability under confirmation",
};

export const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};

/* ── Settings shapes ───────────────────────────────────────────────── */

export interface SiteSettings {
  companyName: string;
  legalName: string;
  tagline: string;
  proposition: string;
  description: string;
  email: string;
  salesEmail: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  officeAddress: string;
  plantAddress: string;
  mapUrl: string;
  hours: string;
  gstin: string;
  social: { label: string; url: string }[];
  enquiryRecipients: string;
  notifyOnEnquiry: boolean;
  analytics: { gaId: string; gtmId: string; gscVerification: string };
  cookieBanner: boolean;
}

export type FontPair = "manrope-inter" | "sora-inter" | "jakarta-inter" | "dmsans-inter";

export interface ThemeSettings {
  primary: string;
  primaryDeep: string;
  charcoal: string;
  ink: string;
  background: string;
  surface: string;
  heading: string;
  body: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  footerBg: string;
  footerText: string;
  fontPair: FontPair;
  baseSize: 15 | 16 | 17 | 18;
  headingWeight: 600 | 700 | 800;
  radius: "sharp" | "soft" | "round";
  container: "standard" | "wide";
  spacing: "compact" | "standard" | "airy";
  headerStyle: "solid" | "transparent";
  buttonStyle: "solid" | "outline-hover";
  logoUrl: string;
  logoReverseUrl: string;
  markUrl: string;
  faviconUrl: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  mega?: "products" | "industries" | "about" | "resources" | null;
  children?: { id: string; label: string; href: string; group?: string; description?: string; enabled: boolean }[];
}

export interface FooterSettings {
  statement: string;
  columns: { id: string; title: string; links: { id: string; label: string; href: string }[] }[];
  legal: { id: string; label: string; href: string }[];
  showSegments: boolean;
  showIndustries: boolean;
}

export interface SeoSettings {
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
  robotsDisallow: string[];
  allowIndexing: boolean;
}
