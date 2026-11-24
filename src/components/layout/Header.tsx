"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ChevronDown, Download, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { aboutMenu, primaryNav, resourcesMenu, type NavKey } from "@/data/navigation";
import type { Menus } from "@/data/menus";

const CATALOGUE = "/assets/downloads/merova-product-catalogue.pdf";
const PROFILE = "/assets/downloads/merova-company-profile.pdf";

export function Header({ menus }: { menus: Menus }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<NavKey | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLElement>(null);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const enter = (k: NavKey) => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(k);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(null), 180);
  };
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      ref={ref}
      className={`sticky top-0 z-50 border-b bg-cloud/95 backdrop-blur supports-[backdrop-filter]:bg-cloud/90 transition-[box-shadow,border-color] duration-300 ${
        scrolled ? "border-line shadow-[0_10px_30px_-22px_rgb(40_37_37/0.45)]" : "border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="container-x flex h-[4.5rem] items-center gap-6 lg:h-[5.25rem]">
        <Link href="/" className="shrink-0" aria-label="Merova Printpack — home">
          <span className="hidden lg:block"><Logo height={58} /></span>
          <span className="lg:hidden"><Logo height={44} /></span>
        </Link>

        <ul className="ml-auto hidden items-center lg:flex">
          {primaryNav.map((item) => (
            <li key={item.key} onMouseEnter={() => item.key !== "contact" && enter(item.key as NavKey)} onMouseLeave={leave}>
              {item.key === "contact" ? (
                <Link href={item.href} data-active={active(item.href)} className="nav-link block px-3 py-3 text-[0.95rem] font-semibold text-char-900 transition-colors hover:text-red-600 xl:px-4">
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-expanded={open === item.key}
                  aria-controls={`mega-${item.key}`}
                  data-active={active(item.href)}
                  onClick={(e) => setOpen(open === item.key && e.detail === 0 ? null : (item.key as NavKey))}
                  className={`nav-link flex items-center gap-1.5 px-3 py-3 text-[0.95rem] font-semibold transition-colors xl:px-4 ${
                    open === item.key ? "text-red-600" : "text-char-900 hover:text-red-600"
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open === item.key ? "rotate-180" : ""}`} aria-hidden />
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Link href="/request-a-quote" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Request a Quote <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-char-200 text-char-900 lg:hidden"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            aria-controls="mobile-nav"
            onClick={() => setMobile((m) => !m)}
          >
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mega menus are always rendered so they can animate in and out */}
      <div className="absolute inset-x-0 top-full hidden lg:block" onMouseLeave={leave}>
        <MegaShell id="products" open={open} onEnter={enter}>
          <ProductsMega menus={menus} />
        </MegaShell>
        <MegaShell id="industries" open={open} onEnter={enter}>
          <IndustriesMega menus={menus} />
        </MegaShell>
        <MegaShell id="about" open={open} onEnter={enter}>
          <AboutMega />
        </MegaShell>
        <MegaShell id="resources" open={open} onEnter={enter}>
          <ResourcesMega />
        </MegaShell>
      </div>

      {/* Portalled to <body>: the header's backdrop-filter would otherwise trap the fixed drawer. */}
      {mobile && createPortal(<MobileNav menus={menus} />, document.body)}
    </header>
  );
}

function MegaShell({ id, open, onEnter, children }: { id: NavKey; open: NavKey | null; onEnter: (k: NavKey) => void; children: React.ReactNode }) {
  const isOpen = open === id;
  return (
    <div id={`mega-${id}`} data-open={isOpen} aria-hidden={!isOpen} inert={!isOpen} className="mega absolute inset-x-0 top-0" onMouseEnter={() => onEnter(id)}>
      <div className="border-t-2 border-red-500 bg-white shadow-lift">
        <div className="container-x py-9">{children}</div>
      </div>
    </div>
  );
}

function ProductsMega({ menus }: { menus: Menus }) {
  const [v, setV] = useState(0);
  const cur = menus.productMenu[v];
  return (
    <div className="grid grid-cols-[16rem_1fr_19rem] gap-10">
      <ul className="border-r border-line pr-6">
        {menus.productMenu.map((m, i) => (
          <li key={m.id}>
            <Link
              href={m.href}
              onMouseEnter={() => setV(i)}
              onFocus={() => setV(i)}
              className={`flex items-center justify-between rounded-sm px-3 py-3 font-display text-[1rem] font-semibold transition-colors ${
                i === v ? "bg-red-500 text-cloud" : "text-char-900 hover:bg-paper-2"
              }`}
            >
              {m.short}
              <span className={`font-sans text-xs font-semibold ${i === v ? "text-cloud" : "text-char-400"}`}>{m.count}</span>
            </Link>
          </li>
        ))}
        <li className="mt-4 border-t border-line pt-4">
          <Link href="/products" className="link-arrow px-3 text-sm">All {menus.productCount} products <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </li>
      </ul>
      <div>
        <p className="eyebrow">{cur.title}</p>
        <p className="mt-3 max-w-xl text-[0.93rem] leading-relaxed text-ink-2">{cur.intro}</p>
        <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2.5">
          {cur.items.map((i) => (
            <li key={i.href}>
              <Link href={i.href} className="group inline-flex items-center gap-2 text-[0.93rem] text-char-800 hover:text-red-600">
                <span className="h-px w-3 bg-red-500 transition-all duration-300 group-hover:w-5" aria-hidden />
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={cur.href} className="link-arrow mt-6 text-sm">Explore {cur.short} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      <Link href={cur.href} className="group block overflow-hidden rounded-sm bg-paper-2">
        <span className="block overflow-hidden">
          <img key={cur.image} src={cur.image} alt="" className="reveal aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </span>
        <span className="surface-red block p-4">
          <span className="block font-display text-[1rem] font-semibold">{cur.title}</span>
          <span className="mt-1 block text-[0.85rem]">{cur.count} formats · specifications, flyers and quotes</span>
        </span>
      </Link>
    </div>
  );
}

function IndustriesMega({ menus }: { menus: Menus }) {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="eyebrow">Solutions by industry</p>
          <p className="mt-2 font-display text-xl font-semibold text-char-900">What are you looking to pack?</p>
        </div>
        <Link href="/custom-requirement" className="link-arrow text-sm">Have a different requirement? <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      <ul className="grid grid-cols-5 gap-3">
        {menus.industryMenu.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="group relative block overflow-hidden rounded-sm bg-paper-2">
              <img src={i.image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-char-950/90 via-char-950/45 to-transparent px-3 pb-2.5 pt-10 text-[0.88rem] font-semibold leading-tight text-cloud">
                {i.label}
              </span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-red-500 transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AboutMega() {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_20rem] gap-10">
      {aboutMenu.map((col) => (
        <div key={col.title}>
          <p className="eyebrow">{col.title}</p>
          <ul className="mt-4 grid gap-2.5">
            {col.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-char-800 hover:text-red-600">
                  <span className="h-px w-3 bg-red-500 transition-all duration-300 group-hover:w-5" aria-hidden />
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="surface-red-deep relative overflow-hidden rounded-sm p-6">
        <img src="/assets/brand/merova-mark-cream.svg" alt="" className="glyph-watermark -bottom-6 -right-10 w-64" />
        <p className="relative font-display text-lg font-semibold leading-snug">More than packaging. A manufacturing partner built around your business.</p>
        <a href={PROFILE} download className="btn btn-cloud btn-sm relative mt-5"><Download className="h-4 w-4" aria-hidden /> Company Profile</a>
      </div>
    </div>
  );
}

function ResourcesMega() {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_20rem] gap-8">
      {resourcesMenu.map((r) => (
        <Link key={r.href} href={r.href} className="group rounded-sm border border-line p-5 transition-colors hover:border-red-500">
          <p className="font-display text-[1.05rem] font-semibold text-char-900 group-hover:text-red-600">{r.label}</p>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">{r.text}</p>
          <span className="link-arrow mt-4 text-sm">Open <ArrowRight className="h-4 w-4" aria-hidden /></span>
        </Link>
      ))}
      <div className="surface-red relative overflow-hidden rounded-sm p-6">
        <img src="/assets/brand/merova-mark-cream.svg" alt="" className="glyph-watermark -bottom-4 -right-8 w-56" />
        <p className="relative text-xs font-bold uppercase tracking-[0.16em]">Product catalogue</p>
        <p className="relative mt-2 font-display text-lg font-semibold leading-snug">Every Merova product in one document.</p>
        <a href={CATALOGUE} download className="btn btn-cloud btn-sm relative mt-5"><Download className="h-4 w-4" aria-hidden /> Download PDF</a>
      </div>
    </div>
  );
}

function MobileNav({ menus }: { menus: Menus }) {
  const [section, setSection] = useState<string | null>(null);
  const groups: Record<string, { title?: string; items: { label: string; href: string }[] }[]> = {
    Products: [{ items: [{ label: "All products", href: "/products" }, ...menus.productMenu.map((m) => ({ label: m.title, href: m.href }))] }],
    Industries: [{ items: [{ label: "All industries", href: "/industries" }, ...menus.industryMenu.map((i) => ({ label: i.label, href: i.href }))] }],
    "About Merova": aboutMenu,
    Resources: [{ items: [{ label: "All resources", href: "/resources" }, ...resourcesMenu] }],
  };
  return (
    <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-cloud lg:hidden">
      <div className="container-x pb-32 pt-2">
        <ul className="divide-y divide-line">
          {Object.entries(groups).map(([label, cols]) => {
            const ex = section === label;
            return (
              <li key={label}>
                <button
                  type="button"
                  className="flex min-h-[3.6rem] w-full items-center justify-between text-left font-display text-[1.2rem] font-semibold text-char-900"
                  aria-expanded={ex}
                  onClick={() => setSection(ex ? null : label)}
                >
                  {label}
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${ex ? "rotate-180 text-red-500" : ""}`} aria-hidden />
                </button>
                {ex && (
                  <div className="reveal mb-4 grid gap-4 border-l-2 border-red-500 pl-4">
                    {cols.map((c, n) => (
                      <div key={n}>
                        {c.title && <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-red-600">{c.title}</p>}
                        <ul>
                          {c.items.map((s) => (
                            <li key={s.href}>
                              <Link href={s.href} className="block py-2 text-[1rem] text-ink-2">{s.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
          <li>
            <Link href="/contact" className="flex min-h-[3.6rem] items-center font-display text-[1.2rem] font-semibold text-char-900">Contact</Link>
          </li>
        </ul>
        <div className="mt-6 grid gap-3">
          <Link href="/request-a-quote" className="btn btn-primary">Request a Quote <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/custom-requirement" className="btn btn-outline">Discuss a Custom Requirement</Link>
          <a href={CATALOGUE} download className="btn btn-outline"><Download className="h-4 w-4" aria-hidden /> Product Catalogue</a>
        </div>
      </div>
    </div>
  );
}

/** Red brand strip above the header (scrolls away; the header stays). */
export function BrandStrip({ phone }: { phone?: string }) {
  return (
    <div className="surface-red hidden text-[0.8rem] lg:block">
      <div className="container-x flex h-9 items-center justify-between gap-6">
        <p className="font-semibold tracking-[0.02em]">
          Packaging, Perfected. <span className="font-normal">· Engineered to Protect. Designed to Perform.</span>
        </p>
        <ul className="flex items-center gap-5 font-medium">
          <li><Link href="/resources/downloads" className="underline-offset-4 hover:underline">Downloads</Link></li>
          <li><Link href="/blog" className="underline-offset-4 hover:underline">Knowledge Centre</Link></li>
          <li><Link href="/custom-requirement" className="underline-offset-4 hover:underline">Custom Requirement</Link></li>
          {phone && <li><a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="font-semibold underline-offset-4 hover:underline">{phone}</a></li>}
        </ul>
      </div>
    </div>
  );
}
