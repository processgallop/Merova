import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getProduct, industryById, verticalById } from "@/data/catalog";
import { ENQUIRY_TYPES, quoteFields, UPLOAD_LIMITS, type EnquiryType } from "@/data/quote";
import type { IndustryId } from "@/data/types";
import { site } from "./site";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface LeadFile {
  name: string;
  type: string;
  size: number;
  data: Buffer;
}

export interface Lead {
  ref: string;
  createdAt: string;
  status: "new";
  type: EnquiryType;
  typeLabel: string;
  team: string;
  product?: { slug: string; name: string; category: string };
  industry?: { id: string; name: string };
  category?: string;
  specs: Record<string, string>;
  quantity?: string;
  delivery?: string;
  timeline?: string;
  message?: string;
  contact: { name: string; company?: string; email: string; phone?: string; location?: string };
  source: { page?: string; referrer?: string; utm?: Record<string, string> };
  files: { name: string; type: string; size: number }[];
}

export class EnquiryError extends Error {
  constructor(public status: number, public code: string, message: string, public fields?: Record<string, string>) {
    super(message);
  }
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-\s\d]{7,20}$/;
const s = (v: FormDataEntryValue | null, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function parseEnquiry(form: FormData): Promise<{ lead: Lead; files: LeadFile[]; token?: string }> {
  // Spam controls: honeypot field and minimum completion time
  if (s(form.get("website"))) throw new EnquiryError(400, "spam", "Submission rejected.");
  const started = Number(s(form.get("startedAt")));
  if (!started || Date.now() - started < 3000) throw new EnquiryError(400, "too_fast", "Please take a moment to complete the form and try again.");

  const typeRaw = s(form.get("type"), 30) as EnquiryType;
  const type: EnquiryType = typeRaw in ENQUIRY_TYPES ? typeRaw : "quote";

  const fields: Record<string, string> = {};
  const name = s(form.get("name"), 120);
  const email = s(form.get("email"), 200).toLowerCase();
  const phone = s(form.get("phone"), 30);
  if (name.length < 2) fields.name = "Please enter your name.";
  if (!EMAIL.test(email)) fields.email = "Please enter a valid email address.";
  if (phone && !PHONE.test(phone)) fields.phone = "Please enter a valid phone number.";
  if (s(form.get("consent")) !== "yes") fields.consent = "Please confirm we may contact you about this enquiry.";

  const productSlug = s(form.get("product"), 80);
  const product = productSlug ? getProduct(productSlug) : undefined;
  if (productSlug && !product && productSlug !== "other") fields.product = "Unknown product.";

  const industryId = s(form.get("industry"), 40) as IndustryId;
  const industry = industryId && industryById[industryId] ? industryById[industryId] : undefined;

  const message = s(form.get("message"), 4000);
  const category = s(form.get("category"), 40);

  // Product-specific technical fields, validated against the same schema the form renders
  const profile = product?.quoteProfile ?? (type === "custom" || productSlug === "other" ? "custom" : undefined);
  const specs: Record<string, string> = {};
  if (profile) {
    for (const f of quoteFields[profile]) {
      const v = s(form.get(`spec_${f.name}`), f.type === "textarea" ? 3000 : 300);
      if (!v) continue;
      if (f.type === "select" && f.options && !f.options.includes(v)) continue;
      specs[f.label] = v;
    }
  }

  if ((type === "quote" || type === "custom") && !product && !message && Object.keys(specs).length === 0) {
    fields.message = "Please tell us what you need packaging for.";
  }
  if (!["quote", "custom"].includes(type) && message.length < 5) fields.message = "Please add a short message.";

  if (Object.keys(fields).length) throw new EnquiryError(422, "invalid", "Please check the highlighted fields.", fields);

  // Files
  const files: LeadFile[] = [];
  let total = 0;
  for (const entry of form.getAll("files")) {
    if (typeof entry === "string" || entry.size === 0) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!UPLOAD_LIMITS.accept.includes(ext)) throw new EnquiryError(422, "file_type", `File type ${ext || "(none)"} is not accepted.`);
    total += entry.size;
    if (files.length >= UPLOAD_LIMITS.maxFiles) throw new EnquiryError(422, "file_count", `Please attach up to ${UPLOAD_LIMITS.maxFiles} files.`);
    if (total > UPLOAD_LIMITS.maxTotalBytes) throw new EnquiryError(413, "file_size", "Attachments exceed 4 MB in total. Please send larger files after we reply.");
    files.push({
      name: entry.name.replace(/[^\w.\- ]/g, "_").slice(0, 120),
      type: entry.type || "application/octet-stream",
      size: entry.size,
      data: Buffer.from(await entry.arrayBuffer()),
    });
  }

  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const v = s(form.get(k), 120);
    if (v) utm[k] = v;
  }

  const lead: Lead = {
    ref: makeRef(),
    createdAt: new Date().toISOString(),
    status: "new",
    type,
    typeLabel: ENQUIRY_TYPES[type],
    team: routeTeam(type, product?.vertical),
    product: product ? { slug: product.slug, name: product.name, category: verticalById[product.vertical].name } : undefined,
    industry: industry ? { id: industry.id, name: industry.name } : undefined,
    category: category && category in verticalById ? verticalById[category as keyof typeof verticalById].name : undefined,
    specs,
    quantity: s(form.get("quantity"), 120) || undefined,
    delivery: s(form.get("delivery"), 200) || undefined,
    timeline: s(form.get("timeline"), 120) || undefined,
    message: message || undefined,
    contact: {
      name,
      email,
      phone: phone || undefined,
      company: s(form.get("company"), 160) || undefined,
      location: s(form.get("location"), 160) || undefined,
    },
    source: { page: s(form.get("page"), 300) || undefined, referrer: s(form.get("referrer"), 300) || undefined, utm: Object.keys(utm).length ? utm : undefined },
    files: files.map(({ name, type, size }) => ({ name, type, size })),
  };
  return { lead, files, token: s(form.get("cf-turnstile-response"), 4000) || undefined };
}

function makeRef() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `MRV-${ymd}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

/* ------------------------------------------------------------------ */
/* Routing                                                             */
/* ------------------------------------------------------------------ */

const TEAM_BY_VERTICAL: Record<string, string> = {
  corrugated: "Corrugated sales",
  paper: "Paperboard sales",
  foodservice: "Foodservice sales",
  flexible: "Flexible packaging sales",
  custom: "Custom development",
};
const TEAM_BY_TYPE: Partial<Record<EnquiryType, string>> = {
  custom: "Custom development",
  technical: "Technical support",
  orders: "Customer service",
  suppliers: "Procurement",
  careers: "HR & careers",
  partnerships: "Business development",
  sales: "Sales",
};
const ENV_BY_TEAM: Record<string, string> = {
  "Corrugated sales": "LEAD_EMAIL_CORRUGATED",
  "Paperboard sales": "LEAD_EMAIL_PAPER",
  "Foodservice sales": "LEAD_EMAIL_FOODSERVICE",
  "Flexible packaging sales": "LEAD_EMAIL_FLEXIBLE",
  "Custom development": "LEAD_EMAIL_CUSTOM",
  "Technical support": "LEAD_EMAIL_TECHNICAL",
  "Customer service": "LEAD_EMAIL_ORDERS",
  Procurement: "LEAD_EMAIL_SUPPLIERS",
  "HR & careers": "LEAD_EMAIL_CAREERS",
  "Business development": "LEAD_EMAIL_PARTNERSHIPS",
  Sales: "LEAD_EMAIL_DEFAULT",
};

export function routeTeam(type: EnquiryType, vertical?: string) {
  if (type === "quote" && vertical) return TEAM_BY_VERTICAL[vertical];
  return TEAM_BY_TYPE[type] ?? "Sales";
}

const teamEmail = (team: string) => process.env[ENV_BY_TEAM[team]]?.trim() || process.env.LEAD_EMAIL_DEFAULT?.trim();

/* ------------------------------------------------------------------ */
/* Delivery channels                                                   */
/* ------------------------------------------------------------------ */

export function deliveryConfigured() {
  return Boolean((process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM && process.env.LEAD_EMAIL_DEFAULT) || process.env.CRM_WEBHOOK_URL || process.env.LEAD_STORE_DIR);
}

export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

/**
 * Delivers a lead through every configured channel. Returns the channels that
 * succeeded. The caller reports success to the visitor only if at least one
 * primary channel (team email, CRM webhook or lead store) accepted the lead.
 */
export async function deliverLead(lead: Lead, files: LeadFile[]) {
  const ok: string[] = [];
  const failed: string[] = [];
  const tasks: Promise<void>[] = [];

  if (process.env.CRM_WEBHOOK_URL) {
    tasks.push(
      postWebhook(lead).then(
        () => void ok.push("crm"),
        (e) => void failed.push(`crm: ${String(e)}`),
      ),
    );
  }
  if (process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM && teamEmail(lead.team)) {
    tasks.push(
      sendEmail({
        to: [teamEmail(lead.team)!],
        replyTo: lead.contact.email,
        subject: `[${lead.ref}] ${lead.typeLabel}: ${lead.product?.name ?? lead.category ?? "General"} — ${lead.contact.company ?? lead.contact.name}`,
        html: teamEmailHtml(lead),
        text: leadText(lead),
        attachments: files.map((f) => ({ filename: f.name, content: f.data.toString("base64") })),
      }).then(
        () => void ok.push("team_email"),
        (e) => void failed.push(`team_email: ${String(e)}`),
      ),
    );
  }
  if (process.env.LEAD_STORE_DIR) {
    tasks.push(
      storeLead(lead, files).then(
        () => void ok.push("store"),
        (e) => void failed.push(`store: ${String(e)}`),
      ),
    );
  }
  await Promise.all(tasks);

  // Acknowledgement goes out only after the lead was accepted somewhere.
  if (ok.length && process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM) {
    try {
      await sendEmail({ to: [lead.contact.email], subject: `We've received your enquiry — ${lead.ref}`, html: ackEmailHtml(lead), text: ackText(lead), replyTo: teamEmail(lead.team) });
      ok.push("ack_email");
    } catch (e) {
      failed.push(`ack_email: ${String(e)}`);
    }
  }
  return { ok, failed };
}

async function postWebhook(lead: Lead) {
  const body = JSON.stringify(lead);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.CRM_WEBHOOK_SECRET) headers["X-Merova-Signature"] = createHmac("sha256", process.env.CRM_WEBHOOK_SECRET).update(body).digest("hex");
  const res = await fetch(process.env.CRM_WEBHOOK_URL!, { method: "POST", headers, body, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

async function sendEmail(msg: { to: string[]; subject: string; html: string; text: string; replyTo?: string; attachments?: { filename: string; content: string }[] }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM,
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      reply_to: msg.replyTo,
      attachments: msg.attachments?.length ? msg.attachments : undefined,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text().catch(() => "")}`.slice(0, 200));
}

async function storeLead(lead: Lead, files: LeadFile[]) {
  const dir = path.resolve(process.env.LEAD_STORE_DIR!, lead.ref);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "lead.json"), JSON.stringify(lead, null, 2));
  for (const f of files) await writeFile(path.join(dir, path.basename(f.name)), f.data);
}

/* ------------------------------------------------------------------ */
/* Email bodies                                                        */
/* ------------------------------------------------------------------ */

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function rows(lead: Lead): [string, string][] {
  return [
    ["Reference", lead.ref],
    ["Type", lead.typeLabel],
    ["Routed to", lead.team],
    ["Industry", lead.industry?.name ?? ""],
    ["Category", lead.product?.category ?? lead.category ?? ""],
    ["Product", lead.product?.name ?? ""],
    ...Object.entries(lead.specs),
    ["Quantity", lead.quantity ?? ""],
    ["Delivery location", lead.delivery ?? ""],
    ["Timeline", lead.timeline ?? ""],
    ["Message", lead.message ?? ""],
    ["Name", lead.contact.name],
    ["Company", lead.contact.company ?? ""],
    ["Email", lead.contact.email],
    ["Phone", lead.contact.phone ?? ""],
    ["Location", lead.contact.location ?? ""],
    ["Files", lead.files.map((f) => `${f.name} (${Math.round(f.size / 1024)} KB)`).join(", ")],
    ["Source page", lead.source.page ?? ""],
    ["Referrer", lead.source.referrer ?? ""],
    ["UTM", lead.source.utm ? Object.entries(lead.source.utm).map(([k, v]) => `${k}=${v}`).join(" ") : ""],
  ].filter(([, v]) => v) as [string, string][];
}

const leadText = (lead: Lead) => rows(lead).map(([k, v]) => `${k}: ${v}`).join("\n");

function teamEmailHtml(lead: Lead) {
  return `<div style="font-family:Arial,sans-serif;color:#161a22"><h2 style="color:#0d1f38">New ${esc(lead.typeLabel)} — ${esc(lead.ref)}</h2><table cellpadding="6" style="border-collapse:collapse;font-size:14px">${rows(lead)
    .map(([k, v]) => `<tr><td style="border-bottom:1px solid #e2d9cb;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #e2d9cb;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("")}</table></div>`;
}

function ackText(lead: Lead) {
  return `Dear ${lead.contact.name},\n\nThank you for contacting ${site.name}. We have received your enquiry (reference ${lead.ref}) and it has been passed to our ${lead.team} team.\n\nWhat happens next: the team will review your requirement and contact you to confirm details, recommend a specification and arrange samples or a quotation where appropriate.\n\nYour information is used only to respond to this enquiry.\n\n${site.name}\n${site.url}`;
}

function ackEmailHtml(lead: Lead) {
  return `<div style="font-family:Arial,sans-serif;color:#161a22;max-width:560px"><p style="font-size:20px;font-weight:bold;color:#0d1f38;margin:0 0 4px">${esc(site.name)}</p><p style="color:#5b6270;margin:0 0 24px">${esc(site.tagline)}</p><p>Dear ${esc(lead.contact.name)},</p><p>Thank you for contacting ${esc(site.name)}. We have received your enquiry and passed it to our <strong>${esc(lead.team)}</strong> team.</p><p style="background:#f5efe5;padding:12px 16px;border-radius:4px">Your reference: <strong>${esc(lead.ref)}</strong></p><p><strong>What happens next</strong><br>The team will review your requirement and contact you to confirm details, recommend a specification and arrange samples or a quotation where appropriate.</p><p style="color:#5b6270;font-size:13px">Your information is used only to respond to this enquiry.</p><p><a href="${site.url}" style="color:#b4231a">${esc(site.url.replace(/^https?:\/\//, ""))}</a></p></div>`;
}
