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
                <Link href={it.href} className="hover:text-navy-900 hover:underline">{it.name}</Link>
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
    <div className={`flex flex-col gap-5 ${action ? "md:flex-row md:items-end md:justify-between" : ""} ${align === "center" ? "items-center text-center" : ""}`}>
      <div className={align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"}>
        {eyebrow && <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>}
        <As className={`${As === "h1" ? "t-1" : "t-2"} mt-3 ${light ? "!text-white" : ""}`}>{title}</As>
        {intro && <p className={`lede mt-4 ${light ? "!text-white/75" : ""}`}>{intro}</p>}
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
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-left font-display text-[1.02rem] font-semibold text-navy-950 [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus className="mt-1 h-4 w-4 shrink-0 transition-transform group-open:rotate-45" aria-hidden />
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
    <section className="bg-navy-900 text-white">
      <div className="container-x grid-bg grid gap-8 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-20">
        <div>
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h2 className="t-2 mt-3 !text-white">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
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
      <div className="grid gap-6 rounded-md border border-line bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
        <div>
          <p className="eyebrow">Have a different packaging requirement?</p>
          <h2 className="t-3 mt-2">Tell us what you are looking for.</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-2">
            Share your specifications, drawings, photographs or sample requirements. Our team will assess your application and help identify the appropriate packaging solution.
          </p>
        </div>
        <Link href={href} className="btn btn-navy">Discuss Your Custom Requirement <ArrowRight className="h-4 w-4" aria-hidden /></Link>
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
    <section className="border-b border-line bg-paper">
      <div className={`container-x grid gap-10 py-10 lg:py-14 ${image ? "lg:grid-cols-[1.15fr_1fr] lg:items-center" : ""}`}>
        <div>
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow mt-8">{eyebrow}</p>
          <h1 className="t-1 mt-3 max-w-4xl">{title}</h1>
          <p className="lede mt-5 max-w-3xl">{intro}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {image && <Media image={image} sizes="(min-width:1024px) 45vw, 100vw" priority className="rounded-md" />}
      </div>
    </section>
  );
}

export function Pending({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded border border-[#efd9a6] bg-[#fff8e8] px-3 py-2 text-[0.85rem] leading-relaxed text-[#6b4a00]">
      <span className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em]">Awaiting confirmation</span>
      <span>{children}</span>
    </p>
  );
}
