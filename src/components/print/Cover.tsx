import { PLogo, QR, ContactBlock, printSrc } from "./PrintKit";
import { site, absoluteUrl } from "@/lib/site";

export function Cover({ eyebrow, title, subtitle, image }: { eyebrow: string; title: string; subtitle: string; image?: string }) {
  return (
    <section className="pp pp-grid" style={{ background: "#0d1f38", color: "#fff" }}>
      <div style={{ padding: "16mm 16mm 0" }}><PLogo light size={1.5} /></div>
      <div style={{ flex: 1, padding: "0 16mm", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="pp-eyebrow" style={{ color: "#f3b1aa" }}>{eyebrow}</div>
        <h1 style={{ color: "#fff", fontSize: "38pt", lineHeight: 1.04, marginTop: 10 }}>{title}</h1>
        <p style={{ fontFamily: "var(--font-sora)", fontSize: "14pt", color: "rgba(255,255,255,.8)", margin: "14pt 0 0", maxWidth: "140mm" }}>{subtitle}</p>
        {image && (
          <div style={{ marginTop: "12mm", borderRadius: 4, overflow: "hidden", height: "78mm" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={printSrc(image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
      <div style={{ padding: "0 16mm 14mm", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: "var(--font-sora)", fontSize: "20pt", fontWeight: 600, color: "#ef5a4c" }}>{site.tagline}</div>
          <div style={{ color: "rgba(255,255,255,.75)", marginTop: 2 }}>{site.proposition}</div>
        </div>
        <div style={{ fontFamily: "var(--font-plex-mono)", fontSize: "7.5pt", letterSpacing: ".12em", color: "rgba(255,255,255,.6)" }}>{site.url.replace(/^https?:\/\//, "").toUpperCase()}</div>
      </div>
    </section>
  );
}

export async function BackCover({ title = "Let's talk about your packaging." }: { title?: string }) {
  return (
    <section className="pp" style={{ background: "#08162a", color: "#fff" }}>
      <div style={{ flex: 1, padding: "20mm 16mm", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <PLogo light size={1.4} />
        <h2 style={{ color: "#fff", fontSize: "28pt", lineHeight: 1.1, marginTop: "16mm", maxWidth: "150mm" }}>{title}</h2>
        <p style={{ color: "rgba(255,255,255,.75)", fontSize: "11pt", margin: "10pt 0 0", maxWidth: "140mm" }}>Tell us what you pack, how it ships and how many you need. The right Merova team will recommend a specification, arrange samples and send a quotation.</p>
        <div style={{ marginTop: "14mm", display: "flex", gap: "10mm", alignItems: "center" }}>
          <div style={{ background: "#fff", padding: 8, borderRadius: 4 }}><QR url={absoluteUrl("/request-a-quote")} size={110} /></div>
          <div>
            <div className="pp-eyebrow" style={{ color: "#f3b1aa" }}>Request a quote</div>
            <div style={{ fontFamily: "var(--font-sora)", fontSize: "13pt", fontWeight: 600, marginTop: 4 }}>{absoluteUrl("/request-a-quote").replace(/^https?:\/\//, "")}</div>
            <div style={{ marginTop: 10 }}><ContactBlock dark /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
