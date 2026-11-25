/** Static navigation (no catalogue imports, safe for client bundles). */

export const aboutMenu = [
  {
    title: "Company",
    items: [
      { label: "About Merova", href: "/company" },
      { label: "Leadership & Team", href: "/company/leadership" },
      { label: "Clients & Partnerships", href: "/company/clients" },
      { label: "Case Studies", href: "/company/case-studies" },
      { label: "Careers", href: "/company/careers" },
    ],
  },
  {
    title: "Capability",
    items: [
      { label: "Manufacturing", href: "/manufacturing" },
      { label: "Capabilities", href: "/manufacturing/capabilities" },
      { label: "Process Excellence", href: "/process" },
      { label: "Quality Assurance", href: "/quality" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    title: "Work with us",
    items: [
      { label: "Custom Packaging", href: "/custom-packaging" },
      { label: "Client Servicing", href: "/company/client-service" },
      { label: "Business Partnerships", href: "/company/partnerships" },
      { label: "Supplier Registration", href: "/company/suppliers" },
    ],
  },
];

export const resourcesMenu = [
  { label: "Downloads Centre", href: "/resources/downloads", text: "Catalogue, company profile, brochures and 49 product flyers." },
  { label: "Packaging Knowledge Centre", href: "/blog", text: "Technical guides on board, flutes, films, cups and procurement." },
  { label: "FAQs", href: "/resources/faqs", text: "Products, quotations, customisation, quality and sustainability." },
];

/** Kept for footer and company pages. */
export const companyMenu = [...aboutMenu[0].items, ...aboutMenu[2].items.slice(1)];

export type NavKey = "products" | "industries" | "about" | "resources";

export const primaryNav: { key: NavKey | "contact"; label: string; href: string }[] = [
  { key: "products", label: "Products", href: "/products" },
  { key: "industries", label: "Industries", href: "/industries" },
  { key: "about", label: "About Merova", href: "/company" },
  { key: "resources", label: "Resources", href: "/resources" },
  { key: "contact", label: "Contact", href: "/contact" },
];
