/* eslint-disable @next/next/no-img-element */
import { BackPage, Cover } from "@/components/print/Spreads";
import { RunningHead, printImg } from "@/components/print/Kit";
import { categories, counts, industries, productsIn } from "@/data/catalog";
import { CLAIM_DEFINITIONS, CLIENT_SERVICE, PROCESS_STEPS, QUALITY_STAGES, VALUES } from "@/data/company";

const H = ({ children }: { children: React.ReactNode }) => <h2 className="pd" style={{ fontSize: "26pt", fontWeight: 700, margin: 0, lineHeight: 1.05 }}>{children}</h2>;
const E = ({ children }: { children: React.ReactNode }) => <p className="p-eyebrow" style={{ color: "#d52b1e", margin: "0 0 4mm" }}>{children}</p>;
const Card = ({ t, d }: { t: string; d: string }) => <div style={{ background: "#fff", border: "0.6pt solid #e6ddd1", borderRadius: "4mm", padding: "5mm" }}><p className="pd" style={{ fontSize: "11pt", fontWeight: 600, margin: 0 }}>{t}</p><p className="p-small" style={{ margin: "2mm 0 0", fontSize: "8pt" }}>{d}</p></div>;

export default function Profile() {
  return (
    <>
      <Cover kicker="Company profile" title="Packaging, Perfected." sub="Engineered to Protect. Designed to Perform. A multi-material printing and packaging partner." image="/assets/renders/scenes/about.webp" />
      <div className="page"><RunningHead label="Who we are" folio={2} />
        <div style={{ padding: "32mm 16mm 0" }}>
          <E>Who we are</E><H>One accountable partner across four materials.</H>
          <p className="p-body" style={{ fontSize: "10.5pt", marginTop: "7mm" }}>Merova Printpack specifies, prints and supplies packaging in paper, plastic and film, compostable and corrugated materials. We start from the product and how it is filled, stored, shipped and sold; specify the material and construction; prove it on a sample; and supply it to the approved reference, order after order.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4mm", marginTop: "10mm" }}>{[[counts.products, "product types"], [counts.industries, "industries"], [counts.operators, "business types mapped"]].map(([v, l]) => <div key={String(l)} style={{ background: "#d52b1e", color: "#fff", borderRadius: "4mm", padding: "6mm" }}><p className="pd" style={{ fontSize: "30pt", fontWeight: 700, margin: 0 }}>{v}</p><p style={{ fontSize: "8.5pt", margin: "1mm 0 0", color: "#f1f0ec" }}>{l}</p></div>)}</div>
          <E><span style={{ display: "block", marginTop: "12mm" }}>How we work</span></E>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm" }}>{VALUES.map((v) => <Card key={v.title} t={v.title} d={v.text} />)}</div>
        </div>
      </div>
      <div className="page"><RunningHead label="Portfolio" folio={3} />
        <div style={{ padding: "32mm 16mm 0" }}>
          <E>Portfolio</E><H>Four material categories.</H>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5mm", marginTop: "8mm" }}>{categories.map((c) => <div key={c.id} style={{ background: "#fff", border: "0.6pt solid #e6ddd1", borderRadius: "4mm", overflow: "hidden" }}><img src={printImg(c.image)} alt="" style={{ width: "100%", height: "44mm", objectFit: "cover" }} /><div style={{ padding: "4mm 5mm" }}><p className="pd" style={{ fontSize: "12pt", fontWeight: 600, margin: 0 }}>{c.name}</p><p className="p-small" style={{ margin: "1.5mm 0 0" }}>{productsIn(c.id).length} products. {c.intro}</p></div></div>)}</div>
        </div>
      </div>
      <div className="page"><RunningHead label="Industries" folio={4} />
        <div style={{ padding: "32mm 16mm 0" }}>
          <E>Industries</E><H>Packaging mapped to the businesses that buy it.</H>
          <div style={{ columns: 2, columnGap: "8mm", marginTop: "8mm" }}>{industries.map((i) => <div key={i.id} style={{ breakInside: "avoid", marginBottom: "5mm" }}><p className="pd" style={{ fontSize: "11pt", fontWeight: 600, margin: 0 }}>{i.name}</p><p className="p-small" style={{ margin: "1mm 0 0" }}>{i.operators.map((o) => o.name).join(" · ")}</p></div>)}</div>
        </div>
      </div>
      <div className="page"><RunningHead label="Process & quality" folio={5} />
        <div style={{ padding: "32mm 16mm 0" }}>
          <E>Process</E><H>Nine steps from requirement to repeat order.</H>
          <ol style={{ listStyle: "none", padding: 0, margin: "6mm 0 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3mm" }}>{PROCESS_STEPS.map((s, i) => <li key={s.name} style={{ background: "#fff", border: "0.6pt solid #e6ddd1", borderRadius: "3mm", padding: "3.5mm" }}><span className="pd" style={{ color: "#d52b1e", fontWeight: 700, fontSize: "10pt" }}>{String(i + 1).padStart(2, "0")}</span><p style={{ fontWeight: 700, fontSize: "9pt", margin: "1mm 0 0" }}>{s.name}</p><p className="p-small" style={{ margin: "1mm 0 0" }}>{s.short}</p></li>)}</ol>
          <E><span style={{ display: "block", marginTop: "9mm" }}>Quality</span></E>
          <ul className="p-list" style={{ columns: 2, columnGap: "8mm" }}>{QUALITY_STAGES.map((q) => <li key={q.name} style={{ breakInside: "avoid" }}><b>{q.name}.</b> {q.text}</li>)}</ul>
        </div>
      </div>
      <div className="page"><RunningHead label="Service & sustainability" folio={6} />
        <div style={{ padding: "32mm 16mm 0" }}>
          <E>Client servicing</E><H>A named person from enquiry to repeat order.</H>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5mm", marginTop: "6mm" }}>{CLIENT_SERVICE.slice(0, 6).map((c) => <Card key={c.name} t={c.name} d={c.text} />)}</div>
          <E><span style={{ display: "block", marginTop: "9mm" }}>Sustainability</span></E>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5mm" }}>{CLAIM_DEFINITIONS.map((d) => <Card key={d.term} t={d.term} d={d.text} />)}</div>
        </div>
      </div>
      <BackPage />
    </>
  );
}
