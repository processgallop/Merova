"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, ChevronDown, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useBasket } from "@/components/basket/Basket";
import { Consent, Field, Files, Honeypot, MAX_BYTES, useEnquirySubmit } from "./shared";
import { track } from "@/lib/track";

export interface QuoteProduct { id: string; n: string; c: string; cn: string; s: string; i: string; u: string; v: string[]; f: string[] }
const COMMON = new Set(["Quantity per order", "Annual / repeat volume", "Delivery location (city, PIN)", "Required by date", "Artwork / reference upload", "Company & contact details"]);
const STEPS = ["Products", "Delivery", "Your details"];

export function QuoteForm({ products }: { products: QuoteProduct[] }) {
  const b = useBasket();
  const sp = useSearchParams();
  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const [step, setStep] = useState(0);
  const [lines, setLines] = useState<Record<string, { quantity: string; specs: Record<string, string>; open: boolean }>>({});
  const [q, setQ] = useState("");
  const [f, setF] = useState({ delivery: "", timeline: "", message: "", name: "", company: "", role: "", email: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [local, setLocal] = useState<Record<string, string>>({});
  const { submit, busy, error, fieldErrors } = useEnquirySubmit();
  const added = useRef(false);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!b.ready || added.current) return; added.current = true;
    const add = sp.get("add"); if (add && byId[add]) b.add(add, sp.get("variant") ?? undefined, byId[add].n);
    track("rfq_start", { items: b.items.length + (add ? 1 : 0) });
  }, [b, sp, byId]);
  const errors = { ...fieldErrors, ...local };
  const items = b.items.filter((i) => byId[i.id]);
  const line = (id: string) => lines[id] ?? { quantity: "", specs: {}, open: false };
  const setLine = (id: string, patch: Partial<{ quantity: string; specs: Record<string, string>; open: boolean }>) => setLines((cur) => ({ ...cur, [id]: { ...line(id), ...patch } }));
  const matches = q.trim().length > 1 ? products.filter((p) => !b.has(p.id) && `${p.n} ${p.s} ${p.cn}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];

  function go(n: number) {
    const e: Record<string, string> = {};
    if (step === 0 && n > 0) { if (!items.length && f.message.trim().length < 10) e.items = "Add at least one product, or describe what you need below."; items.forEach((it, k) => { if (!line(it.id).quantity.trim()) e[`qty_${k}`] = "Add an approximate quantity."; }); }
    if (step === 1 && n > 1) { if (!f.delivery.trim()) e.delivery = "Tell us the delivery city or PIN code."; if (files.reduce((a, x) => a + x.size, 0) > MAX_BYTES) e.files = "Attachments are over 4 MB."; }
    setLocal(e);
    if (Object.keys(e).length) return;
    setStep(n); track("rfq_step", { step: STEPS[n] }); top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function send() {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = "Please enter a valid email address.";
    if (!/^[+()\-\s\d]{7,20}$/.test(f.phone)) e.phone = "Please enter a phone number with country code.";
    if (!consent) e.consent = "Please confirm we may contact you.";
    setLocal(e); if (Object.keys(e).length) return;
    const payload = items.map((it) => ({ id: it.id, variant: it.variant, quantity: line(it.id).quantity, specs: line(it.id).specs }));
    await submit({ type: "quote", items: JSON.stringify(payload), industry: b.context.industry ?? "", operator: b.context.operator ?? "", consent: "yes", ...f }, files, () => b.clear());
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (step < 2) go(step + 1); else send(); }} noValidate className="relative grid gap-8" aria-describedby={error ? "form-error" : undefined}>
      <Honeypot />
      <div ref={top} className="scroll-mt-28" />
      <ol className="grid grid-cols-3 gap-2" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s}><button type="button" disabled={i > step} onClick={() => i < step && setStep(i)} className={`w-full rounded-2xl border-2 px-3 py-3 text-left transition-colors ${i === step ? "border-red bg-white" : i < step ? "border-transparent bg-white" : "border-transparent bg-sand text-stone"}`} aria-current={i === step ? "step" : undefined}>
            <span className={`block text-[11px] font-semibold uppercase tracking-[0.12em] ${i <= step ? "text-red" : ""}`}>Step {i + 1}</span><span className="mt-0.5 block font-semibold">{s}</span>
          </button></li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid gap-6 fade-in">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="h3">Your products</h2><p className="mt-1 text-sm text-stone">{b.context.operator ? `Kit for ${b.context.operator}. ` : ""}Add an approximate quantity for each. Sizes and specifications are optional now; we confirm them with you.</p></div>
            {items.length > 0 && <button type="button" onClick={() => b.clear()} className="text-sm font-semibold text-stone hover:text-red">Clear all</button>}
          </div>
          {errors.items && <p className="error" role="alert"><AlertCircle className="h-4 w-4" />{errors.items}</p>}
          <ul className="grid gap-3">
            {items.map((it, k) => { const p = byId[it.id]; const L = line(it.id); const extra = p.f.filter((x) => !COMMON.has(x)); return (
              <li key={it.id} className="rounded-[24px] border border-line bg-white p-4 sm:p-5">
                <div className="flex gap-4">
                  <Image src={p.i} alt="" width={120} height={90} className="h-[72px] w-24 flex-none rounded-2xl bg-sand object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone">{p.cn}</p>
                    <Link href={p.u} className="font-display text-lg font-semibold leading-tight hover:text-red">{p.n}</Link>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <Field id={`qty_${k}`} label="Approximate quantity" required error={errors[`qty_${k}`]}>
                        <input id={`qty_${k}`} className="input" inputMode="text" placeholder="e.g. 10,000 pcs / 200 kg / month" value={L.quantity} onChange={(e) => setLine(it.id, { quantity: e.target.value })} aria-invalid={!!errors[`qty_${k}`]} />
                      </Field>
                      {p.v.length > 0 && <Field id={`var_${k}`} label="Variant"><select id={`var_${k}`} className="select" value={it.variant ?? ""} onChange={(e) => b.setVariant(it.id, e.target.value)}><option value="">Not sure yet</option>{p.v.map((v) => <option key={v}>{v}</option>)}</select></Field>}
                    </div>
                    {extra.length > 0 && (
                      <div className="mt-3">
                        <button type="button" onClick={() => setLine(it.id, { open: !L.open })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red" aria-expanded={L.open}><ChevronDown className={`h-4 w-4 transition-transform ${L.open ? "rotate-180" : ""}`} />{L.open ? "Hide specification" : `Specify more (${extra.length} optional fields)`}</button>
                        {L.open && <div className="mt-3 grid gap-3 sm:grid-cols-2 fade-in">{extra.map((x, j) => <Field key={x} id={`sp_${k}_${j}`} label={x}><input id={`sp_${k}_${j}`} className="input" value={L.specs[x] ?? ""} onChange={(e) => setLine(it.id, { specs: { ...L.specs, [x]: e.target.value } })} /></Field>)}</div>}
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => b.remove(it.id)} className="icon-btn -mr-2 -mt-2 flex-none text-stone hover:text-red" aria-label={`Remove ${p.n}`}><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            ); })}
          </ul>
          <div className="rounded-[24px] border border-dashed border-line-strong bg-cloud p-4 sm:p-5">
            <label htmlFor="add-product" className="label">Add {items.length ? "another" : "a"} product</label>
            <div className="relative mt-2"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" /><input id="add-product" className="input !pl-11" placeholder="Search: cartons, BOPP, popcorn, 5 ply…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" /></div>
            {matches.length > 0 && <ul className="mt-2 grid gap-1 sm:grid-cols-2">{matches.map((p) => <li key={p.id}><button type="button" onClick={() => { b.add(p.id, undefined, p.n); setQ(""); }} className="flex w-full items-center gap-3 rounded-xl bg-white p-2 text-left hover:shadow-[var(--shadow-lift)]"><Image src={p.i} alt="" width={64} height={48} className="h-10 w-14 rounded-lg object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{p.n}</span><span className="block truncate text-xs text-stone">{p.cn}</span></span><Plus className="h-4 w-4 text-red" /></button></li>)}</ul>}
            <p className="mt-3 text-sm text-stone">Or <Link href="/products/" className="font-semibold text-red">browse products</Link> · <Link href="/industries/" className="font-semibold text-red">find by industry</Link></p>
          </div>
          <Field id="message" label={items.length ? "Anything else we should know?" : "Describe what you need"} hint="Product to be packed, sizes, print, current supplier issues…" error={errors.message}>
            <textarea id="message" className="textarea" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} aria-invalid={!!errors.message} />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-5 fade-in">
          <h2 className="h3">Delivery and files</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="delivery" label="Delivery location" required hint="City and PIN code" error={errors.delivery}><input id="delivery" className="input" value={f.delivery} onChange={(e) => setF({ ...f, delivery: e.target.value })} aria-invalid={!!errors.delivery} autoComplete="address-level2" /></Field>
            <Field id="timeline" label="Required by"><select id="timeline" className="select" value={f.timeline} onChange={(e) => setF({ ...f, timeline: e.target.value })}><option value="">Flexible</option><option>Within 2 weeks</option><option>2–4 weeks</option><option>1–2 months</option><option>Planning ahead (3+ months)</option><option>Ongoing monthly supply</option></select></Field>
          </div>
          <Files files={files} setFiles={setFiles} error={errors.files} />
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5 fade-in">
          <h2 className="h3">Your details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Full name" required error={errors.name}><input id="name" className="input" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!errors.name} /></Field>
            <Field id="company" label="Company"><input id="company" className="input" autoComplete="organization" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></Field>
            <Field id="email" label="Work email" required error={errors.email}><input id="email" type="email" className="input" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-invalid={!!errors.email} /></Field>
            <Field id="phone" label="Phone / WhatsApp" required error={errors.phone}><input id="phone" type="tel" className="input" autoComplete="tel" placeholder="+91" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} aria-invalid={!!errors.phone} /></Field>
            <Field id="role" label="Your role"><select id="role" className="select" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}><option value="">Select</option><option>Owner / founder</option><option>Procurement / purchase</option><option>Operations / supply chain</option><option>Marketing / brand</option><option>Other</option></select></Field>
          </div>
          <Consent checked={consent} onChange={setConsent} error={errors.consent} />
          <div className="rounded-2xl bg-sand p-4 text-sm text-charcoal"><strong>Summary:</strong> {items.length ? items.map((i) => byId[i.id].n).join(", ") : "custom requirement"}{f.delivery && <> · delivery to {f.delivery}</>}{files.length > 0 && <> · {files.length} file(s)</>}</div>
        </div>
      )}

      {error && <p id="form-error" role="alert" className="flex gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 flex-none" />{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        {step > 0 ? <button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</button> : <span />}
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : step < 2 ? <>Continue <ArrowRight className="arrow h-4 w-4" /></> : <>Send enquiry <ArrowRight className="arrow h-4 w-4" /></>}</button>
      </div>
    </form>
  );
}
