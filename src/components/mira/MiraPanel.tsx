"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Loader2, Send, Sparkles, X } from "lucide-react";
import { track } from "@/lib/track";

type Msg = { role: "user" | "assistant"; content: string; links?: { label: string; href: string }[] };

const STARTERS = [
  "Help me find packaging for my industry",
  "What do you offer for cinemas?",
  "Compare 3-ply and 5-ply boxes",
  "I want to request a quote",
];

const INTRO: Msg = {
  role: "assistant",
  content:
    "Hello, I'm Mira — Merova's AI packaging assistant. Tell me what you're looking to pack and I'll point you to suitable products, flyers and the right next step.",
};

/** Only same-site paths are rendered as links, so the assistant can never send visitors elsewhere. */
const safeHref = (h: string) => (h.startsWith("/") && !h.startsWith("//") ? h : null);

export function MiraPanel({ onClose, whatsappHref }: { onClose: () => void; whatsappHref?: string }) {
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"ai" | "guided" | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    track("mira_message");
    try {
      const res = await fetch("/api/mira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: window.location.pathname,
          messages: next.filter((m) => m !== INTRO).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await res.json()) as { reply?: string; links?: Msg["links"]; mode?: "ai" | "guided"; handoff?: boolean; error?: string };
      if (!res.ok || !data.reply) throw new Error(data.error ?? "Mira is unavailable");
      setMode(data.mode ?? null);
      if (data.handoff) track("mira_handoff");
      setMessages((m) => [...m, { role: "assistant", content: data.reply!, links: data.links }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry — I couldn't respond just now. You can still reach a Merova specialist directly.",
          links: [
            { label: "Request a Quote", href: "/request-a-quote" },
            { label: "Contact the team", href: "/contact" },
          ],
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      role="dialog"
      aria-label="Mira, Merova's AI packaging assistant"
      className="flex h-[min(36rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-line bg-white shadow-lift"
    >
      <header className="flex items-center gap-3 bg-red-500 px-4 py-3 text-cloud">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[0.98rem] font-semibold leading-tight">Mira</p>
          <p className="text-[0.72rem] text-cloud">Merova Intelligent Requirements Assistant · AI</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close Mira" className="rounded p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-paper px-4 py-4" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={`max-w-[88%] rounded-lg px-3.5 py-2.5 text-[0.9rem] leading-relaxed ${
                m.role === "user" ? "bg-red-500 text-white" : "border border-line bg-white text-ink"
              }`}
            >
              <p className="whitespace-pre-line">{m.content}</p>
              {m.links && m.links.length > 0 && (
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {m.links.map((l) => {
                    const href = safeHref(l.href);
                    if (!href) return null;
                    const isFile = href.endsWith(".pdf");
                    return (
                      <li key={l.href + l.label}>
                        {isFile ? (
                          <a href={href} download className="inline-flex items-center gap-1 rounded border border-line-strong px-2 py-1 text-[0.78rem] font-semibold text-char-800 hover:border-red-500">
                            {l.label} <ArrowUpRight className="h-3 w-3" aria-hidden />
                          </a>
                        ) : (
                          <Link href={href} className="inline-flex items-center gap-1 rounded border border-line-strong px-2 py-1 text-[0.78rem] font-semibold text-char-800 hover:border-red-500">
                            {l.label} <ArrowUpRight className="h-3 w-3" aria-hidden />
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        ))}
        {messages.length === 1 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {STARTERS.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => send(s)} className="rounded-full border border-line-strong bg-white px-3 py-1.5 text-left text-[0.8rem] text-ink-2 hover:border-red-500 hover:text-red-600">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
        {busy && (
          <p className="flex items-center gap-2 text-[0.8rem] text-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Mira is thinking…
          </p>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="border-t border-line bg-white p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <div className="flex items-end gap-2">
          <label htmlFor="mira-input" className="sr-only">Message Mira</label>
          <textarea
            id="mira-input"
            ref={inputRef}
            rows={1}
            maxLength={800}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="What are you looking to pack?"
            className="field max-h-28 min-h-[2.75rem] resize-none text-[0.92rem]"
          />
          <button type="submit" disabled={busy || !input.trim()} className="btn btn-primary h-11 w-11 shrink-0 px-0 disabled:opacity-50" aria-label="Send">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[0.7rem] leading-snug text-muted">
          Mira is an AI assistant{mode === "guided" ? " running in guided mode" : ""}. It uses Merova&apos;s approved product information and can make mistakes; specifications, prices and timelines are confirmed by a Merova specialist.
          {whatsappHref && (
            <>
              {" "}
              <a href={whatsappHref} target="_blank" rel="noopener" className="font-semibold text-char-800 underline">Chat on WhatsApp</a>
            </>
          )}
        </p>
      </form>
    </section>
  );
}
