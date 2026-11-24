import { productsInVertical, verticals } from "@/data/catalog";
import { MANUFACTURING_PROCESSES, QUALITY_STAGES } from "@/data/company";
import { Cover, BackCover } from "@/components/print/Cover";
import { PFooter, PLogo } from "@/components/print/PrintKit";

export default function CapabilitiesPrint() {
  return (
    <>
      <Cover eyebrow="Manufacturing capabilities" title="The Right Infrastructure. The Right Processes. The Right Packaging Outcome." subtitle="How Merova takes packaging from material to dispatch, and what can be specified in each vertical." image="/assets/manufacturing/capabilities-press-hall.webp" />
      <section className="pp">
        <div className="pp-body">
          <PLogo />
          <div className="pp-eyebrow" style={{ marginTop: "10mm" }}>Production journey</div>
          <div style={{ display: "grid", gap: "3mm", marginTop: "4mm" }}>
            {MANUFACTURING_PROCESSES.map((p, i) => (
              <div key={p.name} style={{ display: "grid", gridTemplateColumns: "10mm 1fr", borderTop: ".6pt solid #e2d9cb", paddingTop: "3mm" }}>
                <span style={{ fontFamily: "var(--font-plex-mono)", color: "#b4231a" }}>{String(i + 1).padStart(2, "0")}</span>
                <div><strong style={{ color: "#08162a" }}>{p.name}</strong><div className="pp-muted" style={{ fontSize: "8.6pt" }}>{p.text}</div></div>
              </div>
            ))}
          </div>
          <div className="pp-eyebrow" style={{ marginTop: "9mm" }}>Quality stages</div>
          <ul className="pp-list" style={{ columns: 2, columnGap: "8mm" }}>{QUALITY_STAGES.map((q) => <li key={q.name} style={{ breakInside: "avoid" }}><strong>{q.name}</strong></li>)}</ul>
          <div style={{ marginTop: "auto", marginBottom: "6mm", background: "#fff8e8", border: ".6pt solid #efd9a6", borderRadius: 3, padding: "4mm", fontSize: "8.4pt", color: "#6b4a00" }}>
            Equipment models, plant details and capacity figures are confirmed per enquiry and will be added to this brochure once verified.
          </div>
        </div>
        <PFooter label="Manufacturing capabilities" page="2" />
      </section>
      <section className="pp">
        <div className="pp-body">
          <div className="pp-eyebrow">Capabilities by vertical</div>
          <div style={{ display: "grid", gap: "4mm", marginTop: "4mm" }}>
            {verticals.map((v) => (
              <div key={v.id} style={{ border: ".6pt solid #e2d9cb", borderRadius: 3, padding: "4mm" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, color: "#08162a", fontSize: "11pt" }}>{v.name}</div>
                <div className="pp-muted" style={{ fontSize: "8.2pt", marginTop: 2 }}>{productsInVertical(v.id).map((p) => p.shortName ?? p.name).join(" · ")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3mm", marginTop: "2mm", fontSize: "8.2pt" }}>
                  {v.technologies.map((t) => <div key={t.name}><strong>{t.name}:</strong> <span className="pp-muted">{t.text}</span></div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <PFooter label="Manufacturing capabilities" page="3" />
      </section>
      <BackCover title="Have a production requirement to discuss?" />
    </>
  );
}
