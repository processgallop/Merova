"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Mail, MessageCircle, Phone, Send, Sparkles, X } from "lucide-react";
import { Emblem } from "@/components/brand/Logo";
import { telHref, whatsappHref } from "@/lib/site";
import { track } from "@/lib/track";
import { useSelection } from "@/components/client/selection";

type Msg = { role: "user" | "assistant"; content: string; links?: { label: string; href: string }[]; handoff?: boolean };

const STARTERS = ["Packaging for a multiplex concession counter", "3-ply vs 5-ply — which do I need?", "Do you supply compostable bags?", "Download the product catalogue"];

/**
 * Persistent contact dock: MIRA (AI requirements assistant), WhatsApp with a
 * message contextualised to the current page, and the consolidated-enquiry
 * tray when products are selected.
 */
export function Dock({ whatsapp, message, email, phone }: { whatsapp: string; message: string; email: string; phone: string }) {
  const pathname = usePathname();
  const [mira, setMira] = useState(false);
  const [contact, setContact] = useState(false);
  const { list, remove, clear } = useSelection();
  const [ctx, setCtx] = useState<string>("");

  useEffect(() => {
    // Page context (product or industry name) for WhatsApp and MIRA.
    const el = document.querySelector<HTMLElement>("[data-context]");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCtx(el?.dataset.context ?? "");
    setContact(false);
  }, [pathname]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/print")) return null;
  const wa = whatsappHref(whatsapp, ctx ? `Hello Merova Team, I'm interested in ${ctx}. I would like to discuss my requirement.` : message);
  const quoteHref = `/request-a-quote?products=${list.map((p) => p.slug).join(",")}`;
  const onQuote = pathname.startsWith("/request-a-quote") || pathname.startsWith("/custom-requirement");

  return (
    <>
      {list.length > 0 && !onQuote ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cloud/95 shadow-[0_-20px_40px_-20px_rgb(31_27_27/0.25)] backdrop-blur-md" role="region" aria-label="Selected products">
          <div className="wrap flex items-center gap-4 py-3 pr-28 sm:pr-36">
            <span className="flex size-9 flex-none items-center justify-center rounded-full bg-red font-display text-sm font-bold text-white">{list.length}</span>
            <div className="scrollbar-none flex min-w-0 flex-1 gap-2 overflow-x-auto">
              {list.map((p) => (
                <span key={p.slug} className="chip flex-none !min-h-8 !py-1 text-xs">
                  {p.name}
                  <button type="button" aria-label={`Remove ${p.name}`} onClick={() => remove(p.slug)} className="-mr-1 rounded-full p-0.5 hover:bg-black/10"><X className="size-3" /></button>
                </span>
              ))}
            </div>
            <button type="button" onClick={clear} className="hidden text-sm font-semibold text-muted hover:text-heading md:block">Clear</button>
            <Link href={quoteHref} className="btn btn-sm flex-none" onClick={() => track("cta_click", { cta: "tray_consolidated_quote", count: list.length })}>
              <span className="hidden sm:inline">Request consolidated quote</span><span className="sm:hidden">Quote</span><ArrowRight className="btn-arrow size-4" />
            </Link>
          </div>
        </div>
      ) : null}

      <div className={`fixed right-4 z-50 flex flex-col items-end gap-3 transition-[bottom] duration-300 sm:right-6 ${list.length && !onQuote ? "bottom-20" : "bottom-5 sm:bottom-6"}`}>
        {contact ? (
          <div className="w-72 border border-line bg-surface p-4 shadow-2xl" role="dialog" aria-label="Contact Merova">
            <p className="font-display font-bold text-heading">Chat with Merova</p>
            <div className="mt-3 grid gap-2 text-sm">
              {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { page: pathname, context: ctx })} className="btn btn-sm w-full !justify-start"><MessageCircle className="size-4" /><span>WhatsApp</span></a> : null}
              {phone ? <a href={telHref(phone)} className="btn btn-outline btn-sm w-full !justify-start"><Phone className="size-4" /><span>{phone}</span></a> : null}
              {email ? <a href={`mailto:${email}`} className="btn btn-outline btn-sm w-full !justify-start"><Mail className="size-4" /><span className="truncate">{email}</span></a> : null}
              <Link href="/contact" className="btn btn-outline btn-sm w-full !justify-start"><span>Contact form</span></Link>
              {!wa ? <p className="text-xs text-muted">WhatsApp will appear here once the business number is configured.</p> : null}
            </div>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setMira(true); track("mira_open", { page: pathname }); }} className="group flex h-12 items-center gap-2 rounded-full bg-ink pl-4 pr-5 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-red" aria-haspopup="dialog">
            <Sparkles className="size-4" aria-hidden /> Ask MIRA
          </button>
          <button type="button" onClick={() => { setContact((v) => !v); }} className="flex size-12 items-center justify-center rounded-full bg-red text-white shadow-xl transition-transform hover:scale-105" aria-label="Chat with Merova" aria-expanded={contact}>
            {contact ? <X className="size-5" /> : <MessageCircle className="size-5" />}
          </button>
        </div>
      </div>
      {mira ? <MiraPanel onClose={() => setMira(false)} context={ctx} /> : null}
    </>
  );
}

function MiraPanel({ onClose, context }: { onClose: () => void; context: string }) {
  const pathname = usePathname();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...msgs, { role: "user" as const, content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    setErr("");
    track("mira_message", { page: pathname });
    try {
      const res = await fetch("/api/mira", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })), page: pathname, context }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "MIRA is unavailable right now.");
      setMsgs([...next, { role: "assistant", content: data.reply, links: data.links, handoff: data.handoff }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "MIRA is unavailable right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-end bg-black/30 sm:p-6" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="MIRA — Merova Intelligent Requirements Assistant" className="flex h-[min(680px,100dvh)] w-full flex-col bg-cloud shadow-2xl sm:h-[min(680px,calc(100dvh-3rem))] sm:max-w-[420px]" onClick={(e) => e.stopPropagation()}>
        <div className="surface-red relative flex items-start justify-between gap-4 overflow-hidden px-5 py-4">
          <Emblem className="pointer-events-none absolute -right-8 -top-4 w-44 opacity-15" color="#fff" />
          <div className="relative">
            <p className="font-display text-lg font-bold text-white">MIRA</p>
            <p className="text-xs text-white/80">Merova Intelligent Requirements Assistant · AI</p>
          </div>
          <button type="button" onClick={onClose} className="relative -mr-2 flex size-10 items-center justify-center text-white" aria-label="Close MIRA"><X className="size-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
          <div className="text-sm">
            <p className="text-heading">Hello — I&apos;m MIRA, an AI assistant. I can help you find packaging for your industry, explain formats, share flyers and prepare a quote request.</p>
            <p className="mt-2 text-xs text-muted">I answer only from Merova&apos;s approved product information and never quote prices or commitments. For anything binding, I&apos;ll connect you with the team.</p>
          </div>
          {msgs.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button key={s} type="button" className="chip text-left !text-xs" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          ) : null}
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "ml-10 bg-ink px-4 py-3 text-sm text-white" : "mr-6 border border-line bg-surface px-4 py-3 text-sm text-heading"}>
              <p className="whitespace-pre-line">{m.content}</p>
              {m.links?.length ? (
                <ul className="mt-3 space-y-1.5">
                  {m.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} onClick={() => track("mira_link", { href: l.href })} className="link link-red text-[13px]">{l.label} <ArrowRight className="size-3.5" /></a>
                    </li>
                  ))}
                </ul>
              ) : null}
              {m.handoff ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/contact" className="btn btn-sm btn-dark"><span>Speak with the team</span></Link>
                  <Link href="/request-a-quote" className="btn btn-sm"><span>Request a quote</span></Link>
                </div>
              ) : null}
            </div>
          ))}
          {busy ? <p className="flex items-center gap-2 text-sm text-muted"><Loader2 className="size-4 animate-spin" /> MIRA is thinking…</p> : null}
          {err ? <p className="text-sm text-red" role="alert">{err} <Link href="/contact" className="underline">Contact the team</Link></p> : null}
          <div ref={endRef} />
        </div>
        <form className="flex items-end gap-2 border-t border-line p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <label htmlFor="mira-input" className="sr-only">Message MIRA</label>
          <textarea
            id="mira-input"
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={800}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Describe what you need to pack…"
            className="field !min-h-11 max-h-32 flex-1 resize-none text-sm"
          />
          <button type="submit" className="btn btn-sm !min-h-11 !px-3" disabled={busy || !input.trim()} aria-label="Send"><Send className="size-4" /></button>
        </form>
      </div>
    </div>
  );
}
