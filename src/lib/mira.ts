import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { DOWNLOADS, flyerUrl, industries, productUrl, products, productsForIndustry, verticals } from "@/data/catalog";
import { articles } from "@/data/blog";
import type { IndustryId, Product } from "@/data/types";
import { site } from "./site";

export type MiraLink = { label: string; href: string };
export type MiraReply = { reply: string; links: MiraLink[]; handoff: boolean; mode: "ai" | "guided" };
export type MiraMessage = { role: "user" | "assistant"; content: string };

/* ------------------------------------------------------------------ */
/* Approved knowledge base (generated from the site's own data)        */
/* ------------------------------------------------------------------ */

const STATIC_PAGES: MiraLink[] = [
  { label: "Request a Quote", href: "/request-a-quote" },
  { label: "Discuss a custom requirement", href: "/custom-requirement" },
  { label: "Contact the team", href: "/contact" },
  { label: "All products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Downloads Centre", href: "/resources/downloads" },
  { label: "FAQs", href: "/resources/faqs" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Quality", href: "/quality" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Product catalogue (PDF)", href: DOWNLOADS.catalogue },
  { label: "Company profile (PDF)", href: DOWNLOADS.profile },
];

/** Every URL Mira is allowed to link to. Links outside this set are dropped. */
export const ALLOWED_HREFS = new Set<string>([
  ...STATIC_PAGES.map((l) => l.href),
  ...products.flatMap((p) => [productUrl(p), flyerUrl(p), `/request-a-quote?product=${p.slug}`]),
  ...industries.flatMap((i) => [`/industries/${i.slug}`, `/request-a-quote?industry=${i.id}`]),
  ...verticals.map((v) => `/${v.slug}`),
  ...articles.map((a) => `/blog/${a.slug}`),
]);

let kbCache: string | null = null;
export function knowledgeBase() {
  if (kbCache) return kbCache;
  const lines: string[] = [];
  lines.push("# Merova Printpack — approved knowledge base");
  lines.push(`Brand: ${site.name}. Tagline: ${site.tagline} ${site.proposition}`);
  lines.push(`Positioning: ${site.description}`);
  lines.push("Verified company facts: none beyond the product information below. Merova has NOT published certifications, client names, production capacity, plant size, years in business, prices, lead times or minimum order quantities. Do not state or imply any of these.");
  lines.push(`Direct contact details published on the site: ${[site.contact.phone && "phone", site.contact.email && "email", site.contact.whatsapp && "WhatsApp"].filter(Boolean).join(", ") || "none yet — route visitors to the quote form or contact page"}.`);
  lines.push("Specification policy: values marked 'confirmed at quotation' are not published; industry reference values are general information, not Merova guarantees.");
  lines.push("\n## Product verticals");
  for (const v of verticals) lines.push(`- ${v.name} (${`/${v.slug}`}): ${v.description}`);
  lines.push("\n## Industries");
  for (const i of industries) lines.push(`- ${i.name} (/industries/${i.slug}; quote: /request-a-quote?industry=${i.id}): ${productsForIndustry(i.id).slice(0, 8).map((p) => p.name).join(", ")}`);
  lines.push("\n## Products");
  for (const p of products) {
    lines.push(
      `- ${p.name} | page ${productUrl(p)} | flyer ${flyerUrl(p)} | quote /request-a-quote?product=${p.slug}\n  Summary: ${p.summary}\n  Applications: ${p.applications.join("; ")}\n  Formats: ${p.formats.join("; ")}\n  Materials: ${p.materials.join("; ")}\n  Specs: ${p.specs.map((s) => `${s.label}: ${s.value}${s.status === "reference" ? " (industry reference)" : ""}`).join("; ")}\n  FAQs: ${p.faqs.map((f) => `Q: ${f.q} A: ${f.a}`).join(" ")}`,
    );
  }
  lines.push("\n## Guides");
  for (const a of articles) lines.push(`- ${a.title} (/blog/${a.slug})`);
  lines.push("\n## Site pages");
  for (const l of STATIC_PAGES) lines.push(`- ${l.label}: ${l.href}`);
  kbCache = lines.join("\n");
  return kbCache;
}

const SYSTEM = `You are Mira — the Merova Intelligent Requirements Assistant, an AI assistant on the Merova Printpack website.

Your job: help B2B visitors identify their industry, find suitable packaging products, understand available formats and technical information, find product flyers, prepare quotation requirements, discuss custom packaging and reach the Merova team.

Style: natural, professional and concise — usually 2–5 short sentences. Plain text, no markdown headings or tables. Ask one clarifying question when the request is ambiguous.

Hard rules:
- Use ONLY the approved knowledge base below. If something is not in it, say you don't have that information and offer to connect the visitor with a Merova specialist.
- Never invent or estimate specifications, prices, production capacity, certifications, delivery or lead times, minimum order quantities or customer references. Where a specification is "confirmed at quotation", say the team confirms it for the order.
- Never state that Merova manufactures something in-house; describe products as packaging Merova supplies or offers.
- You are an AI. If asked, say so. Do not claim to have submitted anything on the visitor's behalf; direct them to the quote form.
- Only link to URLs that appear in the knowledge base.
- Set handoff to true when the visitor wants a person, a price, a commitment, or anything you cannot answer.

Respond as JSON matching the schema: reply (string), links (up to 4 objects with label and href from the knowledge base), handoff (boolean).`;

/* ------------------------------------------------------------------ */
/* AI mode                                                             */
/* ------------------------------------------------------------------ */

export const aiEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY);

export async function askClaude(messages: MiraMessage[], page?: string): Promise<MiraReply> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: process.env.MIRA_ANTHROPIC_BASE_URL ?? "https://api.anthropic.com",
    timeout: 30_000,
    maxRetries: 1,
  });
  const history: Anthropic.Beta.BetaMessageParam[] = messages.map((m) => ({ role: m.role, content: m.content }));
  if (page) history.push({ role: "user", content: `(Context: the visitor is currently viewing ${page}.)` });

  const response = await client.beta.messages.create({
    model: process.env.MIRA_MODEL ?? "claude-opus-5-5",
    max_tokens: 2048,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["reply", "links", "handoff"],
          properties: {
            reply: { type: "string" },
            handoff: { type: "boolean" },
            links: {
              type: "array",
              items: { type: "object", additionalProperties: false, required: ["label", "href"], properties: { label: { type: "string" }, href: { type: "string" } } },
            },
          },
        },
      },
    },
    system: [{ type: "text", text: `${SYSTEM}\n\n${knowledgeBase()}`, cache_control: { type: "ephemeral" } }],
    messages: history,
  });

  if (response.stop_reason === "refusal") return guided(messages);
  const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  const parsed = JSON.parse(text) as { reply: string; links: MiraLink[]; handoff: boolean };
  return {
    reply: parsed.reply.slice(0, 1500),
    links: (parsed.links ?? []).filter((l) => ALLOWED_HREFS.has(l.href)).slice(0, 4),
    handoff: Boolean(parsed.handoff),
    mode: "ai",
  };
}

/* ------------------------------------------------------------------ */
/* Guided mode (no API key): deterministic retrieval over the same KB  */
/* ------------------------------------------------------------------ */

const INDUSTRY_WORDS: [IndustryId, RegExp][] = [
  ["pharmaceutical", /pharma|medicin|tablet|capsule|healthcare|hospital|nutraceutical|vial|blister/],
  ["automotive", /auto(motive)?\b|automobile|car parts|vehicle|spare part|component supplier/],
  ["cinema", /cinema|multiplex|theatre|theater|movie|concession|popcorn/],
  ["food-beverage", /food|restaurant|beverage|drink|cafe|café|bakery|dairy|qsr|kitchen|catering|meal/],
  ["retail", /retail|store|shop|shelf|supermarket/],
  ["gifts-premium", /gift|festive|hamper|premium|luxury|diwali|corporate gift/],
  ["industrial", /industrial|manufactur|machine|engineering|factory|heavy/],
  ["ecommerce", /e-?commerce|online|d2c|courier|marketplace|shipping parcel|amazon|flipkart/],
  ["fmcg", /fmcg|consumer goods|snack|personal care|detergent/],
  ["electronics", /electronic|appliance|gadget|device|mobile phone|laptop/],
];

const STOP = new Set(["the", "and", "for", "with", "box", "boxes", "packaging", "pack", "need", "want", "looking", "you", "your", "what", "have", "do", "can", "a", "an", "of", "to", "in", "is", "i", "me", "my", "we", "our", "about"]);
const tokens = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));

function matchProduct(text: string): Product | undefined {
  const q = text.toLowerCase();
  let best: { p: Product; score: number } | undefined;
  for (const p of products) {
    const names = [p.name, p.shortName ?? "", p.seo.primary, ...p.seo.secondary].map((n) => n.toLowerCase());
    let score = 0;
    for (const n of names) if (n && q.includes(n)) score += 10 + n.length / 4;
    const words = new Set(tokens([p.name, p.shortName ?? "", p.seo.primary].join(" ")));
    for (const t of tokens(q)) if (words.has(t)) score += 2;
    if (score > (best?.score ?? 0)) best = { p, score };
  }
  return best && best.score >= 4 ? best.p : undefined;
}

const productLinks = (p: Product): MiraLink[] => [
  { label: `View ${p.shortName ?? p.name}`, href: productUrl(p) },
  { label: "Download flyer (PDF)", href: flyerUrl(p) },
  { label: "Request a quote", href: `/request-a-quote?product=${p.slug}` },
];

export function guided(messages: MiraMessage[]): MiraReply {
  const last = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const q = last.toLowerCase();
  const reply = (text: string, links: MiraLink[], handoff = false): MiraReply => ({ reply: text, links: links.slice(0, 4), handoff, mode: "guided" });

  if (/\b(human|person|someone|agent|call me|speak|talk to|whatsapp|phone|contact)\b/.test(q))
    return reply("Of course — a Merova specialist can help directly. Use the contact page to reach the right team, or the quote form if you already know what you need. WhatsApp is linked below this chat when available.", [STATIC_PAGES[2], STATIC_PAGES[0]], true);
  if (/\b(price|pricing|cost|rate|how much|cheap|budget)\b/.test(q))
    return reply("I can't give prices — they depend on the specification, print, quantity and delivery location. The quote form captures exactly what the team needs to price your requirement.", [STATIC_PAGES[0], STATIC_PAGES[2]], true);
  if (/certif|\biso\b|fssc|brc|fssai|gmp|accredit/.test(q))
    return reply("Merova lists only certifications that are current and verifiable, and none are published on the site yet. Please ask the team for current certification status and documentation for your requirement.", [{ label: "Contact technical support", href: "/contact" }, { label: "Quality approach", href: "/quality" }], true);
  if (/lead time|delivery time|how (fast|soon|long)|capacity|moq|minimum order|turnaround/.test(q))
    return reply("Lead times, capacity and minimum quantities depend on the product and specification, so the team confirms them with your quotation. Share your timeline in the quote form and they'll respond with what is achievable.", [STATIC_PAGES[0], STATIC_PAGES[2]], true);
  if (/\b[357][- ]?ply\b/.test(q) && /(vs|versus|compare|difference|or)/.test(q))
    return reply("3-ply is single-wall board for light to medium loads, 5-ply is double-wall for heavier products and taller stacks, and 7-ply is triple-wall for very heavy or export loads. Paper grades and flute matter as much as ply — the guide below explains how to choose.", [{ label: "3 vs 5 vs 7-ply guide", href: "/blog/3-ply-vs-5-ply-vs-7-ply-corrugated-boxes" }, ...productLinks(products.find((p) => p.slug === "5-ply-boxes")!).slice(0, 1), STATIC_PAGES[0]]);
  if (/custom|bespoke|unusual|special|different requirement|not listed/.test(q))
    return reply("Merova develops custom packaging from your specifications, drawings, photographs or samples. Share what you have in the custom requirement form and the team will assess your application.", [STATIC_PAGES[1], { label: "Custom packaging", href: "/custom-packaging" }]);

  const product = matchProduct(last);
  if (product && /flyer|brochure|pdf|download|datasheet|data sheet/.test(q))
    return reply(`Here is the ${product.name} flyer, with formats, materials and specifications. The full catalogue is in the Downloads Centre.`, [{ label: "Download flyer (PDF)", href: flyerUrl(product) }, { label: `View ${product.shortName ?? product.name}`, href: productUrl(product) }, STATIC_PAGES[5]]);
  if (/catalog|catalogue|brochure|company profile|download/.test(q))
    return reply("You can download the full product catalogue, the company profile and an individual flyer for every product.", [STATIC_PAGES[10], STATIC_PAGES[11], STATIC_PAGES[5]]);
  if (product)
    return reply(`${product.name}: ${product.summary} Typical applications include ${product.applications.slice(0, 3).join(", ").toLowerCase()}. Specifications such as dimensions and material grade are confirmed by the team for your order.`, productLinks(product));

  const ind = INDUSTRY_WORDS.find(([, re]) => re.test(q));
  if (ind) {
    const i = industries.find((x) => x.id === ind[0])!;
    const list = productsForIndustry(i.id).slice(0, 5);
    return reply(`For ${i.name.toLowerCase()}, Merova offers ${list.map((p) => p.name).join(", ")} and more. What are you packing, and roughly how many do you need?`, [{ label: `${i.shortName} packaging`, href: `/industries/${i.slug}` }, ...list.slice(0, 2).map((p) => ({ label: p.shortName ?? p.name, href: productUrl(p) })), { label: "Request a quote", href: `/request-a-quote?industry=${i.id}` }]);
  }
  if (/\b(quote|rfq|enquir|order)\b/.test(q))
    return reply("The quote form takes four short steps and adapts to the product you choose. You can attach drawings, artwork or photographs.", [STATIC_PAGES[0], STATIC_PAGES[1]]);
  if (/industr|sector|find packaging|help me find/.test(q))
    return reply(`Merova serves ${industries.map((i) => i.shortName).join(", ")}. Which industry are you in, and what are you looking to pack?`, [STATIC_PAGES[4], STATIC_PAGES[3]]);

  return reply("I can help you find packaging by industry or product, share flyers, or start a quote. What are you looking to pack — and for which industry?", [STATIC_PAGES[4], STATIC_PAGES[3], STATIC_PAGES[0]]);
}
