/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, FileText, Play } from "lucide-react";
import type { CSSProperties } from "react";
import type { ImageRef, Section } from "@/db/types";
import { Emblem } from "@/components/brand/Logo";
import { Btn, Faqs, List, SectionHead } from "@/components/ui/blocks";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { Discovery } from "@/components/industry/Discovery";
import { ProductCard } from "@/components/product/ProductCard";
import { ContactForm } from "@/components/forms/ContactForm";
import { getCatalog, getPostCategories, getPosts, getResources, industryUrl, postUrl, segmentUrl } from "@/lib/content";
import { getDiscoveryData } from "@/lib/discovery";

type D = Section["data"];
const d = (n: number) => ({ "--d": n }) as CSSProperties;
const link = (x: unknown): { label: string; href: string } | null => {
  const v = x as { label?: string; href?: string } | undefined;
  return v?.label && v?.href ? { label: v.label, href: v.href } : null;
};

export async function Sections({ sections, crumbs }: { sections: Section[]; crumbs?: React.ReactNode }) {
  const live = sections.filter((s) => s.enabled);
  const out = await Promise.all(live.map((s, i) => renderSection(s, i, i === 0 ? crumbs : undefined)));
  return <>{out}</>;
}

async function renderSection(s: Section, i: number, crumbs?: React.ReactNode) {
  const k = s.id;
  const data = s.data;
  switch (s.type) {
    case "hero":
      return data.variant === "brand" ? <BrandHero key={k} data={data} /> : <PageHero key={k} data={data} crumbs={crumbs} />;
    case "statement":
      return <Statement key={k} data={data} index={i} />;
    case "richText":
      return (
        <section key={k} className="section-tight">
          <div className="wrap"><div className="mx-auto max-w-3xl"><RichText text={data.body ?? ""} /></div></div>
        </section>
      );
    case "split":
      return <Split key={k} data={data} />;
    case "features":
      return <Features key={k} data={data} />;
    case "steps":
      return <Steps key={k} data={data} />;
    case "stats": {
      const items = ((data.items ?? []) as { value: string; label: string; verified?: boolean }[]).filter((x) => x.verified);
      if (!items.length) return null; // statistics are shown only when marked verified
      return (
        <section key={k} className="section-tight border-y border-line">
          <div className="wrap">
            {data.heading ? <p className="eyebrow mb-8">{data.heading}</p> : null}
            <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {items.map((x, j) => (
                <div key={j} data-reveal style={d(j)}>
                  <dt className="order-2 mt-2 text-sm">{x.label}</dt>
                  <dd className="index-num text-[clamp(2.4rem,5vw,4rem)] leading-none text-red">{x.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      );
    }
    case "gallery": {
      const imgs = (data.images ?? []) as ImageRef[];
      if (!imgs.length) return null;
      return (
        <section key={k} className="section-tight">
          <div className="wrap">
            {data.heading ? <SectionHead title={data.heading} className="mb-10" /> : null}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {imgs.map((im, j) => (
                <Img key={j} image={im} className={`overflow-hidden ${j % 5 === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"}`} caption="overlay" sizes="(min-width:768px) 33vw, 50vw" />
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "segmentShowcase":
      return <SegmentShowcase key={k} data={data} />;
    case "industryDiscovery": {
      const dd = await getDiscoveryData();
      return (
        <section key={k} id="industry-finder" className="section surface-paper">
          <div className="wrap">
            <SectionHead align="split" eyebrow={data.eyebrow} title={data.heading} intro={data.intro} />
            <div className="mt-12"><Discovery data={dd} mode="home" /></div>
          </div>
        </section>
      );
    }
    case "productGrid":
      return <ProductGrid key={k} data={data} />;
    case "industryGrid":
      return <IndustryGrid key={k} data={data} />;
    case "testimonials": {
      const items = ((data.items ?? []) as { quote: string; name: string; role?: string; company?: string; approved?: boolean }[]).filter((x) => x.approved);
      if (!items.length) return null; // only verified, approved testimonials are published
      return (
        <section key={k} className="section">
          <div className="wrap">
            {data.heading ? <SectionHead title={data.heading} className="mb-12" /> : null}
            <div className="grid gap-6 md:grid-cols-2">
              {items.map((t, j) => (
                <figure key={j} className="border-l-2 border-red pl-6" data-reveal style={d(j)}>
                  <blockquote className="font-display text-xl font-semibold leading-snug text-heading">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm">{t.name}{t.role ? `, ${t.role}` : ""}{t.company ? ` — ${t.company}` : ""}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "logos": {
      const items = ((data.items ?? []) as { name: string; image?: ImageRef; authorised?: boolean }[]).filter((x) => x.authorised && x.image);
      if (!items.length) return null; // client logos only with written authorisation
      return (
        <section key={k} className="section-tight">
          <div className="wrap">
            {data.heading ? <p className="eyebrow mb-8">{data.heading}</p> : null}
            <ul className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-6">
              {items.map((l, j) => <li key={j}><img src={l.image!.url} alt={l.name} className="mx-auto max-h-12 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" /></li>)}
            </ul>
          </div>
        </section>
      );
    }
    case "faq":
      return (
        <section key={k} className="section">
          <div className="wrap grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4"><SectionHead eyebrow={data.eyebrow ?? "FAQs"} title={data.heading ?? "Frequently asked questions"} /></div>
            <div className="lg:col-span-8"><Faqs items={data.items ?? []} /></div>
          </div>
        </section>
      );
    case "video": {
      const url = String(data.url ?? "");
      const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)?.[1];
      const vimeo = url.match(/vimeo\.com\/(\d+)/)?.[1];
      const src = yt ? `https://www.youtube-nocookie.com/embed/${yt}` : vimeo ? `https://player.vimeo.com/video/${vimeo}` : null;
      if (!src && !url.endsWith(".mp4")) return null;
      return (
        <section key={k} className="section-tight">
          <div className="wrap">
            {data.heading ? <SectionHead title={data.heading} className="mb-8" /> : null}
            <div className="relative aspect-video overflow-hidden bg-ink">
              {src ? <iframe src={src} title={data.heading || "Video"} className="absolute inset-0 size-full" allow="encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /> : <video src={url} controls className="absolute inset-0 size-full" preload="metadata" />}
            </div>
            {data.caption ? <p className="media-caption mt-3 flex items-center gap-2"><Play className="size-3" />{data.caption}</p> : null}
          </div>
        </section>
      );
    }
    case "downloads":
      return <Downloads key={k} data={data} />;
    case "articles":
      return <Articles key={k} data={data} />;
    case "pending":
      return <Pending key={k} data={data} />;
    case "contactForm":
      return (
        <section key={k} id="form" className="section surface-paper">
          <div className="wrap grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5"><SectionHead eyebrow="Get in touch" title={data.heading ?? "Contact us"} intro={data.intro} /></div>
            <div className="lg:col-span-7"><ContactForm defaultTopic={data.topic ?? "sales"} allowFiles={data.topic === "careers"} /></div>
          </div>
        </section>
      );
    case "cta":
      return <Cta key={k} data={data} />;
    default:
      return null;
  }
}

/* ── Heroes ───────────────────────────────────────────────────────── */

function BrandHero({ data }: { data: D }) {
  const words = String(data.heading ?? "").split(" ");
  const lines = splitLines(words);
  const p = link(data.primary);
  const s2 = link(data.secondary);
  return (
    <section className="relative overflow-hidden" data-context="">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] bg-red lg:block" aria-hidden>
        <Emblem className="absolute -left-10 bottom-10 w-[130%] max-w-none opacity-[0.13]" color="#fff" />
      </div>
      <Emblem mode="line" strokeWidth={1.5} color="var(--c-red)" className="pointer-events-none absolute -left-[14%] top-[10%] w-[96%] max-w-none opacity-40 lg:w-[72%]" />
      <div className="wrap relative grid min-h-[calc(100svh-var(--header-h))] items-center gap-10 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-7">
          {data.eyebrow ? <p className="eyebrow rise-in">{data.eyebrow}</p> : null}
          <h1 className="t-hero line-in mt-6">
            {lines.map((l, j) => (
              <span key={j}><span style={d(j)} className={j === lines.length - 1 ? "text-red" : undefined}>{l}</span></span>
            ))}
          </h1>
          {data.text ? <p className="t-lead rise-in mt-7 max-w-xl" style={d(3)}>{data.text}</p> : null}
          <div className="rise-in mt-9 flex flex-wrap gap-3" style={d(4)}>
            {p ? <Btn href={p.href} data-cta="hero_primary">{p.label}</Btn> : null}
            {s2 ? <Btn href={s2.href} variant="outline">{s2.label}</Btn> : null}
          </div>
          {Array.isArray(data.proof) && data.proof.length ? (
            <ol className="rise-in mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-sm font-semibold text-heading" style={d(5)}>
              {(data.proof as string[]).map((x, j) => (
                <li key={x} className="flex items-baseline gap-2"><span className="index-num text-red">{String.fromCharCode(65 + j)}</span>{x}</li>
              ))}
            </ol>
          ) : null}
        </div>
        <div className="relative lg:col-span-5">
          <div className="rise-in relative" style={d(2)}>
            <div className="float-slow relative aspect-[4/3] overflow-hidden bg-cloud shadow-[0_40px_80px_-30px_rgb(31_27_27/0.45)] lg:-mr-[6%] lg:aspect-[5/6]">
              <Img image={data.image} priority caption="overlay" sizes="(min-width:1024px) 45vw, 100vw" imgClassName="object-cover object-[72%_50%]" className="absolute inset-0" />
            </div>
          </div>
        </div>
      </div>
      <Marquee />
    </section>
  );
}

async function Marquee() {
  const { segments, industries } = await getCatalog();
  const items = [...segments.map((s) => s.name), ...industries.filter((i) => !i.isCatchAll).map((i) => i.shortName || i.name)];
  const row = items.map((x, j) => (
    <span key={j} className="flex items-center gap-6 whitespace-nowrap">
      <span>{x}</span>
      <Emblem className="h-3 w-auto opacity-60" color="var(--c-red)" />
    </span>
  ));
  return (
    <div className="marquee relative overflow-hidden border-y border-white/10 bg-ink py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/80" aria-hidden>
      <div className="marquee-track flex w-max gap-6">{row}{row}</div>
    </div>
  );
}

function splitLines(words: string[]) {
  // Two to three balanced lines for the display headline.
  const total = words.join(" ").length;
  const target = total > 42 ? 3 : 2;
  const per = Math.ceil(total / target);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur && (cur + " " + w).length > per && lines.length < target - 1) {
      lines.push(cur);
      cur = w;
    } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

export function PageHero({ data, crumbs }: { data: D; crumbs?: React.ReactNode }) {
  const p = link(data.primary);
  const s2 = link(data.secondary);
  if (data.variant === "minimal")
    return (
      <section className="border-b border-line pb-12 pt-10">
        <div className="wrap">
          {crumbs}
          <p className="eyebrow mt-8">{data.eyebrow}</p>
          <h1 className="t-display mt-4">{data.heading}</h1>
          {data.text ? <p className="t-lead mt-4 max-w-2xl">{data.text}</p> : null}
        </div>
      </section>
    );
  const hasImage = Boolean(data.image?.url);
  return (
    <section className="relative overflow-hidden border-b border-line">
      <Emblem className="pointer-events-none absolute -right-[10%] -top-[20%] w-[70%] max-w-none opacity-[0.05]" />
      <div className={`wrap relative grid gap-10 pb-14 pt-10 lg:pb-20 ${hasImage ? "lg:grid-cols-12 lg:items-end" : ""}`}>
        <div className={hasImage ? "lg:col-span-7" : "max-w-4xl"}>
          {crumbs}
          {data.eyebrow ? <p className="eyebrow rise-in mt-10">{data.eyebrow}</p> : null}
          <h1 className="t-display rise-in mt-5" style={d(1)}>{data.heading}</h1>
          {data.text ? <p className="t-lead rise-in mt-6 max-w-2xl" style={d(2)}>{data.text}</p> : null}
          {p || s2 ? (
            <div className="rise-in mt-8 flex flex-wrap gap-3" style={d(3)}>
              {p ? <Btn href={p.href}>{p.label}</Btn> : null}
              {s2 ? <Btn href={s2.href} variant="outline">{s2.label}</Btn> : null}
            </div>
          ) : null}
        </div>
        {hasImage ? (
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 h-2/3 w-2/3 bg-red" aria-hidden />
              <div data-reveal="mask"><Img image={data.image} priority caption="overlay" className="relative aspect-[4/3] overflow-hidden" /></div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ── Editorial blocks ─────────────────────────────────────────────── */

function Statement({ data, index }: { data: D; index: number }) {
  const cta = link(data.cta);
  return (
    <section className="section relative">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow" data-reveal><span className="opacity-60">{String(index).padStart(2, "0")}</span>{data.eyebrow}</p>
          {cta ? <div className="mt-8 hidden lg:block" data-reveal><Link href={cta.href} className="link link-red">{cta.label} <ArrowRight className="size-4" /></Link></div> : null}
        </div>
        <div className="lg:col-span-8">
          <h2 className="t-display" data-reveal>{data.heading}</h2>
          {data.text ? <p className="t-lead mt-8 max-w-3xl" data-reveal style={d(1)}>{data.text}</p> : null}
          {Array.isArray(data.points) ? (
            <div className="mt-12 grid gap-px bg-line sm:grid-cols-3">
              {(data.points as { title: string; text: string }[]).map((pt, j) => (
                <div key={j} className="bg-cloud pr-6 pt-6 sm:pt-0" data-reveal style={d(j + 2)}>
                  <div className="mb-4 h-[2px] w-10 bg-red" />
                  <p className="font-display text-lg font-bold text-heading">{pt.title}</p>
                  <p className="mt-2 text-sm leading-relaxed">{pt.text}</p>
                </div>
              ))}
            </div>
          ) : null}
          {cta ? <div className="mt-10 lg:hidden"><Link href={cta.href} className="link link-red">{cta.label} <ArrowRight className="size-4" /></Link></div> : null}
        </div>
      </div>
    </section>
  );
}

function Split({ data }: { data: D }) {
  const red = data.variant === "red";
  const cta = link(data.cta);
  const right = data.imageSide !== "left";
  return (
    <section className={red ? "surface-red relative overflow-hidden" : "section"}>
      {red ? <Emblem className="pointer-events-none absolute -bottom-24 -left-20 w-[620px] opacity-[0.1]" color="#fff" /> : null}
      <div className={`relative grid lg:grid-cols-2 ${red ? "" : "wrap gap-12 lg:items-center"}`}>
        <div className={`${right ? "" : "lg:order-2"} ${red ? "px-[var(--gutter)] py-[var(--section-y)] lg:pl-[max(var(--gutter),calc((100vw-var(--container))/2+var(--gutter)))] lg:pr-16" : ""}`}>
          {data.eyebrow ? <p className={`eyebrow ${red ? "light" : ""}`} data-reveal>{data.eyebrow}</p> : null}
          <h2 className={`t-h2 mt-5 ${red ? "text-white" : ""}`} data-reveal>{data.heading}</h2>
          {data.body ? <div data-reveal style={d(1)}><RichText text={data.body} className={`prose-m mt-6 ${red ? "!text-white/85 [&_strong]:!text-white" : ""}`} /></div> : null}
          {Array.isArray(data.bullets) && data.bullets.length ? (
            <ul className="mt-8 space-y-3" data-reveal style={d(2)}>
              {(data.bullets as string[]).map((b) => (
                <li key={b} className={`flex gap-3 ${red ? "text-white" : "text-heading"}`}><span className={`mt-[0.7em] h-[2px] w-4 flex-none ${red ? "bg-white" : "bg-red"}`} />{b}</li>
              ))}
            </ul>
          ) : null}
          {cta ? <div className="mt-10" data-reveal style={d(3)}><Btn href={cta.href} variant={red ? "light" : "primary"}>{cta.label}</Btn></div> : null}
        </div>
        <div className={`${right ? "" : "lg:order-1"} relative min-h-[320px]`}>
          <Img image={data.image} className={red ? "absolute inset-0 h-full" : "relative aspect-[4/3] overflow-hidden"} caption="overlay" />
        </div>
      </div>
    </section>
  );
}

function Features({ data }: { data: D }) {
  const items = (data.items ?? []) as { title: string; text: string; icon?: string }[];
  const cols = Number(data.columns) || 3;
  const grid = cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : cols === 2 ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  const numbered = data.variant === "numbered";
  const defs = data.variant === "definitions";
  return (
    <section className={`section ${defs ? "surface-ink on-dark" : ""}`}>
      <div className="wrap">
        {data.heading ? <SectionHead align={data.intro ? "split" : "left"} eyebrow={data.eyebrow} title={data.heading} intro={data.intro} light={defs} /> : null}
        <div className={`mt-14 grid gap-px ${defs ? "bg-white/10" : "bg-line"} ${grid}`}>
          {items.map((it, j) => (
            <div key={j} className={`group relative p-7 transition-colors duration-300 ${defs ? "bg-ink" : "bg-cloud hover:bg-surface"}`} data-reveal style={d(j % cols)}>
              {numbered ? <p className="index-num text-[2.6rem] leading-none text-line transition-colors duration-300 group-hover:text-red">{String(j + 1).padStart(2, "0")}</p> : it.icon ? <Icon name={it.icon} className="size-6 text-red" /> : <div className="h-[2px] w-8 bg-red" />}
              <h3 className={`mt-6 font-display text-[1.2rem] font-bold leading-snug ${defs ? "text-white" : ""}`}>{it.title}</h3>
              <p className={`mt-3 text-[15px] leading-relaxed ${defs ? "text-white/70" : ""}`}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps({ data }: { data: D }) {
  const items = (data.items ?? []) as { title: string; text: string }[];
  const cta = link(data.cta);
  return (
    <section className="section surface-ink on-dark relative overflow-hidden">
      <Emblem className="pointer-events-none absolute -right-40 top-10 w-[760px] opacity-[0.05]" color="#fff" />
      <div className="wrap relative">
        <SectionHead align="split" eyebrow={data.eyebrow} title={data.heading} intro={data.intro} light action={cta ? <Btn href={cta.href} variant="ghost-light">{cta.label}</Btn> : undefined} />
        <ol className="relative mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, j) => (
            <li key={j} className="relative pl-14" data-reveal style={d(j % 3)}>
              <span className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full border border-red font-display text-sm font-bold text-white">{String(j + 1).padStart(2, "0")}</span>
              <span className="absolute left-5 top-12 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-red/60 to-transparent sm:hidden" aria-hidden />
              <h3 className="font-display text-lg font-bold text-white">{it.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

async function SegmentShowcase({ data }: { data: D }) {
  const { segments, cards } = await getCatalog();
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead align="split" eyebrow={data.eyebrow} title={data.heading} intro={data.intro} action={<Link href="/products" className="link link-red">View all products <ArrowRight className="size-4" /></Link>} />
        <div className="mt-14 flex flex-col gap-px bg-line lg:h-[560px] lg:flex-row">
          {segments.map((s, j) => {
            const count = cards.filter((c) => c.segment.id === s.id).length;
            return (
              <Link key={s.id} href={segmentUrl(s)} className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden bg-ink p-6 transition-[flex-grow] duration-700 ease-[var(--ease-out)] lg:min-h-0 lg:flex-1 lg:hover:flex-[2.4] lg:focus-visible:flex-[2.4]" data-reveal style={d(j)}>
                {s.image ? <img src={s.image.url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-80 transition-[transform,opacity] duration-700 group-hover:scale-105 group-hover:opacity-100" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5" />
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-red transition-transform duration-500 group-hover:scale-x-100" />
                <div className="relative">
                  <span className="index-num block text-6xl leading-none text-red">{s.code}</span>
                  <h3 className="mt-3 font-display text-xl font-bold leading-tight text-white">{s.name}</h3>
                  <p className="mt-1 text-sm text-white/70">{count} products · {s.families.length} families</p>
                  <p className="mt-3 max-h-0 max-w-sm overflow-hidden text-sm text-white/85 opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100 lg:block">{s.intro}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">Explore <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

async function ProductGrid({ data }: { data: D }) {
  const { cards, segments } = await getCatalog();
  let list = cards;
  if (data.segment) {
    const seg = segments.find((s) => s.slug === data.segment);
    list = list.filter((c) => c.segment.id === seg?.id);
  }
  if (Array.isArray(data.productSlugs) && data.productSlugs.length) list = (data.productSlugs as string[]).map((sl) => cards.find((c) => c.slug === sl)).filter((c): c is (typeof cards)[number] => Boolean(c));
  list = list.slice(0, Number(data.limit) || 8);
  if (!list.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        {data.heading ? <SectionHead align={data.intro ? "split" : "left"} eyebrow={data.eyebrow} title={data.heading} intro={data.intro} /> : null}
        <div className="hairline-grid mt-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((c) => <ProductCard key={c.id} p={c} compact />)}
        </div>
      </div>
    </section>
  );
}

export async function IndustryGrid({ data }: { data: D }) {
  const { industries, links } = await getCatalog();
  let list = industries.filter((i) => !i.isCatchAll);
  if (Array.isArray(data.industrySlugs) && data.industrySlugs.length) list = list.filter((i) => (data.industrySlugs as string[]).includes(i.slug));
  list = list.slice(0, Number(data.limit) || 15);
  return (
    <section className="section surface-paper">
      <div className="wrap">
        {data.heading ? <SectionHead align={data.intro ? "split" : "left"} eyebrow={data.eyebrow} title={data.heading} intro={data.intro} action={<Link href="/industries" className="link link-red">Open the industry finder <ArrowRight className="size-4" /></Link>} /> : null}
        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {list.map((i, j) => (
            <li key={i.id} className="bg-cloud" data-reveal style={d(j % 4)}>
              <Link href={industryUrl(i)} className="group relative flex h-full flex-col overflow-hidden">
                <div className="img-zoom relative aspect-[16/10] bg-ink">
                  {(i.banner ?? i.image) ? <img src={(i.banner ?? i.image)!.url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-90" /> : null}
                  <span className="absolute inset-0 bg-red opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-60" />
                </div>
                <div className="flex flex-1 items-start gap-3 p-5">
                  <Icon name={i.icon} className="mt-0.5 size-5 flex-none text-red" />
                  <div className="flex-1">
                    <p className="font-display text-[1.05rem] font-bold leading-snug text-heading group-hover:text-red">{i.name}</p>
                    <p className="mt-1 text-xs text-muted">{links.filter((l) => l.industryId === i.id).length} relevant products</p>
                  </div>
                  <ArrowUpRight className="size-4 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

async function Downloads({ data }: { data: D }) {
  let list = await getResources();
  if (Array.isArray(data.resourceSlugs) && data.resourceSlugs.length) list = list.filter((r) => (data.resourceSlugs as string[]).includes(r.slug));
  return (
    <section className="section">
      <div className="wrap">
        {data.heading ? <SectionHead eyebrow={data.eyebrow} title={data.heading} intro={data.intro} className="mb-12" /> : null}
        <DownloadList items={list} />
      </div>
    </section>
  );
}

export function DownloadList({ items }: { items: { slug: string; title: string; description: string; fileUrl: string; kind: string }[] }) {
  return (
    <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
      {items.map((r, j) => (
        <li key={r.slug} className="bg-cloud" data-reveal style={d(j)}>
          <a href={r.fileUrl} data-track-download={r.slug} className="group flex h-full flex-col p-6 transition-colors hover:bg-surface">
            <FileText className="size-6 text-red" />
            <p className="mt-5 font-display text-lg font-bold text-heading">{r.title}</p>
            <p className="mt-2 flex-1 text-sm">{r.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-heading group-hover:text-red"><Download className="size-4" /> Download PDF</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

async function Articles({ data }: { data: D }) {
  const [posts, cats, resources] = await Promise.all([getPosts(), getPostCategories(), data.showDownloads ? getResources() : Promise.resolve([])]);
  const list = posts.slice(0, Number(data.limit) || 3);
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead align="split" eyebrow={data.eyebrow} title={data.heading} intro={data.intro} action={<Link href="/knowledge" className="link link-red">Knowledge centre <ArrowRight className="size-4" /></Link>} />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {list.map((p, j) => (
            <Link key={p.id} href={postUrl(p)} className="group block" data-reveal style={d(j)}>
              <div className="img-zoom relative aspect-[4/3] bg-paper"><Img image={p.cover} sizes="(min-width:768px) 33vw, 100vw" className="absolute inset-0" /></div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-red">{cats.find((c) => c.id === p.categoryId)?.name}</p>
              <h3 className="mt-2 font-display text-xl font-bold leading-snug group-hover:text-red">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm">{p.excerpt}</p>
            </Link>
          ))}
        </div>
        {resources.length ? (
          <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-line pt-8">
            <span className="mr-2 text-sm font-semibold text-heading">Downloads:</span>
            {resources.map((r) => (
              <a key={r.slug} href={r.fileUrl} data-track-download={r.slug} className="chip"><Download className="size-3.5 text-red" />{r.title}</a>
            ))}
            <Link href="/resources#flyers" className="chip">Product flyers</Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Pending({ data }: { data: D }) {
  const cta = link(data.cta);
  return (
    <section className="section-tight">
      <div className="wrap">
        <div className="grid gap-8 border border-dashed border-[color-mix(in_oklab,var(--c-border)_40%,var(--c-charcoal))] p-8 md:p-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {data.eyebrow ? <p className="eyebrow">{data.eyebrow}</p> : null}
            <h2 className="t-h3 mt-4">{data.heading}</h2>
            <p className="mt-4 max-w-2xl">{data.text}</p>
            {cta ? <Link href={cta.href} className="link link-red mt-6">{cta.label} <ArrowRight className="size-4" /></Link> : null}
          </div>
          {Array.isArray(data.items) && data.items.length ? (
            <div className="lg:col-span-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Awaiting management confirmation</p>
              <List items={data.items as string[]} className="mt-4 text-sm" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function Cta({ data }: { data: D }) {
  const p = link(data.primary);
  const s2 = link(data.secondary);
  const variant = data.variant ?? "red";
  const dark = variant === "charcoal";
  const light = variant === "light";
  return (
    <section className={`relative overflow-hidden ${light ? "surface-paper" : dark ? "surface-ink" : "surface-red"}`}>
      {!light ? <Emblem className="pointer-events-none absolute -right-20 top-1/2 w-[720px] -translate-y-1/2 opacity-[0.1]" color="#fff" /> : null}
      <div className="wrap relative py-[calc(var(--section-y)*0.85)]">
        <h2 className={`t-display max-w-4xl ${light ? "" : "text-white"}`} data-reveal>{data.heading}</h2>
        {data.text ? <p className={`t-lead mt-6 max-w-2xl ${light ? "" : "text-white/85"}`} data-reveal style={d(1)}>{data.text}</p> : null}
        <div className="mt-10 flex flex-wrap gap-3" data-reveal style={d(2)}>
          {p ? <Btn href={p.href} variant={light ? "primary" : dark ? "primary" : "light"}>{p.label}</Btn> : null}
          {s2 ? <Btn href={s2.href} variant={light ? "outline" : "ghost-light"}>{s2.label}</Btn> : null}
        </div>
      </div>
    </section>
  );
}
