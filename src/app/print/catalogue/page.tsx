import { productsInVertical, productUrl, verticals, flyerUrl, industryById } from "@/data/catalog";
import { Cover, BackCover } from "@/components/print/Cover";
import { IMG_NOTE, PFooter, PLogo, printSrc } from "@/components/print/PrintKit";
import { absoluteUrl, site } from "@/lib/site";
import type { Product } from "@/data/types";

const chunk = <T,>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

export default function CataloguePrint() {
  return (
    <>
      <Cover eyebrow="Product catalogue" title="Packaging solutions across five material verticals." subtitle={site.description} image="/assets/manufacturing/hero-factory-packaging.webp" />
      <section className="pp">
        <div className="pp-body">
          <PLogo />
          <h2 style={{ fontSize: "20pt", marginTop: "12mm" }}>Contents</h2>
          <div style={{ marginTop: "6mm", display: "grid", gap: "6mm" }}>
            {verticals.map((v) => (
              <div key={v.id} style={{ borderTop: ".6pt solid #e2d9cb", paddingTop: "4mm" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "12pt", color: "#08162a" }}>{v.name}</div>
                <div className="pp-muted" style={{ fontSize: "8.6pt", marginTop: 3 }}>{productsInVertical(v.id).map((p) => p.shortName ?? p.name).join(" · ")}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto", marginBottom: "8mm", background: "#f5efe5", borderRadius: 4, padding: "6mm" }}>
            <div className="pp-h">How to use this catalogue</div>
            <p style={{ margin: "4pt 0 0", color: "#3a404c" }}>Each product lists its applications, formats, materials and key specifications. Individual product flyers with full specification tables are available at {absoluteUrl("/resources/downloads").replace(/^https?:\/\//, "")}. {IMG_NOTE}</p>
          </div>
        </div>
        <PFooter label="Product catalogue" />
      </section>

      {verticals.map((v) => (
        <VerticalSection key={v.id} vertical={v} items={productsInVertical(v.id)} />
      ))}
      <BackCover />
    </>
  );
}

function VerticalSection({ vertical: v, items }: { vertical: (typeof verticals)[number]; items: Product[] }) {
  return (
    <>
      <section className="pp">
        <div className="pp-band pp-grid" style={{ padding: "16mm 15mm" }}>
          <div>
            <div className="pp-eyebrow" style={{ color: "#f3b1aa" }}>{items.length} formats</div>
            <h2 style={{ color: "#fff", fontSize: "24pt", marginTop: 6 }}>{v.name}</h2>
          </div>
        </div>
        <div className="pp-body">
          <p style={{ fontFamily: "var(--font-sora)", fontSize: "13pt", color: "#142c4d", lineHeight: 1.35, margin: 0 }}>{v.headline}</p>
          <p style={{ color: "#3a404c", margin: "8pt 0 0" }}>{v.intro}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5mm", marginTop: "8mm" }}>
            {v.technologies.map((t) => (
              <div key={t.name} style={{ border: ".6pt solid #e2d9cb", borderRadius: 3, padding: "4mm" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, color: "#08162a" }}>{t.name}</div>
                <div style={{ color: "#3a404c", marginTop: 3, fontSize: "8.8pt" }}>{t.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "8mm", borderRadius: 4, overflow: "hidden", flex: 1, minHeight: 0, maxHeight: "95mm", background: "#f5efe5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={printSrc(v.image.src)} alt={v.image.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ height: "8mm" }} />
        </div>
        <PFooter label={v.name} />
      </section>
      {chunk(items, 2).map((pair, i) => (
        <section className="pp" key={i}>
          <div className="pp-body" style={{ gap: "7mm" }}>
            {pair.map((p) => <ProductBlock key={p.slug} p={p} />)}
          </div>
          <PFooter label={v.name} />
        </section>
      ))}
    </>
  );
}

function ProductBlock({ p }: { p: Product }) {
  const keySpecs = p.specs.slice(0, 4);
  return (
    <article style={{ flex: 1, display: "grid", gridTemplateColumns: "62mm 1fr", gap: "6mm", borderBottom: ".6pt solid #e2d9cb", paddingBottom: "6mm" }}>
      <div>
        <div style={{ borderRadius: 3, overflow: "hidden", aspectRatio: "4/3", background: "#f5efe5", border: ".6pt solid #e2d9cb" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={printSrc(p.image.src)} alt={p.image.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ marginTop: "4mm" }}>
          <div className="pp-h">Industries</div>
          <div className="pp-muted" style={{ fontSize: "7.8pt", marginTop: 2 }}>{p.industries.map((i) => industryById[i].shortName).join(", ")}</div>
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: "13pt" }}>{p.name}</h3>
        <p style={{ margin: "3pt 0 0", color: "#3a404c" }}>{p.summary}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm", marginTop: "4mm" }}>
          <div><div className="pp-h">Formats</div><ul className="pp-list" style={{ fontSize: "8.4pt" }}>{p.formats.slice(0, 4).map((f) => <li key={f}>{f}</li>)}</ul></div>
          <div><div className="pp-h">Materials</div><ul className="pp-list" style={{ fontSize: "8.4pt" }}>{p.materials.slice(0, 4).map((f) => <li key={f}>{f}</li>)}</ul></div>
        </div>
        <table style={{ marginTop: "4mm", fontSize: "7.8pt" }}>
          <tbody>{keySpecs.map((s) => <tr key={s.label}><th style={{ padding: "2.5pt 5pt" }}>{s.label}</th><td style={{ padding: "2.5pt 5pt" }}>{s.value}</td></tr>)}</tbody>
        </table>
        <div className="pp-muted" style={{ fontSize: "7.4pt", marginTop: "3mm" }}>
          Product page: {absoluteUrl(productUrl(p)).replace(/^https?:\/\//, "")} · Flyer: {absoluteUrl(flyerUrl(p)).replace(/^https?:\/\//, "")}
        </div>
      </div>
    </article>
  );
}
