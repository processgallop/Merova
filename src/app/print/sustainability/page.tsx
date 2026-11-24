import { CLAIM_DEFINITIONS, SUSTAINABILITY_TOPICS } from "@/data/company";
import { Cover, BackCover } from "@/components/print/Cover";
import { PFooter, PLogo } from "@/components/print/PrintKit";

const L = "Sustainability approach";

export default function SustainabilityPrint() {
  return (
    <>
      <Cover eyebrow="Sustainability approach" title="Better Packaging Decisions Begin With Better Material Choices." subtitle="How Merova approaches materials, waste and environmental claims — stated per material, never as blanket promises." image="/assets/products/renders/film-roll-green.webp" />
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><PLogo h={11} /><span className="pp-label">Responsible manufacturing</span></div>
          <h2 style={{ fontSize: "22pt", lineHeight: 1.08, marginTop: "13mm" }}>What we do.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm", marginTop: "8mm" }}>
            {SUSTAINABILITY_TOPICS.map((t) => (
              <div key={t.name} style={{ borderLeft: ".8mm solid var(--red)", paddingLeft: "3.5mm", minHeight: "26mm" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}>{t.name}</div>
                <div className="pp-muted" style={{ fontSize: "7.8pt", marginTop: "1mm", lineHeight: 1.45 }}>{t.text}</div>
              </div>
            ))}
          </div>
        </div>
        <PFooter label={L} page={2} />
      </section>
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><PLogo h={11} /><span className="pp-label">Claims, defined</span></div>
          <h2 style={{ fontSize: "20pt", lineHeight: 1.1, marginTop: "13mm" }}>Recyclable, recycled content, biodegradable and compostable are not the same.</h2>
          <div style={{ display: "grid", gap: "4mm", marginTop: "8mm" }}>
            {CLAIM_DEFINITIONS.map((d, i) => (
              <div key={d.term} className={i === 3 ? "pp-red" : ""} style={{ padding: "6mm", background: i === 3 ? undefined : "var(--paper2)" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "12pt" }}>{d.term}</div>
                <div style={{ marginTop: "1.5mm", lineHeight: 1.5 }}>{d.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto", marginBottom: "8mm", border: ".3mm dashed #b3aba7", padding: "4mm", fontSize: "7.8pt", color: "var(--ink2)" }}>
            Recycled-content figures, waste-recovery data and compostability certificates are stated per material once documented evidence is supplied. Merova makes no blanket environmental claims.
          </div>
        </div>
        <PFooter label={L} page={3} />
      </section>
      <BackCover title="Exploring lower-impact packaging?" />
    </>
  );
}
