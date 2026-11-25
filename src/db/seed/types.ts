export type VerticalId = "corrugated" | "paper" | "foodservice" | "flexible" | "custom";

export type IndustryId =
  | "pharmaceutical"
  | "automotive"
  | "food-beverage"
  | "retail"
  | "gifts-premium"
  | "industrial"
  | "ecommerce"
  | "cinema"
  | "fmcg"
  | "electronics"
  | "construction"
  | "corporates"
  | "hospitality"
  | "agriculture"
  | "other";

/** Which dynamic quote form a product uses. */
export type QuoteProfile = "corrugated" | "carton" | "cup" | "foodservice" | "film" | "pouch" | "custom";

/**
 * Status of a specification value.
 * - option: a format or option Merova offers to specify (subject to quotation)
 * - reference: general industry reference information, not a Merova guarantee
 * - confirm: a Merova-specific value that management has not yet confirmed
 */
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

export interface ProductImage {
  src: string;
  alt: string;
  /** render = original Merova product visualisation (3D studio render); representative = non-Merova representative imagery; illustration = diagram */
  kind: "render" | "illustration" | "representative";
}

export interface Product {
  slug: string;
  vertical: VerticalId;
  name: string;
  /** Short name used in cards/menus where space is tight */
  shortName?: string;
  headline: string;
  summary: string;
  overview: string[];
  applications: string[];
  formats: string[];
  materials: string[];
  specs: SpecRow[];
  printing: string[];
  customisation: string[];
  quality: string[];
  industries: IndustryId[];
  faqs: Faq[];
  related: string[];
  image: ProductImage;
  quoteProfile: QuoteProfile;
  seo: { primary: string; secondary: string[]; title?: string; description?: string };
  /** Product-specific note shown with the specification table */
  specNote?: string;
}

export interface Vertical {
  id: VerticalId;
  slug: string;
  name: string;
  navName: string;
  headline: string;
  intro: string;
  description: string;
  technologies: { name: string; text: string }[];
  image: ProductImage;
  seo: { primary: string; secondary: string[]; title: string; description: string };
  faqs: Faq[];
}

export interface Industry {
  id: IndustryId;
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  intro: string;
  challenges: { title: string; text: string }[];
  considerations: string[];
  /** product slugs in display priority; any product tagged with the industry is also included */
  featured: string[];
  icon: string;
  /** Representative product visual for the sector */
  image: string;
  faqs: Faq[];
  seo: { primary: string; secondary: string[]; title: string; description: string };
}
