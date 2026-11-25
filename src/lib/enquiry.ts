import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import path from "node:path";
import { eq } from "drizzle-orm";
import { getDb, isPersistent, schema as t } from "@/db";
import type { EnquiryProduct } from "@/db/schema";
import { ENQUIRY_TYPES, quoteFields, UPLOAD_LIMITS, type EnquiryType } from "@/lib/quote";
import { getCatalog, getSiteSettings } from "./content";
import { siteUrl } from "./site";

export class EnquiryError extends Error {
  constructor(public status: number, public code: string, message: string, public fields?: Record<string, string>) {
    super(message);
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-\s\d]{7,20}$/;
const s = (v: FormDataEntryValue | null, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const TEAM_BY_SEGMENT: Record<string, string> = { A: "Corrugated sales", B: "Paperboard sales", C: "Foodservice sales", D: "Flexible packaging sales", E: "Custom development" };
const TEAM_BY_TYPE: Partial<Record<EnquiryType, string>> = { custom: "Custom development", technical: "Technical support", orders: "Customer service", suppliers: "Procurement", careers: "HR & careers", partnerships: "Business development", sales: "Sales" };

/** Validates and stores an enquiry. Returns the reference only after the database accepted it. */
export async function handleEnquiry(form: FormData, ip: string) {
  if (s(form.get("website"))) throw new EnquiryError(400, "spam", "Submission rejected.");
  const started = Number(s(form.get("startedAt")));
  if (!started || Date.now() - started < 2500) throw new EnquiryError(400, "too_fast", "Please take a moment to complete the form and try again.");
  if (!(await verifyTurnstile(s(form.get("cf-turnstile-response"), 4000), ip))) throw new EnquiryError(400, "captcha", "Please complete the verification and try again.");
  if (!isPersistent() && !externalChannel() && process.env.ALLOW_DEMO_ENQUIRIES !== "1") {
    throw new EnquiryError(503, "not_configured", "Our enquiry system is being configured. Please contact the Merova team directly while we finish setting it up.");
  }

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

  const { cards, industries } = await getCatalog();
  const bySlug = new Map(cards.map((c) => [c.slug, c]));
  let raw: { slug: string; specs?: Record<string, string> }[] = [];
  try {
    const parsed = JSON.parse(s(form.get("products"), 20000) || "[]");
    if (Array.isArray(parsed)) raw = parsed.slice(0, 20);
  } catch {
    raw = [];
  }
  const legacy = s(form.get("product"), 80);
  if (legacy && !raw.some((r) => r.slug === legacy)) raw.push({ slug: legacy });

  const products: EnquiryProduct[] = [];
  for (const r of raw) {
    const c = typeof r?.slug === "string" ? bySlug.get(r.slug) : undefined;
    if (!c) continue;
    const allowed = [...(quoteFields[c.quoteProfile as keyof typeof quoteFields] ?? quoteFields.custom).map((f) => f), { label: "Quantity", type: "text" as const, name: "quantity" }];
    const specs: Record<string, string> = {};
    for (const f of allowed) {
      const v = typeof r.specs?.[f.label] === "string" ? r.specs[f.label].trim().slice(0, f.type === "textarea" ? 3000 : 300) : "";
      if (!v) continue;
      if (f.type === "select" && "options" in f && f.options && !f.options.includes(v)) continue;
      specs[f.label] = v;
    }
    products.push({ slug: c.slug, name: c.name, segment: c.segment.name, specs });
  }

  const details: Record<string, string> = {};
  for (const f of quoteFields.custom) {
    const v = s(form.get(`spec_${f.name}`), f.type === "textarea" ? 3000 : 300);
    if (v && (f.type !== "select" || f.options?.includes(v))) details[f.label] = v;
  }

  const message = s(form.get("message"), 5000);
  if ((type === "quote" || type === "custom") && !products.length && message.length < 5 && !Object.keys(details).length) fields.message = "Please tell us what you need packaging for.";
  if (!["quote", "custom"].includes(type) && message.length < 5) fields.message = "Please add a short message.";
  if (Object.keys(fields).length) throw new EnquiryError(422, "invalid", "Please check the highlighted fields.", fields);

  const indSlug = s(form.get("industry"), 120);
  const industry = industries.find((i) => i.slug === indSlug);

  // Files
  const uploads: { name: string; type: string; data: Buffer }[] = [];
  let total = 0;
  for (const entry of form.getAll("files")) {
    if (typeof entry === "string" || entry.size === 0) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!UPLOAD_LIMITS.accept.includes(ext)) throw new EnquiryError(422, "file_type", `File type ${ext || "(none)"} is not accepted.`);
    total += entry.size;
    if (uploads.length >= UPLOAD_LIMITS.maxFiles) throw new EnquiryError(422, "file_count", `Please attach up to ${UPLOAD_LIMITS.maxFiles} files.`);
    if (total > UPLOAD_LIMITS.maxTotalBytes) throw new EnquiryError(413, "file_size", "Attachments exceed 4 MB in total. Please send larger files after we reply.");
    uploads.push({ name: entry.name.replace(/[^\w.\- ]/g, "_").slice(0, 120), type: entry.type || "application/octet-stream", data: Buffer.from(await entry.arrayBuffer()) });
  }

  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const v = s(form.get(k), 120);
    if (v) utm[k] = v;
  }

  const firstSeg = products[0] ? cards.find((c) => c.slug === products[0].slug)?.segment.code : undefined;
  const team = type === "quote" && firstSeg ? TEAM_BY_SEGMENT[firstSeg] : TEAM_BY_TYPE[type] ?? "Sales";
  const reference = makeRef();
  const db = await getDb();

  const files: { mediaId: string; name: string; size: number; type: string }[] = [];
  for (const f of uploads) {
    const [m] = await db.insert(t.media).values({ filename: f.name, mime: f.type, size: f.data.length, data: f.data, folder: "enquiries", isPrivate: true, title: `${reference} — ${f.name}` }).returning({ id: t.media.id });
    files.push({ mediaId: m.id, name: f.name, size: f.data.length, type: f.type });
  }

  const [row] = await db
    .insert(t.enquiries)
    .values({
      reference,
      type,
      name,
      email,
      phone: phone || null,
      company: s(form.get("company"), 160) || null,
      location: s(form.get("location"), 160) || null,
      industry: industry?.name ?? null,
      segment: products[0]?.segment ?? null,
      products,
      quantity: s(form.get("quantity"), 120) || null,
      delivery: s(form.get("delivery"), 200) || null,
      timeline: s(form.get("timeline"), 120) || null,
      message: message || null,
      details,
      files,
      source: { page: s(form.get("page"), 300) || undefined, referrer: s(form.get("referrer"), 300) || undefined, utm: Object.keys(utm).length ? utm : undefined },
      team,
      consent: true,
    })
    .returning();

  const log = await notify(row, uploads);
  if (log.length) await db.update(t.enquiries).set({ deliveryLog: log }).where(eq(t.enquiries.id, row.id));
  return { ref: reference };
}

function makeRef() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `MRV-${ymd}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

const externalChannel = () => Boolean((process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM) || process.env.CRM_WEBHOOK_URL);

export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret, response: token, remoteip: ip }) });
  return Boolean(((await res.json()) as { success?: boolean }).success);
}

type Row = typeof t.enquiries.$inferSelect;

/** Optional outbound channels. Failures are logged on the enquiry, never shown as success or failure to the visitor (the DB record is the source of truth). */
async function notify(e: Row, files: { name: string; data: Buffer }[]) {
  const log: string[] = [];
  const site = await getSiteSettings();
  const lines = rows(e);
  if (process.env.CRM_WEBHOOK_URL) {
    try {
      const body = JSON.stringify({ ...e, files: e.files.map((f) => ({ name: f.name, size: f.size })) });
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (process.env.CRM_WEBHOOK_SECRET) headers["X-Merova-Signature"] = createHmac("sha256", process.env.CRM_WEBHOOK_SECRET).update(body).digest("hex");
      const res = await fetch(process.env.CRM_WEBHOOK_URL, { method: "POST", headers, body, signal: AbortSignal.timeout(10000) });
      log.push(res.ok ? "crm: delivered" : `crm: HTTP ${res.status}`);
    } catch (err) {
      log.push(`crm: ${String(err).slice(0, 120)}`);
    }
  }
  const to = (site.enquiryRecipients || process.env.LEAD_EMAIL_DEFAULT || "").split(/[,;\s]+/).filter((x) => EMAIL.test(x));
  if (process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM && site.notifyOnEnquiry && to.length) {
    try {
      await sendEmail({ to, replyTo: e.email, subject: `[${e.reference}] ${ENQUIRY_TYPES[e.type as EnquiryType] ?? e.type}: ${e.products.map((p) => p.name).join(", ") || "General"} — ${e.company ?? e.name}`, html: html(e, lines), text: lines.map(([k, v]) => `${k}: ${v}`).join("\n"), attachments: files.map((f) => ({ filename: f.name, content: f.data.toString("base64") })) });
      log.push("team_email: sent");
      await sendEmail({ to: [e.email], subject: `We've received your enquiry — ${e.reference}`, html: ackHtml(e, site.companyName), text: `Dear ${e.name},\n\nThank you for contacting ${site.companyName}. Your reference is ${e.reference}. Our ${e.team} team will review your requirement and contact you.\n\n${siteUrl()}` });
      log.push("ack_email: sent");
    } catch (err) {
      log.push(`email: ${String(err).slice(0, 160)}`);
    }
  }
  return log;
}

async function sendEmail(msg: { to: string[]; subject: string; html: string; text: string; replyTo?: string; attachments?: { filename: string; content: string }[] }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.LEAD_EMAIL_FROM, to: msg.to, subject: msg.subject, html: msg.html, text: msg.text, reply_to: msg.replyTo, attachments: msg.attachments?.length ? msg.attachments : undefined }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text().catch(() => "")).slice(0, 120)}`);
}

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function rows(e: Row): [string, string][] {
  return [
    ["Reference", e.reference],
    ["Type", ENQUIRY_TYPES[e.type as EnquiryType] ?? e.type],
    ["Routed to", e.team ?? ""],
    ["Industry", e.industry ?? ""],
    ...e.products.flatMap((p, i): [string, string][] => [[`Product ${i + 1}`, `${p.name} (${p.segment})`], ...Object.entries(p.specs ?? {}).map(([k, v]): [string, string] => [`  ${k}`, v])]),
    ...Object.entries(e.details),
    ["Quantity", e.quantity ?? ""],
    ["Delivery", e.delivery ?? ""],
    ["Timeline", e.timeline ?? ""],
    ["Message", e.message ?? ""],
    ["Name", e.name],
    ["Company", e.company ?? ""],
    ["Email", e.email],
    ["Phone", e.phone ?? ""],
    ["Location", e.location ?? ""],
    ["Files", e.files.map((f) => f.name).join(", ")],
    ["Source page", e.source.page ?? ""],
  ].filter(([, v]) => v) as [string, string][];
}

function html(e: Row, lines: [string, string][]) {
  return `<div style="font-family:Arial,sans-serif;color:#1f1b1b"><h2 style="color:#d52b1e">New enquiry — ${esc(e.reference)}</h2><table cellpadding="6" style="border-collapse:collapse;font-size:14px">${lines.map(([k, v]) => `<tr><td style="border-bottom:1px solid #e7ddd0;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #e7ddd0;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table><p><a href="${siteUrl()}/admin/enquiries/${e.id}">Open in the Merova dashboard</a></p></div>`;
}

function ackHtml(e: Row, company: string) {
  return `<div style="font-family:Arial,sans-serif;color:#1f1b1b;max-width:560px"><p style="font-size:20px;font-weight:bold;color:#d52b1e;margin:0">${esc(company)}</p><p style="color:#454040">Packaging, Perfected.</p><p>Dear ${esc(e.name)},</p><p>Thank you for your enquiry. It has been passed to our <strong>${esc(e.team ?? "sales")}</strong> team.</p><p style="background:#fffaf3;border-left:3px solid #d52b1e;padding:12px 16px">Your reference: <strong>${esc(e.reference)}</strong></p><p>The team will review your requirement and contact you to confirm details, recommend a specification and arrange samples or a quotation where appropriate.</p></div>`;
}
