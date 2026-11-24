/**
 * Generates documentation that must stay in sync with the site data:
 *  docs/SEO-MAP.md   — URL, keywords, title, description, H1, H2s, intent, schema, conversion goal per page
 *  docs/TAXONOMY.md  — product taxonomy and the industry-to-product mapping
 * Run: npx tsx scripts/generate-docs.ts
 */
import { writeFileSync } from "node:fs";
import { industries, products, productsForIndustry, productsInVertical, productUrl, verticals, verticalById } from "../src/data/catalog";
import { articles, CATEGORIES } from "../src/data/blog";

const esc = (s: string) => s.replace(/\|/g, "\\|");
const row = (cells: string[]) => `| ${cells.map(esc).join(" | ")} |`;

let seo = `# SEO page mapping\n\nGenerated from \`src/data\` by \`scripts/generate-docs.ts\`; do not edit by hand.\nEvery indexable page has a unique title, description and H1, a canonical URL, Open Graph/Twitter tags and breadcrumbs.\n\n`;
seo += `## Product verticals\n\n${row(["URL", "Primary keyword", "Secondary keywords", "SEO title", "Meta description", "H1", "Intent", "Schema", "Conversion"])}\n${row(Array(9).fill("---"))}\n`;
for (const v of verticals) seo += row([`/${v.slug}`, v.seo.primary, v.seo.secondary.join(", "), v.seo.title, v.seo.description, v.headline, "Commercial investigation", "BreadcrumbList, FAQPage", "Request a Quote / View products"]) + "\n";

seo += `\n## Product pages (${products.length})\n\nH2 structure on every product page: Product overview · ${"{Product}"} specification · Printing & finishing · Customisation possibilities · What we check · ${"{Product}"} questions · Related products.\nInternal links: vertical page, related products, related industries, quality page, quote form (pre-filled), flyer PDF.\nImage alt text: the product image's \`alt\` from data (shown below).\n\n`;
seo += `${row(["URL", "Primary keyword", "Secondary keywords", "SEO title", "Meta description", "H1", "Image alt", "Intent", "Schema", "Conversion"])}\n${row(Array(10).fill("---"))}\n`;
for (const p of products) {
  const title = p.seo.title ?? `${p.name} | ${verticalById[p.vertical].navName} Packaging | Merova Printpack`;
  const desc = (p.seo.description ?? `${p.summary} Specifications, applications, FAQs and downloadable flyer. Request a quote from Merova Printpack.`).slice(0, 300);
  seo += row([productUrl(p), p.seo.primary, p.seo.secondary.join(", "), title, desc, p.name, p.image.alt, "Transactional / commercial", "Product, BreadcrumbList, FAQPage", "Request a Quote · Flyer download · WhatsApp"]) + "\n";
}
seo += `\n## Industry pages\n\nH2 structure: Packaging challenges · Packaging for {industry} · Have a different packaging requirement? · {Industry} packaging questions · Further reading.\n\n${row(["URL", "Primary keyword", "Secondary keywords", "SEO title", "Meta description", "H1", "Intent", "Schema", "Conversion"])}\n${row(Array(9).fill("---"))}\n`;
for (const i of industries) seo += row([`/industries/${i.slug}`, i.seo.primary, i.seo.secondary.join(", "), i.seo.title, i.seo.description, i.headline, "Commercial investigation", "BreadcrumbList, FAQPage", "Request a Quote (industry pre-filled) · Custom requirement"]) + "\n";
seo += `\n## Knowledge centre articles\n\nArticles are \`noindex\` and excluded from the sitemap until \`review.status\` is set to \`reviewed\` with a named Merova reviewer (avoids publishing unreviewed technical content).\n\n${row(["URL", "Primary keyword", "Title", "Category", "Related products", "Index status"])}\n${row(Array(6).fill("---"))}\n`;
for (const a of articles) seo += row([`/blog/${a.slug}`, a.keyword, a.title, CATEGORIES[a.category].name, a.relatedProducts.join(", "), a.review.status === "reviewed" ? "index" : "noindex (pending review)"]) + "\n";
seo += `\n## Corporate and utility pages\n\n${row(["URL", "Purpose", "Conversion objective", "Index"])}\n${row(Array(4).fill("---"))}\n`;
for (const [u, p, c, ix] of [
  ["/", "Brand, discovery engine, verticals, process", "Find Your Packaging · Request a Quote", "index"],
  ["/products", "All products by vertical", "View product · Quote", "index"],
  ["/industries", "Industry index", "Industry page", "index"],
  ["/custom-packaging", "Custom vertical", "Discuss custom requirement", "index"],
  ["/manufacturing", "Processes and production approach", "Explore capabilities · Contact technical", "index"],
  ["/manufacturing/capabilities", "Capability matrix", "Technical enquiry", "index"],
  ["/quality", "Quality stages, certifications policy", "Request documentation", "index"],
  ["/process", "Nine-stage process", "Request a Quote", "index"],
  ["/sustainability", "Responsible manufacturing, claim definitions", "Discuss sustainable options", "index"],
  ["/company/*", "About, leadership, clients, client service, careers, partnerships, suppliers", "Relevant contact channel", "index (case studies: noindex until published)"],
  ["/resources, /resources/downloads, /resources/faqs", "Downloads Centre and FAQs", "Downloads · Quote", "index"],
  ["/request-a-quote, /custom-requirement, /contact", "Conversion pages", "Submit enquiry", "index"],
  ["/enquiry-received", "Confirmation", "—", "noindex"],
  ["/privacy-policy, /terms", "Legal", "—", "index"],
]) seo += row([u, p, c, ix]) + "\n";
writeFileSync("docs/SEO-MAP.md", seo);

let tax = `# Product taxonomy and industry-to-product mapping\n\nGenerated from \`src/data\` by \`scripts/generate-docs.ts\`; do not edit by hand.\n\n`;
for (const v of verticals) {
  tax += `## ${v.name} — /${v.slug}\n\n${row(["Product", "URL", "Quote profile", "Formats", "Materials", "Industries"])}\n${row(Array(6).fill("---"))}\n`;
  for (const p of productsInVertical(v.id)) tax += row([p.name, productUrl(p), p.quoteProfile, p.formats.join("; "), p.materials.join("; "), p.industries.join(", ")]) + "\n";
  tax += "\n";
}
tax += `## Industry-to-product mapping\n\nFeatured products are listed first (curated order), followed by every other product tagged with the industry. The same mapping drives the homepage discovery engine, the industry pages, Mira and the quote form.\n\n`;
for (const i of industries) {
  const list = productsForIndustry(i.id);
  tax += `### ${i.name} (${list.length})\n\n${list.map((p, n) => `${n + 1}. ${p.name}${i.featured.includes(p.slug) ? " ★" : ""}`).join("\n")}\n\n`;
}
writeFileSync("docs/TAXONOMY.md", tax);
console.log("docs/SEO-MAP.md and docs/TAXONOMY.md written");
