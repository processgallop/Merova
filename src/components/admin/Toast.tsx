"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type T = { id: number; kind: "ok" | "error"; text: string };
let push: ((t: Omit<T, "id">) => void) | null = null;

export function toast(text: string, kind: "ok" | "error" = "ok") {
  push?.({ text, kind });
}

export function Toaster() {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    push = (t) => {
      const id = Date.now() + Math.random();
      setItems((x) => [...x, { ...t, id }]);
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), t.kind === "error" ? 7000 : 3500);
    };
    return () => {
      push = null;
    };
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} role={t.kind === "error" ? "alert" : "status"} className={`pointer-events-auto flex items-start gap-3 rounded-[3px] border px-4 py-3 text-sm shadow-lg ${t.kind === "ok" ? "border-emerald-200 bg-white text-heading" : "border-red/40 bg-white text-heading"}`}>
          {t.kind === "ok" ? <CheckCircle2 className="mt-0.5 size-4 flex-none text-emerald-600" /> : <XCircle className="mt-0.5 size-4 flex-none text-red" />}
          <p>{t.text}</p>
        </div>
      ))}
    </div>
  );
}
