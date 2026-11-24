/**
 * Renders the default Open Graph image (1200×630) in the Merova Red brand system,
 * using the official reverse lockup and the hero product visualisation.
 * Logos and icons themselves are produced by scripts/brand-logos.mjs.
 * Run: node scripts/brand-assets.mjs
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";

const b64 = (p, type) => `data:${type};base64,${readFileSync(p).toString("base64")}`;
const logo = b64("public/assets/brand/merova-logo-reverse.svg", "image/svg+xml");
const mark = b64("public/assets/brand/merova-mark-cream.svg", "image/svg+xml");
const hero = b64("public/assets/products/renders/hero.webp", "image/webp");
const fonts = `<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600&family=Inter:wght@400;600;700&display=block" rel="stylesheet">`;

const html = `<html><head>${fonts}<style>body{margin:0}</style></head><body>
<div style="width:1200px;height:630px;position:relative;overflow:hidden;background:linear-gradient(150deg,#b8241a 0%,#d52b1e 50%,#a51f16 100%);font-family:Sora;color:#fffaf3">
  <img src="${mark}" style="position:absolute;left:-160px;bottom:-140px;width:900px;opacity:.09">
  <div style="position:absolute;right:0;top:0;bottom:0;width:560px;background:url(${hero}) 78% 50%/cover"></div>
  <div style="position:absolute;right:560px;top:0;bottom:0;width:120px;background:linear-gradient(90deg,#c4271b,transparent)"></div>
  <img src="${logo}" style="position:absolute;left:64px;top:56px;height:120px">
  <div style="position:absolute;left:64px;top:250px;font-size:84px;font-weight:600;letter-spacing:-3px;line-height:.98">Packaging,<br>Perfected.</div>
  <div style="position:absolute;left:64px;bottom:58px;font-family:Inter;font-size:24px">Engineered to Protect. Designed to Perform.</div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/assets/brand/og-default.png" });
await browser.close();
console.log("wrote public/assets/brand/og-default.png");
