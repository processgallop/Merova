import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, MessageCircle, Plus } from "lucide-react";
import { AddToEnquiry } from "@/components/basket/Basket";
import { JsonLd } from "@/components/seo/JsonLd";
import { categoryById, type Product } from "@/data/catalog";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site, whatsappHref } from "@/lib/site";

export function SectionHead({ eyebrow, title, intro, action, align = "left", className = "", tone = "light" }: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; action?: React.ReactNode; align?: "left" | "center"; className?: string; tone?: "light" | "dark" }) {
  return (
    <div className={`reveal flex flex-col gap-6 ${align === "center" ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between"} ${className}`}>
      <div className={align === "center" ? "max-w-3xl" : "max-w-3xl"}>
        {eyebrow && <p className={`eyebrow ${tone === "dark" ? "!text-[#ff8c80]" : ""}`}>{eyebrow}</p>}
        <h2 className={`h2 mt-4 ${tone === "dark" ? "text-white" : ""}`}>{title}</h2>
        {intro && <p className={`lede mt-5 ${align === "center" ? "mx-auto" : ""} ${tone === "dark" ? "!text-[#cfc7c0]" : ""}`}>{intro}</p>}
      </div>
      {action && <div className="flex-none">{action}</div>}
    </div>
  );
}

export function Breadcrumbs({ items, tone = "light" }: { items: { name: string; href: string }[]; tone?: "light" | "dark" }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={`text-[13px] ${tone === "dark" ? "text-white/75" : "text-stone"}`}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
              {i === all.length - 1 ? <span aria-current="page" className={tone === "dark" ? "text-white" : "text-ink"}>{it.name}</span> : <Link href={it.href} className="hover:underline">{it.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}

/** Product render with its honest label. */
export function Render({ src, alt, className = "", sizes = "(min-width: 1024px) 50vw, 100vw", priority = false, label = true, ratio = "aspect-[4/3]", imgClass = "" }: { src: string; alt: string; className?: string; sizes?: string; priority?: boolean; label?: boolean; ratio?: string; imgClass?: string }) {
  return (
    <figure className={`relative overflow-hidden bg-sand ${ratio} ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`tile-img object-cover ${imgClass}`} />
      {label && <figcaption className="absolute bottom-3 left-3 rounded-full bg-ink/55 px-2.5 py-1 text-[10.5px] font-medium tracking-wide text-white backdrop-blur-sm">3D render · sample brand</figcaption>}
    </figure>
  );
}

export function ProductTile({ p, size = "S", tone = "white", showCategory = false }: { p: Product; size?: "S" | "M" | "L" | "T"; tone?: "white" | "red" | "dark" | "sand"; showCategory?: boolean }) {
  const span = size === "L" ? "sm:col-span-2 sm:row-span-2" : size === "M" ? "sm:col-span-2" : size === "T" ? "sm:row-span-2" : "";
  const toneCls = tone === "red" ? "tile-red" : tone === "dark" ? "tile-dark" : tone === "sand" ? "tile-sand" : "";
  const dark = tone === "red" || tone === "dark";
  const cat = categoryById[p.category];
  return (
    <article className={`tile group ${toneCls} ${span}`}>
      <div className={`p-3 pb-0 ${size === "L" || size === "T" ? "flex-1" : ""}`}>
        <Render src={p.image} alt={p.imageAlt} label={false} className="h-full rounded-[20px]" ratio={size === "L" || size === "T" ? "aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[260px]" : size === "M" ? "aspect-[16/9]" : "aspect-[4/3]"} sizes={size === "L" || size === "M" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"} />
      </div>
      <div className="flex items-end gap-3 p-5">
        <div className="min-w-0 flex-1">
          <p className={`text-[11.5px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-white/70" : "text-stone"}`}>{showCategory ? cat.short : p.subcategory}</p>
          <h3 className={`mt-1.5 font-display font-semibold tracking-tight ${size === "L" ? "text-2xl lg:text-[28px]" : "text-[19px]"}`}>
            <Link href={p.url} className="after:absolute after:inset-0 after:content-['']">{p.name}</Link>
          </h3>
          {(size === "L" || size === "M" || size === "T") && <p className={`mt-2 line-clamp-2 text-[14.5px] ${dark ? "text-white/80" : "text-stone"}`}>{p.description}</p>}
          <span className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${dark ? "text-white" : "text-red"}`}>Explore <ArrowRight className="tile-arrow h-4 w-4" aria-hidden /></span>
        </div>
        <AddToEnquiry id={p.id} name={p.name} compact />
      </div>
    </article>
  );
}

export function FaqList({ faqs, className = "" }: { faqs: { q: string; a: string }[]; className?: string }) {
  if (!faqs.length) return null;
  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {faqs.map((f) => (
        <details key={f.q} className="faq group py-1">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left font-display text-[17px] font-semibold tracking-tight hover:text-red">
            {f.q}
            <span className="faq-icon grid h-8 w-8 flex-none place-items-center rounded-full border border-line"><Plus className="h-4 w-4" aria-hidden /></span>
          </summary>
          <p className="max-w-3xl pb-6 pr-12 text-[15.5px] leading-relaxed text-charcoal">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ title = "Build your packaging enquiry.", text = "Add products from any category, or describe what you need. The Merova team replies with a recommendation and a quotation.", primary = { label: "Request a Quote", href: "/request-a-quote/" }, secondary = { label: "Describe your requirement", href: "/custom-packaging/" }, waMessage }: { title?: string; text?: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string }; waMessage?: string }) {
  return (
    <section className="no-print relative overflow-hidden bg-red text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/brand/master/merova-mark-reverse-transparent.svg" alt="" aria-hidden className="pointer-events-none absolute -bottom-[30%] -right-[8%] w-[70%] max-w-[900px] opacity-[0.13]" />
      <div className="wrap relative grid gap-10 py-20 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:py-28">
        <div className="reveal">
          <p className="eyebrow !text-reverse">Start a conversation</p>
          <h2 className="h1 mt-4 text-white">{title}</h2>
          <p className="mt-5 max-w-xl text-lg text-reverse">{text}</p>
        </div>
        <div className="reveal flex flex-wrap gap-3 lg:justify-end" style={{ ["--i" as string]: 1 }}>
          <Link href={primary.href} className="btn btn-cloud btn-lg">{primary.label} <ArrowRight className="arrow h-4 w-4" /></Link>
          <Link href={secondary.href} className="btn btn-ghost-light btn-lg">{secondary.label}</Link>
          <a href={whatsappHref(waMessage)} target="_blank" rel="noopener" className="btn btn-ghost-light btn-lg"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
        </div>
      </div>
      {site.sample && <span className="sr-only">Contact details are sample data in this preview.</span>}
    </section>
  );
}

export function SampleBadge({ className = "" }: { className?: string }) {
  return <span className={`badge badge-sample ${className}`} title="Sample data for preview; to be replaced with Merova-verified information">Sample data</span>;
}

export function PageHero({ eyebrow, title, intro, crumbs, image, imageAlt, children, tone = "cloud" }: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; crumbs: { name: string; href: string }[]; image?: string; imageAlt?: string; children?: React.ReactNode; tone?: "cloud" | "red" | "dark" }) {
  const dark = tone !== "cloud";
  return (
    <section className={`relative overflow-hidden ${tone === "red" ? "bg-red text-white" : tone === "dark" ? "bg-graphite text-white" : "bg-cloud"}`}>
      {tone === "red" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/assets/brand/master/merova-mark-reverse-transparent.svg" alt="" aria-hidden className="pointer-events-none absolute -right-[10%] -top-[10%] w-[60%] max-w-[760px] opacity-[0.12]" />
      )}
      <div className={`wrap relative grid gap-10 pb-14 pt-8 lg:pb-20 lg:pt-10 ${image ? "lg:grid-cols-[1.05fr_1fr] lg:items-center" : ""}`}>
        <div>
          <Breadcrumbs items={crumbs} tone={dark ? "dark" : "light"} />
          <div className="rise mt-10 lg:mt-14">
            {eyebrow && <p className={`eyebrow ${dark ? "!text-reverse" : ""}`} style={{ ["--i" as string]: 0 }}>{eyebrow}</p>}
            <h1 className={`h1 mt-4 ${dark ? "text-white" : ""}`} style={{ ["--i" as string]: 1 }}>{title}</h1>
            {intro && <p className={`lede mt-6 ${dark ? "!text-reverse" : ""}`} style={{ ["--i" as string]: 2 }}>{intro}</p>}
            {children && <div className="mt-8 flex flex-wrap gap-3" style={{ ["--i" as string]: 3 }}>{children}</div>}
          </div>
        </div>
        {image && <div className="reveal-img"><Render src={image} alt={imageAlt ?? ""} priority className="rounded-[28px]" sizes="(min-width: 1024px) 48vw, 100vw" /></div>}
      </div>
    </section>
  );
}
