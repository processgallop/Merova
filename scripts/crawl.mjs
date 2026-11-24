/**
 * QA crawler: visits every page reachable from the home page and sitemap and checks
 *  - HTTP status of every internal link, image and download
 *  - console errors / page errors
 *  - unique <title> and meta description, exactly one <h1>, images with alt
 * Usage: BASE=http://localhost:3100 node scripts/crawl.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
let current = "";
page.on("pageerror", (e) => errors.push(`${current}: pageerror ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`${current}: console ${m.text()}`); });

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const queue = new Set(["/", ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)]);
const visited = new Set();
const assets = new Set();
const titles = new Map();
const descs = new Map();
const problems = [];

while (queue.size) {
  const path = queue.values().next().value;
  queue.delete(path);
  if (visited.has(path)) continue;
  visited.add(path);
  current = path;
  const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (!res || res.status() !== 200) { problems.push(`${path}: HTTP ${res?.status()}`); continue; }
  const info = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content ?? "",
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    robots: document.querySelector('meta[name="robots"]')?.content ?? "",
    h1: document.querySelectorAll("h1").length,
    noAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).map((i) => i.src),
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== "lazy").map((i) => i.src),
    links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    imgs: [...document.images].map((i) => i.currentSrc || i.src),
  }));
  if (info.h1 !== 1) problems.push(`${path}: ${info.h1} <h1> elements`);
  if (!info.desc) problems.push(`${path}: missing meta description`);
  if (!info.canonical) problems.push(`${path}: missing canonical`);
  if (info.noAlt.length) problems.push(`${path}: images without alt ${info.noAlt.join(", ")}`);
  if (info.broken.length) problems.push(`${path}: broken images ${info.broken.join(", ")}`);
  if (!info.robots.includes("noindex")) {
    titles.set(info.title, [...(titles.get(info.title) ?? []), path]);
    descs.set(info.desc, [...(descs.get(info.desc) ?? []), path]);
  }
  for (const href of info.links) {
    if (!href || href.startsWith("#") || /^(mailto:|tel:|https?:\/\/(?!localhost))/.test(href)) continue;
    const u = new URL(href, BASE + path);
    if (u.origin !== new URL(BASE).origin) continue;
    if (/\.(pdf|png|jpe?g|webp|svg)$/.test(u.pathname)) assets.add(u.pathname);
    else if (!visited.has(u.pathname)) queue.add(u.pathname);
  }
  for (const src of info.imgs) { const u = new URL(src, BASE); if (u.origin === new URL(BASE).origin) assets.add(u.pathname + u.search); }
}

for (const a of assets) {
  const r = await fetch(BASE + a, { method: "GET" });
  if (r.status !== 200) problems.push(`asset ${a}: HTTP ${r.status}`);
}
for (const [t, ps] of titles) if (ps.length > 1) problems.push(`duplicate title "${t}" on ${ps.join(", ")}`);
for (const [, ps] of descs) if (ps.length > 1) problems.push(`duplicate description on ${ps.join(", ")}`);

await browser.close();
console.log(`pages crawled: ${visited.size}, assets checked: ${assets.size}`);
const uniqErrors = [...new Set(errors)];
console.log(`console/page errors: ${uniqErrors.length}`);
uniqErrors.slice(0, 20).forEach((e) => console.log("  " + e));
console.log(`problems: ${problems.length}`);
problems.slice(0, 60).forEach((p) => console.log("  " + p));
process.exit(problems.length || uniqErrors.length ? 1 : 0);
