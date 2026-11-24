/* eslint-disable @next/next/no-img-element */
import { ContactStrip, LOCKUP_REV, MARK_REV, Qr, RunningHead, SampleNote, printImg } from "./Kit";
import { categoryById, operatorsFor, type Product } from "@/data/catalog";
import { site } from "@/lib/site";

export function Cover({ title, kicker, sub, image }: { title: string; kicker: string; sub: string; image: string }) {
  return (
    <div className="page" style={{ background: "#d52b1e", color: "#fff" }}>
      <img src={MARK_REV} alt="" style={{ position: "absolute", left: "-40mm", bottom: "40mm", width: "250mm", opacity: 0.12 }} />
      <div style={{ padding: "16mm 16mm 0", position: "relative" }}><img src={LOCKUP_REV} alt="Merova" style={{ height: "15mm" }} /></div>
      <div style={{ padding: "0 16mm", marginTop: "28mm", position: "relative" }}>
        <p className="p-eyebrow" style={{ color: "#f1f0ec" }}>{kicker}</p>
        <h1 className="pd" style={{ fontSize: "46pt", lineHeight: 0.98, fontWeight: 700, margin: "6mm 0 0", maxWidth: "160mm" }}>{title}</h1>
        <p className="pd" style={{ fontSize: "14pt", fontWeight: 500, color: "#f1f0ec", margin: "8mm 0 0", maxWidth: "140mm", lineHeight: 1.3 }}>{sub}</p>
      </div>
      <div style={{ position: "absolute", left: "16mm", right: "16mm", bottom: "30mm", height: "92mm", borderRadius: "6mm", overflow: "hidden", boxShadow: "0 10mm 24mm -10mm rgba(60,0,0,.6)" }}><img src={printImg(image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
      <div style={{ position: "absolute", left: "16mm", right: "16mm", bottom: "12mm", display: "flex", justifyContent: "space-between", fontSize: "8pt", color: "#f1f0ec" }}><span>Packaging, Perfected. Engineered to Protect. Designed to Perform.</span><span>{new Date().getFullYear()} edition</span></div>
    </div>
  );
}

export function Divider({ eyebrow, title, text, count, tone = "graphite", folio }: { eyebrow: string; title: string; text: string; count?: string; tone?: "graphite" | "red"; folio: number }) {
  const bg = tone === "red" ? "#d52b1e" : "#2a2626";
  return (
    <div className="page" style={{ background: bg, color: "#fff" }}>
      <img src={MARK_REV} alt="" style={{ position: "absolute", right: "-60mm", bottom: "-20mm", width: "240mm", opacity: tone === "red" ? 0.12 : 0.06 }} />
      <div style={{ padding: "16mm", marginTop: "auto", marginBottom: "40mm", position: "relative" }}>
        <p className="p-eyebrow" style={{ color: tone === "red" ? "#f1f0ec" : "#ff8c80" }}>{eyebrow}</p>
        <h2 className="pd" style={{ fontSize: "40pt", lineHeight: 1, fontWeight: 700, margin: "5mm 0 0" }}>{title}</h2>
        <p style={{ fontSize: "11pt", lineHeight: 1.5, color: tone === "red" ? "#f1f0ec" : "#cfc7c0", margin: "7mm 0 0", maxWidth: "140mm" }}>{text}</p>
        {count && <p className="pd" style={{ fontSize: "12pt", marginTop: "8mm", fontWeight: 600 }}>{count}</p>}
      </div>
      <span className="p-folio" style={{ right: "16mm", color: "#cfc7c0" }}>{folio}</span>
    </div>
  );
}

export async function ProductHalf({ p }: { p: Product }) {
  const ops = operatorsFor(p.id);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "82mm 1fr", gap: "8mm", padding: "8mm 0", borderTop: "0.6pt solid #e6ddd1", height: "122mm", boxSizing: "border-box", overflow: "hidden" }}>
      <div>
        <div style={{ height: "74mm", borderRadius: "4mm", overflow: "hidden", background: "#f4ede3" }}><img src={printImg(p.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        <div style={{ display: "flex", gap: "3mm", alignItems: "center", marginTop: "3mm" }}><Qr path={`${p.url}?src=catalogue`} size={44} /><span className="p-small">Scan for specifications, flyer and enquiry.<br /><b style={{ color: "#1e1b1b" }}>{p.id}</b></span></div>
      </div>
      <div>
        <p className="p-eyebrow" style={{ color: "#d52b1e" }}>{p.subcategory}</p>
        <h3 className="pd" style={{ fontSize: "19pt", fontWeight: 700, margin: "1.5mm 0 0", lineHeight: 1.05 }}>{p.name}</h3>
        <p className="p-body" style={{ margin: "2.5mm 0 0" }}>{p.description}</p>
        <p style={{ fontSize: "7.5pt", fontWeight: 700, color: "#1e1b1b", margin: "3mm 0 1mm" }}>Variants</p>
        <p className="p-small" style={{ margin: 0 }}>{p.variants.join(" · ")}</p>
        <table className="p-table" style={{ marginTop: "2.5mm" }}><tbody>{p.specs.slice(0, 5).map((s) => <tr key={s.label}><th>{s.label}</th><td>{s.value}</td></tr>)}</tbody></table>
        {ops.primary.length > 0 && <p className="p-small" style={{ margin: "2mm 0 0" }}><b style={{ color: "#1e1b1b" }}>Used by:</b> {ops.primary.slice(0, 5).map((o) => o.name).join(", ")}</p>}
      </div>
    </div>
  );
}

export async function ProductPages({ list, label, startFolio }: { list: Product[]; label: string; startFolio: number }) {
  const pages: Product[][] = [];
  for (let i = 0; i < list.length; i += 2) pages.push(list.slice(i, i + 2));
  return (
    <>
      {pages.map((pg, i) => (
        <div key={i} className="page">
          <RunningHead label={label} folio={startFolio + i} />
          <div style={{ padding: "28mm 14mm 16mm", display: "grid", gap: 0 }}>
            {pg.map((p) => <ProductHalf key={p.id} p={p} />)}
          </div>
          <span style={{ position: "absolute", left: "14mm", bottom: "15mm", fontSize: "6.5pt", color: "#8a8380" }}>Specification values are indicative and confirmed at quotation.</span>
        </div>
      ))}
    </>
  );
}

export function BackPage({ title = "Build your packaging enquiry." }: { title?: string }) {
  const c = site.contact;
  return (
    <div className="page" style={{ background: "#2a2626", color: "#fff" }}>
      <img src={MARK_REV} alt="" style={{ position: "absolute", right: "-50mm", top: "20mm", width: "230mm", opacity: 0.06 }} />
      <div style={{ padding: "16mm", position: "relative", marginTop: "auto" }}>
        <img src={LOCKUP_REV} alt="Merova" style={{ height: "14mm" }} />
        <h2 className="pd" style={{ fontSize: "34pt", fontWeight: 700, lineHeight: 1.02, margin: "14mm 0 0", maxWidth: "150mm" }}>{title}</h2>
        <p style={{ fontSize: "11pt", color: "#cfc7c0", maxWidth: "140mm", lineHeight: 1.5 }}>Add products from any category at the website, or send us your requirement. The Merova team replies with a recommended specification and a quotation.</p>
        <div style={{ display: "flex", gap: "10mm", alignItems: "flex-end", marginTop: "12mm" }}>
          <div style={{ background: "#fff", padding: "2.5mm", borderRadius: "3mm" }}><Qr path="/request-a-quote/?src=print" size={96} /></div>
          <div style={{ fontSize: "9pt", lineHeight: 1.7, color: "#cfc7c0" }}>
            <p style={{ margin: 0 }}><b style={{ color: "#fff" }}>Sales</b> {c.phone}</p>
            <p style={{ margin: 0 }}><b style={{ color: "#fff" }}>Email</b> {c.salesEmail}</p>
            <p style={{ margin: 0 }}><b style={{ color: "#fff" }}>Web</b> {site.url.replace(/^https?:\/\//, "")}</p>
            <p style={{ margin: 0, maxWidth: "110mm" }}><b style={{ color: "#fff" }}>Office</b> {c.officeAddress}</p>
          </div>
        </div>
        <div style={{ marginTop: "10mm" }}><SampleNote dark /></div>
      </div>
      <div style={{ height: "8mm", background: "#d52b1e" }} />
    </div>
  );
}

export function Contents({ items, folio }: { items: { title: string; sub?: string; page: number; children?: string[] }[]; folio: number }) {
  return (
    <div className="page">
      <RunningHead label="Contents" folio={folio} />
      <div style={{ padding: "34mm 16mm 0" }}>
        <h2 className="pd" style={{ fontSize: "34pt", fontWeight: 700, margin: 0 }}>Contents</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: "12mm 0 0" }}>
          {items.map((it, i) => (
            <li key={i} style={{ display: "flex", alignItems: "baseline", gap: "6mm", padding: "4mm 0", borderTop: "0.6pt solid #e6ddd1" }}>
              <span className="pd" style={{ color: "#d52b1e", fontWeight: 600, fontSize: "11pt", width: "12mm" }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ flex: 1 }}><span className="pd" style={{ fontSize: "13pt", fontWeight: 600 }}>{it.title}</span>{it.sub && <span className="p-small" style={{ display: "block", marginTop: "1mm" }}>{it.sub}</span>}{it.children && <span style={{ display: "block", marginTop: "2.5mm", columns: 2, columnGap: "6mm" }}>{it.children.map((c) => <span key={c} className="p-small" style={{ display: "block", color: "#454040", fontSize: "8pt", lineHeight: 1.6 }}>{c}</span>)}</span>}</span>
              <span className="pd" style={{ fontSize: "11pt", color: "#6f6866" }}>{it.page}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export { categoryById, ContactStrip };
