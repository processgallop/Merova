/* eslint-disable @next/next/no-img-element */
import { PLogo, QR, ContactLines, printSrc } from "./PrintKit";
import { site, absoluteUrl } from "@/lib/site";

/** Full-bleed Merova Red cover with the reverse lockup and a hero visual. */
export function Cover({ eyebrow, title, subtitle, image, caption = "Product visualisation" }: { eyebrow: string; title: string; subtitle: string; image?: string; caption?: string }) {
  return (
    <section className="pp pp-red-deep">
      <img src="/assets/brand/merova-mark-cream.svg" alt="" className="pp-watermark" style={{ width: "230mm", right: "-60mm", top: "-30mm" }} />
      <div style={{ padding: "16mm 16mm 0", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <PLogo variant="reverse" h={24} />
        <span style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", marginTop: "3mm" }}>{eyebrow}</span>
      </div>
      <div style={{ padding: "0 16mm", position: "relative", marginTop: "22mm" }}>
        <div className="pp-label">{eyebrow}</div>
        <h1 style={{ fontSize: title.length > 60 ? "30pt" : "36pt", lineHeight: 1.02, marginTop: "6mm", maxWidth: "165mm", letterSpacing: "-0.035em" }}>{title}</h1>
        <p style={{ fontFamily: "var(--font-sora)", fontSize: "12.5pt", lineHeight: 1.4, marginTop: "7mm", maxWidth: "150mm" }}>{subtitle}</p>
      </div>
      {image && (
        <div className="pp-img" style={{ position: "relative", margin: "14mm 16mm 0", height: "88mm" }}>
          <img src={printSrc(image)} alt="" />
          <span className="pp-cap">{caption}</span>
        </div>
      )}
      <div style={{ marginTop: "auto", padding: "0 16mm 14mm", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: "var(--font-sora)", fontSize: "19pt", fontWeight: 600, letterSpacing: "-0.03em" }}>{site.tagline}</div>
          <div style={{ fontSize: "9pt", marginTop: "1mm" }}>{site.proposition}</div>
        </div>
        <a href={site.url} style={{ fontSize: "7.5pt", fontWeight: 700, letterSpacing: ".12em" }}>{site.url.replace(/^https?:\/\//, "").toUpperCase()}</a>
      </div>
    </section>
  );
}

/** Red divider page used between catalogue sections. */
export function Divider({ index, title, intro, image, page, label }: { index: string; title: string; intro: string; image: string; page: number; label: string }) {
  return (
    <section className="pp pp-red-deep">
      <img src="/assets/brand/merova-mark-cream.svg" alt="" className="pp-watermark" style={{ width: "200mm", left: "-40mm", bottom: "40mm" }} />
      <div style={{ padding: "16mm", position: "relative" }}>
        <PLogo variant="reverse" h={12} />
        <div style={{ fontFamily: "var(--font-sora)", fontSize: "64pt", fontWeight: 600, lineHeight: 1, marginTop: "26mm", letterSpacing: "-0.04em" }}>{index}</div>
        <h2 style={{ fontSize: "30pt", lineHeight: 1.05, marginTop: "6mm" }}>{title}</h2>
        <p style={{ fontSize: "10.5pt", lineHeight: 1.55, marginTop: "6mm", maxWidth: "150mm" }}>{intro}</p>
      </div>
      <div className="pp-img" style={{ position: "relative", margin: "auto 16mm 0", height: "96mm" }}>
        <img src={printSrc(image)} alt="" />
        <span className="pp-cap">{image.includes("/renders/") ? "Product visualisation" : "Representative image"}</span>
      </div>
      <div style={{ height: "14mm" }} />
      <div className="pp-foot pp-foot-red">
        <span><b>Merova Printpack</b> · Packaging, Perfected.</span>
        <span>{label}</span>
        <span className="pp-num">{String(page).padStart(2, "0")}</span>
      </div>
    </section>
  );
}

export async function BackCover({ title = "Let’s talk about your packaging." }: { title?: string }) {
  return (
    <section className="pp pp-red-deep">
      <img src="/assets/brand/merova-mark-cream.svg" alt="" className="pp-watermark" style={{ width: "240mm", right: "-70mm", bottom: "-20mm" }} />
      <div style={{ flex: 1, padding: "22mm 16mm", display: "flex", flexDirection: "column", position: "relative" }}>
        <PLogo variant="reverse" h={30} />
        <h2 style={{ fontSize: "32pt", lineHeight: 1.06, marginTop: "34mm", maxWidth: "160mm", letterSpacing: "-0.035em" }}>{title}</h2>
        <p style={{ fontSize: "11pt", lineHeight: 1.55, marginTop: "7mm", maxWidth: "140mm" }}>
          Tell us what you pack, how it ships and how many you need. The right Merova team will recommend a specification, arrange samples and send a quotation.
        </p>
        <div style={{ marginTop: "auto", display: "flex", gap: "10mm", alignItems: "center" }}>
          <a href={absoluteUrl("/request-a-quote")} style={{ background: "#fff", padding: "3mm", borderRadius: "1mm" }}><QR url={absoluteUrl("/request-a-quote")} size={30} /></a>
          <div>
            <div className="pp-label">Request a quote</div>
            <a href={absoluteUrl("/request-a-quote")} style={{ display: "block", fontFamily: "var(--font-sora)", fontSize: "13pt", fontWeight: 600, marginTop: "2mm" }}>{absoluteUrl("/request-a-quote").replace(/^https?:\/\//, "")}</a>
            <div style={{ marginTop: "3mm" }}><ContactLines light /></div>
          </div>
        </div>
        <div style={{ marginTop: "14mm", paddingTop: "5mm", borderTop: ".3mm solid rgba(255,250,243,.5)", display: "flex", justifyContent: "space-between", fontSize: "8pt" }}>
          <span style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "11pt" }}>{site.tagline}</span>
          <span>{site.proposition}</span>
        </div>
      </div>
    </section>
  );
}
