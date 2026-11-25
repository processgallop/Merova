"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/track";

/** Adds `.is-in` to [data-reveal] elements as they enter the viewport (one observer for the whole site). */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  // Delegated click tracking for downloads and contact links anywhere on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const dl = a.getAttribute("data-track-download");
      if (dl) track(dl.startsWith("flyer:") ? "flyer_download" : dl === "catalogue" ? "catalogue_download" : "document_download", { file: dl, href });
      else if (href.startsWith("tel:")) track("phone_click", { href });
      else if (href.startsWith("mailto:")) track("email_click", { href });
      else if (href.includes("wa.me/")) track("whatsapp_click", { href: href.split("?")[0] });
      else if (href.endsWith(".pdf")) track("document_download", { href });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
