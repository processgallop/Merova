import "server-only";
import { asc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import type { AdminRefs, FieldDef, FormTab } from "@/components/admin/types";
import { ICON_NAMES } from "@/components/ui/Icon";

export async function getAdminRefs(): Promise<AdminRefs & { sectors: { slug: string; name: string }[]; categories: { slug: string; name: string }[]; segmentFamilies: Record<string, string[]> }> {
  const db = await getDb();
  const [segs, prods, inds, res, sectors, cats] = await Promise.all([
    db.select().from(t.segments).orderBy(asc(t.segments.sortOrder)),
    db.select({ slug: t.products.slug, name: t.products.name, segmentId: t.products.segmentId }).from(t.products).orderBy(asc(t.products.name)),
    db.select({ slug: t.industries.slug, name: t.industries.name }).from(t.industries).orderBy(asc(t.industries.sortOrder)),
    db.select({ slug: t.resources.slug, title: t.resources.title }).from(t.resources).orderBy(asc(t.resources.sortOrder)),
    db.select().from(t.industrySectors).orderBy(asc(t.industrySectors.sortOrder)),
    db.select().from(t.postCategories).orderBy(asc(t.postCategories.sortOrder)),
  ]);
  return {
    products: prods.map((p) => ({ slug: p.slug, name: p.name, segment: segs.find((s) => s.id === p.segmentId)?.navName ?? "" })),
    industries: inds,
    segments: segs.map((s) => ({ slug: s.slug, name: s.name })),
    resources: res,
    sectors: sectors.map((s) => ({ slug: s.slug, name: s.name })),
    categories: cats.map((c) => ({ slug: c.slug, name: c.name })),
    segmentFamilies: Object.fromEntries(segs.map((s) => [s.slug, s.families.map((f) => f.name)])),
  };
}

const FAQS: FieldDef = { key: "faqs", label: "FAQs", type: "pairs", addLabel: "Add FAQ", fields: [{ key: "q", label: "Question", type: "text" }, { key: "a", label: "Answer", type: "textarea" }] };
const SEO: FieldDef = { key: "seo", label: "Search & social", type: "seo" };
const REL = [{ value: "primary", label: "Primary relevance" }, { value: "secondary", label: "Secondary relevance" }];

export function segmentTabs(): FormTab[] {
  return [
    {
      id: "basics",
      title: "Basics",
      fields: [
        { key: "name", label: "Segment name", type: "text", required: true },
        { key: "navName", label: "Short name (menus)", type: "text", required: true },
        { key: "code", label: "Segment code", type: "text", hint: "Single letter shown across the site, e.g. A.", required: true },
        { key: "slug", label: "URL slug", type: "slug", from: "name", prefix: "/products/", required: true },
        { key: "headline", label: "Headline", type: "text" },
        { key: "intro", label: "Introduction", type: "textarea", rows: 3 },
        { key: "description", label: "Description (used in menus, MIRA and metadata)", type: "textarea", rows: 3 },
        { key: "sortOrder", label: "Display order", type: "number" },
      ],
    },
    {
      id: "content",
      title: "Families & technologies",
      fields: [
        { key: "families", label: "Product families", type: "pairs", hint: "Products are grouped under these families on segment pages.", addLabel: "Add family", fields: [{ key: "code", label: "Code (e.g. A1)", type: "text" }, { key: "name", label: "Family name", type: "text" }] },
        { key: "technologies", label: "Technologies & materials", type: "pairs", addLabel: "Add technology", fields: [{ key: "name", label: "Name", type: "text" }, { key: "text", label: "Description", type: "textarea" }] },
        FAQS,
      ],
    },
    { id: "media", title: "Images", fields: [{ key: "image", label: "Segment image", type: "image" }, { key: "banner", label: "Banner (optional, wide)", type: "image" }] },
    { id: "seo", title: "SEO", fields: [SEO] },
  ];
}

export function productTabs(refs: Awaited<ReturnType<typeof getAdminRefs>>): FormTab[] {
  return [
    {
      id: "basics",
      title: "Basics",
      fields: [
        { key: "name", label: "Product name", type: "text", required: true },
        { key: "shortName", label: "Short name (cards & menus)", type: "text" },
        { key: "code", label: "Canonical product ID", type: "text", required: true, hint: "Unique ID used in documents and enquiries, e.g. MRV-A1-04." },
        { key: "slug", label: "URL slug", type: "slug", from: "name", required: true },
        { key: "segmentSlug", label: "Primary segment", type: "select", required: true, options: refs.segments.map((s) => ({ value: s.slug, label: s.name })) },
        { key: "family", label: "Product family", type: "select", options: [...new Set(Object.values(refs.segmentFamilies).flat())].map((f) => ({ value: f, label: f })), hint: "Should belong to the selected segment." },
        { key: "headline", label: "Headline", type: "text" },
        { key: "summary", label: "Summary", type: "textarea", rows: 3 },
        { key: "sortOrder", label: "Display order", type: "number" },
        { key: "publishedAt", label: "Publish date (schedule)", type: "date", hint: "Leave empty to publish immediately. A future date schedules publication." },
      ],
    },
    {
      id: "content",
      title: "Content",
      fields: [
        { key: "overview", label: "Overview paragraphs", type: "list" },
        { key: "highlights", label: "Highlights", type: "list" },
        { key: "applications", label: "Applications", type: "list" },
        { key: "formats", label: "Available formats", type: "list" },
        { key: "materials", label: "Material options", type: "list" },
        { key: "printing", label: "Printing & finishing", type: "list" },
        { key: "customisation", label: "Customisation options", type: "list" },
        { key: "quality", label: "Quality considerations", type: "list" },
        FAQS,
      ],
    },
    {
      id: "specs",
      title: "Technical",
      fields: [
        { key: "specs", label: "Technical specifications", type: "pairs", hint: "“Confirmed at quotation” for values agreed per order; “Industry reference” for general information; “Option” for options Merova specifies.", addLabel: "Add specification", fields: [{ key: "label", label: "Attribute", type: "text" }, { key: "value", label: "Value", type: "text" }, { key: "status", label: "Status", type: "select", options: [{ value: "confirm", label: "Confirmed at quotation" }, { value: "option", label: "Option we specify" }, { value: "reference", label: "Industry reference" }] }] },
        { key: "specNote", label: "Specification note", type: "textarea" },
        { key: "quoteProfile", label: "Quote form profile", type: "select", required: true, hint: "Which technical questions the quote form asks.", options: [{ value: "corrugated", label: "Corrugated" }, { value: "carton", label: "Carton / paperboard" }, { value: "cup", label: "Cups" }, { value: "foodservice", label: "Foodservice" }, { value: "film", label: "Films & rolls" }, { value: "pouch", label: "Pouches & bags" }, { value: "custom", label: "Custom / general" }] },
        { key: "availability", label: "Availability classification", type: "select", required: true, options: [{ value: "offered", label: "Portfolio — manufacturing route confirmed at quotation" }, { value: "manufactured", label: "Verified Merova-manufactured" }, { value: "sourced", label: "Verified sourced product" }, { value: "custom", label: "Custom-developed solution" }, { value: "pending", label: "Capability pending management confirmation" }] },
        { key: "verification", label: "Technical verification", type: "select", required: true, options: [{ value: "unverified", label: "Unverified — awaiting technical confirmation" }, { value: "verified", label: "Verified by Merova management" }] },
        { key: "moq", label: "Minimum order quantity (only if confirmed)", type: "text" },
        { key: "leadTime", label: "Lead time (only if confirmed)", type: "text" },
      ],
    },
    {
      id: "relations",
      title: "Industries & related",
      fields: [
        { key: "industryLinks", label: "Industries served", type: "pairs", hint: "The product appears automatically on each industry page listed here. Remove an industry to remove it from that page — the product itself is unaffected.", addLabel: "Add industry", fields: [{ key: "slug", label: "Industry", type: "select", options: refs.industries.map((i) => ({ value: i.slug, label: i.name })) }, { key: "context", label: "Application context (optional)", type: "text" }, { key: "relevance", label: "Relevance", type: "select", options: REL }] },
        { key: "related", label: "Related products", type: "products" },
      ],
    },
    {
      id: "media",
      title: "Media & flyer",
      fields: [
        { key: "images", label: "Product images", type: "images", hint: "The first image is the primary image. Label stock or rendered images honestly." },
        { key: "videoUrl", label: "Product video URL (optional)", type: "text" },
        { key: "flyer", label: "Product flyer (PDF)", type: "file", hint: "Replacing the PDF updates every download link for this product." },
      ],
    },
    { id: "seo", title: "SEO", fields: [{ key: "keywords", label: "Search keywords", type: "list" }, SEO] },
  ];
}

export function industryTabs(refs: Awaited<ReturnType<typeof getAdminRefs>>): FormTab[] {
  return [
    {
      id: "basics",
      title: "Basics",
      fields: [
        { key: "name", label: "Industry name", type: "text", required: true },
        { key: "shortName", label: "Short name", type: "text" },
        { key: "slug", label: "URL slug", type: "slug", from: "name", prefix: "/industries/", required: true },
        { key: "sectorSlug", label: "Sector group", type: "select", options: refs.sectors.map((s) => ({ value: s.slug, label: s.name })) },
        { key: "icon", label: "Icon", type: "select", options: ICON_NAMES.map((n) => ({ value: n, label: n })) },
        { key: "headline", label: "Headline", type: "text" },
        { key: "intro", label: "Introduction", type: "textarea", rows: 4 },
        { key: "subIndustries", label: "Sub-industries", type: "list" },
        { key: "isCatchAll", label: "“Other industries” catch-all", type: "checkbox", hint: "Shown as the route for visitors whose industry is not listed." },
        { key: "sortOrder", label: "Display order", type: "number" },
      ],
    },
    {
      id: "products",
      title: "Product mapping",
      fields: [
        { key: "productLinks", label: "Products for this industry", type: "pairs", hint: "Order sets the display order on the industry page. Only add products with genuine application relevance.", addLabel: "Add product", fields: [{ key: "slug", label: "Product", type: "select", options: refs.products.map((p) => ({ value: p.slug, label: `${p.name} · ${p.segment}` })) }, { key: "context", label: "Application context (optional)", type: "text" }, { key: "relevance", label: "Relevance", type: "select", options: REL }] },
      ],
    },
    {
      id: "content",
      title: "Content",
      fields: [
        { key: "challenges", label: "Typical packaging requirements", type: "pairs", addLabel: "Add requirement", fields: [{ key: "title", label: "Title", type: "text" }, { key: "text", label: "Description", type: "textarea" }] },
        { key: "considerations", label: "What we consider when specifying", type: "list" },
        FAQS,
      ],
    },
    { id: "media", title: "Images", fields: [{ key: "image", label: "Card image", type: "image" }, { key: "banner", label: "Page banner", type: "image" }] },
    { id: "seo", title: "SEO", fields: [SEO] },
  ];
}

export function postTabs(refs: Awaited<ReturnType<typeof getAdminRefs>>): FormTab[] {
  return [
    {
      id: "basics",
      title: "Article",
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "slug", label: "URL slug", type: "slug", from: "title", prefix: "/knowledge/", required: true },
        { key: "categorySlug", label: "Category", type: "select", options: refs.categories.map((c) => ({ value: c.slug, label: c.name })) },
        { key: "excerpt", label: "Summary (cards & search results)", type: "textarea", rows: 2 },
        { key: "intro", label: "Introduction", type: "textarea", rows: 4 },
        { key: "author", label: "Author", type: "text" },
        { key: "tags", label: "Tags", type: "list" },
        { key: "publishedAt", label: "Publish date (schedule)", type: "date" },
      ],
    },
    {
      id: "body",
      title: "Body",
      fields: [
        { key: "bodyText", label: "Sections", type: "pairs", hint: "Each section has a heading and Markdown body: paragraphs, “- ” lists, “1. ” lists, “### ” sub-headings, “> ” notes, tables using | pipes |, and ![alt](url) images.", addLabel: "Add section", fields: [{ key: "heading", label: "Section heading", type: "text" }, { key: "text", label: "Body (Markdown)", type: "textarea" }] },
        { key: "recommendations", label: "Recommendations", type: "list" },
        FAQS,
      ],
    },
    {
      id: "media",
      title: "Media & links",
      fields: [
        { key: "cover", label: "Featured image", type: "image" },
        { key: "videoUrl", label: "Related video URL", type: "text" },
        { key: "relatedProducts", label: "Related products", type: "products" },
      ],
    },
    {
      id: "review",
      title: "Review & SEO",
      fields: [
        { key: "reviewStatus", label: "Technical review", type: "select", required: true, hint: "Articles are hidden from search engines until reviewed by a named Merova specialist.", options: [{ value: "pending", label: "Pending technical review (noindex)" }, { value: "reviewed", label: "Reviewed — indexable" }] },
        { key: "reviewer", label: "Reviewer name", type: "text" },
        SEO,
      ],
    },
  ];
}

export function resourceTabs(): FormTab[] {
  return [
    {
      id: "basics",
      title: "Resource",
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "slug", label: "Identifier", type: "slug", from: "title", required: true },
        { key: "kind", label: "Type", type: "select", required: true, options: [{ value: "catalogue", label: "Product catalogue" }, { value: "profile", label: "Company profile" }, { value: "brochure", label: "Brochure" }, { value: "technical", label: "Technical document" }, { value: "flyer", label: "Flyer" }] },
        { key: "description", label: "Description", type: "textarea" },
        { key: "file", label: "PDF file", type: "file", hint: "Replacing the file updates every link to this resource across the site." },
        { key: "sortOrder", label: "Display order", type: "number" },
      ],
    },
  ];
}
