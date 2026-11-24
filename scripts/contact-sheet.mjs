// Dev utility: renders all generated illustrations into one PNG for visual review.
import { chromium } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
const dir = new URL("../public/assets/products/illustrations/", import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith(".svg")).sort();
const cell = (f) => `<div style="background:#fff;font:11px sans-serif"><img src="data:image/svg+xml;base64,${readFileSync(new URL(f, dir)).toString("base64")}" style="width:100%;display:block">${f}</div>`;
const html = `<html><body style="margin:0;display:grid;grid-template-columns:repeat(7,1fr);gap:4px;background:#999">${files.map(cell).join("")}</body></html>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1750, height: 1000 } });
await p.setContent(html);
await p.waitForTimeout(500);
await p.screenshot({ path: process.argv[2], fullPage: true });
await b.close();
