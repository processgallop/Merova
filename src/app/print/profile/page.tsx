import { industries, productsInVertical, verticals, products } from "@/data/catalog";
import { PROCESS_STEPS, QUALITY_STAGES, SUSTAINABILITY_TOPICS } from "@/data/company";
import { Cover, BackCover } from "@/components/print/Cover";
import { PFooter, PLogo, IMG_NOTE } from "@/components/print/PrintKit";
import { site } from "@/lib/site";

export default function ProfilePrint() {
  return (
    <>
      <Cover eyebrow="Company profile" title="More Than Packaging. A Manufacturing Partner Built Around Your Business." subtitle="Multi-material packaging solutions: corrugated, paperboard, foodservice, flexible and custom." image="/assets/manufacturing/about-production-floor.webp" />
      <section className="pp">
        <div className="pp-body">
          <PLogo />
          <div className="pp-eyebrow" style={{ marginTop: "10mm" }}>About Merova</div>
          <h2 style={{ fontSize: "20pt", marginTop: 5 }}>A multi-material packaging solutions partner.</h2>
          <p style={{ color: "#3a404c", margin: "8pt 0 0", fontSize: "10.4pt" }}>{site.name} brings corrugated, paperboard, foodservice, flexible and custom packaging together under one accountable partner — {verticals.length} material verticals and {products.length} product formats serving {industries.length} industries. Recommendations start from your product and its route, not from a single process.</p>
          <p style={{ color: "#3a404c", margin: "8pt 0 0", fontSize: "10.4pt" }}><strong>Manufacturing philosophy:</strong> prove it on a sample, write it on the specification, then run it. Nothing goes to full production on an assumption.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "5mm", marginTop: "10mm" }}>
            {[
              ["Mission", "To supply every packaging format a customer needs through one accountable partner — on one agreed specification, to a date we have committed to."],
              ["Vision", "Packaging that is specified rather than guessed, so every pack is only as heavy, as printed and as costly as the job requires."],
              ["Brand promise", "Packaging, Perfected: engineered to protect your product, designed to perform on your line, on the shelf and in transit."],
            ].map(([k, v]) => (
              <div key={k} style={{ border: ".6pt solid #e2d9cb", borderRadius: 3, padding: "5mm" }}>
                <div className="pp-eyebrow">{k}</div>
                <div style={{ fontFamily: "var(--font-sora)", color: "#08162a", marginTop: 5, fontSize: "9.8pt", lineHeight: 1.4 }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="pp-h" style={{ marginTop: "10mm" }}>What we supply</div>
          <div style={{ display: "grid", gap: "3mm", marginTop: "3mm" }}>
            {verticals.map((v) => (
              <div key={v.id} style={{ display: "grid", gridTemplateColumns: "50mm 1fr", gap: "4mm", borderTop: ".6pt solid #e2d9cb", paddingTop: "3mm" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, color: "#08162a" }}>{v.name}</div>
                <div className="pp-muted" style={{ fontSize: "8.6pt" }}>{productsInVertical(v.id).map((p) => p.shortName ?? p.name).join(" · ")}</div>
              </div>
            ))}
          </div>
        </div>
        <PFooter label="Company profile" page="2" />
      </section>
      <section className="pp">
        <div className="pp-body">
          <div className="pp-eyebrow">Industries served</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3mm", marginTop: "4mm" }}>
            {industries.map((i) => (
              <div key={i.id} style={{ border: ".6pt solid #e2d9cb", borderRadius: 3, padding: "3.5mm" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, color: "#08162a" }}>{i.name}</div>
                <div className="pp-muted" style={{ fontSize: "8pt", marginTop: 2 }}>{i.headline}</div>
              </div>
            ))}
          </div>
          <div className="pp-eyebrow" style={{ marginTop: "9mm" }}>Our process</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "3mm", marginTop: "4mm" }}>
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.name} style={{ background: "#f5efe5", borderRadius: 3, padding: "3.5mm" }}>
                <div style={{ fontFamily: "var(--font-plex-mono)", color: "#b4231a", fontSize: "7.5pt" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, color: "#08162a", marginTop: 2 }}>{s.name}</div>
                <div className="pp-muted" style={{ fontSize: "8pt", marginTop: 2 }}>{s.short}</div>
              </div>
            ))}
          </div>
        </div>
        <PFooter label="Company profile" page="3" />
      </section>
      <section className="pp">
        <div className="pp-body">
          <div className="pp-eyebrow">Quality assurance</div>
          <h2 style={{ fontSize: "16pt", marginTop: 5 }}>Quality is not a final inspection. It is built into every stage.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3mm", marginTop: "5mm" }}>
            {QUALITY_STAGES.map((q) => (
              <div key={q.name} style={{ borderTop: ".6pt solid #e2d9cb", paddingTop: "3mm" }}>
                <div style={{ fontWeight: 700, color: "#08162a" }}>{q.name}</div>
                <div className="pp-muted" style={{ fontSize: "8.4pt", marginTop: 2 }}>{q.text}</div>
              </div>
            ))}
          </div>
          <div className="pp-eyebrow" style={{ marginTop: "9mm" }}>Sustainability</div>
          <h2 style={{ fontSize: "16pt", marginTop: 5 }}>Better packaging decisions begin with better material choices.</h2>
          <ul className="pp-list" style={{ columns: 2, columnGap: "8mm", marginTop: "4mm" }}>
            {SUSTAINABILITY_TOPICS.slice(0, 8).map((t) => <li key={t.name} style={{ breakInside: "avoid" }}><strong>{t.name}.</strong> <span className="pp-muted">{t.text}</span></li>)}
          </ul>
          <p className="pp-muted" style={{ fontSize: "7.4pt", marginTop: "auto", marginBottom: "5mm" }}>Certifications, client references, facility details and capacity figures are published only once verified. {IMG_NOTE}</p>
        </div>
        <PFooter label="Company profile" page="4" />
      </section>
      <BackCover />
    </>
  );
}
