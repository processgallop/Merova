"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BasketCount } from "@/components/basket/Basket";

export interface NavData {
  categories: { id: string; name: string; short: string; url: string; promise: string; image: string; count: number; accent: string; subs: { name: string; url: string }[] }[];
  industries: { name: string; url: string; image: string; ops: { name: string; url: string }[] }[];
  totalProducts: number;
}

const ABOUT = [
  ["Company overview", "/about/", "Who we are and how we work"],
  ["Manufacturing & infrastructure", "/about/manufacturing/", "Processes, equipment and plant"],
  ["Quality assurance", "/about/quality/", "Checks from material to dispatch"],
  ["Process excellence", "/about/process/", "From requirement to delivery"],
  ["Client servicing", "/about/client-servicing/", "How enquiries and orders are run"],
  ["Sustainability", "/about/sustainability/", "Materials, stated precisely"],
  ["Leadership & team", "/about/leadership/", "The functions behind every order"],
  ["Careers", "/about/careers/", "Work with us"],
  ["Business partnerships", "/about/partnerships/", "Suppliers and partners"],
] as const;
const RESOURCES = [
  ["Download centre", "/resources/downloads/", "Catalogue, brochures, flyers, profile"],
  ["Technical resources", "/resources/technical/", "Guides to materials and specs"],
  ["FAQs", "/resources/faqs/", "Answers by topic"],
  ["Insights", "/insights/", "Buyer guides and articles"],
] as const;

type Panel = "products" | "industries" | "about" | "resources" | null;

export function Header({ nav }: { nav: NavData }) {
  const [open, setOpen] = useState<Panel>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ind, setInd] = useState(0);
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setOpen(null); setMobile(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : ""; }, [mobile]);

  const enter = (p: Panel) => { if (timer.current) clearTimeout(timer.current); setOpen(p); };
  const leave = () => { timer.current = setTimeout(() => setOpen(null), 140); };
  const openSearch = () => window.dispatchEvent(new Event("merova:search"));
  const active = (prefix: string) => pathname.startsWith(prefix);

  const Trigger = ({ id, label, prefix }: { id: Exclude<Panel, null>; label: string; prefix: string }) => (
    <button type="button" aria-expanded={open === id} aria-controls={`panel-${id}`} onClick={() => setOpen(open === id ? null : id)} onMouseEnter={() => enter(id)} onMouseLeave={leave}
      className={`group relative flex h-11 items-center gap-1.5 rounded-full px-4 text-[15px] font-medium transition-colors ${open === id || active(prefix) ? "text-red" : "text-charcoal hover:text-ink"}`}>
      {label}<ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open === id ? "rotate-180" : ""}`} aria-hidden />
      <span className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-red transition-transform duration-300 ${open === id || active(prefix) ? "scale-x-100" : "scale-x-0"}`} />
    </button>
  );

  return (
    <header className={`no-print sticky top-0 z-50 transition-shadow duration-300 ${scrolled || open ? "shadow-[0_1px_0_var(--color-line),0_12px_32px_-24px_rgb(42_38_38/0.4)]" : ""}`} style={{ background: "var(--color-cloud)" }} onMouseLeave={leave}>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="wrap wrap-wide flex h-[76px] items-center gap-4">
        <Link href="/" aria-label="Merova Printpack home" className="flex-none"><Logo height={46} /></Link>
        <nav aria-label="Main" className="ml-6 hidden items-center lg:flex">
          <Trigger id="products" label="Products" prefix="/products" />
          <Trigger id="industries" label="Industries" prefix="/industries" />
          <Trigger id="about" label="About Merova" prefix="/about" />
          <Trigger id="resources" label="Resources" prefix="/resources" />
          <Link href="/contact/" className={`flex h-11 items-center rounded-full px-4 text-[15px] font-medium ${active("/contact") ? "text-red" : "text-charcoal hover:text-ink"}`}>Contact</Link>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={openSearch} className="icon-btn" aria-label="Search products (Ctrl K)"><Search className="h-5 w-5" aria-hidden /></button>
          <Link href="/request-a-quote/" className="icon-btn relative" aria-label="Your enquiry basket"><ShoppingBag className="h-5 w-5" aria-hidden /><BasketCount /></Link>
          <Link href="/request-a-quote/" className="btn btn-primary btn-sm ml-2 hidden sm:inline-flex">Request a Quote <ArrowRight className="arrow h-4 w-4" aria-hidden /></Link>
          <button type="button" className="icon-btn lg:hidden" aria-label="Open menu" aria-expanded={mobile} onClick={() => setMobile(true)}><Menu className="h-6 w-6" aria-hidden /></button>
        </div>
      </div>

      {/* Desktop panels */}
      {open && (
        <div className="absolute inset-x-0 top-full hidden lg:block" onMouseEnter={() => enter(open)} onMouseLeave={leave}>
          <div className="fade-in border-t border-line bg-cloud shadow-[0_40px_80px_-40px_rgb(42_38_38/0.45)]">
            {open === "products" && (
              <div id="panel-products" className="wrap wrap-wide py-8">
                <div className="grid grid-cols-4 gap-5">
                  {nav.categories.map((c, i) => (
                    <div key={c.id} className="fade-in group" style={{ animationDelay: `${i * 40}ms` }}>
                      <Link href={c.url} className="block overflow-hidden rounded-[20px] bg-sand">
                        <Image src={c.image} alt="" width={640} height={480} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" sizes="22vw" />
                      </Link>
                      <div className="mt-4 flex items-center gap-2"><span className="mat-dot" style={{ ["--mat" as string]: c.accent }} /><Link href={c.url} className="h4 hover:text-red">{c.name}</Link></div>
                      <p className="mt-1 text-sm text-stone">{c.promise} <span className="tnum">· {c.count} products</span></p>
                      <ul className="mt-3 grid gap-1.5">
                        {c.subs.map((s) => <li key={s.url}><Link href={s.url} className="text-[14px] text-charcoal hover:text-red">{s.name}</Link></li>)}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-line pt-5 text-sm">
                  <Link href="/products/" className="link-arrow">View all {nav.totalProducts} products <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/custom-packaging/" className="text-charcoal hover:text-red">Not sure what you need? <span className="font-semibold">Describe your requirement →</span></Link>
                </div>
              </div>
            )}
            {open === "industries" && (
              <div id="panel-industries" className="wrap wrap-wide grid grid-cols-[280px_1fr] gap-8 py-8">
                <ul className="grid content-start gap-1 border-r border-line pr-6">
                  {nav.industries.map((d, i) => (
                    <li key={d.url}>
                      <Link href={d.url} onMouseEnter={() => setInd(i)} onFocus={() => setInd(i)} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${ind === i ? "bg-white text-red shadow-[var(--shadow-rest)]" : "text-charcoal hover:text-ink"}`}>
                        {d.name}<ArrowRight className={`h-4 w-4 transition-opacity ${ind === i ? "opacity-100" : "opacity-0"}`} />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div key={ind} className="fade-in grid grid-cols-[1fr_320px] gap-8">
                  <div>
                    <p className="eyebrow">{nav.industries[ind].name}</p>
                    <ul className="mt-4 grid grid-cols-2 gap-3">
                      {nav.industries[ind].ops.map((o) => (
                        <li key={o.url}><Link href={o.url} className="group flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3.5 text-[15px] font-medium hover:border-ink">{o.name}<ArrowRight className="h-4 w-4 text-red transition-transform group-hover:translate-x-1" /></Link></li>
                      ))}
                    </ul>
                  </div>
                  <Link href={nav.industries[ind].url} className="group overflow-hidden rounded-[20px] bg-sand">
                    <Image src={nav.industries[ind].image} alt="" width={640} height={480} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" sizes="320px" />
                    <span className="block p-4 text-sm font-semibold text-ink">Explore {nav.industries[ind].name} →</span>
                  </Link>
                </div>
              </div>
            )}
            {(open === "about" || open === "resources") && (
              <div id={`panel-${open}`} className="wrap wrap-wide py-8">
                <ul className="grid grid-cols-3 gap-3">
                  {(open === "about" ? ABOUT : RESOURCES).map(([t, u, d]) => (
                    <li key={u}><Link href={u} className="group block rounded-2xl border border-transparent p-4 hover:border-line hover:bg-white"><span className="flex items-center gap-2 font-semibold text-ink group-hover:text-red">{t}<ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" /></span><span className="mt-1 block text-sm text-stone">{d}</span></Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile sheet */}
      {mobile && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobile(false)} />
          <div className="pop-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cloud">
            <div className="flex h-[76px] items-center justify-between px-4"><Logo height={40} /><button type="button" className="icon-btn" aria-label="Close menu" onClick={() => setMobile(false)}><X className="h-6 w-6" /></button></div>
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <MobileGroup title="Products">
                {nav.categories.map((c) => (
                  <details key={c.id} className="border-b border-line py-1">
                    <summary className="flex cursor-pointer items-center gap-2 py-3 font-medium"><span className="mat-dot" style={{ ["--mat" as string]: c.accent }} />{c.name}<ChevronDown className="ml-auto h-4 w-4" /></summary>
                    <ul className="grid gap-2 pb-3 pl-4">
                      <li><Link href={c.url} className="text-sm font-semibold text-red">All {c.short} ({c.count})</Link></li>
                      {c.subs.map((s) => <li key={s.url}><Link href={s.url} className="text-sm text-charcoal">{s.name}</Link></li>)}
                    </ul>
                  </details>
                ))}
              </MobileGroup>
              <MobileGroup title="Industries">
                {nav.industries.map((d) => (
                  <details key={d.url} className="border-b border-line py-1">
                    <summary className="flex cursor-pointer items-center py-3 font-medium">{d.name}<ChevronDown className="ml-auto h-4 w-4" /></summary>
                    <ul className="grid gap-2 pb-3 pl-4"><li><Link href={d.url} className="text-sm font-semibold text-red">Overview</Link></li>{d.ops.map((o) => <li key={o.url}><Link href={o.url} className="text-sm text-charcoal">{o.name}</Link></li>)}</ul>
                  </details>
                ))}
              </MobileGroup>
              <MobileGroup title="About Merova">{ABOUT.map(([t, u]) => <Link key={u} href={u} className="block border-b border-line py-3 font-medium">{t}</Link>)}</MobileGroup>
              <MobileGroup title="Resources">{RESOURCES.map(([t, u]) => <Link key={u} href={u} className="block border-b border-line py-3 font-medium">{t}</Link>)}</MobileGroup>
              <Link href="/contact/" className="mt-6 block font-display text-2xl font-semibold">Contact</Link>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-line p-4" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
              <button type="button" className="btn btn-outline" onClick={() => { setMobile(false); openSearch(); }}><Search className="h-4 w-4" /> Search</button>
              <Link href="/request-a-quote/" className="btn btn-primary">Request a Quote</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mt-6"><p className="eyebrow mb-1">{title}</p>{children}</div>;
}
