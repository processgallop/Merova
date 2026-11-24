"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Reveals .reveal / .reveal-img elements once as they enter the viewport, and drives the red scroll line. */
export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-in), .reveal-img:not(.is-in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    els.forEach((e) => { const r = e.getBoundingClientRect(); if (r.top < window.innerHeight * 0.95) e.classList.add("is-in"); else io.observe(e); });
    const line = document.getElementById("red-line");
    const onScroll = () => { const h = document.documentElement.scrollHeight - window.innerHeight; line?.style.setProperty("--p", String(h > 0 ? Math.min(1, window.scrollY / h) : 0)); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [pathname]);
  return <div id="red-line" className="red-line no-print" aria-hidden />;
}
