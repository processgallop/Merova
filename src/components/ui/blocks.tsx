import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Fragment } from "react";

export function SectionHead({
  eyebrow,
  title,
  intro,
  align = "left",
  index,
  light = false,
  className = "",
  action,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "split";
  index?: string;
  light?: boolean;
  className?: string;
  action?: React.ReactNode;
}) {
  if (align === "split") {
    return (
      <div className={`grid gap-6 lg:grid-cols-12 lg:items-end ${className}`}>
        <div className="lg:col-span-7" data-reveal>
          {eyebrow ? <p className={`eyebrow ${light ? "light" : ""}`}>{index ? <span className="opacity-60">{index}</span> : null}{eyebrow}</p> : null}
          <h2 className={`t-display mt-5 ${light ? "text-white" : ""}`}>{title}</h2>
        </div>
        <div className="lg:col-span-5" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          {intro ? <p className={`t-lead ${light ? "text-white/80" : "text-body"}`}>{intro}</p> : null}
          {action ? <div className="mt-6">{action}</div> : null}
        </div>
      </div>
    );
  }
  return (
    <div className={`max-w-3xl ${className}`} data-reveal>
      {eyebrow ? <p className={`eyebrow ${light ? "light" : ""}`}>{eyebrow}</p> : null}
      <h2 className={`t-h2 mt-5 ${light ? "text-white" : ""}`}>{title}</h2>
      {intro ? <p className={`t-lead mt-5 ${light ? "text-white/80" : ""}`}>{intro}</p> : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}

export function Btn({ href, children, variant = "primary", size, className = "", arrow = true, ...rest }: { href: string; children: React.ReactNode; variant?: "primary" | "dark" | "outline" | "light" | "ghost-light"; size?: "sm"; className?: string; arrow?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = `btn ${variant !== "primary" ? `btn-${variant}` : ""} ${size === "sm" ? "btn-sm" : ""} ${className}`;
  const external = /^https?:|^mailto:|^tel:|\.pdf$/.test(href);
  const inner = (
    <>
      <span>{children}</span>
      {arrow ? <ArrowRight className="btn-arrow size-4" aria-hidden /> : null}
    </>
  );
  return external ? (
    <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}

export function Crumbs({ items, light = false }: { items: { name: string; href: string }[]; light?: boolean }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={`text-[13px] ${light ? "text-white/70" : "text-muted"}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <Fragment key={c.href}>
            <li>
              {i === all.length - 1 ? (
                <span aria-current="page" className={light ? "text-white" : "text-heading"}>{c.name}</span>
              ) : (
                <Link href={c.href} className="hover:text-red">{c.name}</Link>
              )}
            </li>
            {i < all.length - 1 ? <ChevronRight className="size-3.5 opacity-50" aria-hidden /> : null}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

export function Faqs({ items, light = false }: { items: { q: string; a: string }[]; light?: boolean }) {
  return (
    <div className={`divide-y border-y ${light ? "divide-white/15 border-white/15" : "divide-line border-line"}`}>
      {items.map((f, i) => (
        <details key={i} className="group py-1">
          <summary className={`flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left font-display text-lg font-semibold tracking-tight ${light ? "text-white" : "text-heading"} [&::-webkit-details-marker]:hidden`}>
            <span>{f.q}</span>
            <span className="relative mt-1.5 size-4 flex-none" aria-hidden>
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-red" />
              <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-red transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <p className={`pb-6 pr-10 ${light ? "text-white/75" : ""}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Pill({ children, tone = "line" }: { children: React.ReactNode; tone?: "line" | "red" | "ink" }) {
  const cls = tone === "red" ? "bg-red text-white" : tone === "ink" ? "bg-ink text-white" : "border border-line text-heading bg-surface";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${cls}`}>{children}</span>;
}

export function List({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((x) => (
        <li key={x} className="flex gap-3">
          <span className="mt-[0.7em] h-[2px] w-3 flex-none bg-red" aria-hidden />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}
