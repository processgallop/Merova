"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Paperclip, Plus, Search, Trash2, X } from "lucide-react";
import { quoteFields, QUANTITY_BANDS, TIMELINES, UPLOAD_LIMITS, type QuoteField } from "@/lib/quote";
import { useSelection } from "@/components/client/selection";
import { track } from "@/lib/track";
import { Field, FormError, Honeypot, submitEnquiry, Turnstile, useFileList, useStartedAt } from "./shared";

export interface QuoteProduct {
  slug: string;
  name: string;
  segment: string;
  segmentCode: string;
  profile: string;
  image?: string;
}

type Mode = "quote" | "custom";
const STEPS_QUOTE = ["Requirement", "Specifications", "Delivery & files", "Your details"];
const STEPS_CUSTOM = ["Your requirement", "Delivery & files", "Your details"];

/**
 * Progressive quotation engine. Industry and products carry in from the page
 * the visitor came from (?industry=&products=) and from the selection tray;
 * technical questions depend on each selected product's quote profile.
 * Success is shown only after the server confirms the enquiry was stored.
 */
export function QuoteEngine({ products, industries, mode = "quote", initialProducts = [], initialIndustry = "" }: { products: QuoteProduct[]; industries: { slug: string; name: string }[]; mode?: Mode; initialProducts?: string[]; initialIndustry?: string }) {
  const router = useRouter();
  const steps = mode === "custom" ? STEPS_CUSTOM : STEPS_QUOTE;
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState(initialIndustry);
  const [chosen, setChosen] = useState<string[]>(initialProducts.filter((s) => products.some((p) => p.slug === s)));
  const [other, setOther] = useState(mode === "custom");
  const [specs, setSpecs] = useState<Record<string, Record<string, string>>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const started = useStartedAt();
  const files = useFileList(UPLOAD_LIMITS.maxFiles, UPLOAD_LIMITS.maxTotalBytes);
  const { list: selection, clear: clearSelection } = useSelection();

  // Pull in products picked in the selection tray if the URL carried none.
  useEffect(() => {
    if (initialProducts.length || !selection.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChosen((c) => (c.length ? c : selection.map((s) => s.slug).filter((s) => products.some((p) => p.slug === s))));
  }, [selection, initialProducts.length, products]);

  useEffect(() => {
    track("quote_start", { mode, products: chosen.length, industry });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bySlug = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);
  const chosenProducts = chosen.map((s) => bySlug.get(s)).filter((p): p is QuoteProduct => Boolean(p));
  const filtered = search.trim() ? products.filter((p) => `${p.name} ${p.segment}`.toLowerCase().includes(search.toLowerCase())) : products;
  const set = (k: string, v: string) => setValues((x) => ({ ...x, [k]: v }));
  const setSpec = (slug: string, k: string, v: string) => setSpecs((x) => ({ ...x, [slug]: { ...x[slug], [k]: v } }));
  const toggle = (slug: string) => setChosen((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : [...c, slug].slice(0, 20)));

  const stepName = steps[step];
  function validate(): boolean {
    const e: Record<string, string> = {};
    if (stepName === "Requirement" && !chosen.length && !other) e.products = "Select at least one product, or choose “Something else”.";
    if ((stepName === "Requirement" && other && !(values.message ?? "").trim()) || (stepName === "Your requirement" && (values.message ?? "").trim().length < 10)) e.message = "Please describe what you need packaging for.";
    if (stepName === "Your details") {
      if ((values.name ?? "").trim().length < 2) e.name = "Please enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email ?? "")) e.email = "Please enter a valid business email.";
      if (values.phone && !/^[+()\-\s\d]{7,20}$/.test(values.phone)) e.phone = "Please enter a valid phone number.";
      if (values.consent !== "yes") e.consent = "Please confirm we may contact you about this enquiry.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const next = () => {
    if (!validate()) return;
    track("quote_step", { step: step + 1, name: stepName, mode });
    setStep((s) => Math.min(s + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) return next();
    if (!validate()) return;
    setBusy(true);
    setFormError("");
    const fd = new FormData(e.currentTarget);
    fd.set("type", mode === "custom" ? "custom" : "quote");
    fd.set("startedAt", String(started.current));
    fd.set("industry", industry);
    fd.set("products", JSON.stringify(chosenProducts.map((p) => ({ slug: p.slug, specs: specs[p.slug] ?? {} }))));
    for (const [k, v] of Object.entries(values)) fd.set(k, v);
    fd.delete("files");
    for (const f of files.files) fd.append("files", f);
    const result = await submitEnquiry(fd);
    setBusy(false);
    if (result.ok) {
      track("quote_submit", { mode, products: chosenProducts.length, industry });
      clearSelection();
      router.push(`/enquiry-received?ref=${encodeURIComponent(result.ref)}`);
    } else {
      setFormError(result.message);
      if (result.fields) setErrors(result.fields);
      track("quote_error", { mode });
    }
  }

  return (
    <form onSubmit={submit} noValidate className="relative">
      <Honeypot />
      {/* Progress */}
      <ol className="mb-10 grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined}>
            <div className={`h-1 transition-colors duration-500 ${i <= step ? "bg-red" : "bg-line"}`} />
            <p className={`mt-2.5 hidden text-xs font-semibold sm:block ${i === step ? "text-heading" : "text-muted"}`}><span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> {s}</p>
          </li>
        ))}
      </ol>
      <p className="mb-6 text-sm text-muted sm:hidden">Step {step + 1} of {steps.length}: <strong className="text-heading">{stepName}</strong></p>

      {stepName === "Requirement" ? (
        <div className="space-y-8">
          <Field label="Your industry" name="industry-select" hint="Helps us route your enquiry to the right team.">
            <select id="industry-select" className="field" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">Select your industry (optional)</option>
              {industries.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}
            </select>
          </Field>
          <div>
            <p className="field-label">Products you need <span className="font-normal text-muted">— select one or several</span></p>
            {chosenProducts.length ? (
              <ul className="mb-4 flex flex-wrap gap-2">
                {chosenProducts.map((p) => (
                  <li key={p.slug} className="chip is-active">{p.name}<button type="button" onClick={() => toggle(p.slug)} aria-label={`Remove ${p.name}`}><X className="size-3.5" /></button></li>
                ))}
              </ul>
            ) : null}
            <div className="border border-line bg-surface">
              <div className="relative border-b border-line">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <label htmlFor="product-search" className="sr-only">Search products</label>
                <input id="product-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search 50+ products…" className="h-12 w-full bg-transparent pl-10 pr-3 outline-none" />
              </div>
              <ul className="max-h-72 overflow-y-auto" role="listbox" aria-multiselectable="true" aria-label="Products">
                {filtered.map((p) => {
                  const on = chosen.includes(p.slug);
                  return (
                    <li key={p.slug} role="option" aria-selected={on}>
                      <button type="button" onClick={() => toggle(p.slug)} className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${on ? "bg-red-tint" : "hover:bg-paper"}`}>
                        <span className={`flex size-5 flex-none items-center justify-center border ${on ? "border-red bg-red text-white" : "border-line"}`}>{on ? <Check className="size-3.5" /> : null}</span>
                        <span className="flex-1 font-medium text-heading">{p.name}</span>
                        <span className="text-xs text-muted"><span className="text-red">{p.segmentCode}</span> {p.segment}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            {errors.products ? <p className="mt-2 text-xs font-semibold text-red">{errors.products}</p> : null}
          </div>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={other} onChange={(e) => setOther(e.target.checked)} className="mt-1 size-4 accent-[var(--c-red)]" />
            <span><span className="font-semibold text-heading">Something else / not sure</span><span className="block text-sm text-muted">Describe your requirement and we will recommend the right format.</span></span>
          </label>
          {other ? (
            <Field label="Describe your requirement" name="message" error={errors.message} required>
              <textarea id="message" className="field" value={values.message ?? ""} onChange={(e) => set("message", e.target.value)} placeholder="What do you need to pack, how is it shipped and sold, and roughly how many?" />
            </Field>
          ) : null}
        </div>
      ) : null}

      {stepName === "Specifications" ? (
        <div className="space-y-6">
          {chosenProducts.length ? (
            chosenProducts.map((p, idx) => (
              <fieldset key={p.slug} className="border border-line bg-surface p-5 sm:p-6">
                <legend className="sr-only">{p.name}</legend>
                <div className="mb-5 flex items-center gap-4">
                  {p.image ? <img src={p.image} alt="" className="size-14 flex-none bg-paper object-cover" /> : null}
                  <div className="flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Product {idx + 1} · {p.segment}</p>
                    <p className="font-display text-lg font-bold text-heading">{p.name}</p>
                  </div>
                  <button type="button" onClick={() => toggle(p.slug)} className="flex size-10 items-center justify-center text-muted hover:text-red" aria-label={`Remove ${p.name}`}><Trash2 className="size-4" /></button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Quantity" name={`${p.slug}-qty`}>
                    <select id={`${p.slug}-qty`} className="field" value={specs[p.slug]?.Quantity ?? ""} onChange={(e) => setSpec(p.slug, "Quantity", e.target.value)}>
                      <option value="">Select quantity</option>
                      {QUANTITY_BANDS.map((q) => <option key={q}>{q}</option>)}
                    </select>
                  </Field>
                  {(quoteFields[p.profile as keyof typeof quoteFields] ?? quoteFields.custom).map((f) => (
                    <SpecInput key={f.name} f={f} id={`${p.slug}-${f.name}`} value={specs[p.slug]?.[f.label] ?? ""} onChange={(v) => setSpec(p.slug, f.label, v)} />
                  ))}
                </div>
              </fieldset>
            ))
          ) : (
            <p className="border border-line bg-surface p-6 text-sm">No catalogue product selected — your description will be reviewed by the team. <button type="button" className="font-semibold text-red underline" onClick={() => setStep(0)}>Add products</button></p>
          )}
          <p className="text-sm text-muted">Everything here is optional. Approximate values are fine — the team confirms the specification with you.</p>
        </div>
      ) : null}

      {stepName === "Your requirement" ? (
        <div className="space-y-6">
          <Field label="Your industry" name="industry-select">
            <select id="industry-select" className="field" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">Select your industry (optional)</option>
              {industries.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}
            </select>
          </Field>
          <Field label="What needs packing?" name="message" error={errors.message} required hint="Product, size and weight, how it is shipped, stored and sold, and what isn't working today.">
            <textarea id="message" className="field min-h-40" value={values.message ?? ""} onChange={(e) => set("message", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            {quoteFields.custom.filter((f) => f.name !== "productDescription").map((f) => (
              <SpecInput key={f.name} f={f} id={`custom-${f.name}`} value={values[`spec_${f.name}`] ?? ""} onChange={(v) => set(`spec_${f.name}`, v)} />
            ))}
            <Field label="Quantity" name="quantity">
              <select id="quantity" className="field" value={values.quantity ?? ""} onChange={(e) => set("quantity", e.target.value)}>
                <option value="">Select quantity</option>
                {QUANTITY_BANDS.map((q) => <option key={q}>{q}</option>)}
              </select>
            </Field>
          </div>
          {chosenProducts.length ? <p className="text-sm">Related products noted: {chosenProducts.map((p) => p.name).join(", ")}</p> : null}
        </div>
      ) : null}

      {stepName === "Delivery & files" ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Delivery location" name="delivery" hint="City / state / country">
              <input id="delivery" className="field" value={values.delivery ?? ""} onChange={(e) => set("delivery", e.target.value)} />
            </Field>
            <Field label="Timeline" name="timeline">
              <select id="timeline" className="field" value={values.timeline ?? ""} onChange={(e) => set("timeline", e.target.value)}>
                <option value="">Select timeline</option>
                {TIMELINES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          {mode === "quote" && !other ? (
            <Field label="Anything else we should know?" name="notes">
              <textarea id="notes" className="field" value={values.message ?? ""} onChange={(e) => set("message", e.target.value)} placeholder="Printing, finishing, current supplier issues, sampling needs…" />
            </Field>
          ) : null}
          <div>
            <p className="field-label">Supporting files <span className="font-normal text-muted">— drawings, artwork, photographs or specification sheets</span></p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[color-mix(in_oklab,var(--c-border)_40%,var(--c-charcoal))] bg-surface px-6 py-8 text-center transition-colors hover:border-red">
              <Paperclip className="size-5 text-red" />
              <span className="text-sm font-semibold text-heading">Choose files</span>
              <span className="text-xs text-muted">Up to {UPLOAD_LIMITS.maxFiles} files, 4 MB in total · {UPLOAD_LIMITS.accept.join(" ")}</span>
              <input type="file" multiple accept={UPLOAD_LIMITS.accept.join(",")} className="sr-only" onChange={(e) => { files.add(e.target.files); e.target.value = ""; }} />
            </label>
            {files.error ? <p className="mt-2 text-xs font-semibold text-red">{files.error}</p> : null}
            {files.files.length ? (
              <ul className="mt-3 space-y-1.5">
                {files.files.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 bg-surface px-3 py-2 text-sm"><Paperclip className="size-4 text-muted" /><span className="flex-1 truncate">{f.name}</span><span className="text-xs text-muted">{Math.ceil(f.size / 1024)} KB</span><button type="button" onClick={() => files.remove(i)} aria-label={`Remove ${f.name}`}><X className="size-4" /></button></li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      {stepName === "Your details" ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact person" name="name" error={errors.name} required><input id="name" autoComplete="name" className="field" aria-invalid={Boolean(errors.name)} value={values.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Company" name="company"><input id="company" autoComplete="organization" className="field" value={values.company ?? ""} onChange={(e) => set("company", e.target.value)} /></Field>
            <Field label="Business email" name="email" error={errors.email} required><input id="email" type="email" autoComplete="email" className="field" aria-invalid={Boolean(errors.email)} value={values.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Mobile / phone" name="phone" error={errors.phone}><input id="phone" type="tel" autoComplete="tel" className="field" aria-invalid={Boolean(errors.phone)} value={values.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="Your location" name="location"><input id="location" className="field" value={values.location ?? ""} onChange={(e) => set("location", e.target.value)} /></Field>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={values.consent === "yes"} onChange={(e) => set("consent", e.target.checked ? "yes" : "")} className="mt-0.5 size-4 accent-[var(--c-red)]" />
            <span>I agree that Merova may contact me about this enquiry. See the <Link href="/privacy-policy" className="underline">privacy policy</Link>.</span>
          </label>
          {errors.consent ? <p className="text-xs font-semibold text-red">{errors.consent}</p> : null}
          <Turnstile />
          <div className="border-t border-line pt-5 text-sm">
            <p className="font-semibold text-heading">Summary</p>
            <p className="mt-1">{chosenProducts.length ? `${chosenProducts.length} product${chosenProducts.length > 1 ? "s" : ""}: ${chosenProducts.map((p) => p.name).join(", ")}` : "Custom / unlisted requirement"}{industry ? ` · ${industries.find((i) => i.slug === industry)?.name}` : ""}{files.files.length ? ` · ${files.files.length} file(s)` : ""}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-8"><FormError message={formError} /></div>
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
        {step > 0 ? <button type="button" onClick={back} className="btn btn-outline"><ArrowLeft className="size-4" /><span>Back</span></button> : <span />}
        {step < steps.length - 1 ? (
          <button type="button" onClick={next} className="btn"><span>Continue</span><ArrowRight className="btn-arrow size-4" /></button>
        ) : (
          <button type="submit" className="btn" disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : null}<span>{busy ? "Submitting…" : "Submit enquiry"}</span>{busy ? null : <ArrowRight className="btn-arrow size-4" />}</button>
        )}
      </div>
      {stepName === "Requirement" && !chosen.length ? <p className="mt-4 flex items-center gap-2 text-xs text-muted"><Plus className="size-3.5" />Tip: on any industry page, use “Enquire” on several products to build one consolidated request.</p> : null}
    </form>
  );
}

function SpecInput({ f, id, value, onChange }: { f: QuoteField; id: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className={f.type === "textarea" ? "sm:col-span-2" : ""}>
      <Field label={f.label} name={id} hint={f.hint}>
        {f.type === "select" ? (
          <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Select</option>
            {f.options?.map((o) => <option key={o}>{o}</option>)}
          </select>
        ) : f.type === "textarea" ? (
          <textarea id={id} className="field" value={value} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input id={id} className="field" value={value} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
        )}
      </Field>
    </div>
  );
}
