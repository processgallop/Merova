/**
 * Initial CMS pages. Every block is editable in /admin/pages. Copy is
 * process-based: no metrics, certifications, client names or capacities are
 * stated until Merova management supplies verified information ("pending"
 * blocks show what is awaiting confirmation without inventing it).
 */
import type { Section, SectionType, SeoMeta } from "../types";
import { CLAIM_DEFINITIONS, CLIENT_SERVICE, MANUFACTURING_PROCESSES, PROCESS_STEPS, QUALITY_STAGES, SUSTAINABILITY_TOPICS, TEAM_FUNCTIONS } from "./company";

let i = 0;
const s = (type: SectionType, data: Section["data"]): Section => ({ id: `s${++i}`, type, enabled: true, data });

export interface SeedPage {
  slug: string;
  title: string;
  navLabel?: string;
  template?: string;
  system?: boolean;
  seo: SeoMeta;
  sections: Section[];
}

const WAREHOUSE = { url: "/assets/stock/editorial-warehouse.webp", alt: "Corrugated cartons stored on warehouse racking", kind: "representative" as const, credit: "CHUTTERSNAP / Unsplash" };
const RANGE = { url: "/assets/products/renders/qsr-range.webp", alt: "Merova-red foodservice range: popcorn tub, fries carton, burger box and cup", kind: "render" as const };
const HERO = { url: "/assets/products/renders/hero.webp", alt: "A composition of Merova packaging formats: film roll, paper cup, popcorn tub and printed carton", kind: "render" as const };
const DIELINES = { url: "/assets/products/bespoke-dielines.webp", alt: "Carton prototypes and dielines with measuring tools", kind: "representative" as const };

export const SEED_PAGES: SeedPage[] = [
  /* ── Homepage ─────────────────────────────────────────────────────── */
  {
    slug: "home",
    title: "Home",
    system: true,
    template: "home",
    seo: {
      title: "Merova Printpack — Packaging, Perfected. | Multi-Material Packaging Partner",
      description:
        "Corrugated, paperboard, foodservice, flexible and custom packaging from one accountable partner. Select your industry to discover relevant packaging and request a quote.",
    },
    sections: [
      s("hero", {
        variant: "brand",
        eyebrow: "Packaging, Perfected.",
        heading: "Packaging Solutions That Move Businesses Forward.",
        text: "From protective transit packaging to precision-printed consumer packaging, Merova brings material understanding, application-led design and accountable supply together — built around the way your product is packed, shipped and sold.",
        image: HERO,
        primary: { label: "Explore Packaging Solutions", href: "/industries" },
        secondary: { label: "Request a Quote", href: "/request-a-quote" },
        proof: ["Corrugated", "Paperboard", "Foodservice", "Flexible", "Custom"],
      }),
      s("statement", {
        eyebrow: "Who we are",
        heading: "One accountable partner across every packaging material.",
        text: "Merova Printpack is a multi-material packaging solutions and manufacturing partner. We specify corrugated, paperboard, foodservice and flexible packaging against the application, prove it on a sample, and supply it to an approved reference — so procurement teams deal with one partner instead of several single-process suppliers.",
        points: [
          { title: "Specified, not guessed", text: "Every pack starts from the product, the route and the line it runs on." },
          { title: "Sampled before committed", text: "Fit, handling and print are proven before production begins." },
          { title: "Supplied to a reference", text: "The approved sample and specification govern every repeat order." },
        ],
        cta: { label: "About Merova", href: "/about" },
      }),
      s("industryDiscovery", {
        eyebrow: "What can Merova do for your industry?",
        heading: "Your Industry. Your Requirements. The Right Packaging.",
        intro: "Every industry has different packaging requirements. Select your industry to discover relevant products, materials and packaging solutions from across Merova's portfolio.",
      }),
      s("segmentShowcase", {
        eyebrow: "Product portfolio",
        heading: "Every Packaging Requirement. A Clearly Defined Solution.",
        intro: "Five product segments, one specification discipline. Explore by material, then narrow by format.",
      }),
      s("features", {
        eyebrow: "Why Merova",
        heading: "Built on process. Accountable on delivery.",
        intro: "What a buyer can expect from working with Merova — described by how we work, not by claims we cannot yet evidence on this page.",
        variant: "numbered",
        columns: 3,
        items: [
          { title: "Multi-material understanding", text: "Corrugated, paperboard, foodservice and flexible packaging specified side by side, so mixed requirements are quoted and managed together." },
          { title: "Application-led specification", text: "Board grade, flute, film structure and cup stock are chosen against load, route, food contact and line speed — and written onto a specification you can review." },
          { title: "Sample-first development", text: "Physical samples are produced and checked for fit, handling and print before production is committed." },
          { title: "Approved-reference production", text: "The approved sample, specification and artwork proof become the reference for every production run and repeat order." },
          { title: "Structured quality checks", text: "Incoming material, in-process and final checks against the agreed specification, with records kept for traceability." },
          { title: "One point of coordination", text: "A single contact coordinates enquiries, samples, orders, dispatch and artwork changes across formats." },
        ],
      }),
      s("steps", {
        eyebrow: "Manufacturing & quality",
        heading: "Manufacturing Precision. Packaging Performance.",
        intro: "A nine-stage process takes every requirement from consultation to after-delivery support.",
        items: PROCESS_STEPS.map((p) => ({ title: p.name, text: p.short })),
        cta: { label: "Explore Manufacturing", href: "/about/manufacturing" },
      }),
      s("split", {
        variant: "red",
        eyebrow: "Custom packaging",
        heading: "Have a Requirement That Needs a Different Approach?",
        body: "Irregular products, multi-item kits, unusual routes or a specification from another supplier. Share drawings, photographs or a sample — our team assesses the application and develops the right pack through sampling.",
        image: DIELINES,
        imageSide: "right",
        bullets: ["Structures developed around your product", "Multi-material systems specified as one", "Customer specifications reviewed and sampled"],
        cta: { label: "Discuss Your Custom Requirement", href: "/custom-requirement" },
      }),
      s("pending", {
        eyebrow: "Corporate credibility",
        heading: "Credentials published only when they can be verified.",
        text: "Client references, certifications, capacity figures and plant details appear here once Merova management confirms them. Until then we would rather show nothing than show something unverified. Ask our team for current documentation relevant to your requirement.",
        items: ["Certifications and audit reports", "Client references (with permission)", "Plant infrastructure and machinery", "Production capacity"],
        cta: { label: "Speak With Our Team", href: "/contact" },
      }),
      s("articles", {
        eyebrow: "Knowledge & resources",
        heading: "Technical guidance for packaging decisions.",
        intro: "Guides on board, flutes, films, cups and procurement — plus the catalogue, company profile and a flyer for every product.",
        limit: 3,
        showDownloads: true,
      }),
      s("cta", {
        variant: "red",
        heading: "Let's Build the Right Packaging Solution for Your Business.",
        text: "Tell us what you pack, how it travels and the quantities involved. We will come back with a specification and a quotation.",
        primary: { label: "Request a Quote", href: "/request-a-quote" },
        secondary: { label: "Speak With Our Team", href: "/contact" },
      }),
    ],
  },

  /* ── About ────────────────────────────────────────────────────────── */
  {
    slug: "about",
    title: "About Merova",
    seo: { title: "About Merova Printpack | Multi-Material Packaging Partner", description: "Merova Printpack brings corrugated, paperboard, foodservice, flexible and custom packaging together under one accountable partner." },
    sections: [
      s("hero", {
        variant: "page",
        eyebrow: "About Merova",
        heading: "Built Around Packaging. Driven by Business Partnerships.",
        text: "Merova Printpack brings corrugated, paperboard, foodservice, flexible and custom packaging together under one accountable partner. Every pack is specified to the application, sampled before production and checked against the approved reference.",
        image: HERO,
        primary: { label: "Explore Products", href: "/products" },
        secondary: { label: "Download Company Profile", href: "/resources#company" },
      }),
      s("statement", {
        eyebrow: "Positioning",
        heading: "Packaging that is specified rather than guessed.",
        text: "For B2B buyers who need packaging that performs on their line, in transit and on the shelf, Merova is the multi-material packaging partner that specifies against the application, proves it on a sample and checks it at every stage — so one accountable partner replaces several single-process suppliers.",
        points: [
          { title: "Mission", text: "To supply every packaging format a customer needs through one accountable partner, on one agreed specification, to a date we have committed to." },
          { title: "Vision", text: "Packaging that is only as heavy, as printed and as costly as the job requires — specified, never guessed." },
          { title: "Promise", text: "Packaging, Perfected: engineered to protect your product, designed to perform on your line, on the shelf and in transit." },
        ],
      }),
      s("features", {
        eyebrow: "How we work",
        heading: "Five principles behind every Merova pack.",
        variant: "numbered",
        columns: 3,
        items: [
          { title: "Start from the product", text: "What it is, how it is filled, stored, shipped and sold." },
          { title: "Specify in writing", text: "Material, construction, dimensions and tolerances on a specification you approve." },
          { title: "Prove it on a sample", text: "Fit, handling and print checked before production." },
          { title: "Produce to the reference", text: "The approved sample governs every run." },
          { title: "Stay accountable", text: "One coordinator, recorded checks and documented corrective action." },
        ],
      }),
      s("industryGrid", { eyebrow: "Industries", heading: "Packaging Expertise Across Industries.", intro: "Fifteen industry pathways, each with packaging mapped across all five segments.", limit: 8 }),
      s("cta", { variant: "charcoal", heading: "Let's Define the Right Packaging Solution for Your Business.", text: "Share your requirement and the team will respond with a specification and quotation.", primary: { label: "Request a Quote", href: "/request-a-quote" }, secondary: { label: "Contact Merova", href: "/contact" } }),
    ],
  },
  {
    slug: "about/manufacturing",
    title: "Manufacturing",
    seo: { title: "Manufacturing | Merova Printpack", description: "How Merova manufactures packaging to an approved reference: material preparation, printing, conversion, finishing, forming, film conversion and inspection." },
    sections: [
      s("hero", { variant: "page", eyebrow: "Manufacturing", heading: "Manufacturing Precision. Packaging Performance.", text: "Production runs to the approved specification, with in-process checks on dimensions, print and construction at every stage.", image: WAREHOUSE, primary: { label: "View Capabilities", href: "/about/capabilities" }, secondary: { label: "Request a Quote", href: "/request-a-quote" } }),
      s("features", { eyebrow: "Processes", heading: "From material to dispatch.", variant: "numbered", columns: 4, items: MANUFACTURING_PROCESSES.map((m) => ({ title: m.name, text: m.text })) }),
      s("pending", { eyebrow: "Infrastructure", heading: "Plant and machinery details are awaiting confirmation.", text: "Merova publishes plant locations, machinery and capacity only once they are verified by management. Until then, ask our team for the manufacturing route of any product you are evaluating.", items: ["Plant locations", "Printing and conversion equipment", "Capacity by product segment", "Factory photography"], cta: { label: "Ask our team", href: "/contact?topic=technical" } }),
      s("cta", { variant: "red", heading: "Need a manufacturing route confirmed?", text: "Tell us the product and quantity — the quotation states how it will be produced.", primary: { label: "Request a Quote", href: "/request-a-quote" } }),
    ],
  },
  {
    slug: "about/capabilities",
    title: "Capabilities",
    seo: { title: "Capabilities | Merova Printpack", description: "Merova's packaging capabilities across corrugated, paperboard, foodservice, flexible and custom packaging." },
    sections: [
      s("hero", { variant: "page", eyebrow: "Capabilities", heading: "Five segments. One specification discipline.", text: "Capabilities are organised by product segment. Each product page states what is specified, what is industry reference and what is confirmed at quotation.", image: RANGE, primary: { label: "Explore Products", href: "/products" } }),
      s("segmentShowcase", { eyebrow: "By segment", heading: "What we specify and supply.", intro: "Select a segment to see its product families, technologies and formats." }),
      s("features", { eyebrow: "Across segments", heading: "Shared capabilities.", columns: 3, items: [
        { title: "Structural design", text: "Dielines developed around the product's dimensions, weight and fragility." },
        { title: "Artwork management", text: "Dieline supply, artwork checks and proof approval before production." },
        { title: "Sampling", text: "Physical samples for fit, handling and print approval." },
        { title: "Print and finish", text: "Print, varnish, lamination and other finishes specified per format." },
        { title: "Material selection", text: "Board, paper and film grades chosen against performance and cost." },
        { title: "Kitting and consolidation", text: "Multi-format requirements quoted and coordinated together." },
      ] }),
      s("cta", { variant: "charcoal", heading: "Have a specification to evaluate?", text: "Share it with us — we review feasibility and confirm in the quotation.", primary: { label: "Request a Quote", href: "/request-a-quote" }, secondary: { label: "Custom Requirement", href: "/custom-requirement" } }),
    ],
  },
  {
    slug: "about/quality",
    title: "Quality Assurance",
    seo: { title: "Quality Assurance | Merova Printpack", description: "Merova's eight-stage quality approach: incoming inspection, in-process control, dimensional and print checks, testing, release, traceability and corrective action." },
    sections: [
      s("hero", { variant: "page", eyebrow: "Quality assurance", heading: "Consistency Is Engineered. Quality Is Accountable.", text: "Quality is built into the specification and checked at defined stages — from incoming material to final release — with records kept for every order.", image: { url: "/assets/products/renders/pharma-carton.webp", alt: "Printed pharmaceutical cartons with a blister pack", kind: "render" } }),
      s("steps", { eyebrow: "Eight stages", heading: "How quality is controlled.", items: QUALITY_STAGES.map((q) => ({ title: q.name, text: q.text })) }),
      s("pending", { eyebrow: "Certifications", heading: "Certifications listed only when current and verifiable.", text: "Merova does not display certification logos or standards until management provides current certificates. Ask the team for documentation relevant to your requirement — for example food-contact declarations per material.", items: ["Quality management certification", "Food-contact material declarations", "Forest-source certification (where applicable)", "Compostability certificates per grade"], cta: { label: "Request documentation", href: "/contact?topic=technical" } }),
      s("cta", { variant: "red", heading: "Quality starts with the specification.", text: "Send your requirement and we will propose a specification you can approve.", primary: { label: "Request a Quote", href: "/request-a-quote" } }),
    ],
  },
  {
    slug: "about/process",
    title: "Process Excellence",
    seo: { title: "Process Excellence | Merova Printpack", description: "Nine stages from consultation to client support — how Merova develops, approves, manufactures and supports every packaging order." },
    sections: [
      s("hero", { variant: "page", eyebrow: "Process excellence", heading: "Nine stages. No guesswork.", text: "Every requirement follows the same path from consultation to after-delivery support, so you always know what happens next and what has been approved.", image: DIELINES }),
      s("steps", { eyebrow: "The Merova process", heading: "From consultation to client support.", items: PROCESS_STEPS.map((p) => ({ title: p.name, text: p.detail })) }),
      s("features", { eyebrow: "Client servicing", heading: "What you can expect from our team.", columns: 3, items: CLIENT_SERVICE.map((c) => ({ title: c.name, text: c.text })) }),
      s("cta", { variant: "charcoal", heading: "Start at stage one.", text: "Tell us about your product and how it travels.", primary: { label: "Request a Quote", href: "/request-a-quote" } }),
    ],
  },
  {
    slug: "about/sustainability",
    title: "Sustainability",
    seo: { title: "Sustainability | Responsible Packaging Decisions | Merova Printpack", description: "How Merova approaches recycled content, material optimisation, recyclability and compostable options — with clear definitions and no blanket claims." },
    sections: [
      s("hero", { variant: "page", eyebrow: "Sustainability", heading: "Making More Responsible Packaging Decisions.", text: "The most responsible pack is usually the one specified precisely: no heavier, more printed or more mixed in material than the job requires. Environmental claims are made only against evidence for the specific material.", image: { url: "/assets/products/renders/compostable-bag.webp", alt: "Compostable bag format visualisation", kind: "render" } }),
      s("features", { eyebrow: "Our approach", heading: "Ten areas where packaging decisions matter.", columns: 2, items: SUSTAINABILITY_TOPICS.map((t) => ({ title: t.name, text: t.text })) }),
      s("features", { eyebrow: "Clear language", heading: "Four terms we never use interchangeably.", variant: "definitions", columns: 4, items: CLAIM_DEFINITIONS.map((c) => ({ title: c.term, text: c.text })) }),
      s("cta", { variant: "red", heading: "Looking to reduce material or move to a different format?", text: "We assess alternatives against performance before recommending them.", primary: { label: "Discuss Your Requirement", href: "/custom-requirement" }, secondary: { label: "Sustainable Alternatives", href: "/products/custom-packaging/sustainable-alternatives" } }),
    ],
  },
  {
    slug: "about/leadership",
    title: "Leadership & Team",
    seo: { title: "Leadership & Team | Merova Printpack", description: "The functions that deliver Merova packaging: management, production, quality, technical, design and customer service." },
    sections: [
      s("hero", { variant: "page", eyebrow: "Leadership & team", heading: "The people accountable for your packaging.", text: "Each function has a clear responsibility in the process, from specification to dispatch." }),
      s("features", { eyebrow: "Functions", heading: "How the team is organised.", columns: 3, items: TEAM_FUNCTIONS.map((t) => ({ title: t.name, text: t.text })) }),
      s("pending", { eyebrow: "Leadership profiles", heading: "Leadership profiles are awaiting approval.", text: "Names, photographs and biographies are published only with each person's approval.", items: ["Managing leadership", "Production and quality leads", "Commercial team"] }),
      s("cta", { variant: "charcoal", heading: "Speak with the team.", text: "Your enquiry reaches the right function first time.", primary: { label: "Contact Merova", href: "/contact" } }),
    ],
  },
  {
    slug: "about/clients",
    title: "Clients & Partnerships",
    seo: { title: "Clients & Partnerships | Merova Printpack", description: "Industries Merova serves and how client references are handled." },
    sections: [
      s("hero", { variant: "page", eyebrow: "Clients & partnerships", heading: "Partnerships built on specification and follow-through.", text: "Merova works with manufacturers, brands, retailers, foodservice operators and institutions across fifteen industry pathways." }),
      s("industryGrid", { eyebrow: "Industries served", heading: "Where Merova packaging is applied.", limit: 15 }),
      s("logos", { heading: "Client references", items: [] }),
      s("pending", { eyebrow: "Reference policy", heading: "Client names appear only with written permission.", text: "We do not display client logos or testimonials without approval. References can be arranged on request during evaluation.", items: [] , cta: { label: "Request a reference", href: "/contact" } }),
    ],
  },
  {
    slug: "about/careers",
    title: "Careers",
    seo: { title: "Careers | Merova Printpack", description: "Work in production, quality, design, technical and customer service roles at Merova Printpack." },
    sections: [
      s("hero", { variant: "page", eyebrow: "Careers", heading: "Build a career in packaging that is specified properly.", text: "We look for people who care about doing the job precisely — on the shop floor, in the quality lab, at the design desk and with customers." }),
      s("features", { eyebrow: "Areas", heading: "Where you could work.", columns: 3, items: TEAM_FUNCTIONS.map((t) => ({ title: t.name, text: t.text })) }),
      s("contactForm", { heading: "Send your CV", intro: "Tell us about yourself and the area you are interested in. Attach your CV (PDF or Word, up to 4 MB).", topic: "careers" }),
    ],
  },
  {
    slug: "about/business-enquiries",
    title: "Business Enquiries",
    seo: { title: "Business & Strategic Enquiries | Merova Printpack", description: "Distribution, supplier, institutional and strategic partnership enquiries." },
    sections: [
      s("hero", { variant: "page", eyebrow: "Business enquiries", heading: "Partnerships that extend what we can deliver together.", text: "Distribution, supply, institutional procurement and strategic partnerships." }),
      s("features", { columns: 3, heading: "Who should get in touch", items: [
        { title: "Material suppliers", text: "Board, paper, film, ink and consumables suppliers who can document grade and origin." },
        { title: "Distributors", text: "Regional and sector distributors serving packaging buyers." },
        { title: "Institutions", text: "Procurement and administration teams with recurring packaging needs." },
      ] }),
      s("contactForm", { heading: "Start the conversation", intro: "Tell us about your organisation and what you have in mind.", topic: "partnerships" }),
    ],
  },
  /* ── Legal ───────────────────────────────────────────────────────── */
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    system: true,
    seo: { title: "Privacy Policy | Merova Printpack", description: "How Merova Printpack collects, uses and protects personal information submitted through this website." },
    sections: [
      s("hero", { variant: "minimal", eyebrow: "Legal", heading: "Privacy Policy", text: "How Merova Printpack handles personal information submitted through this website." }),
      s("richText", { body: `## Information we collect
When you submit a quote request, custom requirement or contact form we collect the details you provide: name, company, business email, phone number, location, your enquiry, product and industry selections, technical requirements and any files you attach. We also record the page you submitted from, the referring page and campaign parameters (UTM tags).

## How we use it
- To respond to your enquiry, prepare quotations and arrange samples.
- To route your enquiry to the relevant team and keep a record of it in our enquiry management system.
- To send you an acknowledgement and follow-up communication about your enquiry.

We do not sell your personal information, and we do not use enquiry data for unrelated marketing without your consent.

## Service providers
We use trusted providers to operate this website: hosting, database, email delivery and, where enabled, spam protection and CRM. If you use MIRA, the AI assistant, your messages are processed by our AI provider to generate replies; please do not share sensitive personal information in the chat. WhatsApp conversations are subject to WhatsApp's own terms.

## Cookies and analytics
Essential operation of this site does not require tracking cookies. If analytics is enabled, analytics cookies are set only after you accept them in the cookie banner.

## Retention
We keep enquiry records for as long as needed to respond, maintain a business relationship and meet legal obligations, and then delete or anonymise them.

## Your rights
Subject to applicable law, including India's Digital Personal Data Protection Act, 2023, you may ask to access, correct or delete your personal information, or withdraw consent, using the [contact form](/contact).

## Security
Forms are submitted over encrypted connections. Access to enquiry data is limited to authorised staff.` }),
    ],
  },
  {
    slug: "terms",
    title: "Terms of Use",
    system: true,
    seo: { title: "Terms of Use | Merova Printpack", description: "Terms governing use of the Merova Printpack website." },
    sections: [
      s("hero", { variant: "minimal", eyebrow: "Legal", heading: "Terms of Use", text: "Terms governing use of this website." }),
      s("richText", { body: `## Information on this site
Product descriptions, specifications and guides are provided for general information. Specification values marked "confirmed at quotation" or "industry reference" are not guarantees; the binding specification is the one agreed in your quotation and approved sample.

## Imagery
Product images are studio visualisations of packaging formats or representative third-party photography, labelled as such. They do not depict Merova facilities, staff or clients unless stated.

## Quotations
Prices, minimum quantities, lead times and availability are confirmed only in a written quotation.

## AI assistant
MIRA is an AI assistant that answers from Merova's approved product information. It may make mistakes and does not make commitments on price, delivery or specification. Always confirm with our team.

## Intellectual property
The Merova name, logo and site content belong to Merova Printpack. Do not reproduce them without permission.

## Contact
Questions about these terms can be sent through the [contact page](/contact).` }),
    ],
  },
];
