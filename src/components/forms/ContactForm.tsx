"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2, Paperclip, X } from "lucide-react";
import { CONTACT_TOPICS, UPLOAD_LIMITS } from "@/lib/quote";
import { track } from "@/lib/track";
import { Field, FormError, Honeypot, submitEnquiry, Turnstile, useFileList, useStartedAt } from "./shared";

export function ContactForm({ defaultTopic = "sales", allowFiles = false }: { defaultTopic?: string; allowFiles?: boolean }) {
  const router = useRouter();
  const [topic, setTopic] = useState(CONTACT_TOPICS.some((t) => t.id === defaultTopic) ? defaultTopic : "sales");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const started = useStartedAt();
  const files = useFileList(UPLOAD_LIMITS.maxFiles, UPLOAD_LIMITS.maxTotalBytes);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const err: Record<string, string> = {};
    if (String(fd.get("name") ?? "").trim().length < 2) err.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(fd.get("email") ?? ""))) err.email = "Please enter a valid email address.";
    if (String(fd.get("message") ?? "").trim().length < 5) err.message = "Please add a short message.";
    if (fd.get("consent") !== "yes") err.consent = "Please confirm we may contact you.";
    setErrors(err);
    if (Object.keys(err).length) return;
    fd.set("type", topic);
    fd.set("startedAt", String(started.current));
    fd.delete("files");
    for (const f of files.files) fd.append("files", f);
    setBusy(true);
    setFormError("");
    const r = await submitEnquiry(fd);
    setBusy(false);
    if (r.ok) {
      track("contact_submit", { topic });
      router.push(`/enquiry-received?ref=${encodeURIComponent(r.ref)}`);
    } else {
      setFormError(r.message);
      if (r.fields) setErrors(r.fields);
    }
  }

  const showFiles = allowFiles || topic === "careers" || topic === "technical";
  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5 bg-surface p-6 sm:p-8">
      <Honeypot />
      <fieldset>
        <legend className="field-label">What is your enquiry about?</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((t) => (
            <button key={t.id} type="button" className="chip" aria-pressed={topic === t.id} onClick={() => setTopic(t.id)} title={t.hint}>{t.label}</button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name} required><input id="name" name="name" autoComplete="name" className="field" aria-invalid={Boolean(errors.name)} /></Field>
        <Field label="Company" name="company"><input id="company" name="company" autoComplete="organization" className="field" /></Field>
        <Field label="Email" name="email" error={errors.email} required><input id="email" name="email" type="email" autoComplete="email" className="field" aria-invalid={Boolean(errors.email)} /></Field>
        <Field label="Phone" name="phone" error={errors.phone}><input id="phone" name="phone" type="tel" autoComplete="tel" className="field" /></Field>
      </div>
      <Field label="Message" name="message" error={errors.message} required><textarea id="message" name="message" className="field" aria-invalid={Boolean(errors.message)} /></Field>
      {showFiles ? (
        <div>
          <label className="btn btn-outline btn-sm cursor-pointer"><Paperclip className="size-4" /><span>Attach files</span><input type="file" multiple className="sr-only" accept={UPLOAD_LIMITS.accept.join(",")} onChange={(e) => { files.add(e.target.files); e.target.value = ""; }} /></label>
          {files.error ? <p className="mt-2 text-xs font-semibold text-red">{files.error}</p> : null}
          <ul className="mt-2 space-y-1 text-sm">{files.files.map((f, i) => <li key={i} className="flex items-center gap-2"><span className="truncate">{f.name}</span><button type="button" onClick={() => files.remove(i)} aria-label={`Remove ${f.name}`}><X className="size-3.5" /></button></li>)}</ul>
        </div>
      ) : null}
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input type="checkbox" name="consent" value="yes" className="mt-0.5 size-4 accent-[var(--c-red)]" />
        <span>I agree that Merova may contact me about this enquiry. See the <Link href="/privacy-policy" className="underline">privacy policy</Link>.</span>
      </label>
      {errors.consent ? <p className="text-xs font-semibold text-red">{errors.consent}</p> : null}
      <Turnstile />
      <FormError message={formError} />
      <button type="submit" className="btn" disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : null}<span>{busy ? "Sending…" : "Send message"}</span>{busy ? null : <ArrowRight className="btn-arrow size-4" />}</button>
    </form>
  );
}
