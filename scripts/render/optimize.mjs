// Converts rendered PNGs to web masters (WebP, used by next/image) and print JPEGs (used by PDFs).
import sharp from "sharp"; import fs from "node:fs"; import path from "node:path";
const src = process.argv[2] ?? "scripts/render/_png";
const only = process.argv.slice(3);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
for (const f of walk(src).filter((f) => f.endsWith(".png"))) {
  const rel = path.relative(src, f).replace(/\.png$/, "");
  if (only.length && !only.includes(rel)) continue;
  const web = path.join("public/assets/renders", `${rel}.webp`), jpg = path.join("public/assets/renders/print", `${rel}.jpg`);
  fs.mkdirSync(path.dirname(web), { recursive: true }); fs.mkdirSync(path.dirname(jpg), { recursive: true });
  await sharp(f).webp({ quality: 84, effort: 5 }).toFile(web);
  await sharp(f).resize({ width: 1600 }).jpeg({ quality: 86, mozjpeg: true }).toFile(jpg);
}
console.log("done");
