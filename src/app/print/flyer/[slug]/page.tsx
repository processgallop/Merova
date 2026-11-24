/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { getProduct, industryById, productUrl, products, relatedProducts, verticalById } from "@/data/catalog";
import { ContactLines, IMG_NOTE, PFooter, PImg, PLogo, PSpecTable, QR } from "@/components/print/PrintKit";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export default async function FlyerPrint({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const v = verticalById[p.vertical];
  const url = absoluteUrl(productUrl(p));
  const quote = absoluteUrl(`/request-a-quote?product=${p.slug}`);
  const related = relatedProducts(p).slice(0, 4);

  return (
    <>
      {/* ───────────── Page 1 — cover & overview ───────────── */}
      <section className="pp">
        <div className="pp-red-deep" style={{ height: "108mm", padding: "13mm 16mm 0", position: "relative", flexShrink: 0 }}>
          <img src="/assets/brand/merova-mark-cream.svg" alt="" className="pp-watermark" style={{ width: "150mm", left: "-22mm", bottom: "-26mm" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <PLogo variant="reverse" h={17} />
            <div style={{ textAlign: "right", fontSize: "7pt", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
              Product flyer
              <div style={{ fontSize: "8pt", fontWeight: 500, letterSpacing: 0, textTransform: "none", marginTop: "1mm" }}>{v.name}</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: "16mm", bottom: "12mm", width: "88mm" }}>
            <div className="pp-label">{v.navName}</div>
            <h1 style={{ fontSize: p.name.length > 30 ? "23pt" : "28pt", lineHeight: 1.04, marginTop: "4mm" }}>{p.name}</h1>
            <p style={{ fontFamily: "var(--font-sora)", fontSize: "11pt", lineHeight: 1.35, marginTop: "4mm" }}>{p.headline}</p>
          </div>
        </div>

        <PImg image={p.image} style={{ position: "absolute", top: "42mm", right: "16mm", width: "84mm", height: "84mm", boxShadow: "0 6mm 14mm -6mm rgba(40,37,37,.45)" }} />

        <div className="pp-body" style={{ paddingTop: "10mm" }}>
          <div style={{ width: "88mm" }}>
            <p style={{ fontSize: "10pt", lineHeight: 1.55, color: "var(--ink)", fontWeight: 500 }}>{p.summary}</p>
          </div>

          <div style={{ marginTop: "12mm" }}>
            <div className="pp-h">Product overview</div>
            <div style={{ columns: 2, columnGap: "8mm", color: "var(--ink2)" }}>
              {p.overview.map((o) => <p key={o.slice(0, 20)} style={{ marginBottom: "2mm", breakInside: "avoid" }}>{o}</p>)}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "7mm", marginTop: "7mm" }}>
            <div><div className="pp-h">Applications</div><ul className="pp-list">{p.applications.map((a) => <li key={a}>{a}</li>)}</ul></div>
            <div><div className="pp-h">Available variants</div><ul className="pp-list">{p.formats.map((a) => <li key={a}>{a}</li>)}</ul></div>
            <div><div className="pp-h">Material options</div><ul className="pp-list">{p.materials.map((a) => <li key={a}>{a}</li>)}</ul></div>
          </div>

          <div style={{ marginTop: "auto", marginBottom: "8mm", background: "var(--paper2)", borderTop: ".8mm solid var(--red)", padding: "5mm 6mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8mm" }}>
            <div><div className="pp-h">Printing & finishing</div><ul className="pp-list">{p.printing.map((a) => <li key={a}>{a}</li>)}</ul></div>
            <div><div className="pp-h">Customisation possibilities</div><ul className="pp-list">{p.customisation.map((a) => <li key={a}>{a}</li>)}</ul></div>
          </div>

        </div>
        <PFooter label={p.name} page={1} total={2} />
      </section>

      {/* ───────────── Page 2 — specification & quote ───────────── */}
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "12mm" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "4mm", borderBottom: ".6mm solid var(--red)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4mm" }}>
              <PLogo variant="mark-red" h={7} />
              <span style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "11pt" }}>{p.name}</span>
            </div>
            <span className="pp-label">Technical specifications</span>
          </div>

          <div style={{ marginTop: "5mm" }}><PSpecTable rows={p.specs} /></div>
          <p className="pp-muted" style={{ fontSize: "6.8pt", marginTop: "2mm" }}>
            <b>Option</b> — a format or option Merova can specify · <b>Industry reference</b> — general technical information, not a Merova guarantee · <b>Confirmed at quotation</b> — confirmed in writing for your order.
          </p>

          <div style={{ marginTop: "6mm" }}>
            <div className="pp-h">Quality considerations</div>
            <ul className="pp-list" style={{ columns: 2, columnGap: "8mm" }}>{p.quality.map((a) => <li key={a} style={{ breakInside: "avoid" }}>{a}</li>)}</ul>
          </div>

          <div style={{ marginTop: "6mm" }}>
            <div className="pp-h">Application industries</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.8mm" }}>
              {p.industries.map((i) => <span key={i} className="pp-chip">{industryById[i].name}</span>)}
            </div>
          </div>
          {related.length > 0 && (
            <div style={{ marginTop: "6mm" }}>
              <div className="pp-h">Related products</div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(4, 1fr)`, gap: "4mm" }}>
                {related.map((r) => (
                  <a key={r.slug} href={absoluteUrl(productUrl(r))} style={{ display: "block" }}>
                    <PImg image={r.image} caption={false} style={{ aspectRatio: "16 / 10" }} />
                    <div style={{ fontSize: "7.4pt", fontWeight: 600, marginTop: "1.6mm", lineHeight: 1.3 }}>{r.name}</div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pp-red-deep" style={{ marginTop: "auto", marginBottom: "5mm", position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr auto", gap: "8mm", alignItems: "center", padding: "6mm 8mm" }}>
            <img src="/assets/brand/merova-mark-cream.svg" alt="" className="pp-watermark" style={{ width: "95mm", right: "-18mm", top: "-10mm" }} />
            <div style={{ position: "relative" }}>
              <div className="pp-label">Request a quote</div>
              <h2 style={{ fontSize: "14pt", lineHeight: 1.15, marginTop: "2mm" }}>Share your dimensions, material and quantity.</h2>
              <p style={{ marginTop: "2mm", fontSize: "8.4pt" }}>
                <a href={quote} style={{ textDecoration: "underline" }}>{quote.replace(/^https?:\/\//, "")}</a>
              </p>
              <div style={{ marginTop: "3mm" }}><ContactLines light /></div>
            </div>
            <a href={url} style={{ position: "relative", background: "#fff", padding: "2.4mm", textAlign: "center", borderRadius: ".8mm" }}>
              <QR url={url} size={24} />
              <div style={{ fontSize: "5.8pt", fontWeight: 700, color: "var(--red)", marginTop: ".6mm" }}>Scan or click</div>
              <div style={{ fontSize: "5.8pt", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#4d4747", marginTop: "1.4mm" }}>Product page</div>
            </a>
          </div>
          <p className="pp-muted" style={{ fontSize: "6.2pt", marginBottom: "3mm" }}>{IMG_NOTE}</p>
        </div>
        <PFooter label={`${p.name} · Specification`} page={2} total={2} red />
      </section>
    </>
  );
}
