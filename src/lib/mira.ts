import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { getCatalog, getPosts, getResources, getSiteSettings, industryUrl, postUrl, segmentUrl, type ProductCard } from "./content";

export type MiraLink = { label: string; href: string };
export type MiraReply = { reply: string; links: MiraLink[]; handoff: boolean; mode: "ai" | "guided" };
export type MiraMessage = { role: "user" | "assistant"; content: string };

/* ── Approved knowledge base, generated from the live CMS records ──── */

interface KB {
  text: string;
  allowed: Set<string>;
  cards: ProductCard[];
  industries: { name: string; shortName: string; slug: string; url: string; productIds: number[] }[];
  pages: Record<"quote" | "custom" | "contact" | "products" | "industries" | "resources" | "faqs" | "catalogue" | "profile" | "quality", MiraLink>;
  guide3v5: MiraLink | null;
}

let cached: { at: number; kb: KB } | null = null;

export async function knowledge(): Promise<KB> {
  if (cached && Date.now() - cached.at < 5 * 60_000) return cached.kb;
  const [{ cards, industries, segments, links }, posts, resources, site] = await Promise.all([getCatalog(), getPosts(), getResources(), getSiteSettings()]);
  const res = (kind: string) => resources.find((r) => r.kind === kind)?.fileUrl ?? "/resources";
  const pages: KB["pages"] = {
    quote: { label: "Request a Quote", href: "/request-a-quote" },
    custom: { label: "Discuss a custom requirement", href: "/custom-requirement" },
    contact: { label: "Contact the team", href: "/contact" },
    products: { label: "All products", href: "/products" },
    industries: { label: "Find packaging by industry", href: "/industries" },
    resources: { label: "Downloads", href: "/resources" },
    faqs: { label: "FAQs", href: "/resources/faqs" },
    catalogue: { label: "Product catalogue (PDF)", href: res("catalogue") },
    profile: { label: "Company profile (PDF)", href: res("profile") },
    quality: { label: "Quality approach", href: "/about/quality" },
  };
  const inds = industries.map((i) => ({ name: i.name, shortName: i.shortName || i.name, slug: i.slug, url: industryUrl(i), productIds: links.filter((l) => l.industryId === i.id).map((l) => l.productId) }));
  const allowed = new Set<string>([
    ...Object.values(pages).map((p) => p.href),
    ...cards.flatMap((c) => [c.url, c.flyer ?? "", `/request-a-quote?products=${c.slug}`]).filter(Boolean),
    ...inds.flatMap((i) => [i.url, `/request-a-quote?industry=${i.slug}`]),
    ...segments.map((s) => segmentUrl(s)),
    ...posts.map((p) => postUrl(p)),
    ...resources.map((r) => r.fileUrl),
  ]);
  const L: string[] = [];
  L.push("# Merova Printpack — approved knowledge base");
  L.push(`Brand: ${site.companyName}. Tagline: ${site.tagline} ${site.proposition}`);
  L.push(`Positioning: ${site.description}`);
  L.push("Verified company facts: none beyond the product information below. Merova has NOT published certifications, client names, production capacity, plant details, years in business, prices, lead times or minimum order quantities. Never state or imply any of these.");
  L.push(`Direct contact channels published: ${[site.phone && `phone ${site.phone}`, site.email && `email ${site.email}`, site.whatsapp && "WhatsApp"].filter(Boolean).join(", ") || "none yet — route visitors to the quote form or contact page"}.`);
  L.push("Specification policy: values marked 'confirmed at quotation' are agreed per order; 'industry reference' values are general information, not Merova guarantees. Availability 'pending' means capability is under confirmation.");
  L.push("\n## Product segments");
  for (const s of segments) L.push(`- ${s.code}. ${s.name} (${segmentUrl(s)}): ${s.description}`);
  L.push("\n## Industries (with mapped products)");
  for (const i of inds) L.push(`- ${i.name} (page ${i.url}; quote /request-a-quote?industry=${i.slug}): ${i.productIds.slice(0, 12).map((id) => cards.find((c) => c.id === id)?.name).filter(Boolean).join(", ")}`);
  L.push("\n## Products");
  const prods = await import("./content").then((m) => m.getProducts());
  for (const c of cards) {
    const p = prods.find((x) => x.id === c.id)!;
    L.push(`- ${c.name} [${c.code}] | segment ${c.segment.name} / ${c.family} | page ${c.url} | flyer ${c.flyer ?? "not yet available"} | quote /request-a-quote?products=${c.slug} | availability ${c.availability}\n  Summary: ${c.summary}\n  Applications: ${c.applications.join("; ")}\n  Formats: ${c.formats.join("; ")}\n  Materials: ${c.materials.join("; ")}\n  Specs: ${p.specs.map((sp) => `${sp.label}: ${sp.value}${sp.status === "reference" ? " (industry reference)" : sp.status === "confirm" ? " (confirmed at quotation)" : ""}`).join("; ")}\n  FAQs: ${p.faqs.map((f) => `Q: ${f.q} A: ${f.a}`).join(" ")}`);
  }
  L.push("\n## Guides");
  for (const p of posts) L.push(`- ${p.title} (${postUrl(p)})`);
  L.push("\n## Site pages and downloads");
  for (const l of Object.values(pages)) L.push(`- ${l.label}: ${l.href}`);
  for (const r of resources) L.push(`- ${r.title}: ${r.fileUrl}`);
  const g = posts.find((p) => /3-ply.*5-ply|ply-vs/.test(p.slug));
  const kb: KB = { text: L.join("\n"), allowed, cards, industries: inds, pages, guide3v5: g ? { label: g.title, href: postUrl(g) } : null };
  cached = { at: Date.now(), kb };
  return kb;
}

const SYSTEM = `You are MIRA — the Merova Intelligent Requirements Assistant, an AI assistant on the Merova Printpack website.

Your job: help B2B visitors identify their industry, discover suitable packaging products, understand formats and approved technical information, compare formats, find product flyers, prepare quotation requirements and reach the Merova team.

Style: professional, concise, corporate — usually 2–5 short sentences. Plain text, no markdown headings or tables. Ask one clarifying question when the request is ambiguous.

Hard rules:
- Use ONLY the approved knowledge base below. If something is not in it, say you don't have that information and offer to connect the visitor with a Merova specialist.
- Never invent or estimate specifications, prices, production capacity, certifications, delivery or lead times, minimum order quantities or customer references.
- Never claim Merova manufactures something in-house unless its availability says manufactured.
- You are an AI. If asked, say so. You cannot submit forms on the visitor's behalf; direct them to the quote form.
- Only link to URLs that appear in the knowledge base.
- Set handoff to true when the visitor wants a person, a price, a commitment, or anything you cannot answer.

Respond as JSON: reply (string), links (up to 4 objects with label and href from the knowledge base), handoff (boolean).`;

export const aiEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY);

export async function askClaude(messages: MiraMessage[], page?: string): Promise<MiraReply> {
  const kb = await knowledge();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 30_000, maxRetries: 1 });
  const history: Anthropic.MessageParam[] = messages.map((m) => ({ role: m.role, content: m.content }));
  if (page) history[history.length - 1] = { role: "user", content: `${messages[messages.length - 1].content}\n\n(Context: the visitor is viewing ${page}.)` };
  const response = await client.messages.create({
    model: process.env.MIRA_MODEL ?? "claude-opus-5-5",
    max_tokens: 1500,
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
            links: { type: "array", items: { type: "object", additionalProperties: false, required: ["label", "href"], properties: { label: { type: "string" }, href: { type: "string" } } } },
          },
        },
      },
    },
    system: [{ type: "text", text: `${SYSTEM}\n\n${kb.text}`, cache_control: { type: "ephemeral" } }],
    messages: history,
  } as Anthropic.MessageCreateParamsNonStreaming);
  if (response.stop_reason === "refusal") return guided(messages);
  const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  const parsed = JSON.parse(text) as { reply: string; links: MiraLink[]; handoff: boolean };
  return { reply: parsed.reply.slice(0, 1500), links: (parsed.links ?? []).filter((l) => kb.allowed.has(l.href)).slice(0, 4), handoff: Boolean(parsed.handoff), mode: "ai" };
}

/* ── Guided mode (no API key): deterministic retrieval over the same KB ── */

const STOP = new Set(["the", "and", "for", "with", "box", "boxes", "packaging", "pack", "need", "want", "looking", "you", "your", "what", "have", "do", "can", "a", "an", "of", "to", "in", "is", "i", "me", "my", "we", "our", "about", "which", "should", "use"]);
const tokens = (x: string) => x.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

const INDUSTRY_HINTS: [RegExp, string][] = [
  [/pharma|medicin|tablet|healthcare|hospital|nutraceutical|vial|blister/, "pharma"],
  [/auto(motive)?\b|automobile|car parts|vehicle|spare part|two-wheeler/, "automotive"],
  [/cinema|multiplex|theatre|theater|movie|concession|popcorn/, "cinema"],
  [/hotel|resort|catering|hospitality/, "hospitality"],
  [/food|beverage|drink|bakery|dairy|qsr|kitchen|meal|restaurant|cafe/, "food"],
  [/fmcg|consumer goods|snack|personal care|detergent/, "fmcg"],
  [/retail|store|shop|shelf|supermarket|apparel/, "retail"],
  [/gift|festive|hamper|luxury|jewel/, "gift"],
  [/e-?commerce|online|d2c|courier|fulfil|warehouse|logistic/, "ecommerce"],
  [/electronic|appliance|gadget|device|laptop/, "electronics"],
  [/construction|tile|sanitary|cement|building|hardware/, "construction"],
  [/agri|farm|seed|fertili|agrochem/, "agriculture"],
  [/corporate|office|institution|university|bank|government/, "corporate"],
  [/industrial|manufactur|machine|engineering|factory/, "industrial"],
];

function matchProduct(text: string, cards: ProductCard[]) {
  const q = text.toLowerCase();
  let best: { c: ProductCard; score: number } | undefined;
  for (const c of cards) {
    let score = 0;
    for (const n of [c.name, c.shortName].map((x) => x.toLowerCase())) if (n && q.includes(n)) score += 10 + n.length / 4;
    const words = new Set(tokens(`${c.name} ${c.shortName} ${c.family}`));
    for (const w of tokens(q)) if (words.has(w) || words.has(w.replace(/s$/, ""))) score += 2;
    if (score > (best?.score ?? 0)) best = { c, score };
  }
  return best && best.score >= 4 ? best.c : undefined;
}

export async function guided(messages: MiraMessage[]): Promise<MiraReply> {
  const kb = await knowledge();
  const P = kb.pages;
  const last = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const q = last.toLowerCase();
  const reply = (text: string, links: MiraLink[], handoff = false): MiraReply => ({ reply: text, links: links.filter(Boolean).slice(0, 4), handoff, mode: "guided" });
  const prodLinks = (c: ProductCard): MiraLink[] => [{ label: `View ${c.shortName}`, href: c.url }, ...(c.flyer ? [{ label: "Download flyer (PDF)", href: c.flyer }] : []), { label: "Request a quote", href: `/request-a-quote?products=${c.slug}` }];

  if (/\b(human|person|someone|agent|call me|speak|talk to|whatsapp|phone|contact)\b/.test(q)) return reply("Of course — a Merova specialist can help directly. Use the contact page to reach the right team, or the quote form if you already know what you need.", [P.contact, P.quote], true);
  if (/\b(price|pricing|cost|rate|how much|cheap|budget)\b/.test(q)) return reply("I can't provide prices — they depend on the specification, print, quantity and delivery location. The quote form captures exactly what the team needs to price your requirement.", [P.quote, P.contact], true);
  if (/certif|\biso\b|fssc|brc|fssai|gmp|accredit/.test(q)) return reply("Merova publishes only certifications that are current and verifiable, and none are listed on the site yet. Please ask the team for documentation relevant to your requirement.", [P.contact, P.quality], true);
  if (/lead time|delivery time|how (fast|soon|long)|capacity|moq|minimum order|turnaround/.test(q)) return reply("Lead times, capacity and minimum quantities depend on the product and specification, so the team confirms them in your quotation. Share your timeline in the quote form.", [P.quote, P.contact], true);
  if (/\b(are you|is this) (an? )?(ai|bot|robot|human)/.test(q)) return reply("Yes — I'm MIRA, an AI assistant. I answer from Merova's approved product information and hand over to the team for anything binding.", [P.contact]);
  if (/\b[357][- ]?ply\b/.test(q) && /(vs|versus|compare|difference|or|which)/.test(q)) {
    const five = kb.cards.find((c) => c.slug === "5-ply-boxes");
    return reply("3-ply is single-wall board for light to medium loads, 5-ply is double-wall for heavier products and taller stacks, and 7-ply is triple-wall for very heavy or export loads. Paper grade and flute matter as much as ply count.", [kb.guide3v5!, five ? { label: "5-Ply boxes", href: five.url } : P.products, P.quote]);
  }
  if (/custom|bespoke|unusual|special|different requirement|not listed/.test(q)) return reply("Merova develops custom packaging from your specifications, drawings, photographs or samples. Share what you have in the custom requirement form and the team will assess your application.", [P.custom, P.contact]);

  const product = matchProduct(last, kb.cards);
  if (product && product.flyer && /flyer|brochure|pdf|download|datasheet/.test(q)) return reply(`Here is the ${product.name} flyer, with formats, materials and specifications.`, [{ label: "Download flyer (PDF)", href: product.flyer! }, { label: `View ${product.shortName}`, href: product.url }, P.resources]);
  if (/catalog|catalogue|brochure|company profile|download/.test(q)) return reply("You can download the full product catalogue, the company profile and an individual flyer for every product.", [P.catalogue, P.profile, P.resources]);
  if (product) return reply(`${product.name}: ${product.summary} Typical applications include ${product.applications.slice(0, 3).join(", ").toLowerCase()}. Specifications such as dimensions and material grade are confirmed for your order.`, prodLinks(product));

  const hint = INDUSTRY_HINTS.find(([re]) => re.test(q))?.[1];
  const ind = hint ? kb.industries.find((i) => `${i.slug} ${i.name}`.toLowerCase().includes(hint)) : undefined;
  if (ind) {
    const list = ind.productIds.slice(0, 6).map((id) => kb.cards.find((c) => c.id === id)).filter((c): c is ProductCard => Boolean(c));
    return reply(`For ${ind.name.toLowerCase()}, relevant Merova packaging includes ${list.map((c) => c.name).join(", ")}. What are you packing, and roughly how many do you need?`, [{ label: `${ind.shortName} packaging`, href: ind.url }, ...list.slice(0, 2).map((c) => ({ label: c.shortName, href: c.url })), { label: "Request a quote", href: `/request-a-quote?industry=${ind.slug}` }]);
  }
  if (/\b(quote|rfq|enquir|order)\b/.test(q)) return reply("The quote form takes four short steps and adapts its technical questions to each product you select. You can add several products and attach drawings or artwork.", [P.quote, P.custom]);
  return reply("I can help you find packaging by industry or product, compare formats, share flyers, or start a quote. What are you looking to pack — and for which industry?", [P.industries, P.products, P.quote]);
}
