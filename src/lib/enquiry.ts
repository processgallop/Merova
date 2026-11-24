import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { categoryById, productById, type CategoryId } from "@/data/catalog";
import { site } from "./site";

/* Types ─────────────────────────────────────────────── */
export const ENQUIRY_TYPES = { quote: "Quotation request", custom: "Custom requirement", sales: "Sales enquiry", technical: "Technical question", orders: "Existing order", suppliers: "Supplier enquiry", careers: "Career enquiry", partnerships: "Business partnership" } as const;
export type EnquiryType = keyof typeof ENQUIRY_TYPES;
export const UPLOAD_LIMITS = { maxFiles: 5, maxTotalBytes: 4 * 1024 * 1024, accept: [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".ai", ".eps", ".svg", ".zip", ".doc", ".docx", ".xls", ".xlsx", ".cdr"] };

export interface LeadFile { name: string; type: string; size: number; data: Buffer }
export interface LeadItem { id: string; name: string; category: string; variant?: string; quantity?: string; specs: Record<string, string> }
export interface Lead {
  ref: string; createdAt: string; type: EnquiryType; typeLabel: string; team: string;
  items: LeadItem[]; context: { industry?: string; operator?: string };
  delivery?: string; timeline?: string; message?: string;
  contact: { name: string; company?: string; email: string; phone?: string; role?: string };
  source: { page?: string; referrer?: string; utm?: Record<string, string>; mira?: string };
  files: { name: string; type: string; size: number; stored?: string }[];
}
export class EnquiryError extends Error { constructor(public status: number, public code: string, message: string, public fields?: Record<string, string>) { super(message); } }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-\s\d]{7,20}$/;
const s = (v: FormDataEntryValue | null, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/* Parse & validate ─────────────────────────────────── */
export async function parseEnquiry(form: FormData): Promise<{ lead: Lead; files: LeadFile[]; token?: string }> {
  if (s(form.get("website"))) throw new EnquiryError(400, "spam", "Submission rejected.");
  const started = Number(s(form.get("startedAt")));
  if (!started || Date.now() - started < 3000) throw new EnquiryError(400, "too_fast", "Please take a moment to complete the form and try again.");
  const typeRaw = s(form.get("type"), 30) as EnquiryType;
  const type: EnquiryType = typeRaw in ENQUIRY_TYPES ? typeRaw : "quote";

  const fields: Record<string, string> = {};
  const name = s(form.get("name"), 120), email = s(form.get("email"), 200).toLowerCase(), phone = s(form.get("phone"), 30);
  if (name.length < 2) fields.name = "Please enter your name.";
  if (!EMAIL.test(email)) fields.email = "Please enter a valid email address.";
  if (type === "quote" && !phone) fields.phone = "Please add a phone number so the team can discuss your quotation.";
  else if (phone && !PHONE.test(phone)) fields.phone = "Please enter a valid phone number.";
  if (s(form.get("consent")) !== "yes") fields.consent = "Please confirm we may contact you about this enquiry.";

  let items: LeadItem[] = [];
  try {
    const raw = JSON.parse(s(form.get("items"), 20000) || "[]") as { id: string; variant?: string; quantity?: string; specs?: Record<string, string> }[];
    items = raw.slice(0, 30).filter((i) => productById[i.id]).map((i) => {
      const p = productById[i.id];
      const specs: Record<string, string> = {};
      for (const [k, v] of Object.entries(i.specs ?? {})) if (p.rfqFields.includes(k) && typeof v === "string" && v.trim()) specs[k] = v.trim().slice(0, 300);
      return { id: p.id, name: p.name, category: categoryById[p.category].name, variant: typeof i.variant === "string" && p.variants.includes(i.variant) ? i.variant : undefined, quantity: typeof i.quantity === "string" ? i.quantity.slice(0, 80) : undefined, specs };
    });
  } catch { throw new EnquiryError(400, "bad_items", "The product list could not be read. Please refresh and try again."); }

  const message = s(form.get("message"), 4000);
  if (type === "quote" && !items.length && !message) fields.message = "Add at least one product, or describe what you need.";
  if (type === "quote") items.forEach((it, k) => { if (!it.quantity) fields[`qty_${k}`] = `Add an approximate quantity for ${it.name}.`; });
  if (type === "custom" && message.length < 15) fields.message = "Please describe the requirement in a sentence or two.";
  if (!["quote", "custom"].includes(type) && message.length < 5) fields.message = "Please add a short message.";
  if (Object.keys(fields).length) throw new EnquiryError(422, "invalid", "Please check the highlighted fields.", fields);

  const files: LeadFile[] = []; let total = 0;
  for (const entry of form.getAll("files")) {
    if (typeof entry === "string" || entry.size === 0) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!UPLOAD_LIMITS.accept.includes(ext)) throw new EnquiryError(422, "file_type", `File type ${ext || "(none)"} is not accepted.`);
    total += entry.size;
    if (files.length >= UPLOAD_LIMITS.maxFiles) throw new EnquiryError(422, "file_count", `Please attach up to ${UPLOAD_LIMITS.maxFiles} files.`);
    if (total > UPLOAD_LIMITS.maxTotalBytes) throw new EnquiryError(413, "file_size", "Attachments exceed 4 MB in total. Please send larger files after we reply.");
    files.push({ name: entry.name.replace(/[^\w.\- ]/g, "_").slice(0, 120), type: entry.type || "application/octet-stream", size: entry.size, data: Buffer.from(await entry.arrayBuffer()) });
  }
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) { const v = s(form.get(k), 120); if (v) utm[k] = v; }

  const lead: Lead = {
    ref: makeRef(), createdAt: new Date().toISOString(), type, typeLabel: ENQUIRY_TYPES[type], team: routeTeam(type, items),
    items, context: { industry: s(form.get("industry"), 120) || undefined, operator: s(form.get("operator"), 120) || undefined },
    delivery: s(form.get("delivery"), 200) || undefined, timeline: s(form.get("timeline"), 120) || undefined, message: message || undefined,
    contact: { name, email, phone: phone || undefined, company: s(form.get("company"), 160) || undefined, role: s(form.get("role"), 120) || undefined },
    source: { page: s(form.get("page"), 300) || undefined, referrer: s(form.get("referrer"), 300) || undefined, utm: Object.keys(utm).length ? utm : undefined },
    files: files.map(({ name, type, size }) => ({ name, type, size })),
  };
  return { lead, files, token: s(form.get("cf-turnstile-response"), 4000) || undefined };
}

function makeRef() { const d = new Date(); return `MRV-${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}-${randomBytes(3).toString("hex").toUpperCase()}`; }

/* Routing: by material mix of the basket ───────────── */
const TEAM: Record<CategoryId | "mixed", string> = { paper: "Paper packaging sales", plastic: "Plastic & film sales", compostable: "Compostable packaging sales", corrugated: "Corrugated sales", mixed: "Key accounts (multi-material)" };
const ENV_BY_TEAM: Record<string, string> = { "Paper packaging sales": "LEAD_EMAIL_PAPER", "Plastic & film sales": "LEAD_EMAIL_PLASTIC", "Compostable packaging sales": "LEAD_EMAIL_COMPOSTABLE", "Corrugated sales": "LEAD_EMAIL_CORRUGATED", "Custom development": "LEAD_EMAIL_CUSTOM", "Technical support": "LEAD_EMAIL_TECHNICAL", "Customer service": "LEAD_EMAIL_ORDERS", Procurement: "LEAD_EMAIL_SUPPLIERS", "HR & careers": "LEAD_EMAIL_CAREERS", "Business development": "LEAD_EMAIL_PARTNERSHIPS" };
const TEAM_BY_TYPE: Partial<Record<EnquiryType, string>> = { custom: "Custom development", technical: "Technical support", orders: "Customer service", suppliers: "Procurement", careers: "HR & careers", partnerships: "Business development", sales: "Sales" };
export function routeTeam(type: EnquiryType, items: LeadItem[]) {
  if (type !== "quote") return TEAM_BY_TYPE[type] ?? "Sales";
  const cats = new Set(items.map((i) => productById[i.id]?.category).filter(Boolean));
  if (cats.size === 1) return TEAM[[...cats][0] as CategoryId];
  return cats.size > 1 ? TEAM.mixed : "Sales";
}
const teamEmail = (team: string) => process.env[ENV_BY_TEAM[team] ?? ""]?.trim() || process.env.LEAD_EMAIL_DEFAULT?.trim();

/* Delivery ─────────────────────────────────────────── */
export function deliveryConfigured() {
  return Boolean((process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM && process.env.LEAD_EMAIL_DEFAULT) || process.env.CRM_WEBHOOK_URL || process.env.BLOB_READ_WRITE_TOKEN || process.env.LEAD_STORE_DIR);
}
export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY; if (!secret) return true; if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret, response: token, remoteip: ip }) });
  return Boolean(((await res.json()) as { success?: boolean }).success);
}

/** Delivers through every configured channel; success requires at least one primary channel (blob, CRM, team email, local store). */
export async function deliverLead(lead: Lead, files: LeadFile[]) {
  const ok: string[] = [], failed: string[] = [];
  const run = (name: string, p: Promise<unknown>) => p.then(() => void ok.push(name), (e) => void failed.push(`${name}: ${String(e).slice(0, 200)}`));
  const tasks: Promise<void>[] = [];
  if (process.env.BLOB_READ_WRITE_TOKEN) tasks.push(run("blob", storeBlob(lead, files)));
  if (process.env.CRM_WEBHOOK_URL) tasks.push(run("crm", postWebhook(lead)));
  if (process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM && teamEmail(lead.team))
    tasks.push(run("team_email", sendEmail({ to: [teamEmail(lead.team)!], replyTo: lead.contact.email, subject: `[${lead.ref}] ${lead.typeLabel}: ${lead.items.map((i) => i.name).slice(0, 3).join(", ") || "General"} — ${lead.contact.company ?? lead.contact.name}`, html: teamEmailHtml(lead), text: leadText(lead), attachments: files.map((f) => ({ filename: f.name, content: f.data.toString("base64") })) })));
  if (process.env.LEAD_STORE_DIR) tasks.push(run("store", storeLocal(lead, files)));
  await Promise.all(tasks);
  if (ok.length && process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM)
    await run("ack_email", sendEmail({ to: [lead.contact.email], subject: `We've received your enquiry: ${lead.ref}`, html: ackEmailHtml(lead), text: ackText(lead), replyTo: teamEmail(lead.team) }));
  return { ok, failed };
}

async function storeBlob(lead: Lead, files: LeadFile[]) {
  const base = `leads/${lead.createdAt.slice(0, 10)}/${lead.ref}`;
  for (const f of files) { const r = await put(`${base}/files/${f.name}`, f.data, { access: "private", contentType: f.type, addRandomSuffix: true }); const lf = lead.files.find((x) => x.name === f.name); if (lf) lf.stored = r.pathname; }
  await put(`${base}/lead.json`, JSON.stringify(lead, null, 2), { access: "private", contentType: "application/json", addRandomSuffix: false });
}
async function storeLocal(lead: Lead, files: LeadFile[]) {
  const dir = path.resolve(process.env.LEAD_STORE_DIR!, lead.ref); await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "lead.json"), JSON.stringify(lead, null, 2));
  for (const f of files) await writeFile(path.join(dir, path.basename(f.name)), f.data);
}
async function postWebhook(lead: Lead) {
  const body = JSON.stringify(lead); const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.CRM_WEBHOOK_SECRET) headers["X-Merova-Signature"] = createHmac("sha256", process.env.CRM_WEBHOOK_SECRET).update(body).digest("hex");
  const res = await fetch(process.env.CRM_WEBHOOK_URL!, { method: "POST", headers, body, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
async function sendEmail(msg: { to: string[]; subject: string; html: string; text: string; replyTo?: string; attachments?: { filename: string; content: string }[] }) {
  const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.LEAD_EMAIL_FROM, to: msg.to, subject: msg.subject, html: msg.html, text: msg.text, reply_to: msg.replyTo, attachments: msg.attachments?.length ? msg.attachments : undefined }), signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

/* Email bodies ─────────────────────────────────────── */
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
function rows(lead: Lead): [string, string][] {
  return ([
    ["Reference", lead.ref], ["Type", lead.typeLabel], ["Routed to", lead.team],
    ["Industry / business", [lead.context.industry, lead.context.operator].filter(Boolean).join(" / ")],
    ...lead.items.map((it, k) => [`Product ${k + 1}`, `${it.name} (${it.category})${it.variant ? ` · ${it.variant}` : ""} · Qty: ${it.quantity ?? "—"}${Object.keys(it.specs).length ? `\n${Object.entries(it.specs).map(([a, b]) => `  ${a}: ${b}`).join("\n")}` : ""}`] as [string, string]),
    ["Delivery location", lead.delivery ?? ""], ["Timeline", lead.timeline ?? ""], ["Message", lead.message ?? ""],
    ["Name", lead.contact.name], ["Company", lead.contact.company ?? ""], ["Role", lead.contact.role ?? ""], ["Email", lead.contact.email], ["Phone", lead.contact.phone ?? ""],
    ["Files", lead.files.map((f) => `${f.name} (${Math.round(f.size / 1024)} KB)`).join(", ")], ["Source page", lead.source.page ?? ""],
  ] as [string, string][]).filter(([, v]) => v);
}
const leadText = (lead: Lead) => rows(lead).map(([k, v]) => `${k}: ${v}`).join("\n");
const teamEmailHtml = (lead: Lead) => `<div style="font-family:Arial,sans-serif;color:#1e1b1b"><h2 style="color:#d52b1e">New ${esc(lead.typeLabel)} — ${esc(lead.ref)}</h2><table cellpadding="6" style="border-collapse:collapse;font-size:14px">${rows(lead).map(([k, v]) => `<tr><td style="border-bottom:1px solid #e6ddd1;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #e6ddd1;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table></div>`;
const ackText = (lead: Lead) => `Dear ${lead.contact.name},\n\nThank you for contacting ${site.name}. We have received your enquiry (reference ${lead.ref}) and passed it to our ${lead.team} team. They will review your requirement and contact you to confirm details, recommend a specification and arrange a quotation.\n\n${site.name}\n${site.url}`;
const ackEmailHtml = (lead: Lead) => `<div style="font-family:Arial,sans-serif;color:#1e1b1b;max-width:560px"><p style="font-size:20px;font-weight:bold;color:#d52b1e;margin:0 0 4px">${esc(site.name)}</p><p style="color:#6f6866;margin:0 0 24px">${esc(site.tagline)}</p><p>Dear ${esc(lead.contact.name)},</p><p>Thank you for contacting ${esc(site.name)}. We have received your enquiry and passed it to our <strong>${esc(lead.team)}</strong> team.</p><p style="background:#f4ede3;padding:12px 16px;border-radius:12px">Your reference: <strong>${esc(lead.ref)}</strong></p><p>${lead.items.length ? `Products: ${esc(lead.items.map((i) => i.name).join(", "))}.` : ""}</p><p>The team will review your requirement and contact you to confirm details, recommend a specification and arrange a quotation.</p></div>`;
