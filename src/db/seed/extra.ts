/**
 * Seed content added for the 2026 platform rebuild: the five industries the
 * brief requires beyond the original ten, sector groupings, sub-industries,
 * product families and three solution-led Custom & Specialised records.
 * Everything describes application needs and process — no capabilities,
 * certifications or figures are claimed.
 */
import type { Faq } from "../types";
import type { Product } from "./types";
import { opt, tbc } from "./products/shared";

export const SECTORS = [
  { slug: "food-beverage-hospitality", name: "Food, Beverage & Hospitality" },
  { slug: "consumer-retail", name: "Consumer & Retail" },
  { slug: "industrial-manufacturing", name: "Industrial & Manufacturing" },
  { slug: "healthcare", name: "Healthcare" },
  { slug: "corporate-institutional", name: "Corporate & Institutional" },
] as const;

/** Industry id → sector slug, display order and sub-industries (brief §6.1). */
export const INDUSTRY_META: Record<string, { sector: string; order: number; sub: string[]; slug?: string }> = {
  automotive: { sector: "industrial-manufacturing", order: 1, sub: ["Automotive OEMs", "Auto Components", "Spare Parts", "Two-Wheeler Manufacturers", "Commercial Vehicles", "Automotive Ancillaries"] },
  "food-beverage": { sector: "food-beverage-hospitality", order: 2, sub: ["Food Manufacturers", "Beverage Manufacturers", "Dairy and Ice Cream", "Bakery and Confectionery", "Frozen Food", "Processed Food", "Restaurants and QSR", "Cloud Kitchens", "Food Distribution"] },
  pharmaceutical: { sector: "healthcare", order: 3, sub: ["Pharmaceutical Manufacturers", "Medicine Manufacturers", "Healthcare Products", "Medical Devices", "Healthcare Distribution", "Diagnostics and Laboratory Supplies"] },
  retail: { sector: "consumer-retail", order: 4, sub: ["Retail Chains", "Department Stores", "Apparel and Fashion", "Cosmetics and Personal Care", "Electronics Retail", "Home and Lifestyle", "Consumer Goods Distribution"] },
  fmcg: { sector: "consumer-retail", order: 5, sub: ["Personal Care", "Home Care", "Packaged Foods", "Household Products", "Consumer Product Manufacturers"] },
  cinema: { sector: "food-beverage-hospitality", order: 6, sub: ["Multiplex Chains", "Cinema Operators", "Single-Screen Cinemas", "Entertainment Centres", "Stadiums and Event Venues", "Amusement Facilities"] },
  construction: { sector: "industrial-manufacturing", order: 7, sub: ["Construction Companies", "Building Material Manufacturers", "Cement and Related Products", "Tiles and Ceramics", "Sanitaryware", "Electrical and Plumbing Products", "Hardware and Fittings", "Interior and Building Products"] },
  industrial: { sector: "industrial-manufacturing", order: 8, sub: ["Engineering Companies", "Industrial Equipment", "Machinery Manufacturers", "Metal Components", "Industrial Parts", "Electrical Equipment", "Industrial Consumables"] },
  ecommerce: { sector: "consumer-retail", order: 9, sub: ["E-commerce Businesses", "Online Retailers", "Third-Party Logistics", "Warehousing", "Courier and Fulfilment", "Exporters and Distributors"] },
  electronics: { sector: "industrial-manufacturing", order: 10, sub: ["Consumer Electronics", "Home Appliances", "Electronic Components", "Electrical Products", "IT Hardware", "Industrial Electronics"] },
  "gifts-premium": { sector: "consumer-retail", order: 11, sub: ["Corporate Gifting", "Luxury Products", "Jewellery", "Watches and Accessories", "Premium Retail", "Promotional Merchandise"] },
  corporates: { sector: "corporate-institutional", order: 12, sub: ["Corporate Offices", "IT Companies", "Banks and Financial Institutions", "Educational Institutions", "Universities", "Government Institutions", "Corporate Events", "Procurement and Administration"] },
  hospitality: { sector: "food-beverage-hospitality", order: 13, sub: ["Hotels", "Resorts", "Restaurants", "Cafés", "Catering Businesses", "Hospitality Chains"] },
  agriculture: { sector: "industrial-manufacturing", order: 14, sub: ["Agricultural Inputs", "Agrochemicals", "Agricultural Equipment", "Processed Agricultural Products", "Food Storage and Distribution"] },
  other: { sector: "corporate-institutional", order: 15, sub: [] },
};

/** Product families (brief §5). Product slug → [segment code, family code]. */
export const SEGMENT_FAMILIES: Record<string, { code: string; families: { code: string; name: string }[] }> = {
  corrugated: { code: "A", families: [ { code: "A1", name: "Corrugated Boxes" }, { code: "A2", name: "Corrugated Trays" }, { code: "A3", name: "Protective Packaging" }, { code: "A4", name: "Specialised Corrugated" } ] },
  paper: { code: "B", families: [ { code: "B1", name: "Folding Cartons" }, { code: "B2", name: "Specialised Cartons" }, { code: "B3", name: "Premium Paper Packaging" }, { code: "B4", name: "Printed Paper Packaging" } ] },
  foodservice: { code: "C", families: [ { code: "C1", name: "Multiplex and Cinema" }, { code: "C2", name: "QSR and Restaurants" }, { code: "C3", name: "Beverage Packaging" }, { code: "C4", name: "Bakery and Food" } ] },
  flexible: { code: "D", families: [ { code: "D1", name: "BOPP" }, { code: "D2", name: "LDPE" }, { code: "D3", name: "Shrink Packaging" }, { code: "D4", name: "Cling Films" }, { code: "D5", name: "Flexible and Laminated Packaging" }, { code: "D6", name: "Compostable Packaging" } ] },
  custom: { code: "E", families: [ { code: "E1", name: "Custom Development" }, { code: "E2", name: "Specialised Solutions" } ] },
};

export const PRODUCT_FAMILY: Record<string, string> = {
  "3-ply-boxes": "A1", "5-ply-boxes": "A1", "7-ply-boxes": "A1", "rsc-boxes": "A1", "die-cut-boxes": "A1", "heavy-duty-cartons": "A1", "export-cartons": "A1", "e-commerce-boxes": "A1",
  "corrugated-trays": "A2", "retail-ready-packaging": "A2",
  "partitions-inserts": "A3", "protective-packaging": "A3",
  "display-packaging": "A4",
  "folding-cartons": "B1", "mono-cartons": "B1", "pharmaceutical-cartons": "B1", "food-cartons": "B1",
  "window-cartons": "B2", sleeves: "B2",
  "gift-boxes": "B3", "rigid-boxes": "B3",
  "printed-paper-packaging": "B4",
  "popcorn-cones": "C1", "popcorn-tubs": "C1", "nachos-trays": "C1", "ice-cream-cups": "C1",
  "french-fries-trays": "C2", "burger-boxes": "C2", "food-trays": "C2", "takeaway-boxes": "C2", "custom-qsr-packaging": "C2",
  "beverage-cups": "C3", "cup-sleeves": "C3",
  "pizza-boxes": "C4", "sandwich-boxes": "C4", "bakery-boxes": "C4",
  "bopp-rolls": "D1",
  "ldpe-pouches": "D2", "ldpe-film": "D2",
  "pof-shrink-film": "D3", "compostable-shrink-film": "D3",
  "pvc-cling-film": "D4", "compostable-cling-film": "D4",
  "laminated-rolls": "D5", "barrier-films": "D5", "custom-pouches": "D5",
  "compostable-bags": "D6",
  "bespoke-packaging": "E1", "sustainable-alternatives": "E2", "specialised-industrial-packaging": "E2", "multi-material-solutions": "E1", "customer-specified-projects": "E1",
};

/** Products whose capability the brief explicitly marks "subject to verification". */
export const CAPABILITY_PENDING = new Set(["rigid-boxes", "compostable-shrink-film", "compostable-cling-film"]);

interface NewIndustry {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  intro: string;
  challenges: { title: string; text: string }[];
  considerations: string[];
  featured: string[];
  icon: string;
  image: string;
  faqs: Faq[];
  seo: { primary: string; secondary: string[]; title: string; description: string };
  isCatchAll?: boolean;
}

export const NEW_INDUSTRIES: NewIndustry[] = [
  {
    id: "construction",
    slug: "construction-packaging",
    name: "Construction & Building Materials",
    shortName: "Construction",
    headline: "Heavy-duty packaging for building products that are dense, sharp-edged and handled hard.",
    intro:
      "Tiles, sanitaryware, fittings, hardware and electrical products are heavy, often fragile at the edges and moved through rough site and distribution handling. Packaging has to carry the weight, protect corners and stay legible on a building site.",
    challenges: [
      { title: "Weight and density", text: "Tiles, fittings and fixtures put concentrated loads on the pack, so board construction and box style matter more than box size." },
      { title: "Edge and corner damage", text: "Ceramics and finished surfaces chip at corners and edges; fitments and corner protection prevent most transit damage." },
      { title: "Site and dealer handling", text: "Packs are stacked in yards, moved by hand and opened on site — they need clear marking and handholds." },
    ],
    considerations: ["5-ply or 7-ply construction for dense loads", "Corner, edge and surface protection", "Partitions for sets of fittings", "Handling marks, product codes and hand holes", "Moisture exposure in storage"],
    featured: ["heavy-duty-cartons", "7-ply-boxes", "5-ply-boxes", "export-cartons", "partitions-inserts", "protective-packaging", "die-cut-boxes", "specialised-industrial-packaging", "ldpe-film", "pof-shrink-film"],
    icon: "HardHat",
    image: "/assets/products/renders/heavy-duty.webp",
    faqs: [
      { q: "Can you package tiles and sanitaryware?", a: "Share the product dimensions, weight per pack and how packs are stacked and moved. The construction and internal protection are specified against that and confirmed on a sample." },
      { q: "Do you supply export packaging for building products?", a: "Export cartons and heavy-duty transit boxes can be specified for long routes. Tell us the destination, transit mode and storage conditions with your enquiry." },
    ],
    seo: {
      primary: "construction materials packaging",
      secondary: ["tiles packaging boxes", "sanitaryware packaging", "heavy duty corrugated boxes", "building products packaging"],
      title: "Construction & Building Materials Packaging | Merova Printpack",
      description: "Heavy-duty corrugated boxes, export cartons, partitions and protective packaging for tiles, sanitaryware, fittings and building products. Request a quote.",
    },
  },
  {
    id: "corporates",
    slug: "corporate-institutional-packaging",
    name: "Corporates & Institutions",
    shortName: "Corporates",
    headline: "Packaging for offices, institutions and corporate programmes — procured simply, presented well.",
    intro:
      "Corporate offices, IT companies, banks, universities and government institutions buy packaging for gifting, events, dispatch, records and pantry operations. Procurement teams need one supplier who can cover several formats on one purchase order.",
    challenges: [
      { title: "Many formats, small volumes", text: "Gift boxes, dispatch cartons, printed sleeves and pantry packaging often arrive as one mixed requirement." },
      { title: "Brand presentation", text: "Corporate gifting and event kits carry the organisation's brand and have to look consistent across items." },
      { title: "Procurement process", text: "Vendor registration, quotations and documentation must be clear for purchase and administration teams." },
    ],
    considerations: ["Consolidated quotation across formats", "Brand colour and logo consistency", "Event and gifting timelines", "Dispatch and records storage cartons", "Pantry and cafeteria foodservice items"],
    featured: ["gift-boxes", "rigid-boxes", "sleeves", "printed-paper-packaging", "e-commerce-boxes", "rsc-boxes", "beverage-cups", "takeaway-boxes", "bespoke-packaging"],
    icon: "Building2",
    image: "/assets/products/renders/gift-box.webp",
    faqs: [
      { q: "Can we order several packaging items in one enquiry?", a: "Yes. Select every product you need on the industry page or in the quote form and submit one consolidated enquiry." },
      { q: "Can you support corporate gifting programmes?", a: "Gift boxes, sleeves and printed packaging can be specified with your brand. Share quantities, the gift contents and your event date." },
    ],
    seo: {
      primary: "corporate packaging supplier",
      secondary: ["corporate gift boxes", "institutional packaging", "branded packaging for companies", "office packaging supplies"],
      title: "Corporate & Institutional Packaging | Merova Printpack",
      description: "Gift boxes, printed sleeves, dispatch cartons and pantry packaging for corporates, institutions and events — quoted together. Request a quote.",
    },
  },
  {
    id: "hospitality",
    slug: "hospitality-packaging",
    name: "Hospitality & Tourism",
    shortName: "Hospitality",
    headline: "Packaging that carries a hotel or restaurant's standard beyond the table.",
    intro:
      "Hotels, resorts, cafés and caterers use packaging for takeaway, room service, bakery counters, amenities and banqueting. It has to perform with food, present the brand and work for busy service teams.",
    challenges: [
      { title: "Food performance", text: "Hot, oily and wet foods need the right board, barrier and closure so food arrives as intended." },
      { title: "Brand experience", text: "Takeaway and gifting packaging is part of the guest experience and should match the property's standard." },
      { title: "Varied, recurring needs", text: "Cafés, bakeries and banqueting draw on different formats that need to be reordered reliably." },
    ],
    considerations: ["Food-contact materials for each food type", "Grease and moisture barriers", "Branded print across the range", "Bakery and cake box formats", "Cling film and wraps for kitchens"],
    featured: ["takeaway-boxes", "food-trays", "beverage-cups", "cup-sleeves", "bakery-boxes", "sandwich-boxes", "pizza-boxes", "gift-boxes", "pvc-cling-film", "compostable-bags"],
    icon: "ConciergeBell",
    image: "/assets/products/renders/takeaway-box.webp",
    faqs: [
      { q: "Can you brand takeaway packaging for our property?", a: "Branded print can be specified across cups, boxes and trays. Share artwork and quantities so print and minimums are confirmed in the quotation." },
      { q: "Do you offer compostable options?", a: "Compostable bags are part of the portfolio and are stated only against the certificate for the specific grade. Ask for documentation with your quote." },
    ],
    seo: {
      primary: "hospitality packaging",
      secondary: ["hotel takeaway packaging", "restaurant packaging supplier", "cafe packaging", "bakery boxes"],
      title: "Hospitality & Tourism Packaging | Hotels, Cafés, Catering | Merova Printpack",
      description: "Takeaway boxes, cups, food trays, bakery boxes and cling films for hotels, resorts, cafés and caterers. Request a quote.",
    },
  },
  {
    id: "agriculture",
    slug: "agriculture-packaging",
    name: "Agriculture & Allied Industries",
    shortName: "Agriculture",
    headline: "Packaging for agricultural inputs and produce that travels long, rough routes.",
    intro:
      "Agricultural inputs, agrochemicals, equipment parts and processed agricultural products move through long rural distribution chains, warehouses and seasonal peaks. Packaging needs strength, moisture tolerance and clear labelling.",
    challenges: [
      { title: "Long distribution chains", text: "Products pass through several warehouses and dealers, so cartons must hold up to repeated handling and stacking." },
      { title: "Moisture and storage", text: "Humid storage and seasonal stockholding reduce board strength; construction and films are specified for it." },
      { title: "Labelling and compliance", text: "Inputs and agrochemicals carry regulated information that must stay legible throughout distribution." },
    ],
    considerations: ["5-ply construction for stacked storage", "Moisture exposure during storage", "Liners and films for powders and granules", "Printed regulatory information", "Seasonal volume planning"],
    featured: ["5-ply-boxes", "heavy-duty-cartons", "export-cartons", "rsc-boxes", "ldpe-pouches", "ldpe-film", "laminated-rolls", "barrier-films", "partitions-inserts"],
    icon: "Wheat",
    image: "/assets/products/renders/ldpe-pouch.webp",
    faqs: [
      { q: "Can you supply packaging for agrochemical products?", a: "Outer cartons, partitions and films can be specified. Tell us the product, primary container and any regulatory marking requirements; suitability is confirmed at quotation." },
      { q: "How do you account for humid storage?", a: "Storage humidity and duration are part of the specification. Share where and how long the product is stored so board and film choices reflect it." },
    ],
    seo: {
      primary: "agricultural packaging",
      secondary: ["agrochemical cartons", "agri input packaging", "LDPE pouches agriculture", "corrugated boxes agriculture"],
      title: "Agriculture & Allied Industries Packaging | Merova Printpack",
      description: "Corrugated cartons, partitions, LDPE pouches, films and laminates for agricultural inputs, agrochemicals and processed agri products. Request a quote.",
    },
  },
  {
    id: "other",
    slug: "other-industries",
    name: "Other Industries",
    shortName: "Other",
    headline: "Your industry is not listed? Start with what you need to pack.",
    intro:
      "Merova's portfolio spans corrugated, paperboard, foodservice, flexible and custom packaging. If your sector is not listed, describe your product and how it travels — the team will identify the relevant formats.",
    challenges: [
      { title: "Unusual products", text: "Irregular, fragile or multi-part products usually need a structure developed around them." },
      { title: "Mixed requirements", text: "Many businesses need several packaging formats across materials from one partner." },
      { title: "Specification uncertainty", text: "If you are unsure what to specify, start with the product, weight, quantity and route." },
    ],
    considerations: ["Product dimensions and weight", "How the product is shipped and stored", "Presentation and print needs", "Quantities and frequency", "Existing samples or drawings"],
    featured: ["bespoke-packaging", "multi-material-solutions", "customer-specified-projects", "3-ply-boxes", "5-ply-boxes", "folding-cartons", "custom-pouches", "protective-packaging"],
    icon: "Shapes",
    image: "/assets/products/bespoke-dielines.webp",
    isCatchAll: true,
    faqs: [
      { q: "What should I share if my industry isn't listed?", a: "What you pack, its size and weight, how it is shipped and sold, quantities, and any photographs, drawings or samples." },
    ],
    seo: {
      primary: "custom packaging for any industry",
      secondary: ["packaging supplier", "custom packaging enquiry"],
      title: "Packaging for Other Industries | Merova Printpack",
      description: "Not listed? Describe what you pack and how it travels — Merova identifies suitable corrugated, paperboard, foodservice, flexible or custom packaging.",
    },
  },
];

const CUSTOM_BASE = {
  vertical: "custom" as const,
  quoteProfile: "custom" as const,
  printing: ["Plain or printed", "Print process selected per material and quantity"],
  quality: ["Sample approval before production", "Dimensional checks against the approved sample", "Agreed validation checks recorded on the approval"],
};

export const NEW_PRODUCTS: Product[] = [
  {
    ...CUSTOM_BASE,
    slug: "specialised-industrial-packaging",
    name: "Specialised Industrial Packaging",
    shortName: "Specialised Industrial",
    headline: "Packaging engineered around heavy, irregular and high-value industrial items.",
    summary: "Corrugated structures, fitments and protective systems developed for machinery parts, components and equipment that standard boxes cannot carry safely.",
    overview: [
      "Industrial items are often heavy, irregular, oily or precision-finished. A standard box with void fill rarely protects them well. Specialised industrial packaging combines heavy-duty board, internal fitments and surface protection designed around the part.",
      "Merova starts from the part drawing or a sample, the quantity per pack, how it is lifted and how it travels, then develops and samples the structure before production. Standard formats it builds on — heavy-duty boxes, partitions and protective packaging — keep their own product records.",
    ],
    applications: ["Machinery and equipment parts", "Precision-machined components", "Electrical equipment", "Building products and fittings", "Export consignments"],
    formats: ["Heavy-duty corrugated structures", "Die-cut fitments and cradles", "Partition systems", "Film-wrapped or bagged components"],
    materials: ["5-ply and 7-ply corrugated board", "Corrugated fitments", "LDPE film and bags"],
    specs: [tbc("Construction", "Developed per project from the part and load"), tbc("Dimensions & tolerances", "Agreed on the approved sample"), opt("Development steps", "Brief → concept → dieline → sample → approval → production"), tbc("Validation", "Drop, compression or fit checks agreed per project")],
    customisation: ["Fitments shaped to the part", "Lifting and handling features", "Part identification and handling marks"],
    industries: ["industrial", "automotive", "construction", "electronics", "agriculture"],
    faqs: [
      { q: "What do you need to develop industrial packaging?", a: "A drawing or sample of the part, its weight, quantity per pack, how it is lifted and moved, and the route it travels." },
      { q: "Can you replace wooden crates?", a: "Some applications can move from timber to heavy-duty corrugated. It depends on weight, handling and route; the team assesses it case by case and confirms on a sample." },
    ],
    related: ["heavy-duty-cartons", "7-ply-boxes", "partitions-inserts", "protective-packaging"],
    image: { src: "/assets/products/renders/heavy-duty.webp", alt: "Heavy-duty corrugated transit box", kind: "render" },
    seo: { primary: "industrial packaging solutions", secondary: ["heavy duty industrial packaging", "custom industrial boxes", "component packaging"] },
  },
  {
    ...CUSTOM_BASE,
    slug: "multi-material-solutions",
    name: "Multi-Material Packaging Solutions",
    shortName: "Multi-Material",
    headline: "When one material cannot do everything, combine the right ones.",
    summary: "Packs that combine corrugated, paperboard and flexible materials — for example a printed carton with a film liner and corrugated outer — specified as one system.",
    overview: [
      "Some requirements need presentation, barrier and transit strength at the same time. A single material rarely delivers all three efficiently. Multi-material solutions specify each layer for its job and make sure they work together on the packing line.",
      "Because Merova works across corrugated, paperboard, foodservice and flexible packaging, the complete system can be specified, sampled and quoted together, with each component linked to its own product record.",
    ],
    applications: ["Food and FMCG products needing barrier plus display", "Kits combining several items", "Retail-ready and e-commerce dual-use packs", "Premium products with protective inner packaging"],
    formats: ["Carton plus film liner", "Corrugated outer plus printed carton", "Paperboard tray plus flexible lid film", "Kitted assemblies"],
    materials: ["Corrugated board", "Paperboard", "BOPP, LDPE and laminated films"],
    specs: [tbc("System structure", "Specified per project"), tbc("Component specifications", "Each component specified and confirmed at quotation"), opt("Development steps", "Brief → system concept → sampling → approval → production")],
    customisation: ["Component-level print", "Matched brand standards across materials", "Recyclability-focused alternatives where performance allows"],
    industries: ["food-beverage", "fmcg", "retail", "ecommerce", "gifts-premium", "other"],
    faqs: [
      { q: "Does combining materials affect recyclability?", a: "It can. Where possible components are designed to separate easily, and mono-material alternatives are proposed when they meet the performance requirement." },
      { q: "Can you quote all components together?", a: "Yes. The complete system is quoted together, with each component specified." },
    ],
    related: ["folding-cartons", "laminated-rolls", "custom-pouches", "rsc-boxes"],
    image: { src: "/assets/products/renders/qsr-range.webp", alt: "A coordinated range of paperboard and film packaging formats", kind: "render" },
    seo: { primary: "multi material packaging", secondary: ["combination packaging", "packaging system design"] },
  },
  {
    ...CUSTOM_BASE,
    slug: "customer-specified-projects",
    name: "Customer-Specified Projects",
    shortName: "Customer-Specified",
    headline: "You have the specification. We assess it, sample it and quote it.",
    summary: "For buyers with an existing drawing, dieline or specification sheet — Merova reviews feasibility, suggests improvements where useful and produces to the approved reference.",
    overview: [
      "Many procurement teams already hold a specification: a dieline, a board grade, a film structure or a drawing from an existing supplier. Customer-specified projects start there.",
      "Merova reviews the specification against the application, flags anything that may affect performance, cost or availability, samples where needed and then produces to the approved reference.",
    ],
    applications: ["Second-source and supplier transition", "Tender and RFQ responses", "Existing packaging re-quotes", "Standardisation across sites"],
    formats: ["Any format within the five product segments"],
    materials: ["As specified by the customer, subject to feasibility review"],
    specs: [opt("Inputs accepted", "Drawings, dielines, specification sheets, physical samples"), tbc("Feasibility", "Reviewed and confirmed at quotation"), tbc("Tolerances", "Agreed against your specification")],
    customisation: ["Match existing packaging", "Value-engineering suggestions on request", "Documentation to your vendor format"],
    industries: ["automotive", "pharmaceutical", "industrial", "fmcg", "corporates", "other"],
    faqs: [
      { q: "Can you match our current supplier's packaging?", a: "Share the specification or a sample. The team reviews feasibility and confirms what can be matched in the quotation." },
      { q: "Will you suggest changes to our specification?", a: "Only where it would help performance, cost or availability — suggestions are optional and clearly marked." },
    ],
    related: ["bespoke-packaging", "rsc-boxes", "folding-cartons", "die-cut-boxes"],
    image: { src: "/assets/products/bespoke-dielines.webp", alt: "Carton prototypes and dielines with measuring tools", kind: "representative" },
    seo: { primary: "packaging to customer specification", secondary: ["packaging RFQ", "second source packaging supplier"] },
  },
];
