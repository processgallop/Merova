"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Consent, Field, Files, Honeypot, useEnquirySubmit } from "./shared";

export function CustomForm({ industries }: { industries: string[] }) {
  const [f, setF] = useState({ message: "", current: "", application: "", industry: "", quantity: "", delivery: "", name: "", company: "", email: "", phone: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [local, setLocal] = useState<Record<string, string>>({});
  const { submit, busy, error, fieldErrors } = useEnquirySubmit();
  const e = { ...fieldErrors, ...local };
  const up = (k: keyof typeof f) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: ev.target.value });
  return (
    <form noValidate className="relative grid gap-6" onSubmit={async (ev) => {
      ev.preventDefault();
      const x: Record<string, string> = {};
      if (f.message.trim().length < 15) x.message = "Please describe the requirement in a sentence or two.";
      if (f.name.trim().length < 2) x.name = "Please enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) x.email = "Please enter a valid email address.";
      if (f.phone && !/^[+()\-\s\d]{7,20}$/.test(f.phone)) x.phone = "Please enter a valid phone number.";
      if (!consent) x.consent = "Please confirm we may contact you.";
      setLocal(x); if (Object.keys(x).length) return;
      const message = [f.message, f.current && `Current packaging: ${f.current}`, f.application && `Application: ${f.application}`, f.quantity && `Quantity: ${f.quantity}`].filter(Boolean).join("\n\n");
      await submit({ type: "custom", message, industry: f.industry, delivery: f.delivery, name: f.name, company: f.company, email: f.email, phone: f.phone, consent: "yes" }, files);
    }}>
      <Honeypot />
      <Field id="c-message" label="What do you need to pack, and what should the packaging do?" required error={e.message} hint="e.g. 'Ship 2 kg glass jars of pickle to customers without breakage; currently using a plain 3-ply box with bubble wrap.'"><textarea id="c-message" className="textarea" value={f.message} onChange={up("message")} aria-invalid={!!e.message} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-current" label="Existing packaging (if any)"><input id="c-current" className="input" value={f.current} onChange={up("current")} /></Field>
        <Field id="c-application" label="Where it's used"><input id="c-application" className="input" placeholder="Retail shelf, delivery, export, counter…" value={f.application} onChange={up("application")} /></Field>
        <Field id="c-industry" label="Your industry"><select id="c-industry" className="select" value={f.industry} onChange={up("industry")}><option value="">Select</option>{industries.map((i) => <option key={i}>{i}</option>)}<option>Other</option></select></Field>
        <Field id="c-qty" label="Approximate quantity"><input id="c-qty" className="input" placeholder="per order or per month" value={f.quantity} onChange={up("quantity")} /></Field>
      </div>
      <Files files={files} setFiles={setFiles} error={e.files} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label="Full name" required error={e.name}><input id="c-name" className="input" autoComplete="name" value={f.name} onChange={up("name")} aria-invalid={!!e.name} /></Field>
        <Field id="c-company" label="Company"><input id="c-company" className="input" autoComplete="organization" value={f.company} onChange={up("company")} /></Field>
        <Field id="c-email" label="Email" required error={e.email}><input id="c-email" type="email" className="input" autoComplete="email" value={f.email} onChange={up("email")} aria-invalid={!!e.email} /></Field>
        <Field id="c-phone" label="Phone / WhatsApp" error={e.phone}><input id="c-phone" type="tel" className="input" autoComplete="tel" value={f.phone} onChange={up("phone")} aria-invalid={!!e.phone} /></Field>
        <Field id="c-delivery" label="Delivery location"><input id="c-delivery" className="input" value={f.delivery} onChange={up("delivery")} /></Field>
      </div>
      <Consent checked={consent} onChange={setConsent} error={e.consent} />
      {error && <p role="alert" className="flex gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 flex-none" />{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary btn-lg justify-self-start">{busy ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</> : <>Send requirement <ArrowRight className="arrow h-4 w-4" /></>}</button>
    </form>
  );
}

const TOPICS = [["sales", "Sales enquiry"], ["technical", "Technical question"], ["orders", "Existing order"], ["suppliers", "Supplier enquiry"], ["partnerships", "Business partnership"], ["careers", "Careers"]] as const;
export function ContactForm({ defaultTopic = "sales", lockTopic = false }: { defaultTopic?: string; lockTopic?: boolean }) {
  const [f, setF] = useState({ type: defaultTopic, message: "", name: "", company: "", email: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [local, setLocal] = useState<Record<string, string>>({});
  const { submit, busy, error, fieldErrors } = useEnquirySubmit();
  const e = { ...fieldErrors, ...local };
  const up = (k: keyof typeof f) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: ev.target.value });
  return (
    <form noValidate className="relative grid gap-5" onSubmit={async (ev) => {
      ev.preventDefault();
      const x: Record<string, string> = {};
      if (f.message.trim().length < 5) x.message = "Please add a short message.";
      if (f.name.trim().length < 2) x.name = "Please enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) x.email = "Please enter a valid email address.";
      if (!consent) x.consent = "Please confirm we may contact you.";
      setLocal(x); if (Object.keys(x).length) return;
      await submit({ ...f, consent: "yes" }, files);
    }}>
      <Honeypot />
      {!lockTopic && <Field id="t-type" label="Topic"><select id="t-type" className="select" value={f.type} onChange={up("type")}>{TOPICS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="t-name" label="Full name" required error={e.name}><input id="t-name" className="input" autoComplete="name" value={f.name} onChange={up("name")} aria-invalid={!!e.name} /></Field>
        <Field id="t-company" label="Company"><input id="t-company" className="input" autoComplete="organization" value={f.company} onChange={up("company")} /></Field>
        <Field id="t-email" label="Email" required error={e.email}><input id="t-email" type="email" className="input" autoComplete="email" value={f.email} onChange={up("email")} aria-invalid={!!e.email} /></Field>
        <Field id="t-phone" label="Phone"><input id="t-phone" type="tel" className="input" autoComplete="tel" value={f.phone} onChange={up("phone")} /></Field>
      </div>
      <Field id="t-message" label="Message" required error={e.message}><textarea id="t-message" className="textarea" value={f.message} onChange={up("message")} aria-invalid={!!e.message} /></Field>
      {(f.type === "careers" || f.type === "suppliers") && <Files files={files} setFiles={setFiles} error={e.files} />}
      <Consent checked={consent} onChange={setConsent} error={e.consent} />
      {error && <p role="alert" className="flex gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 flex-none" />{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary btn-lg justify-self-start">{busy ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</> : <>Send message <ArrowRight className="arrow h-4 w-4" /></>}</button>
    </form>
  );
}
