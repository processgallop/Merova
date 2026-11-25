import type { FieldDef } from "@/components/admin/types";
import type { SectionType } from "@/db/types";

/**
 * Page-builder registry: every approved content block, its editable fields and
 * a sensible default. Layouts are fixed and responsive, so administrators
 * cannot break the design — they choose blocks and edit content.
 */
const CTA = (key: string, label: string): FieldDef => ({ key, label, type: "link" });
const ITEMS = (fields: Extract<FieldDef, { type: "pairs" }>["fields"], addLabel = "Add item"): FieldDef => ({ key: "items", label: "Items", type: "pairs", fields, addLabel });

export const SECTION_DEFS: Record<SectionType, { label: string; description: string; fields: FieldDef[]; defaults: Record<string, unknown> }> = {
  hero: {
    label: "Hero banner",
    description: "Opening banner with headline, text, image and buttons.",
    fields: [
      { key: "variant", label: "Style", type: "select", required: true, options: [{ value: "page", label: "Page hero (image right)" }, { value: "brand", label: "Brand hero (homepage, animated emblem)" }, { value: "minimal", label: "Minimal (text only)" }] },
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
      { key: "text", label: "Supporting text", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
      CTA("primary", "Primary button"),
      CTA("secondary", "Secondary button"),
      { key: "proof", label: "Proof points (brand hero)", type: "list" },
    ],
    defaults: { variant: "page", eyebrow: "", heading: "New page heading", text: "" },
  },
  statement: {
    label: "Statement (editorial)",
    description: "Large statement with supporting text and three points.",
    fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "text", label: "Text", type: "textarea", rows: 4 }, { key: "points", label: "Points", type: "pairs", fields: [{ key: "title", label: "Title", type: "text" }, { key: "text", label: "Text", type: "textarea" }] }, CTA("cta", "Link")],
    defaults: { heading: "Statement heading", text: "", points: [] },
  },
  richText: { label: "Text", description: "Formatted text (headings, lists, links).", fields: [{ key: "body", label: "Body", type: "markdown", rows: 14 }], defaults: { body: "## Heading\n\nWrite your content here." } },
  split: {
    label: "Image & text",
    description: "Split section with image, text, bullets and a button.",
    fields: [{ key: "variant", label: "Background", type: "select", options: [{ value: "light", label: "Light" }, { value: "red", label: "Merova red (full width)" }] }, { key: "imageSide", label: "Image side", type: "select", options: [{ value: "right", label: "Right" }, { value: "left", label: "Left" }] }, { key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "body", label: "Body", type: "markdown", rows: 5 }, { key: "bullets", label: "Bullet points", type: "list" }, { key: "image", label: "Image", type: "image" }, CTA("cta", "Button")],
    defaults: { variant: "light", imageSide: "right", heading: "Heading", body: "" },
  },
  features: {
    label: "Feature highlights",
    description: "Grid of highlights (numbered, plain or definitions).",
    fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" }, { key: "variant", label: "Style", type: "select", options: [{ value: "plain", label: "Plain" }, { value: "numbered", label: "Numbered" }, { value: "definitions", label: "Dark definitions" }] }, { key: "columns", label: "Columns", type: "select", options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }] }, ITEMS([{ key: "title", label: "Title", type: "text" }, { key: "text", label: "Text", type: "textarea" }])],
    defaults: { heading: "Highlights", variant: "plain", columns: "3", items: [] },
  },
  steps: { label: "Process steps", description: "Numbered process on a dark background.", fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" }, ITEMS([{ key: "title", label: "Step", type: "text" }, { key: "text", label: "Description", type: "textarea" }], "Add step"), CTA("cta", "Button")], defaults: { heading: "Our process", items: [] } },
  stats: { label: "Statistics", description: "Shown only for figures marked verified.", fields: [{ key: "heading", label: "Heading", type: "text" }, ITEMS([{ key: "value", label: "Value", type: "text" }, { key: "label", label: "Label", type: "text" }, { key: "verified", label: "Verified by management", type: "checkbox" }], "Add statistic")], defaults: { items: [] } },
  gallery: { label: "Image gallery", description: "Grid of images.", fields: [{ key: "heading", label: "Heading", type: "text" }, { key: "images", label: "Images", type: "images" }], defaults: { images: [] } },
  segmentShowcase: { label: "Product segments", description: "The product segments as interactive panels (from the catalogue).", fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" }], defaults: { heading: "Our product segments" } },
  industryDiscovery: { label: "Industry finder", description: "Interactive industry → products discovery (from the catalogue).", fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" }], defaults: { eyebrow: "What can Merova do for your industry?", heading: "Your Industry. Your Requirements. The Right Packaging." } },
  productGrid: { label: "Product grid", description: "Products from a segment or a hand-picked list.", fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" }, { key: "segment", label: "Segment", type: "segmentRef" }, { key: "productSlugs", label: "Or choose products", type: "products" }, { key: "limit", label: "Maximum", type: "number" }], defaults: { heading: "Featured products", limit: 8 } },
  industryGrid: { label: "Industry grid", description: "Industry cards linking to industry pages.", fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" }, { key: "industrySlugs", label: "Choose industries (optional)", type: "industries" }, { key: "limit", label: "Maximum", type: "number" }], defaults: { heading: "Industries we serve", limit: 8 } },
  testimonials: { label: "Testimonials", description: "Published only when marked approved.", fields: [{ key: "heading", label: "Heading", type: "text" }, ITEMS([{ key: "quote", label: "Quote", type: "textarea" }, { key: "name", label: "Name", type: "text" }, { key: "role", label: "Role", type: "text" }, { key: "company", label: "Company", type: "text" }, { key: "approved", label: "Verified and approved for publication", type: "checkbox" }], "Add testimonial")], defaults: { items: [] } },
  logos: { label: "Client logos", description: "Published only with written authorisation.", fields: [{ key: "heading", label: "Heading", type: "text" }, ITEMS([{ key: "name", label: "Client name", type: "text" }, { key: "image", label: "Logo", type: "image" }, { key: "authorised", label: "Written authorisation received", type: "checkbox" }], "Add logo")], defaults: { items: [] } },
  faq: { label: "FAQs", description: "Expandable questions and answers.", fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, ITEMS([{ key: "q", label: "Question", type: "text" }, { key: "a", label: "Answer", type: "textarea" }], "Add question")], defaults: { heading: "Frequently asked questions", items: [] } },
  video: { label: "Video", description: "YouTube, Vimeo or MP4 video.", fields: [{ key: "heading", label: "Heading", type: "text" }, { key: "url", label: "Video URL", type: "text" }, { key: "caption", label: "Caption", type: "text" }], defaults: { url: "" } },
  downloads: { label: "Downloads", description: "Resource PDFs.", fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" }, { key: "resourceSlugs", label: "Choose resources (optional)", type: "resources" }], defaults: { heading: "Downloads" } },
  articles: { label: "Latest articles", description: "Latest knowledge-centre articles.", fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" }, { key: "limit", label: "Number of articles", type: "number" }, { key: "showDownloads", label: "Show downloads row", type: "checkbox" }], defaults: { heading: "Knowledge centre", limit: 3 } },
  pending: { label: "Awaiting confirmation", description: "Honest placeholder for information pending management approval.", fields: [{ key: "eyebrow", label: "Eyebrow", type: "text" }, { key: "heading", label: "Heading", type: "text" }, { key: "text", label: "Text", type: "textarea" }, { key: "items", label: "Items awaiting confirmation", type: "list" }, CTA("cta", "Link")], defaults: { heading: "Details awaiting confirmation", items: [] } },
  contactForm: { label: "Contact form", description: "Enquiry form routed to a team.", fields: [{ key: "heading", label: "Heading", type: "text" }, { key: "intro", label: "Intro", type: "textarea" }, { key: "topic", label: "Default topic", type: "select", options: [{ value: "sales", label: "Sales" }, { value: "technical", label: "Technical" }, { value: "orders", label: "Orders" }, { value: "suppliers", label: "Suppliers" }, { value: "careers", label: "Careers" }, { value: "partnerships", label: "Partnerships" }] }], defaults: { heading: "Contact us", topic: "sales" } },
  cta: { label: "Call-to-action banner", description: "Closing banner with buttons.", fields: [{ key: "variant", label: "Colour", type: "select", options: [{ value: "red", label: "Merova red" }, { value: "charcoal", label: "Charcoal" }, { value: "light", label: "Light" }] }, { key: "heading", label: "Heading", type: "text" }, { key: "text", label: "Text", type: "textarea" }, CTA("primary", "Primary button"), CTA("secondary", "Secondary button")], defaults: { variant: "red", heading: "Let's build the right packaging solution for your business.", primary: { label: "Request a Quote", href: "/request-a-quote" } } },
};
