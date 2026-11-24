"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { AlertTriangle, Check, Loader2, Lock } from "lucide-react";
import { UPLOAD_LIMITS } from "@/data/quote";
import { track } from "@/lib/track";
import { CONTACT_TOPICS } from "@/data/contact";

export function ContactForm({ defaultTopic, fallback }: { defaultTopic?: string; fallback: { whatsapp?: string; email?: string; phone?: string } }) {
  const router = useRouter();
  const params = useSearchParams();
  const ref = useRef<HTMLFormElement>(null);
  const initial = params.get("topic") ?? defaultTopic ?? "sales";
  const valid = (x: string) => (CONTACT_TOPICS.some((t) => t.id === x) ? x : "sales");
  const [topic, setTopic] = useState<string>(valid(initial));
  // Follow ?topic= changes from the channel links while the form stays mounted.
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setTopic(valid(initial));
  }
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const product = params.get("product");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(ref.current!);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const errs: Record<string, string> = {};
    if (v("name").length < 2) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email"))) errs.email = "Please enter a valid email.";
    if (v("message").length < 5) errs.message = "Please add a short message.";
    if (v("consent") !== "yes") errs.consent = "Please confirm so we can reply to you.";
    const file = fd.get("files");
    if (file instanceof File && file.size > UPLOAD_LIMITS.maxTotalBytes) errs.files = "Attachment must be 4 MB or less.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    fd.set("page", window.location.pathname + window.location.search);
    fd.set("referrer", document.referrer);
    setBusy(true);
    setBanner(null);
    try {
      const res = await fetch("/api/enquiry", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; team?: string; acknowledged?: boolean; error?: string; fields?: Record<string, string> };
      if (res.ok && data.ok && data.ref) {
        track("enquiry_submit", { type: topic });
        router.push(`/enquiry-received?${new URLSearchParams({ ref: data.ref, team: data.team ?? "", ack: data.acknowledged ? "1" : "0", type: topic })}`);
        return;
      }
      if (data.fields) setErrors(data.fields);
      setBanner(data.error ?? "We couldn't send your message. Please try again.");
    } catch {
      setBanner("Network error — your message was not sent. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const err = (n: string) => errors[n] && <p id={`c-${n}-error`} className="field-error" role="alert">{errors[n]}</p>;
  const aria = (n: string) => (errors[n] ? { "aria-invalid": true as const, "aria-describedby": `c-${n}-error` } : {});
  const t = CONTACT_TOPICS.find((x) => x.id === topic)!;

  return (
    <form ref={ref} onSubmit={submit} noValidate className="rounded-md border border-line bg-white p-5 sm:p-8">
      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="type" value={topic} />
      {product && <input type="hidden" name="product" value={product} />}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset>
        <legend className="field-label">What is your enquiry about?</legend>
        <div className="mt-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_TOPICS.map((x) => (
            <label key={x.id} className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-2.5 text-sm font-semibold ${topic === x.id ? "border-navy-900 bg-navy-50 text-navy-950" : "border-line text-ink-2 hover:border-navy-700"}`}>
              <input type="radio" name="topic" value={x.id} checked={topic === x.id} onChange={() => setTopic(x.id)} className="accent-[#0d1f38]" />
              {x.label}
            </label>
          ))}
        </div>
        <p className="field-hint">{t.hint}</p>
      </fieldset>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="field-label">Name</label>
          <input id="c-name" name="name" className="field" autoComplete="name" {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="c-company" className="field-label">Company <span className="font-normal text-muted">(optional)</span></label>
          <input id="c-company" name="company" className="field" autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">Email</label>
          <input id="c-email" name="email" type="email" className="field" autoComplete="email" {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="c-phone" className="field-label">Phone <span className="font-normal text-muted">(optional)</span></label>
          <input id="c-phone" name="phone" type="tel" className="field" autoComplete="tel" {...aria("phone")} />
          {err("phone")}
        </div>
        {topic === "orders" && (
          <div className="md:col-span-2">
            <label htmlFor="c-order" className="field-label">Order or enquiry reference <span className="font-normal text-muted">(optional)</span></label>
            <input id="c-order" name="spec_orderRef" className="field" />
          </div>
        )}
        <div className="md:col-span-2">
          <label htmlFor="c-message" className="field-label">Message</label>
          <textarea id="c-message" name="message" rows={5} className="field" {...aria("message")} defaultValue={product ? `I'd like to discuss ${product.replace(/-/g, " ")}.` : ""} />
          {err("message")}
        </div>
        {(topic === "careers" || topic === "suppliers" || topic === "technical") && (
          <div className="md:col-span-2">
            <label htmlFor="c-file" className="field-label">{topic === "careers" ? "CV / résumé" : "Attachment"} <span className="font-normal text-muted">(optional, max 4 MB)</span></label>
            <input id="c-file" name="files" type="file" accept={UPLOAD_LIMITS.accept.join(",")} className="block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-navy-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
            {err("files")}
          </div>
        )}
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-ink-2">
        <input type="checkbox" name="consent" value="yes" className="mt-1 h-4 w-4 accent-[#0d1f38]" {...aria("consent")} />
        <span>I agree that Merova may contact me about this enquiry, as described in the <a href="/privacy-policy" target="_blank" className="font-semibold text-navy-800 underline">privacy policy</a>.</span>
      </label>
      {err("consent")}

      {banner && (
        <div role="alert" className="mt-5 rounded-md border border-signal/40 bg-signal-50 p-4 text-sm text-signal-700">
          <p className="flex items-start gap-2 font-semibold"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{banner}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {fallback.whatsapp && <li><a href={fallback.whatsapp} target="_blank" rel="noopener" className="btn btn-sm bg-[#177a42] text-white">WhatsApp</a></li>}
            {fallback.email && <li><a href={`mailto:${fallback.email}`} className="btn btn-outline btn-sm">Email</a></li>}
            {fallback.phone && <li><a href={`tel:${fallback.phone.replace(/[^\d+]/g, "")}`} className="btn btn-outline btn-sm">Call</a></li>}
            {!fallback.whatsapp && !fallback.email && !fallback.phone && <li className="text-ink-2">Direct contact details will be published here once confirmed.</li>}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-muted"><Lock className="h-3.5 w-3.5" aria-hidden /> Used only to respond to your enquiry.</p>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…</> : <><Check className="h-4 w-4" aria-hidden /> Send message</>}
        </button>
      </div>
    </form>
  );
}
