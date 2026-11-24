import { productsInVertical, verticals } from "@/data/catalog";
import { MANUFACTURING_PROCESSES, QUALITY_STAGES } from "@/data/company";
import { Cover, BackCover } from "@/components/print/Cover";
import { PFooter, PImg, PLogo } from "@/components/print/PrintKit";

const L = "Manufacturing capabilities";

export default function CapabilitiesPrint() {
  return (
    <>
      <Cover eyebrow="Manufacturing capabilities" title="The Right Infrastructure. The Right Processes. The Right Packaging Outcome." subtitle="How Merova takes packaging from material to dispatch, and what can be specified in each vertical." image="/assets/products/renders/partitions.webp" />
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><PLogo h={11} /><span className="pp-label">Production journey</span></div>
          <h2 style={{ fontSize: "22pt", lineHeight: 1.08, marginTop: "13mm" }}>From material to dispatch.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm", marginTop: "8mm" }}>
            {MANUFACTURING_PROCESSES.map((p, i) => (
              <div key={p.name} style={{ background: "var(--paper2)", padding: "5mm", minHeight: "30mm" }}>
                <span style={{ fontFamily: "var(--font-sora)", fontSize: "15pt", fontWeight: 600, color: "var(--red)" }}>{String(i + 1).padStart(2, "0")}</span>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, marginTop: "1.5mm" }}>{p.name}</div>
                <div className="pp-muted" style={{ fontSize: "7.8pt", marginTop: "1mm", lineHeight: 1.45 }}>{p.text}</div>
              </div>
            ))}
          </div>
          <div className="pp-red" style={{ marginTop: "8mm", padding: "6mm" }}>
            <div className="pp-label">Quality at every stage</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5mm 7mm", marginTop: "3mm", fontSize: "8pt" }}>
              {QUALITY_STAGES.map((q) => <div key={q.name}>— {q.name}</div>)}
            </div>
          </div>
          <div style={{ marginTop: "auto", marginBottom: "8mm", border: ".3mm dashed #b3aba7", padding: "4mm", fontSize: "7.8pt", color: "var(--ink2)" }}>
            Equipment models, plant details and capacity figures are confirmed per enquiry and added to this brochure once verified.
          </div>
        </div>
        <PFooter label={L} page={2} />
      </section>
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><PLogo h={11} /><span className="pp-label">Capabilities by vertical</span></div>
          <div style={{ display: "grid", gap: "4.5mm", marginTop: "10mm" }}>
            {verticals.map((v, i) => (
              <div key={v.id} style={{ display: "grid", gridTemplateColumns: "40mm 1fr", gap: "5mm", borderTop: i ? ".3mm solid var(--line)" : undefined, paddingTop: i ? "4.5mm" : 0 }}>
                <PImg image={v.image} caption={false} style={{ height: "30mm" }} />
                <div>
                  <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "11pt" }}>{v.name}</div>
                  <div className="pp-muted" style={{ fontSize: "7.4pt", marginTop: "1mm" }}>{productsInVertical(v.id).map((p) => p.shortName ?? p.name).join(" · ")}</div>
                  <div style={{ fontSize: "7.4pt", marginTop: "1.5mm", color: "var(--ink2)" }}>{v.technologies.map((t) => t.name).join(" · ")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PFooter label={L} page={3} />
      </section>
      <BackCover title="Have a production requirement to discuss?" />
    </>
  );
}
