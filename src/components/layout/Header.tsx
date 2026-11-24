"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { IndustryIcon } from "@/components/ui/Icon";
import { primaryNav, type NavItem } from "@/data/navigation";
import type { Menus } from "@/data/menus";

export function Header({ menus }: { menus: Menus }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close menus on route change. Adjusting state during render (rather than in an
  // effect) is React's recommended pattern for resetting state when a value changes.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const enter = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85 transition-shadow ${
        scrolled ? "border-line shadow-[0_6px_20px_-14px_rgb(13_31_56/0.35)]" : "border-transparent"
      }`}
    >
      <nav ref={navRef} aria-label="Primary" className="container-x flex h-[4.25rem] items-center gap-4 lg:h-[4.75rem] xl:!px-6 2xl:!px-10">
        <Link href="/" className="shrink-0">
          <Logo />
          <span className="sr-only"> — home</span>
        </Link>

        <ul className="ml-auto hidden items-center xl:flex">
          {primaryNav.map((item) => (
            <li key={item.label} className="relative" onMouseEnter={() => item.kind !== "link" && enter(item.label)} onMouseLeave={leave}>
              {item.kind === "link" ? (
                <Link
                  href={item.href}
                  className={`block whitespace-nowrap rounded px-2 py-2 text-[0.875rem] font-semibold transition-colors 2xl:px-3 2xl:text-[0.9rem] ${
                    isActive(item.href) ? "text-signal-600" : "text-navy-900 hover:text-signal-600"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-expanded={open === item.label}
                  aria-controls={`menu-${item.label}`}
                  onClick={() => setOpen(open === item.label ? null : item.label)}
                  className={`flex items-center gap-1 whitespace-nowrap rounded px-2 py-2 text-[0.875rem] font-semibold transition-colors 2xl:px-3 2xl:text-[0.9rem] ${
                    isActive(item.href) || open === item.label ? "text-signal-600" : "text-navy-900 hover:text-signal-600"
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open === item.label ? "rotate-180" : ""}`} aria-hidden />
                </button>
              )}
              {item.kind === "dropdown" && open === item.label && (
                <div id={`menu-${item.label}`} className="absolute left-0 top-full pt-2">
                  <ul className="card min-w-[15rem] p-2 shadow-lift">
                    {item.items.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} className="block rounded px-3 py-2 text-[0.92rem] text-ink-2 hover:bg-paper-2 hover:text-navy-900">
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 xl:ml-3">
          <Link href="/request-a-quote" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Request a Quote
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded border border-line-strong text-navy-900 xl:hidden"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            aria-controls="mobile-nav"
            onClick={() => setMobile((m) => !m)}
          >
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mega menus */}
        {(open === "Products" || open === "Industries") && (
          <div
            id={`menu-${open}`}
            className="absolute inset-x-0 top-full hidden xl:block"
            onMouseEnter={() => enter(open)}
            onMouseLeave={leave}
          >
            <div className="border-y border-line bg-white shadow-lift">
              <div className="container-x py-8">{open === "Products" ? <ProductsMega menus={menus} /> : <IndustriesMega menus={menus} />}</div>
            </div>
          </div>
        )}
      </nav>

      {/* Portalled to <body>: the header's backdrop-filter would otherwise trap the fixed drawer inside the header box. */}
      {mobile && createPortal(<MobileNav menus={menus} />, document.body)}
    </header>
  );
}

function ProductsMega({ menus }: { menus: Menus }) {
  return (
    <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_15rem] gap-8">
      {menus.productMenu.map((col) => (
        <div key={col.href}>
          <Link href={col.href} className="group flex items-center gap-1 font-display text-[0.98rem] font-semibold text-navy-950 hover:text-signal-600">
            {col.title}
            <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
          </Link>
          <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
            {col.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-[0.88rem] text-ink-2 hover:text-signal-600">
                  {i.label}
                </Link>
              </li>
            ))}
            {col.count > col.items.length && (
              <li>
                <Link href={col.href} className="text-[0.85rem] font-semibold text-navy-700 hover:text-signal-600">
                  View all {col.count} →
                </Link>
              </li>
            )}
          </ul>
        </div>
      ))}
      <div className="rounded bg-navy-900 p-5 text-white">
        <p className="eyebrow eyebrow-light">Not sure what you need?</p>
        <p className="mt-2 font-display text-lg font-semibold leading-snug">Start from your industry or your product.</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/#find-your-packaging" className="btn btn-primary btn-sm">Find Your Packaging</Link>
          <Link href="/custom-requirement" className="btn btn-ghost-light btn-sm">Discuss a Custom Requirement</Link>
        </div>
      </div>
    </div>
  );
}

function IndustriesMega({ menus }: { menus: Menus }) {
  return (
    <div className="grid grid-cols-[1fr_17rem] gap-8">
      <ul className="grid grid-cols-5 gap-3">
        {menus.industryMenu.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="group flex h-full flex-col gap-3 rounded border border-line p-4 transition-colors hover:border-navy-900 hover:bg-paper">
              <span className="flex h-9 w-9 items-center justify-center rounded bg-navy-50 text-navy-800 group-hover:bg-navy-900 group-hover:text-white">
                <IndustryIcon name={i.icon} className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[0.9rem] font-semibold leading-snug text-navy-950">{i.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-col justify-between rounded bg-paper-2 p-5">
        <div>
          <p className="eyebrow">Have a different requirement?</p>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">
            Share your specifications, drawings or photographs. Our team will assess your application.
          </p>
        </div>
        <Link href="/custom-requirement" className="btn btn-navy btn-sm mt-4">Discuss Your Requirement</Link>
      </div>
    </div>
  );
}

function MobileNav({ menus }: { menus: Menus }) {
  const [section, setSection] = useState<string | null>(null);
  const toggle = (k: string) => setSection(section === k ? null : k);
  const groups: Record<string, { label: string; href: string }[]> = {
    Industries: menus.industryMenu.map((i) => ({ label: i.label, href: i.href })),
    Products: [
      { label: "All products", href: "/products" },
      ...menus.productMenu.map((c) => ({ label: c.title, href: c.href })),
    ],
  };
  return (
    <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-[4.25rem] z-40 overflow-y-auto bg-paper xl:hidden lg:top-[4.75rem]">
      <div className="container-x pb-28 pt-4">
        <ul className="divide-y divide-line border-y border-line">
          {primaryNav.map((item: NavItem) => {
            const sub = item.kind === "link" ? null : item.kind === "mega" ? groups[item.label] : item.items;
            if (!sub)
              return (
                <li key={item.label}>
                  <Link href={item.href} className="flex min-h-[3.25rem] items-center text-[1.05rem] font-semibold text-navy-950">
                    {item.label}
                  </Link>
                </li>
              );
            const expanded = section === item.label;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  className="flex min-h-[3.25rem] w-full items-center justify-between text-left text-[1.05rem] font-semibold text-navy-950"
                  aria-expanded={expanded}
                  onClick={() => toggle(item.label)}
                >
                  {item.label}
                  <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {expanded && (
                  <ul className="mb-3 grid gap-0.5 border-l-2 border-signal pl-4">
                    <li>
                      <Link href={item.href} className="block py-2 text-[0.95rem] font-semibold text-navy-800">
                        {item.label} overview
                      </Link>
                    </li>
                    {sub.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} className="block py-2 text-[0.95rem] text-ink-2">
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-6 grid gap-3">
          <Link href="/request-a-quote" className="btn btn-primary">Request a Quote</Link>
          <Link href="/custom-requirement" className="btn btn-outline">Discuss a Custom Requirement</Link>
          <Link href="/contact" className="btn btn-outline">
            <MessageCircle className="h-4 w-4" aria-hidden /> Speak With Our Team
          </Link>
        </div>
      </div>
    </div>
  );
}
