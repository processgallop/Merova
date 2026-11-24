import Link from "next/link";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import type { Faq, ProductImage } from "@/data/types";
import { Media } from "./Media";
export { Media };

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[0.82rem] text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-ink-2">{it.name}</span>
              ) : (
                <Link href={it.href} className="hover:text-red-600 hover:underline underline-offset-4">{it.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: As = "h2",
  light = false,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  light?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className={`rise flex flex-col gap-5 ${action ? "md:flex-row md:items-end md:justify-between" : ""} ${align === "center" ? "items-center text-center" : ""}`}>
      <div className={align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"}>
        {eyebrow && <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>}
        <As className={`${As === "h1" ? "t-1" : "t-2"} mt-4 ${light ? "!text-cloud" : ""}`}>{title}</As>
        {intro && <p className={`lede mt-5 ${light ? "!text-cloud" : ""}`}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function FaqList({ faqs, schema = true }: { faqs: Faq[]; schema?: boolean }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-left font-display text-[1.02rem] font-semibold text-char-950 [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-char-200 transition-colors group-open:border-red-500 group-open:bg-red-500 group-open:text-white">
              <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-45" aria-hidden />
            </span>
          </summary>
          <p className="pb-5 pr-10 leading-relaxed text-ink-2">{f.a}</p>
        </details>
      ))}
      {schema && <JsonLd data={faqJsonLd(faqs)} />}
    </div>
  );
}

export function CtaBand({
  eyebrow = "Start your project",
  title,
  text,
  primary = { label: "Request a Quote", href: "/request-a-quote" },
  secondary = { label: "Speak With Our Team", href: "/contact" },
}: {
  eyebrow?: string;
  title: string;
  text: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="surface-charcoal relative overflow-hidden border-t-4 border-red-500">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/brand/merova-mark-red.svg" alt="" aria-hidden="true" className="glyph-watermark -right-16 -top-10 w-[38rem] max-w-none !opacity-20" />
      <div className="container-x relative grid gap-8 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-24">
        <div className="rise">
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h2 className="t-2 mt-4">{title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed">{text}</p>
        </div>
        <div className="rise flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href={primary.href} className="btn btn-primary">{primary.label} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href={secondary.href} className="btn btn-ghost-light">{secondary.label}</Link>
        </div>
      </div>
    </section>
  );
}

export function CustomRequirementBand({ context, industry, product }: { context?: string; industry?: string; product?: string }) {
  const q = new URLSearchParams();
  if (industry) q.set("industry", industry);
  if (product) q.set("product", product);
  if (context && !industry && !product) q.set("context", context);
  const href = q.size ? `/custom-requirement?${q}` : "/custom-requirement";
  return (
    <section className="container-x py-14 lg:py-16">
      <div className="rise relative grid gap-6 overflow-hidden rounded-sm border border-line border-l-4 border-l-red-500 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
        <div>
          <p className="eyebrow">Have a different packaging requirement?</p>
          <h2 className="t-3 mt-2">Tell us what you are looking for.</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-2">
            Share your specifications, drawings, photographs or sample requirements. Our team will assess your application and help identify the appropriate packaging solution.
          </p>
        </div>
        <Link href={href} className="btn btn-primary">Discuss Your Custom Requirement <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
  image,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  crumbs: { name: string; href: string }[];
  children?: ReactNode;
  image?: ProductImage;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-red-500" aria-hidden />
      <div className={`container-x grid gap-10 py-12 lg:py-16 ${image ? "lg:grid-cols-[1.1fr_1fr] lg:items-center" : ""}`}>
        <div className="reveal">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow mt-9">{eyebrow}</p>
          <h1 className="t-1 mt-4 max-w-4xl">{title}</h1>
          <p className="lede mt-6 max-w-3xl">{intro}</p>
          {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
        </div>
        {image && (
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 left-10 top-10 hidden bg-red-500 lg:block" aria-hidden />
            <Media image={image} sizes="(min-width:1024px) 45vw, 100vw" priority className="relative rounded-sm" />
          </div>
        )}
      </div>
    </section>
  );
}

export function Pending({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-3 rounded-sm border border-dashed border-char-300 bg-white px-4 py-3 text-[0.88rem] leading-relaxed text-ink-2">
      <span className="mt-0.5 shrink-0 rounded-sm bg-char-100 px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-char-700">Awaiting confirmation</span>
      <span>{children}</span>
    </p>
  );
}
