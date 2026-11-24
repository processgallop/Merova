import { CLAIM_DEFINITIONS, SUSTAINABILITY_TOPICS } from "@/data/company";
import { Cover, BackCover } from "@/components/print/Cover";
import { PFooter, PLogo } from "@/components/print/PrintKit";

export default function SustainabilityPrint() {
  return (
    <>
      <Cover eyebrow="Sustainability approach" title="Better Packaging Decisions Begin With Better Material Choices." subtitle="How Merova approaches materials, waste and environmental claims." image="/assets/manufacturing/sustainability-material-flow.webp" />
      <section className="pp">
        <div className="pp-body">
          <PLogo />
          <div className="pp-eyebrow" style={{ marginTop: "10mm" }}>Responsible manufacturing</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm", marginTop: "4mm" }}>
            {SUSTAINABILITY_TOPICS.map((t) => (
              <div key={t.name} style={{ borderTop: ".6pt solid #e2d9cb", paddingTop: "3mm" }}>
                <strong style={{ color: "#08162a" }}>{t.name}</strong>
                <div className="pp-muted" style={{ fontSize: "8.6pt", marginTop: 2 }}>{t.text}</div>
              </div>
            ))}
          </div>
        </div>
        <PFooter label="Sustainability approach" page="2" />
      </section>
      <section className="pp">
        <div className="pp-body">
          <div className="pp-eyebrow">Claims, defined</div>
          <h2 style={{ fontSize: "16pt", marginTop: 5 }}>Recyclable, recycled content, biodegradable and compostable are not the same.</h2>
          <div style={{ display: "grid", gap: "4mm", marginTop: "6mm" }}>
            {CLAIM_DEFINITIONS.map((d) => (
              <div key={d.term} style={{ border: ".6pt solid #e2d9cb", borderRadius: 3, padding: "5mm" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, color: "#08162a", fontSize: "11pt" }}>{d.term}</div>
                <div style={{ color: "#3a404c", marginTop: 3 }}>{d.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto", marginBottom: "6mm", background: "#fff8e8", border: ".6pt solid #efd9a6", borderRadius: 3, padding: "4mm", fontSize: "8.4pt", color: "#6b4a00" }}>
            Recycled-content figures, waste-recovery data and compostability certificates are stated per material once documented evidence is supplied. Merova makes no blanket environmental claims.
          </div>
        </div>
        <PFooter label="Sustainability approach" page="3" />
      </section>
      <BackCover title="Exploring lower-impact packaging?" />
    </>
  );
}
