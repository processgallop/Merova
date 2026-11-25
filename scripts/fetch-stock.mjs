import sharp from "sharp";
import { readFileSync, existsSync } from "node:fs";
const src = readFileSync("src/db/seed/stock.ts", "utf8");
const re = /file: "([^"]+)", photo: "([^"]+)"/g;
let m;
while ((m = re.exec(src))) {
  const [, file, photo] = m;
  const out = `public/assets/stock/${file}`;
  if (existsSync(out)) continue;
  const res = await fetch(`https://images.unsplash.com/${photo}?ixlib=rb-4.1.0&q=85&fm=jpg&w=2200&fit=max`);
  if (!res.ok) { console.error("fail", file, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  console.log("ok", file);
}
