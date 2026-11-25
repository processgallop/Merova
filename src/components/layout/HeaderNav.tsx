"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Download, Menu, X } from "lucide-react";
import type { ImageRef, NavItem } from "@/db/types";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/track";

export interface MegaData {
  segments: { code: string; name: string; navName: string; intro: string; href: string; image: ImageRef | null; count: number; families: { name: string; products: { name: string; href: string }[] }[] }[];
  sectors: { name: string; industries: { name: string; href: string; icon: string }[] }[];
  otherIndustry: string;
  profileHref: string;
  catalogueHref: string;
}

export function HeaderNav({ nav, data, logo }: { nav: NavItem[]; data: MegaData; logo?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Close menus whenever the route changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const enter = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-50 transition-[background,box-shadow] duration-300 ${scrolled || open ? "bg-cloud/95 shadow-[0_1px_0_var(--c-border)] backdrop-blur-md" : "bg-cloud"}`} onMouseLeave={leave}>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="wrap flex h-[var(--header-h)] items-center gap-6">
        <Link href="/" className="flex-none" aria-label="Merova Printpack — home">
          <Logo height={30} src={logo && !logo.endsWith("merova-logo-primary.svg") ? logo : undefined} />
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const hasMega = Boolean(item.mega);
              const isOpen = open === item.id;
              return (
                <li key={item.id} onMouseEnter={() => (hasMega ? enter(item.id) : setOpen(null))}>
                  {hasMega ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`mega-${item.id}`}
                      onClick={() => setOpen(isOpen ? null : item.id)}
                      className={`group relative flex h-11 items-center gap-1.5 px-3.5 text-[15px] font-semibold transition-colors ${isOpen || active(item.href) ? "text-red" : "text-heading hover:text-red"}`}
                    >
                      {item.label}
                      <ChevronDown className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden />
                      <span className={`absolute inset-x-3.5 -bottom-[17px] h-[2px] origin-left bg-red transition-transform duration-300 ${isOpen ? "scale-x-100" : "scale-x-0"}`} />
                    </button>
                  ) : (
                    <Link href={item.href} className={`flex h-11 items-center px-3.5 text-[15px] font-semibold transition-colors ${active(item.href) ? "text-red" : "text-heading hover:text-red"}`}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <Link href="/request-a-quote" onClick={() => track("cta_click", { cta: "header_quote" })} className="btn btn-sm ml-auto hidden sm:inline-flex lg:ml-4">
          <span>Request a Quote</span>
          <ArrowRight className="btn-arrow size-4" aria-hidden />
        </Link>
        <button type="button" className="-mr-2 ml-auto flex size-11 items-center justify-center text-heading sm:ml-0 lg:hidden" aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile} aria-controls="mobile-nav" onClick={() => setMobile((v) => !v)}>
          {mobile ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Desktop mega panels */}
      {nav.filter((n) => n.mega).map((item) => (
        <div
          key={item.id}
          id={`mega-${item.id}`}
          onMouseEnter={() => enter(item.id)}
          className={`absolute inset-x-0 top-full hidden border-t border-line bg-cloud shadow-[0_30px_60px_-30px_rgb(31_27_27/0.35)] transition-[opacity,transform,visibility] duration-300 lg:block ${open === item.id ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
        >
          <div className="wrap py-10">
            {item.mega === "products" ? <ProductsMega data={data} /> : null}
            {item.mega === "industries" ? <IndustriesMega data={data} /> : null}
            {item.mega === "about" ? <GroupMega item={item} side={<ProfileCard href={data.profileHref} />} /> : null}
            {item.mega === "resources" ? <ResourcesMega item={item} catalogue={data.catalogueHref} /> : null}
          </div>
        </div>
      ))}

      {/* Mobile drawer */}
      <div id="mobile-nav" className={`fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-cloud transition-[opacity,visibility] duration-300 lg:hidden ${mobile ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="wrap pb-16 pt-4">
          <ul className="divide-y divide-line border-b border-line">
            {nav.map((item) => (
              <li key={item.id}>
                {item.mega ? (
                  <details className="group">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-display text-xl font-bold text-heading [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <div className="pb-5">
                      <MobileGroup item={item} data={data} />
                    </div>
                  </details>
                ) : (
                  <Link href={item.href} className="flex min-h-14 items-center font-display text-xl font-bold text-heading">{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <Link href="/request-a-quote" className="btn w-full"><span>Request a Quote</span><ArrowRight className="size-4" /></Link>
            <Link href="/custom-requirement" className="btn btn-outline w-full"><span>Discuss a Custom Requirement</span></Link>
            <Link href="/contact" className="btn btn-outline w-full"><span>Speak With Our Team</span></Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function ProductsMega({ data }: { data: MegaData }) {
  const [i, setI] = useState(0);
  const seg = data.segments[i];
  if (!seg) return null;
  return (
    <div className="grid grid-cols-12 gap-10">
      <ul className="col-span-3 space-y-1 border-r border-line pr-6" role="list">
        {data.segments.map((s, idx) => (
          <li key={s.href}>
            <Link
              href={s.href}
              onMouseEnter={() => setI(idx)}
              onFocus={() => setI(idx)}
              className={`group flex items-center gap-4 px-3 py-3 transition-colors ${idx === i ? "bg-surface text-red" : "text-heading hover:text-red"}`}
            >
              <span className={`index-num text-2xl ${idx === i ? "text-red" : "text-line"}`}>{s.code}</span>
              <span className="flex-1 text-[15px] font-semibold leading-tight">{s.navName}</span>
              <span className="text-xs text-muted">{s.count}</span>
            </Link>
          </li>
        ))}
        <li className="pt-4">
          <Link href="/products" className="link link-red px-3 text-sm">All products <ArrowRight className="size-4" /></Link>
        </li>
      </ul>
      <div className="col-span-6 grid grid-cols-2 gap-x-8 gap-y-6 content-start">
        {seg.families.map((f) => (
          <div key={f.name}>
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{f.name}</p>
            <ul className="space-y-1.5">
              {f.products.slice(0, 6).map((p) => (
                <li key={p.href}><Link href={p.href} className="text-[15px] text-heading transition-colors hover:text-red">{p.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link href={seg.href} className="group col-span-3 block bg-surface">
        <div className="img-zoom relative aspect-[4/3] bg-paper">{seg.image ? <img src={seg.image.url} alt="" className="absolute inset-0 size-full object-cover" /> : null}</div>
        <div className="p-5">
          <p className="font-display text-lg font-bold text-heading">{seg.name}</p>
          <p className="mt-1.5 line-clamp-3 text-sm">{seg.intro}</p>
          <span className="link link-red mt-3 text-sm">Explore segment <ArrowRight className="size-4" /></span>
        </div>
      </Link>
    </div>
  );
}

function IndustriesMega({ data }: { data: MegaData }) {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-9 grid grid-cols-3 gap-x-8 gap-y-8">
        {data.sectors.map((s) => (
          <div key={s.name}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{s.name}</p>
            <ul className="space-y-1">
              {s.industries.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="group flex items-center gap-3 py-1.5 text-[15px] text-heading transition-colors hover:text-red">
                    <Icon name={i.icon} className="size-4 text-muted transition-colors group-hover:text-red" />
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="col-span-3 flex flex-col gap-3">
        <Link href="/industries" className="surface-red group relative block overflow-hidden p-6">
          <p className="font-display text-xl font-bold text-white">What can Merova do for your industry?</p>
          <p className="mt-2 text-sm text-white/80">Select your industry and see relevant packaging across all five segments.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">Open industry finder <ArrowRight className="btn-arrow size-4 transition-transform group-hover:translate-x-1" /></span>
        </Link>
        <Link href={data.otherIndustry} className="block border border-line bg-surface p-5 transition-colors hover:border-heading">
          <p className="font-semibold text-heading">Industry not listed?</p>
          <p className="mt-1 text-sm">Start with what you need to pack.</p>
        </Link>
      </div>
    </div>
  );
}

function GroupMega({ item, side }: { item: NavItem; side?: React.ReactNode }) {
  const groups = [...new Set((item.children ?? []).filter((c) => c.enabled).map((c) => c.group || ""))];
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-9 grid grid-cols-3 gap-8">
        {groups.map((g) => (
          <div key={g}>
            {g ? <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{g}</p> : null}
            <ul className="space-y-1">
              {(item.children ?? []).filter((c) => c.enabled && (c.group || "") === g).map((c) => (
                <li key={c.id}><Link href={c.href} className="block py-1.5 text-[15px] text-heading transition-colors hover:text-red">{c.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="col-span-3">{side}</div>
    </div>
  );
}

function ProfileCard({ href }: { href: string }) {
  return (
    <a href={href} className="surface-ink group block p-6" onClick={() => track("download", { file: "company_profile", location: "mega_menu" })}>
      <Download className="size-5 text-red" aria-hidden />
      <p className="mt-4 font-display text-lg font-bold text-white">Company Profile</p>
      <p className="mt-1 text-sm text-white/70">Positioning, process and portfolio in one PDF.</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">Download <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
    </a>
  );
}

function ResourcesMega({ item, catalogue }: { item: NavItem; catalogue: string }) {
  return (
    <div className="grid grid-cols-12 gap-10">
      <ul className="col-span-9 grid grid-cols-3 gap-px bg-line">
        {(item.children ?? []).filter((c) => c.enabled).map((c) => (
          <li key={c.id} className="bg-cloud">
            <Link href={c.href} className="group block h-full p-5 transition-colors hover:bg-surface">
              <p className="flex items-center justify-between font-semibold text-heading group-hover:text-red">{c.label}<ArrowRight className="size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" /></p>
              {c.description ? <p className="mt-1.5 text-sm">{c.description}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
      <div className="col-span-3">
        <a href={catalogue} className="surface-red group block p-6" onClick={() => track("download", { file: "catalogue", location: "mega_menu" })}>
          <Download className="size-5" aria-hidden />
          <p className="mt-4 font-display text-lg font-bold text-white">Product Catalogue</p>
          <p className="mt-1 text-sm text-white/80">Every segment, family and product.</p>
        </a>
      </div>
    </div>
  );
}

function MobileGroup({ item, data }: { item: NavItem; data: MegaData }) {
  if (item.mega === "products")
    return (
      <ul className="space-y-1">
        {data.segments.map((s) => (
          <li key={s.href}><Link href={s.href} className="flex min-h-11 items-center gap-3 text-heading"><span className="index-num w-6 text-red">{s.code}</span>{s.name}</Link></li>
        ))}
        <li><Link href="/products" className="flex min-h-11 items-center font-semibold text-red">All products →</Link></li>
      </ul>
    );
  if (item.mega === "industries")
    return (
      <div className="space-y-5">
        {data.sectors.map((s) => (
          <div key={s.name}>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{s.name}</p>
            <ul className="mt-1">
              {s.industries.map((i) => (
                <li key={i.href}><Link href={i.href} className="flex min-h-11 items-center gap-3 text-heading"><Icon name={i.icon} className="size-4 text-red" />{i.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <Link href="/industries" className="flex min-h-11 items-center font-semibold text-red">Open the industry finder →</Link>
      </div>
    );
  return (
    <ul>
      <li><Link href={item.href} className="flex min-h-11 items-center font-semibold text-heading">{item.label} overview</Link></li>
      {(item.children ?? []).filter((c) => c.enabled).map((c) => (
        <li key={c.id}><Link href={c.href} className="flex min-h-11 items-center text-heading">{c.label}</Link></li>
      ))}
    </ul>
  );
}
