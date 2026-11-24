/** Static navigation (no catalogue imports, safe for client bundles). */
export const companyMenu = [
  { label: "About Merova", href: "/company" },
  { label: "Process Excellence", href: "/process" },
  { label: "Client Servicing", href: "/company/client-service" },
  { label: "Leadership & Team", href: "/company/leadership" },
  { label: "Clients & Partnerships", href: "/company/clients" },
  { label: "Case Studies", href: "/company/case-studies" },
  { label: "Careers", href: "/company/careers" },
  { label: "Business Partnerships", href: "/company/partnerships" },
  { label: "Supplier Registration", href: "/company/suppliers" },
];

export const manufacturingMenu = [
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Capabilities", href: "/manufacturing/capabilities" },
  { label: "Process Excellence", href: "/process" },
];

export const resourcesMenu = [
  { label: "Downloads Centre", href: "/resources/downloads" },
  { label: "Packaging Knowledge Centre", href: "/blog" },
  { label: "FAQs", href: "/resources/faqs" },
  { label: "All Resources", href: "/resources" },
];

export type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "mega"; label: string; href: string; menu: "products" | "industries" }
  | { kind: "dropdown"; label: string; href: string; items: { label: string; href: string }[] };

export const primaryNav: NavItem[] = [
  { kind: "mega", label: "Industries", href: "/industries", menu: "industries" },
  { kind: "mega", label: "Products", href: "/products", menu: "products" },
  { kind: "link", label: "Custom Packaging", href: "/custom-packaging" },
  { kind: "dropdown", label: "Manufacturing", href: "/manufacturing", items: manufacturingMenu },
  { kind: "link", label: "Quality", href: "/quality" },
  { kind: "link", label: "Sustainability", href: "/sustainability" },
  { kind: "dropdown", label: "Resources", href: "/resources", items: resourcesMenu },
  { kind: "dropdown", label: "Company", href: "/company", items: companyMenu },
  { kind: "link", label: "Contact", href: "/contact" },
];
