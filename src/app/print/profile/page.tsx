/* eslint-disable @next/next/no-img-element */
import { industries, productsInVertical, verticals, products } from "@/data/catalog";
import { CLIENT_SERVICE, MANUFACTURING_PROCESSES, PROCESS_STEPS, QUALITY_STAGES, SUSTAINABILITY_TOPICS } from "@/data/company";
import { Cover, BackCover } from "@/components/print/Cover";
import { IMG_NOTE, PFooter, PImg, PLogo } from "@/components/print/PrintKit";
import { absoluteUrl, site } from "@/lib/site";

const L = "Company profile";

function PageHead({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <PLogo h={11} />
      <span className="pp-label">{label}</span>
    </div>
  );
}

export default function ProfilePrint() {
  return (
    <>
      <Cover eyebrow="Company profile" title="More Than Packaging. A Manufacturing Partner Built Around Your Business." subtitle="Corrugated, paperboard, foodservice, flexible and custom packaging — specified, sampled and supplied to your application." image="/assets/products/renders/hero.webp" />

      {/* 2 — About */}
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <PageHead label="About Merova" />
          <h2 style={{ fontSize: "24pt", lineHeight: 1.08, marginTop: "14mm", maxWidth: "150mm" }}>A multi-material packaging solutions partner.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8mm", marginTop: "8mm", color: "var(--ink2)", fontSize: "9.6pt", lineHeight: 1.6 }}>
            <p>{site.name} brings corrugated, paperboard, foodservice, flexible and custom packaging together under one accountable partner — {verticals.length} material verticals and {products.length} product formats serving {industries.length} industries.</p>
            <p>Recommendations start from your product and its route, not from a single process. Where nothing standard fits, packaging is developed from your drawings, photographs or samples. <b style={{ color: "var(--ink)" }}>Prove it on a sample, write it on the specification, then run it.</b></p>
          </div>
          <PImg image={{ src: "/assets/products/renders/qsr-range.webp", alt: "", kind: "render" }} style={{ height: "74mm", marginTop: "9mm" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "5mm", marginTop: "auto", marginBottom: "10mm" }}>
            {[
              ["Mission", "To supply every packaging format a customer needs through one accountable partner — on one agreed specification, to a date we have committed to."],
              ["Vision", "Packaging that is specified rather than guessed, so every pack is only as heavy, as printed and as costly as the job requires."],
              ["Brand promise", "Packaging, Perfected: engineered to protect your product, designed to perform on your line, on the shelf and in transit."],
            ].map(([k, v], i) => (
              <div key={k} className={i === 2 ? "pp-red" : ""} style={{ padding: "6mm", background: i === 2 ? undefined : "var(--paper2)", minHeight: "48mm" }}>
                <div className="pp-label">{k}</div>
                <p style={{ fontFamily: "var(--font-sora)", fontSize: "9.8pt", lineHeight: 1.42, marginTop: "3mm", fontWeight: 500 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
        <PFooter label={L} page={2} />
      </section>

      {/* 3 — What we supply */}
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <PageHead label="What we supply" />
          <h2 style={{ fontSize: "22pt", marginTop: "12mm" }}>Five packaging verticals.</h2>
          <div style={{ display: "grid", gap: "5mm", marginTop: "8mm" }}>
            {verticals.map((v, i) => (
              <div key={v.id} style={{ display: "grid", gridTemplateColumns: "52mm 1fr", gap: "6mm", alignItems: "center", borderTop: i ? ".3mm solid var(--line)" : undefined, paddingTop: i ? "5mm" : 0 }}>
                <PImg image={v.image} caption={false} style={{ height: "36mm" }} />
                <div>
                  <div style={{ display: "flex", gap: "3mm", alignItems: "baseline" }}>
                    <span style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "14pt", color: "var(--red)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 style={{ fontSize: "12.5pt" }}>{v.name}</h3>
                  </div>
                  <p className="pp-muted" style={{ fontSize: "8pt", marginTop: "1.5mm", lineHeight: 1.45 }}>{productsInVertical(v.id).map((p) => p.shortName ?? p.name).join(" · ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PFooter label={L} page={3} />
      </section>

      {/* 4 — Industries */}
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <PageHead label="Industries served" />
          <h2 style={{ fontSize: "22pt", marginTop: "12mm" }}>Packaging that understands your industry.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5mm", marginTop: "8mm" }}>
            {industries.map((i) => (
              <div key={i.id} style={{ display: "grid", gridTemplateColumns: "30mm 1fr", gap: "4mm", alignItems: "center", background: "var(--paper2)" }}>
                <PImg image={{ src: i.image, alt: "", kind: "render" }} caption={false} style={{ height: "30mm" }} />
                <div style={{ paddingRight: "3mm" }}>
                  <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "9.6pt" }}>{i.name}</div>
                  <div className="pp-muted" style={{ fontSize: "7.2pt", marginTop: "1mm", lineHeight: 1.4 }}>{i.headline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PFooter label={L} page={4} />
      </section>

      {/* 5 — Process (red) */}
      <section className="pp pp-red-deep">
        <img src="/assets/brand/merova-mark-cream.svg" alt="" className="pp-watermark" style={{ width: "220mm", left: "-50mm", bottom: "-30mm" }} />
        <div className="pp-body" style={{ paddingTop: "16mm", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <PLogo variant="reverse" h={11} />
            <span className="pp-label">Process excellence</span>
          </div>
          <h2 style={{ fontSize: "24pt", lineHeight: 1.08, marginTop: "14mm", maxWidth: "160mm" }}>From your first brief to final delivery. Every stage has a purpose.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4mm", marginTop: "10mm" }}>
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.name} style={{ background: "rgba(150,29,21,.45)", padding: "5mm", minHeight: "52mm" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontSize: "18pt", fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "10pt", marginTop: "2mm" }}>{s.name}</div>
                <p style={{ fontSize: "7.6pt", marginTop: "1.5mm", lineHeight: 1.45 }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <PFooter label={L} page={5} red />
      </section>

      {/* 6 — Manufacturing & quality */}
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <PageHead label="Manufacturing & quality" />
          <h2 style={{ fontSize: "20pt", lineHeight: 1.1, marginTop: "12mm" }}>The right processes. Quality built into every stage.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9mm", marginTop: "8mm" }}>
            <div>
              <div className="pp-h">Production journey</div>
              {MANUFACTURING_PROCESSES.map((p, i) => (
                <div key={p.name} style={{ display: "grid", gridTemplateColumns: "7mm 1fr", marginTop: i ? "2.6mm" : 0 }}>
                  <span style={{ fontFamily: "var(--font-sora)", fontWeight: 600, color: "var(--red)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div><b>{p.name}</b><div className="pp-muted" style={{ fontSize: "7.6pt", lineHeight: 1.4 }}>{p.text}</div></div>
                </div>
              ))}
            </div>
            <div>
              <div className="pp-h">Quality assurance</div>
              {QUALITY_STAGES.map((q, i) => (
                <div key={q.name} style={{ marginTop: i ? "2.6mm" : 0 }}>
                  <b>{q.name}</b>
                  <div className="pp-muted" style={{ fontSize: "7.6pt", lineHeight: 1.4 }}>{q.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "auto", marginBottom: "8mm", border: ".3mm dashed #b3aba7", padding: "4mm", fontSize: "7.8pt", color: "var(--ink2)" }}>
            Machinery, plant, capacity and certification details are published only once verified, and are available from the Merova team on request.
          </div>
        </div>
        <PFooter label={L} page={6} />
      </section>

      {/* 7 — Client servicing & sustainability */}
      <section className="pp">
        <div className="pp-body" style={{ paddingTop: "16mm" }}>
          <PageHead label="Partnership" />
          <h2 style={{ fontSize: "20pt", lineHeight: 1.1, marginTop: "12mm" }}>A responsive partner — before, during and after production.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm", marginTop: "7mm" }}>
            {CLIENT_SERVICE.map((c) => (
              <div key={c.name} style={{ borderLeft: ".8mm solid var(--red)", paddingLeft: "3.5mm" }}>
                <b>{c.name}</b>
                <div className="pp-muted" style={{ fontSize: "7.6pt", lineHeight: 1.4 }}>{c.text}</div>
              </div>
            ))}
          </div>
          <div className="pp-red" style={{ marginTop: "9mm", padding: "7mm" }}>
            <div className="pp-label">Sustainability</div>
            <h3 style={{ fontSize: "14pt", marginTop: "2.5mm" }}>Better packaging decisions begin with better material choices.</h3>
            <div style={{ columns: 2, columnGap: "7mm", marginTop: "4mm", fontSize: "7.8pt" }}>
              {SUSTAINABILITY_TOPICS.slice(0, 8).map((t) => (
                <p key={t.name} style={{ breakInside: "avoid", marginBottom: "2mm" }}><b>{t.name}.</b> {t.text}</p>
              ))}
            </div>
          </div>
          <p className="pp-muted" style={{ fontSize: "6.4pt", marginTop: "auto", marginBottom: "4mm" }}>
            Certifications, client references, facility details and capacity figures are published only once verified. {IMG_NOTE} More at <a href={absoluteUrl("/company")} style={{ color: "var(--red)" }}>{absoluteUrl("/company").replace(/^https?:\/\//, "")}</a>.
          </p>
        </div>
        <PFooter label={L} page={7} />
      </section>

      <BackCover />
    </>
  );
}
