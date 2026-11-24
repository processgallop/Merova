/**
 * Renders raster brand assets (apple touch icon, 512px logo, default Open Graph
 * image) from the original Merova glyph SVG, using the pre-installed Chromium.
 * Run: node scripts/brand-assets.mjs
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";

const glyph = readFileSync(new URL("../public/assets/brand/merova-glyph-red.svg", import.meta.url), "utf8");
const d = glyph.match(/d="([^"]+)"/)[1];
const fontsCss = `<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600&family=IBM+Plex+Mono:wght@500&display=block" rel="stylesheet">`;
const mark = (fill) => `<svg viewBox="171 56 659 288" style="width:100%;height:auto;display:block"><path d="${d}" fill="${fill}"/></svg>`;

const jobs = [
  {
    out: "src/app/apple-icon.png", w: 180, h: 180,
    html: `<div style="width:180px;height:180px;background:#0d1f38;display:flex;align-items:center;justify-content:center"><div style="width:120px">${mark("#FFFAF3")}</div></div>`,
  },
  {
    out: "public/assets/brand/merova-logo-512.png", w: 512, h: 512,
    html: `<div style="width:512px;height:512px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;font-family:Sora"><div style="width:300px">${mark("#D52B1E")}</div><div style="font-size:64px;font-weight:600;letter-spacing:-2px;color:#08162a">Merova</div><div style="font-family:'IBM Plex Mono';font-size:20px;letter-spacing:9px;color:#5b6270;margin-top:-18px">PRINTPACK</div></div>`,
  },
  {
    out: "public/assets/brand/og-default.png", w: 1200, h: 630,
    html: `<div style="width:1200px;height:630px;background:#0d1f38;position:relative;overflow:hidden;font-family:Sora;color:#fff">
      <div style="position:absolute;inset:0;background-image:linear-gradient(to right,rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.05) 1px,transparent 1px);background-size:48px 48px"></div>
      <div style="position:absolute;left:80px;top:72px;display:flex;align-items:center;gap:18px"><div style="width:84px">${mark("#D52B1E")}</div><div><div style="font-size:40px;font-weight:600;letter-spacing:-1px">Merova</div><div style="font-family:'IBM Plex Mono';font-size:13px;letter-spacing:6px;color:rgba(255,255,255,.65)">PRINTPACK</div></div></div>
      <div style="position:absolute;left:80px;top:230px;font-size:92px;font-weight:600;letter-spacing:-3px;line-height:1">Packaging,<br><span style="color:#ef5a4c">Perfected.</span></div>
      <div style="position:absolute;left:80px;bottom:70px;font-size:26px;color:rgba(255,255,255,.8)">Engineered to Protect. Designed to Perform.</div>
      <div style="position:absolute;right:80px;bottom:70px;font-family:'IBM Plex Mono';font-size:15px;letter-spacing:2px;color:rgba(255,255,255,.6);text-align:right;line-height:1.8">CORRUGATED · PAPERBOARD<br>FOODSERVICE · FLEXIBLE · CUSTOM</div>
    </div>`,
  },
];

const browser = await chromium.launch();
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
  await page.setContent(`<html><head>${fontsCss}<style>body{margin:0}</style></head><body>${j.html}</body></html>`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: j.out, clip: { x: 0, y: 0, width: j.w, height: j.h } });
  await page.close();
  console.log("wrote", j.out);
}
await browser.close();
