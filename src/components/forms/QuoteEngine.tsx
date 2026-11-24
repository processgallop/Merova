"use client";

import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, Lock, Paperclip, Trash2 } from "lucide-react";
import { QUANTITY_BANDS, TIMELINES, UPLOAD_LIMITS, quoteFields, type QuoteField } from "@/data/quote";
import type { QuoteProfile } from "@/data/types";
import { track } from "@/lib/track";

export interface QuoteProduct {
  slug: string;
  name: string;
  vertical: string;
  profile: QuoteProfile;
}

type Mode = "quote" | "custom";

const STEPS: Record<Mode, string[]> = {
  quote: ["Requirement", "Specifications", "Delivery & files", "Your details"],
  custom: ["Your requirement", "Details & files", "Your details"],
};

const FIELD_STEP: Record<Mode, Record<string, number>> = {
  quote: { product: 0, message: 2, name: 3, email: 3, phone: 3, consent: 3 },
  custom: { message: 0, name: 2, email: 2, phone: 2, consent: 2 },
};

export function QuoteEngine({
  mode,
  products,
  verticals,
  industries,
  turnstileSiteKey,
  fallback,
}: {
  mode: Mode;
  products: QuoteProduct[];
  verticals: { id: string; name: string }[];
  industries: { id: string; name: string }[];
  turnstileSiteKey?: string;
  fallback: { whatsapp?: string; email?: string; phone?: string };
}) {
  const router = useRouter();
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const initialProduct = products.find((p) => p.slug === params.get("product"));
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState(params.get("industry") ?? "");
  const [category, setCategory] = useState(initialProduct?.vertical ?? params.get("category") ?? "");
  const [product, setProduct] = useState(initialProduct?.slug ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<{ text: string; offline?: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const steps = STEPS[mode];
  const last = steps.length - 1;
  const selected = products.find((p) => p.slug === product);
  const profile: QuoteProfile = selected?.profile ?? "custom";
  // In custom mode the free-text description is captured on step 1, so it is not repeated here.
  const specFields = quoteFields[profile].filter((f) => !(mode === "custom" && f.name === "productDescription"));
  const productOptions = useMemo(() => (category ? products.filter((p) => p.vertical === category) : products), [category, products]);
  const context = params.get("context");

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function validate(s: number): Record<string, string> {
    const f = formRef.current!;
    const val = (n: string) => ((f.elements.namedItem(n) as HTMLInputElement | null)?.value ?? "").trim();
    const e: Record<string, string> = {};
    if (mode === "quote" && s === 0 && !product) e.product = "Choose a product, or select ‘Something else’.";
    if (mode === "custom" && s === 0 && val("message").length < 10) e.message = "Please describe what you need packing (a sentence or two is enough).";
    if (s === last) {
      if (val("name").length < 2) e.name = "Please enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("email"))) e.email = "Please enter a valid business email.";
      if (val("phone") && !/^[+()\-\s\d]{7,20}$/.test(val("phone"))) e.phone = "Please enter a valid phone number.";
      if (!(f.elements.namedItem("consent") as HTMLInputElement).checked) e.consent = "Please confirm so we can reply to you.";
    }
    return e;
  }

  function next() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    track("quote_step", { step: step + 1, mode });
    setStep((x) => Math.min(x + 1, last));
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const merged = [...files, ...Array.from(list)].slice(0, UPLOAD_LIMITS.maxFiles);
    const total = merged.reduce((n, f) => n + f.size, 0);
    if (total > UPLOAD_LIMITS.maxTotalBytes) {
      setErrors((e) => ({ ...e, files: "Attachments must total 4 MB or less. You can send larger files after we reply." }));
      return;
    }
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.files;
      return rest;
    });
    setFiles(merged);
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (step !== last) return next();
    const e = validate(last);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    setBanner(null);
    const fd = new FormData(formRef.current!);
    fd.delete("files_picker");
    fd.set("page", window.location.pathname + window.location.search);
    fd.set("referrer", document.referrer);
    files.forEach((f) => fd.append("files", f, f.name));
    try {
      const res = await fetch("/api/enquiry", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; team?: string; acknowledged?: boolean; error?: string; code?: string; fields?: Record<string, string> };
      if (res.ok && data.ok && data.ref) {
        track(mode === "quote" ? "quote_submit" : "enquiry_submit", { product: product || "none", industry: industry || "none", type: mode });
        const q = new URLSearchParams({ ref: data.ref, team: data.team ?? "", ack: data.acknowledged ? "1" : "0", type: mode });
        router.push(`/enquiry-received?${q}`);
        return;
      }
      if (data.fields) {
        setErrors(data.fields);
        const first = Object.keys(data.fields)[0];
        const target = FIELD_STEP[mode][first];
        if (target !== undefined) setStep(target);
      }
      setBanner({ text: data.error ?? "We couldn't submit your enquiry. Please try again.", offline: data.code === "not_configured" || res.status >= 500 });
    } catch {
      setBanner({ text: "Network error — your enquiry was not sent. Please check your connection and try again.", offline: true });
    } finally {
      setSubmitting(false);
    }
  }

  const err = (n: string) => errors[n] && <p id={`${n}-error`} className="field-error" role="alert">{errors[n]}</p>;
  const aria = (n: string) => (errors[n] ? { "aria-invalid": true as const, "aria-describedby": `${n}-error` } : {});

  return (
    <div ref={topRef} className="scroll-mt-28">
      {turnstileSiteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />}

      {/* Progress */}
      <ol className="mb-8 grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))` }} aria-label="Progress">
        {steps.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-signal" : "bg-line"}`} />
            <p className={`mt-2 hidden text-[0.78rem] font-semibold sm:block ${i === step ? "text-navy-950" : "text-muted"}`}>
              <span className="font-mono">{String(i + 1).padStart(2, "0")}</span> {label}
            </p>
          </li>
        ))}
      </ol>
      <p className="mb-6 text-sm text-muted sm:hidden">
        Step {step + 1} of {steps.length}: <span className="font-semibold text-navy-950">{steps[step]}</span>
      </p>

      <form ref={formRef} onSubmit={submit} noValidate className="rounded-md border border-line bg-white p-5 sm:p-8">
        <input type="hidden" name="type" value={mode} />
        <input type="hidden" name="startedAt" value={startedAt} />
        <input type="hidden" name="category" value={category} />
        {["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].map((k) => params.get(k) && <input key={k} type="hidden" name={k} value={params.get(k)!} />)}
        {context && <input type="hidden" name="spec_context" value={context} />}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        {/* ---------- QUOTE: Step 1 ---------- */}
        {mode === "quote" && (
          <fieldset hidden={step !== 0} className="grid gap-5">
            <legend className="mb-1 font-display text-xl font-semibold text-navy-950">What do you need?</legend>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="industry" className="field-label">Industry <span className="font-normal text-muted">(optional)</span></label>
                <select id="industry" name="industry" className="field" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="">Select your industry</option>
                  {industries.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category-select" className="field-label">Product category</label>
                <select
                  id="category-select"
                  className="field"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (selected && selected.vertical !== e.target.value) setProduct("");
                  }}
                >
                  <option value="">All categories</option>
                  {verticals.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="product" className="field-label">Product</label>
              <select id="product" name="product" className="field" value={product} onChange={(e) => setProduct(e.target.value)} {...aria("product")}>
                <option value="">Select a product</option>
                {productOptions.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                <option value="other">Something else / not sure</option>
              </select>
              {err("product")}
              {product === "other" && <p className="field-hint">No problem — describe your requirement on the next step.</p>}
            </div>
          </fieldset>
        )}

        {/* ---------- CUSTOM: Step 1 ---------- */}
        {mode === "custom" && (
          <fieldset hidden={step !== 0} className="grid gap-5">
            <legend className="mb-1 font-display text-xl font-semibold text-navy-950">Tell us about your requirement</legend>
            <div>
              <label htmlFor="message" className="field-label">What are you looking for?</label>
              <textarea id="message" name="message" rows={6} className="field" placeholder="Describe the product, its size and weight, how it is shipped and sold, and what the packaging needs to do." {...aria("message")} />
              {err("message")}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="industry" className="field-label">Industry <span className="font-normal text-muted">(optional)</span></label>
                <select id="industry" name="industry" className="field" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="">Select your industry</option>
                  {industries.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="product" className="field-label">Closest product <span className="font-normal text-muted">(optional)</span></label>
                <select id="product" name="product" className="field" value={product} onChange={(e) => setProduct(e.target.value)}>
                  <option value="">Not sure</option>
                  {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </fieldset>
        )}

        {/* ---------- Specifications ---------- */}
        <fieldset hidden={step !== 1} className="grid gap-5">
          <legend className="mb-1 font-display text-xl font-semibold text-navy-950">
            {mode === "quote" ? (selected ? `${selected.name}: specifications` : "Your requirement") : "Specifications"}
          </legend>
          <p className="-mt-2 text-sm text-muted">Fill in what you know — the team will help with the rest.</p>
          <div className="grid gap-5 md:grid-cols-2">
            {specFields.map((f) => <SpecInput key={`${profile}-${f.name}`} field={f} />)}
            <div>
              <label htmlFor="quantity" className="field-label">Required quantity</label>
              <select id="quantity" name="quantity" className="field" defaultValue="">
                <option value="">Select a range</option>
                {QUANTITY_BANDS.map((q) => <option key={q}>{q}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        {/* ---------- Delivery & files ---------- */}
        <fieldset hidden={step !== (mode === "quote" ? 2 : 1)} className={`grid gap-5 ${mode === "custom" && step === 1 ? "mt-8 border-t border-line pt-8" : ""}`}>
          <legend className="mb-1 font-display text-xl font-semibold text-navy-950">Delivery, timeline & reference files</legend>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="delivery" className="field-label">Delivery location</label>
              <input id="delivery" name="delivery" className="field" placeholder="City, state / country" autoComplete="address-level2" />
            </div>
            <div>
              <label htmlFor="timeline" className="field-label">Required timeline</label>
              <select id="timeline" name="timeline" className="field" defaultValue="">
                <option value="">Select</option>
                {TIMELINES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          {mode === "quote" && (
            <div>
              <label htmlFor="message" className="field-label">Additional details <span className="font-normal text-muted">(optional)</span></label>
              <textarea id="message" name="message" rows={4} className="field" placeholder="Anything else we should know — current issues, performance needs, food contact, export, testing…" {...aria("message")} />
              {err("message")}
            </div>
          )}
          <div>
            <p className="field-label">Upload photographs, drawings, artwork, dielines or specifications</p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-line-strong bg-paper px-4 py-7 text-center hover:border-navy-700">
              <Paperclip className="h-5 w-5 text-navy-700" aria-hidden />
              <span className="text-sm font-semibold text-navy-900">Choose files</span>
              <span className="text-xs text-muted">Up to {UPLOAD_LIMITS.maxFiles} files, 4 MB total · PDF, images, AI, EPS, DXF, DWG, ZIP, Office</span>
              <input type="file" name="files_picker" multiple accept={UPLOAD_LIMITS.accept.join(",")} className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            </label>
            {err("files")}
            {files.length > 0 && (
              <ul className="mt-3 grid gap-2">
                {files.map((f, i) => (
                  <li key={f.name + i} className="flex items-center justify-between rounded border border-line px-3 py-2 text-sm">
                    <span className="truncate">{f.name} <span className="text-muted">· {Math.max(1, Math.round(f.size / 1024))} KB</span></span>
                    <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="p-1 text-muted hover:text-signal-700" aria-label={`Remove ${f.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </fieldset>

        {/* ---------- Contact ---------- */}
        <fieldset hidden={step !== last} className="grid gap-5">
          <legend className="mb-1 font-display text-xl font-semibold text-navy-950">Your details</legend>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="field-label">Contact person</label>
              <input id="name" name="name" className="field" autoComplete="name" {...aria("name")} />
              {err("name")}
            </div>
            <div>
              <label htmlFor="company" className="field-label">Company name <span className="font-normal text-muted">(recommended)</span></label>
              <input id="company" name="company" className="field" autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="email" className="field-label">Business email</label>
              <input id="email" name="email" type="email" className="field" autoComplete="email" inputMode="email" {...aria("email")} />
              {err("email")}
            </div>
            <div>
              <label htmlFor="phone" className="field-label">Mobile <span className="font-normal text-muted">(optional)</span></label>
              <input id="phone" name="phone" type="tel" className="field" autoComplete="tel" inputMode="tel" placeholder="+91" {...aria("phone")} />
              {err("phone")}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="location" className="field-label">Your location <span className="font-normal text-muted">(optional)</span></label>
              <input id="location" name="location" className="field" autoComplete="address-level2" placeholder="City, country" />
            </div>
          </div>
          <label className="flex items-start gap-3 text-sm text-ink-2">
            <input type="checkbox" name="consent" value="yes" className="mt-1 h-4 w-4 accent-[#0d1f38]" {...aria("consent")} />
            <span>I agree that Merova may contact me about this enquiry. My information will be handled as described in the <a href="/privacy-policy" target="_blank" className="font-semibold text-navy-800 underline">privacy policy</a>.</span>
          </label>
          {err("consent")}
          {turnstileSiteKey && <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />}
          <p className="flex items-center gap-2 text-xs text-muted"><Lock className="h-3.5 w-3.5" aria-hidden /> Your enquiry and files are confidential and used only to respond to your requirement.</p>
        </fieldset>

        {banner && (
          <div role="alert" className="mt-6 rounded-md border border-signal/40 bg-signal-50 p-4 text-sm text-signal-700">
            <p className="flex items-start gap-2 font-semibold"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{banner.text}</p>
            {banner.offline && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {fallback.whatsapp && <li><a href={fallback.whatsapp} target="_blank" rel="noopener" className="btn btn-sm bg-[#177a42] text-white">WhatsApp</a></li>}
                {fallback.email && <li><a href={`mailto:${fallback.email}`} className="btn btn-outline btn-sm">Email {fallback.email}</a></li>}
                {fallback.phone && <li><a href={`tel:${fallback.phone.replace(/[^\d+]/g, "")}`} className="btn btn-outline btn-sm">Call {fallback.phone}</a></li>}
                {!fallback.whatsapp && !fallback.email && !fallback.phone && <li className="text-ink-2">Direct contact details will be published here once confirmed.</li>}
              </ul>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" aria-hidden /> Back</button>
          ) : <span />}
          {step < last ? (
            <button type="button" className="btn btn-navy" onClick={next}>Continue <ArrowRight className="h-4 w-4" aria-hidden /></button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Submitting…</> : <><Check className="h-4 w-4" aria-hidden /> {mode === "quote" ? "Submit quote request" : "Submit requirement"}</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function SpecInput({ field }: { field: QuoteField }) {
  const id = `spec_${field.name}`;
  const label = (
    <label htmlFor={id} className="field-label">{field.label} <span className="font-normal text-muted">(optional)</span></label>
  );
  if (field.type === "select")
    return (
      <div>
        {label}
        <select id={id} name={id} className="field" defaultValue="">
          <option value="">Select</option>
          {field.options!.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    );
  if (field.type === "textarea")
    return (
      <div className="md:col-span-2">
        {label}
        <textarea id={id} name={id} rows={4} className="field" placeholder={field.placeholder} />
        {field.hint && <p className="field-hint">{field.hint}</p>}
      </div>
    );
  return (
    <div>
      {label}
      <input id={id} name={id} className="field" placeholder={field.placeholder} />
      {field.hint && <p className="field-hint">{field.hint}</p>}
    </div>
  );
}
