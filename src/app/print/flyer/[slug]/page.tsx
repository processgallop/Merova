import { notFound } from "next/navigation";
import { getProduct, industryById, productUrl, products, verticalById } from "@/data/catalog";
import { ContactBlock, IMG_NOTE, PFooter, PLogo, PSpecTable, QR, printSrc } from "@/components/print/PrintKit";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export default async function FlyerPrint({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const v = verticalById[p.vertical];
  const url = absoluteUrl(productUrl(p));
  const quote = absoluteUrl(`/request-a-quote?product=${p.slug}`);

  return (
    <>
      {/* Page 1 */}
      <section className="pp">
        <div className="pp-band pp-grid">
          <PLogo light />
          <div style={{ textAlign: "right" }}>
            <div className="pp-eyebrow" style={{ color: "#f3b1aa" }}>Product flyer</div>
            <div style={{ fontSize: "8.4pt", color: "rgba(255,255,255,.75)", marginTop: 3 }}>{v.name}</div>
          </div>
        </div>
        <div className="pp-body">
          <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "8mm", alignItems: "center" }}>
            <div>
              <div className="pp-eyebrow">{v.navName}</div>
              <h1 style={{ fontSize: "25pt", lineHeight: 1.08, marginTop: 5 }}>{p.name}</h1>
              <p style={{ fontFamily: "var(--font-sora)", fontSize: "11.5pt", color: "#142c4d", margin: "7pt 0 0", lineHeight: 1.35 }}>{p.headline}</p>
              <p style={{ margin: "8pt 0 0", color: "#3a404c" }}>{p.summary}</p>
            </div>
            <div style={{ borderRadius: 4, overflow: "hidden", border: ".6pt solid #e2d9cb", aspectRatio: "4/3", background: "#f5efe5" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={printSrc(p.image.src)} alt={p.image.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>

          <div style={{ marginTop: "8mm" }}>
            <div className="pp-h">Product overview</div>
            {p.overview.map((o) => <p key={o.slice(0, 20)} style={{ margin: "4pt 0 0", color: "#3a404c" }}>{o}</p>)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6mm", marginTop: "7mm" }}>
            <div><div className="pp-h">Applications</div><ul className="pp-list">{p.applications.map((a) => <li key={a}>{a}</li>)}</ul></div>
            <div><div className="pp-h">Available variants</div><ul className="pp-list">{p.formats.map((a) => <li key={a}>{a}</li>)}</ul></div>
            <div><div className="pp-h">Material information</div><ul className="pp-list">{p.materials.map((a) => <li key={a}>{a}</li>)}</ul></div>
          </div>

          <div style={{ marginTop: "7mm" }}>
            <div className="pp-h">Application industries</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
              {p.industries.map((i) => <span key={i} className="pp-tag" style={{ fontSize: "7pt", padding: "2pt 6pt" }}>{industryById[i].name}</span>)}
            </div>
          </div>
        </div>
        <PFooter label={p.name} page="1 / 2" />
      </section>

      {/* Page 2 */}
      <section className="pp">
        <div className="pp-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <PLogo />
            <span className="pp-eyebrow">{p.name}</span>
          </div>
          <h2 style={{ fontSize: "15pt", marginTop: "8mm" }}>Technical specifications</h2>
          <div style={{ marginTop: "4mm" }}><PSpecTable rows={p.specs} /></div>
          <p className="pp-muted" style={{ fontSize: "7.6pt", margin: "4pt 0 0" }}>Option: a format or option Merova can specify · Industry reference: general technical information, not a Merova guarantee · Confirmed at quotation: confirmed in writing for your order.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6mm", marginTop: "8mm" }}>
            <div><div className="pp-h">Printing & finishing</div><ul className="pp-list">{p.printing.map((a) => <li key={a}>{a}</li>)}</ul></div>
            <div><div className="pp-h">Customisation</div><ul className="pp-list">{p.customisation.map((a) => <li key={a}>{a}</li>)}</ul></div>
            <div><div className="pp-h">Quality</div><ul className="pp-list">{p.quality.map((a) => <li key={a}>{a}</li>)}</ul></div>
          </div>

          <div style={{ marginTop: "auto", marginBottom: "8mm", display: "grid", gridTemplateColumns: "1fr auto", gap: "8mm", alignItems: "center", background: "#0d1f38", color: "#fff", borderRadius: 4, padding: "7mm" }}>
            <div>
              <div className="pp-eyebrow" style={{ color: "#f3b1aa" }}>Request a quote</div>
              <div style={{ fontFamily: "var(--font-sora)", fontSize: "14pt", fontWeight: 600, marginTop: 4 }}>Tell us your dimensions, material and quantity.</div>
              <div style={{ fontSize: "8.4pt", color: "rgba(255,255,255,.75)", marginTop: 5 }}>{quote.replace(/^https?:\/\//, "")}</div>
              <div style={{ marginTop: 8 }}><ContactBlock dark /></div>
            </div>
            <div style={{ background: "#fff", padding: 6, borderRadius: 3, textAlign: "center" }}>
              <QR url={url} size={88} />
              <div style={{ fontSize: "6.2pt", color: "#3a404c", marginTop: 3 }}>Scan for product page</div>
            </div>
          </div>
          <p className="pp-muted" style={{ fontSize: "7pt", margin: "0 0 4mm" }}>{IMG_NOTE}</p>
        </div>
        <PFooter label={url.replace(/^https?:\/\//, "")} page="2 / 2" />
      </section>
    </>
  );
}
