/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { ContactStrip, LOCKUP_REV, MARK_REV, Qr, SampleNote, printImg } from "@/components/print/Kit";
import { categoryById, operatorsFor, productBySlug, products } from "@/data/catalog";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export default async function Flyer({ params }: { params: Promise<{ slug: string }> }) {
  const p = productBySlug((await params).slug);
  if (!p) notFound();
  const c = categoryById[p.category];
  const ops = operatorsFor(p.id);
  const opNames = [...ops.primary, ...ops.secondary].map((o) => o.name).slice(0, 8);
  return (
    <div className="page">
      {/* Header band */}
      <div style={{ background: "#d52b1e", color: "#fff", padding: "10mm 14mm 0", position: "relative", overflow: "hidden", height: "118mm" }}>
        <img src={MARK_REV} alt="" style={{ position: "absolute", right: "-30mm", top: "-14mm", width: "150mm", opacity: 0.12 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <img src={LOCKUP_REV} alt="Merova" style={{ height: "11mm" }} />
          <span className="p-eyebrow" style={{ color: "#f1f0ec" }}>Product flyer · {c.name}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "8mm", marginTop: "9mm", position: "relative" }}>
          <div>
            <p className="p-eyebrow" style={{ color: "#f1f0ec", opacity: 0.85 }}>{p.subcategory}</p>
            <h1 className="pd" style={{ fontSize: p.name.length > 26 ? "24pt" : "30pt", lineHeight: 1, fontWeight: 700, margin: "3mm 0 0" }}>{p.name}</h1>
            <p className="pd" style={{ fontSize: "12pt", lineHeight: 1.25, fontWeight: 500, margin: "5mm 0 0", color: "#f1f0ec" }}>{p.headline}</p>
          </div>
          <div style={{ borderRadius: "5mm", overflow: "hidden", height: "84mm", background: "#f4ede3", boxShadow: "0 8mm 16mm -8mm rgba(60,0,0,.5)" }}>
            <img src={printImg(p.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "8mm 14mm 0", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "8mm", flex: 1 }}>
        <div>
          <p className="p-body" style={{ margin: 0, fontSize: "9.5pt" }}>{p.overview[0]} {p.overview[1]}</p>
          <h2 className="p-eyebrow" style={{ color: "#d52b1e", margin: "6mm 0 2.5mm" }}>Available variants</h2>
          <ul className="p-list">{p.variants.slice(0, 7).map((v) => <li key={v}>{v}</li>)}</ul>
          <h2 className="p-eyebrow" style={{ color: "#d52b1e", margin: "5mm 0 2.5mm" }}>Printing &amp; customisation</h2>
          <ul className="p-list">{p.customisation.slice(0, 5).map((v) => <li key={v}>{v}</li>)}</ul>
          <h2 className="p-eyebrow" style={{ color: "#d52b1e", margin: "5mm 0 2.5mm" }}>Materials</h2>
          <div>{p.materials.slice(0, 5).map((m) => <span key={m} className="p-chip">{m}</span>)}</div>
        </div>
        <div>
          <div style={{ background: "#fff", borderRadius: "4mm", padding: "4.5mm 5mm", border: "0.6pt solid #e6ddd1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><h2 className="pd" style={{ fontSize: "11pt", margin: 0, fontWeight: 600 }}>Technical parameters</h2><span style={{ fontSize: "6.5pt", fontWeight: 700, color: "#6a4a00", background: "#fff3d6", borderRadius: "99pt", padding: "1.5pt 6pt", letterSpacing: ".06em" }}>INDICATIVE</span></div>
            <table className="p-table" style={{ marginTop: "2mm" }}><tbody>{p.specs.slice(0, 7).map((s) => <tr key={s.label}><th>{s.label}</th><td>{s.value}</td></tr>)}</tbody></table>
            <p className="p-small" style={{ margin: "2mm 0 0" }}>You specify: {p.parameters.join(" · ")}. Values are confirmed at quotation.</p>
          </div>
          <h2 className="p-eyebrow" style={{ color: "#d52b1e", margin: "5mm 0 2.5mm" }}>Applications</h2>
          <p className="p-body" style={{ margin: 0 }}>{p.applications}.</p>
          {opNames.length > 0 && <><h2 className="p-eyebrow" style={{ color: "#d52b1e", margin: "5mm 0 2.5mm" }}>Used by</h2><div>{opNames.map((n) => <span key={n} className="p-chip">{n}</span>)}</div></>}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#2a2626", color: "#fff", padding: "6mm 14mm", display: "flex", alignItems: "center", gap: "8mm", marginTop: "6mm" }}>
        <div style={{ flex: 1 }}>
          <p className="pd" style={{ fontSize: "14pt", fontWeight: 600, margin: 0 }}>Request a quote for {p.name.toLowerCase()}.</p>
          <p style={{ fontSize: "8pt", color: "#cfc7c0", margin: "1.5mm 0 3mm" }}>Scan for the product page, full specifications and the enquiry builder.</p>
          <ContactStrip />
          <div style={{ marginTop: "2mm" }}><SampleNote dark /></div>
        </div>
        <div style={{ background: "#fff", borderRadius: "3mm", padding: "2mm" }}><Qr path={`${p.url}?src=flyer`} size={78} /></div>
      </div>
    </div>
  );
}
