import { productsInVertical, productUrl, verticals, industryById } from "@/data/catalog";
import { Cover, BackCover, Divider } from "@/components/print/Cover";
import { IMG_NOTE, PFooter, PImg, PLogo } from "@/components/print/PrintKit";
import { absoluteUrl, site } from "@/lib/site";
import type { Product } from "@/data/types";

const chunk = <T,>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

export default function CataloguePrint() {
  // Page plan: 1 cover, 2 contents, then per vertical: divider + product pages (2 per page), then back cover.
  let page = 2;
  const plan = verticals.map((v) => {
    const items = productsInVertical(v.id);
    const divider = ++page;
    const pages = chunk(items, 2).map((pair) => ({ pair, page: ++page }));
    return { v, items, divider, pages };
  });

  return (
    <>
      <Cover eyebrow="Product catalogue" title="Packaging solutions across five material verticals." subtitle={site.description} image="/assets/products/renders/hero.webp" />

      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <PLogo h={13} />
            <span className="pp-label">Product catalogue</span>
          </div>
          <h2 style={{ fontSize: "28pt", marginTop: "18mm" }}>Contents</h2>
          <div style={{ marginTop: "8mm", display: "grid", gap: "5mm" }}>
            {plan.map(({ v, items, divider }, i) => (
              <a key={v.id} href={`#v-${v.id}`} style={{ display: "grid", gridTemplateColumns: "14mm 1fr 14mm", gap: "4mm", borderTop: ".3mm solid var(--line)", paddingTop: "4mm" }}>
                <span style={{ fontFamily: "var(--font-sora)", fontSize: "16pt", fontWeight: 600, color: "var(--red)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span style={{ display: "block", fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "12pt" }}>{v.name}</span>
                  <span className="pp-muted" style={{ display: "block", fontSize: "7.8pt", marginTop: "1mm" }}>{items.map((p) => p.shortName ?? p.name).join(" · ")}</span>
                </span>
                <span className="pp-num" style={{ textAlign: "right", fontSize: "10pt" }}>{String(divider).padStart(2, "0")}</span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: "auto", marginBottom: "8mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8mm" }}>
            <div style={{ background: "var(--paper2)", padding: "6mm" }}>
              <div className="pp-h">How to use this catalogue</div>
              <p style={{ color: "var(--ink2)" }}>Each product lists applications, variants, materials and key specifications. Full specification tables are in the individual product flyers at <a href={absoluteUrl("/resources/downloads")} style={{ color: "var(--red)", fontWeight: 600 }}>{absoluteUrl("/resources/downloads").replace(/^https?:\/\//, "")}</a>.</p>
            </div>
            <div className="pp-red" style={{ padding: "6mm" }}>
              <div className="pp-label">Request a quote</div>
              <p style={{ marginTop: "2mm" }}>Every product page has a quote form that adapts to the product.</p>
              <a href={absoluteUrl("/request-a-quote")} style={{ display: "block", marginTop: "2mm", fontWeight: 700, textDecoration: "underline" }}>{absoluteUrl("/request-a-quote").replace(/^https?:\/\//, "")}</a>
            </div>
          </div>
          <p className="pp-muted" style={{ fontSize: "6.4pt", marginBottom: "3mm" }}>{IMG_NOTE}</p>
        </div>
        <PFooter label="Contents" page={2} />
      </section>

      {plan.map(({ v, divider, pages }, i) => (
        <div key={v.id} id={`v-${v.id}`} style={{ display: "contents" }}>
          <Divider index={String(i + 1).padStart(2, "0")} title={v.name} intro={v.intro} image={v.image.src} page={divider} label="Product catalogue" />
          {pages.map(({ pair, page: pg }) => (
            <section className="pp" key={pg}>
              <div className="pp-body" style={{ paddingTop: "11mm", gap: "8mm" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "3mm", borderBottom: ".6mm solid var(--red)" }}>
                  <span style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "9.5pt" }}>{v.name}</span>
                  <PLogo variant="mark-red" h={6} />
                </div>
                {pair.map((p) => <ProductBlock key={p.slug} p={p} />)}
              </div>
              <PFooter label="Product catalogue" page={pg} />
            </section>
          ))}
        </div>
      ))}
      <BackCover />
    </>
  );
}

function ProductBlock({ p }: { p: Product }) {
  const keySpecs = p.specs.slice(0, 4);
  const url = absoluteUrl(productUrl(p));
  return (
    <article style={{ flex: "0 0 auto", height: "118mm", display: "grid", gridTemplateColumns: "74mm 1fr", gap: "7mm" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <PImg image={p.image} style={{ height: "74mm" }} />
        <div style={{ marginTop: "4mm" }}>
          <div className="pp-h">Industries</div>
          <div className="pp-muted" style={{ fontSize: "7.6pt", lineHeight: 1.45 }}>{p.industries.map((i) => industryById[i].shortName).join(" · ")}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "15pt", lineHeight: 1.1 }}>{p.name}</h3>
        <p style={{ marginTop: "2mm", color: "var(--red-d)", fontFamily: "var(--font-sora)", fontSize: "8.8pt", lineHeight: 1.35 }}>{p.headline}</p>
        <p style={{ marginTop: "2mm", color: "var(--ink2)" }}>{p.summary}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5mm", marginTop: "4mm" }}>
          <div><div className="pp-h">Variants</div><ul className="pp-list" style={{ fontSize: "8pt" }}>{p.formats.slice(0, 4).map((f) => <li key={f}>{f}</li>)}</ul></div>
          <div><div className="pp-h">Applications</div><ul className="pp-list" style={{ fontSize: "8pt" }}>{p.applications.slice(0, 4).map((f) => <li key={f}>{f}</li>)}</ul></div>
        </div>
        <table style={{ marginTop: "4mm", fontSize: "7.4pt" }}>
          <tbody>{keySpecs.map((s) => <tr key={s.label}><th style={{ padding: "1.5mm 2mm" }}>{s.label}</th><td style={{ padding: "1.5mm 2mm" }}>{s.value}</td></tr>)}</tbody>
        </table>
        <a href={url} style={{ marginTop: "auto", fontSize: "7.4pt", color: "var(--red)", fontWeight: 600 }}>
          Specifications, flyer & quote → {url.replace(/^https?:\/\//, "")}
        </a>
      </div>
    </article>
  );
}
