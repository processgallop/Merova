/**
 * Generates Merova's product format illustrations as SVG.
 *
 * These are clearly illustrations (not photographs) so they can never be
 * mistaken for Merova's factory, clients or products. Each one depicts the
 * actual format of the product it represents. Replace with original product
 * photography when available (see docs/ASSET-REGISTER.md).
 *
 * Run: node scripts/illustrations.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = new URL("../public/assets/products/illustrations/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const W = 800, H = 600;
const C = {
  bg: "#f3ede3", bg2: "#ebe2d4", floor: "#d9cdb9",
  kT: "#d8b289", kL: "#c69a6b", kR: "#b3875a", kIn: "#a87c50", kInD: "#946b43", kEdge: "#8a6440",
  wT: "#fbf9f5", wL: "#ece6dc", wR: "#ddd5c8", wIn: "#d2c9ba",
  navy: "#14304f", navy2: "#23416a", red: "#d52b1e", red2: "#b4231a",
  green: "#5e8f63", green2: "#46744b", ink: "#1b2230",
  film: "rgba(214,232,240,0.55)", filmEdge: "rgba(120,160,185,0.8)",
};

// ---------- isometric helpers ----------
const S = 1; const cos = Math.cos(Math.PI / 6), sin = Math.sin(Math.PI / 6);
let OX = 400, OY = 330;
const P = (x, y, z) => [OX + (x - y) * cos * S, OY + (x + y) * sin * S - z * S];
const pts = (arr) => arr.map((p) => P(...p).map((n) => n.toFixed(1)).join(",")).join(" ");
const poly = (arr, fill, extra = "") => `<polygon points="${pts(arr)}" fill="${fill}" stroke="rgba(40,30,20,0.18)" stroke-width="1" stroke-linejoin="round" ${extra}/>`;

function box(x, y, z, w, d, h, col = "k", extra = {}) {
  const T = col === "k" ? [C.kT, C.kL, C.kR] : col === "w" ? [C.wT, C.wL, C.wR] : col;
  return [
    poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], T[1]),
    poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], T[2]),
    extra.noTop ? "" : poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], T[0]),
  ].join("");
}

/** Open box with walls of thickness and four open flaps. */
function openBox(x, y, z, w, d, h, opts = {}) {
  const col = opts.white ? [C.wT, C.wL, C.wR, C.wIn, C.wIn] : [C.kT, C.kL, C.kR, C.kIn, C.kInD];
  const fl = opts.flap ?? 0.55; // flap length ratio of d / w
  const out = [];
  // back flaps (behind)
  if (!opts.noFlaps) {
    out.push(poly([[x, y, z + h], [x + w, y, z + h], [x + w, y - d * fl * 0.6, z + h + d * fl * 0.8], [x, y - d * fl * 0.6, z + h + d * fl * 0.8]], col[0]));
    out.push(poly([[x, y, z + h], [x, y + d, z + h], [x - w * fl * 0.6, y + d, z + h + w * fl * 0.8], [x - w * fl * 0.6, y, z + h + w * fl * 0.8]], col[1]));
  }
  // inner back walls
  out.push(poly([[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]], col[3]));
  out.push(poly([[x, y, z], [x, y + d, z], [x, y + d, z + h], [x, y, z + h]], col[4]));
  // floor
  out.push(poly([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]], col[4]));
  if (opts.inside) out.push(opts.inside);
  // front walls
  out.push(poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], col[1]));
  out.push(poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], col[2]));
  if (opts.band) out.push(opts.band);
  // front flaps (open outwards)
  if (!opts.noFlaps) {
    out.push(poly([[x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d + d * fl * 0.55, z + h + d * fl * 0.5], [x, y + d + d * fl * 0.55, z + h + d * fl * 0.5]], col[0]));
    out.push(poly([[x + w, y, z + h], [x + w, y + d, z + h], [x + w + w * fl * 0.55, y + d, z + h + w * fl * 0.5], [x + w + w * fl * 0.55, y, z + h + w * fl * 0.5]], col[0]));
  }
  return out.join("");
}

// ---------- 2D helpers ----------
const ell = (cx, cy, rx, ry, fill, extra = "") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const path = (d, fill, extra = "") =>
  `<path d="${d}" fill="${fill}" ${extra.includes("stroke=") ? "" : 'stroke="rgba(40,30,20,0.18)" stroke-width="1"'} stroke-linejoin="round" ${extra}/>`;
const shadow = (cx = 400, cy = 470, rx = 230, ry = 34) => ell(cx, cy, rx, ry, "url(#sh)");

/** Tapered cup/tub: top ellipse at (cx, top) radius rt, bottom at (cx, bot) radius rb. */
function cup(cx, top, bot, rt, rb, body, bands = [], opts = {}) {
  const ry = rt * 0.22, ryb = rb * 0.22;
  let s = path(`M${cx - rt},${top} L${cx - rb},${bot} A${rb},${ryb} 0 0 0 ${cx + rb},${bot} L${cx + rt},${top} Z`, body);
  for (const b of bands) {
    // band between t0..t1 (0 top, 1 bottom)
    const y0 = top + (bot - top) * b.t0, y1 = top + (bot - top) * b.t1;
    const r0 = rt + (rb - rt) * b.t0, r1 = rt + (rb - rt) * b.t1;
    s += path(`M${cx - r0},${y0} A${r0},${r0 * 0.22} 0 0 0 ${cx + r0},${y0} L${cx + r1},${y1} A${r1},${r1 * 0.22} 0 0 1 ${cx - r1},${y1} Z`, b.fill, 'stroke="none"');
  }
  // shading
  s += `<path d="M${cx + rt * 0.35},${top + ry} L${cx + rb * 0.35},${bot + ryb} A${rb},${ryb} 0 0 0 ${cx + rb},${bot} L${cx + rt},${top} Z" fill="rgba(0,0,0,0.09)"/>`;
  s += `<path d="M${cx - rt * 0.75},${top + ry * 0.7} L${cx - rb * 0.75},${bot + ryb * 0.7}" stroke="rgba(255,255,255,0.45)" stroke-width="6" stroke-linecap="round"/>`;
  if (!opts.noRim) {
    s += ell(cx, top, rt, ry, opts.inner ?? "#e8dfd0", 'stroke="rgba(40,30,20,0.25)" stroke-width="1.5"');
    s += ell(cx, top, rt - 2, ry - 1, "none", 'stroke="rgba(255,255,255,0.7)" stroke-width="3"');
  }
  return s;
}

function popcorn(cx, cy, r, n = 26, seed = 3) {
  let s = "", rnd = seed;
  const rand = () => ((rnd = (rnd * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * r;
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.45 - rand() * r * 0.35;
    const k = 9 + rand() * 9;
    s += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><circle r="${k}" fill="#fff6dc"/><circle cx="${k * 0.6}" cy="${-k * 0.3}" r="${k * 0.7}" fill="#fffaf0"/><circle cx="${-k * 0.5}" cy="${-k * 0.4}" r="${k * 0.6}" fill="#f6e3b0"/><circle cx="${k * 0.1}" cy="${k * 0.25}" r="${k * 0.35}" fill="#e8c27a"/></g>`;
  }
  return s;
}

/** Upright roll: cx, base y, radius, height */
function roll(cx, by, r, h, body, opts = {}) {
  const ry = r * 0.32, ty = by - h;
  let s = "";
  if (opts.tail) s += opts.tail;
  s += path(`M${cx - r},${ty} L${cx - r},${by} A${r},${ry} 0 0 0 ${cx + r},${by} L${cx + r},${ty} Z`, body);
  s += `<path d="M${cx + r * 0.25},${ty + ry * 0.95} L${cx + r * 0.25},${by + ry * 0.95} A${r},${ry} 0 0 0 ${cx + r},${by} L${cx + r},${ty} Z" fill="rgba(0,0,0,0.08)"/>`;
  s += `<path d="M${cx - r * 0.7},${ty + ry * 0.7} L${cx - r * 0.7},${by + ry * 0.7}" stroke="rgba(255,255,255,0.6)" stroke-width="10" stroke-linecap="round"/>`;
  if (opts.stripes) for (let i = 1; i < 7; i++) s += `<path d="M${cx - r},${ty + (h * i) / 7} A${r},${ry} 0 0 0 ${cx + r},${ty + (h * i) / 7}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>`;
  s += ell(cx, ty, r, ry, opts.top ?? body, 'stroke="rgba(40,30,20,0.25)" stroke-width="1.5"');
  for (let i = 1; i < 5; i++) s += ell(cx, ty, r * (1 - i * 0.13), ry * (1 - i * 0.13), "none", 'stroke="rgba(255,255,255,0.35)" stroke-width="1"');
  s += ell(cx, ty, r * 0.3, ry * 0.3, "#c9a77f", 'stroke="#8a6440" stroke-width="2"');
  s += ell(cx, ty, r * 0.2, ry * 0.2, "#6b4f33");
  return s;
}

const logoMark = (x, y, s = 1, fill = C.red) =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,10 C8,-6 18,-6 26,6 C34,18 44,18 52,4" fill="none" stroke="${fill}" stroke-width="6" stroke-linecap="round"/></g>`;

const FRAME = { k: 0.84, dy: 46 };
function svg(name, body, title, frame = {}) {
  const { k, dy } = { ...FRAME, ...frame };
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${title}">
<title>${title}</title>
<defs>
<radialGradient id="bgG" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#f8f4ec"/><stop offset="1" stop-color="${C.bg2}"/></radialGradient>
<radialGradient id="sh" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="rgba(60,40,20,0.30)"/><stop offset="1" stop-color="rgba(60,40,20,0)"/></radialGradient>
<pattern id="flute" width="14" height="10" patternUnits="userSpaceOnUse"><path d="M0,9 Q3.5,1 7,9 T14,9" fill="none" stroke="${C.kEdge}" stroke-width="1.6"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="url(#bgG)"/>
<g transform="translate(400 ${300 + dy}) scale(${k}) translate(-400 -300)">
${body}
</g>
</svg>`;
  writeFileSync(new URL(`${name}.svg`, OUT), s);
}

/** Board cross-section callout showing ply count. */
function plyCallout(flutes, x = 600, y = 150) {
  const w = 230, layer = 8, fluteH = 22;
  const h = (flutes + 1) * layer + flutes * fluteH;
  let s = `<g transform="translate(${x},${y})"><rect x="-18" y="-40" width="${w + 36}" height="${h + 62}" rx="10" fill="#fff" stroke="#e2d9cb"/><text x="0" y="-12" font-family="IBM Plex Mono, monospace" font-size="17" font-weight="600" letter-spacing="1.5" fill="${C.navy}">${flutes * 2 + 1}-PLY BOARD</text>`;
  let cy = 0;
  for (let i = 0; i <= flutes; i++) {
    s += `<rect x="0" y="${cy}" width="${w}" height="${layer}" fill="${C.kL}"/>`;
    cy += layer;
    if (i < flutes) {
      let d = `M0,${cy + fluteH}`;
      for (let k = 0; k < w; k += 16) d += ` Q${k + 4},${cy} ${k + 8},${cy} Q${k + 12},${cy} ${k + 16},${cy + fluteH}`;
      s += `<path d="${d}" fill="none" stroke="${C.kEdge}" stroke-width="2"/>`;
      cy += fluteH;
    }
  }
  return s + `</g>`;
}

// ================== CORRUGATED ==================
function plyBox(n) {
  OX = 330; OY = 330;
  const band = poly([[0, 230, 60], [210, 230, 60], [210, 230, 90], [0, 230, 90]], C.red, 'opacity="0.9"');
  return shadow(390, 470, 250, 40) + openBox(0, 0, 0, 210, 230, 170, { band }) + plyCallout(n);
}
svg("box-3ply", plyBox(1), "3-ply corrugated box", { k: 0.8, dy: 60 });
svg("box-5ply", plyBox(2), "5-ply corrugated box", { k: 0.8, dy: 60 });
svg("box-7ply", (() => { OX = 330; OY = 330; return shadow(390, 470, 250, 40) + openBox(0, 0, 0, 230, 240, 175, { flap: 0.45 }) + plyCallout(3, 600, 110); })(), "7-ply corrugated box", { k: 0.8, dy: 60 });

svg("die-cut-box", (() => {
  OX = 400; OY = 330;
  let s = shadow(400, 470, 240, 36);
  s += box(-120, -90, 0, 240, 180, 70, "k");
  // lid hinged at back, open at angle
  s += poly([[-120, -90, 70], [120, -90, 70], [120, -90 - 60, 70 + 160], [-120, -90 - 60, 70 + 160]], C.kL);
  s += poly([[-120, -90 - 60, 70 + 160], [120, -90 - 60, 70 + 160], [120, -90 - 40, 70 + 175], [-120, -90 - 40, 70 + 175]], C.kT);
  // inside
  s += poly([[-110, -80, 70], [110, -80, 70], [110, 80, 70], [-110, 80, 70]], C.kInD);
  s += poly([[-110, -80, 30], [110, -80, 30], [110, 80, 30], [-110, 80, 30]], C.kIn).replace("polygon", 'polygon opacity="0.7"');
  s += poly([[-120, 90, 40], [120, 90, 40], [120, 90, 52], [-120, 90, 52]], C.red);
  return s;
})(), "Die-cut corrugated mailer box", { k: 0.8, dy: 70 });

svg("heavy-duty", (() => {
  OX = 390; OY = 330;
  let s = shadow(400, 480, 270, 42);
  // pallet
  s += box(-150, -150, 0, 300, 300, 14, [C.kT, "#9c7a55", "#86674a"]);
  s += box(-150, -150, 14, 300, 300, 4, ["#c9aa82", "#9c7a55", "#86674a"]);
  const bx = (x, y, z) => box(x, y, z, 145, 145, 110, "k") + poly([[x, y + 145, z + 50], [x + 145, y + 145, z + 50], [x + 145, y + 145, z + 62], [x, y + 145, z + 62]], C.navy);
  s += bx(-148, -148, 18) + bx(3, -148, 18) + bx(-148, 3, 18) + bx(3, 3, 18);
  s += bx(-148, -148, 128) + bx(3, -148, 128) + bx(-148, 3, 128) + bx(3, 3, 128);
  // strapping
  s += poly([[-150, -2, 238], [150, -2, 238], [150, 4, 238], [-150, 4, 238]], C.red);
  s += poly([[-2, 150, 18], [4, 150, 18], [4, 150, 238], [-2, 150, 238]], C.red);
  return s;
})(), "Heavy-duty corrugated cases on a pallet", { k: 0.76, dy: 62 });

svg("export-carton", (() => {
  OX = 400; OY = 330;
  let s = shadow(400, 475, 250, 40);
  s += box(-130, -110, 0, 260, 220, 190, "k");
  // shipping marks on front-left face (y = 110)
  const f = (x, z) => P(x, 110, z);
  const a1 = f(-110, 160);
  s += `<g transform="translate(${a1[0]},${a1[1]}) skewY(30)" font-family="IBM Plex Mono, monospace" fill="${C.ink}"><text x="0" y="0" font-size="16" font-weight="700">EXPORT</text><text x="0" y="20" font-size="11">GROSS WT ___ KG</text><text x="0" y="36" font-size="11">CTN NO. __ / __</text></g>`;
  // handling arrows on right face
  const r = P(130, -60, 150);
  s += `<g transform="translate(${r[0]},${r[1]}) skewY(-30)" fill="${C.ink}"><path d="M0,0 l8,-14 l8,14 h-5 v14 h-6 v-14z"/><path d="M22,0 l8,-14 l8,14 h-5 v14 h-6 v-14z"/><rect x="-2" y="18" width="42" height="2"/></g>`;
  const u = P(130, -20, 70);
  s += `<g transform="translate(${u[0]},${u[1]}) skewY(-30)" stroke="${C.ink}" stroke-width="2.5" fill="none"><path d="M0,0 h18 l-4,22 h-10z"/><path d="M9,0 v-8"/></g>`;
  s += poly([[-130, 110, 20], [130, 110, 20], [130, 110, 34], [-130, 110, 34]], C.red);
  return s;
})(), "Export carton with shipping marks and handling symbols");

svg("ecommerce-mailer", (() => {
  OX = 400; OY = 340;
  let s = shadow(400, 470, 250, 36);
  s += box(-130, -100, 0, 260, 200, 80, [C.wT, C.wL, C.wR]);
  s += poly([[-122, -92, 80], [122, -92, 80], [122, 92, 80], [-122, 92, 80]], C.navy2);
  // lid open back
  s += poly([[-130, -100, 80], [130, -100, 80], [130, -150, 270], [-130, -150, 270]], C.navy);
  s += poly([[-130, -150, 270], [130, -150, 270], [130, -128, 280], [-130, -128, 280]], C.navy2);
  // tissue / product
  s += box(-70, -50, 80, 140, 100, 22, [C.kT, C.kL, C.kR]);
  s += logoMark(...P(-20, 0, 102), 1.2, C.red);
  s += poly([[-130, 100, 30], [130, 100, 30], [130, 100, 40], [-130, 100, 40]], C.red);
  return s;
})(), "Printed e-commerce mailer box, open", { k: 0.78, dy: 74 });

svg("tray", (() => {
  OX = 400; OY = 340;
  const inside = [0, 1, 2].map((i) => [0, 1].map((j) => {
    const x = -100 + i * 70 + 35, y = -70 + j * 75 + 37;
    const p = P(x, y, 0); return ell(p[0], p[1] - 70, 26, 10, "#5e8f63") + `<rect x="${p[0] - 26}" y="${p[1] - 70}" width="52" height="70" fill="#4d7a52"/>` + ell(p[0], p[1], 26, 10, "#46744b") + ell(p[0], p[1] - 70, 26, 10, "#7fb085") + ell(p[0], p[1] - 70, 8, 3, "#dfe9d8");
  }).join("")).join("");
  return shadow(400, 470, 250, 36) + openBox(-110, -80, 0, 220, 160, 55, { noFlaps: true, inside }) ;
})(), "Corrugated tray holding bottles");

svg("partitions", (() => {
  OX = 400; OY = 330;
  let inside = "";
  const h = 140;
  for (let i = 1; i < 3; i++) inside += poly([[-110 + i * 73, -100, 0], [-110 + i * 73, 100, 0], [-110 + i * 73, 100, h], [-110 + i * 73, -100, h]], C.kL);
  for (let j = 1; j < 3; j++) inside += poly([[-110, -100 + j * 67, 0], [110, -100 + j * 67, 0], [110, -100 + j * 67, h], [-110, -100 + j * 67, h]], C.kR);
  return shadow(400, 470, 250, 40) + openBox(-110, -100, 0, 220, 200, h, { inside, flap: 0.45 });
})(), "Corrugated partitions inside an open box", { k: 0.8, dy: 60 });

svg("display-unit", (() => {
  OX = 400; OY = 360;
  let s = shadow(400, 500, 200, 30);
  s += box(-80, -60, 0, 160, 120, 300, [C.wT, C.wL, C.wR]);
  for (let k = 0; k < 3; k++) {
    const z = 30 + k * 90;
    s += poly([[-80, 60, z], [80, 60, z], [80, 60, z + 70], [-80, 60, z + 70]], "#efe7da");
    s += box(-70, 20, z, 140, 40, 8, [C.kT, C.kL, C.kR]);
    for (let n = 0; n < 4; n++) s += box(-66 + n * 34, 26, z + 8, 28, 28, 44, [C.red, C.red2, "#9d1f17"]);
  }
  // header board
  s += poly([[-90, 60, 300], [90, 60, 300], [90, 60, 380], [-90, 60, 380]], C.navy);
  s += poly([[90, -60, 300], [90, 60, 300], [90, 60, 380], [90, -60, 380]], C.navy2);
  s += logoMark(...P(-30, 60, 350), 1.4, "#fff");
  return s;
})(), "Corrugated floor-standing display unit", { k: 0.7, dy: 78 });

// ================== PAPERBOARD ==================
function carton({ w = 110, d = 70, h = 220, front, side, top = C.wT, ox = 400, oy = 380, extra = "" }) {
  OX = ox; OY = oy;
  return box(-w / 2, -d / 2, 0, w, d, h, [top, front, side]) + extra;
}
svg("mono-carton", (() => {
  let s = shadow(420, 470, 200, 30);
  OX = 360; OY = 400;
  s += box(-55, -40, 0, 110, 80, 250, [C.wT, C.wL, C.wR]);
  s += poly([[-55, 40, 160], [55, 40, 160], [55, 40, 210], [-55, 40, 210]], C.navy);
  s += poly([[55, -40, 160], [55, 40, 160], [55, 40, 210], [55, -40, 210]], C.navy2);
  s += poly([[-55, 40, 20], [55, 40, 20], [55, 40, 34], [-55, 40, 34]], C.red);
  s += logoMark(...P(-30, 40, 120), 0.9, C.red);
  // bottle
  const bx = 520, by = 450;
  s += `<rect x="${bx - 40}" y="${by - 170}" width="80" height="170" rx="18" fill="#7d4a2a"/><rect x="${bx - 18}" y="${by - 215}" width="36" height="50" rx="6" fill="#7d4a2a"/><rect x="${bx - 22}" y="${by - 235}" width="44" height="26" rx="5" fill="${C.wT}" stroke="#cfc3b1"/><rect x="${bx - 40}" y="${by - 120}" width="80" height="60" fill="${C.wT}"/><rect x="${bx - 40}" y="${by - 120}" width="80" height="12" fill="${C.navy}"/><path d="M${bx - 28},${by - 160} v120" stroke="rgba(255,255,255,0.35)" stroke-width="8" stroke-linecap="round"/>`;
  return s;
})(), "Printed mono carton beside a bottle");

svg("pharma-carton", (() => {
  let s = shadow(400, 470, 240, 34);
  OX = 360; OY = 420;
  s += box(-120, -50, 0, 240, 100, 70, [C.wT, C.wL, C.wR]);
  s += poly([[-120, 50, 0], [-40, 50, 0], [-40, 50, 70], [-120, 50, 70]], "#e7eef6");
  s += poly([[-40, 50, 40], [120, 50, 40], [120, 50, 52], [-40, 50, 52]], C.navy);
  s += poly([[-120, 50, 10], [-40, 50, 10], [-40, 50, 18], [-120, 50, 18]], C.red);
  // blister strip
  const b = [470, 260];
  s += `<g transform="translate(${b[0]},${b[1]}) rotate(-12)"><rect x="0" y="0" width="210" height="96" rx="8" fill="#d7dde4" stroke="#aab4bf"/>`;
  for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) s += `<ellipse cx="${26 + i * 40}" cy="${26 + j * 44}" rx="15" ry="12" fill="#eef2f6" stroke="#9aa6b2"/><ellipse cx="${26 + i * 40}" cy="${26 + j * 44}" rx="9" ry="7" fill="#fff"/>`;
  s += `</g>`;
  return s;
})(), "Pharmaceutical carton with a blister strip");

svg("food-carton", carton({ w: 170, d: 70, h: 240, front: "#f6efe2", side: "#e6dccb", extra: (() => {
  let s = poly([[-85, 35, 140], [85, 35, 140], [85, 35, 240], [-85, 35, 240]], C.red);
  s += poly([[85, -35, 140], [85, 35, 140], [85, 35, 240], [85, -35, 240]], C.red2);
  for (let i = 0; i < 5; i++) { const p = P(-60 + i * 30, 35, 70 + (i % 2) * 18); s += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="12" ry="9" fill="#d49a4c"/>`; }
  s += logoMark(...P(-40, 35, 200), 1, "#fff");
  return s;
})() }) + shadow(400, 470, 200, 30).replace("<ellipse", '<ellipse opacity="0.8"'), "Printed food carton");

svg("window-carton", (() => {
  let s = shadow(400, 470, 220, 32);
  s += carton({ w: 200, d: 90, h: 170, front: C.wL, side: C.wR });
  // window on front face
  s += poly([[-70, 45, 40], [70, 45, 40], [70, 45, 130], [-70, 45, 130]], "#cfe2ea", 'opacity="0.9"');
  for (let i = 0; i < 4; i++) { const p = P(-50 + i * 33, 45, 75); s += `<circle cx="${p[0]}" cy="${p[1]}" r="17" fill="#c58b45"/><circle cx="${p[0] - 4}" cy="${p[1] - 4}" r="5" fill="#7a4b22"/>`; }
  s += poly([[-70, 45, 110], [70, 45, 110], [70, 45, 130], [-70, 45, 130]], "rgba(255,255,255,0.45)");
  s += poly([[-100, 45, 0], [100, 45, 0], [100, 45, 22], [-100, 45, 22]], C.navy);
  return s;
})(), "Carton with a clear film window");

svg("sleeve", (() => {
  OX = 400; OY = 360;
  let s = shadow(400, 470, 240, 34);
  s += box(-150, -90, 0, 300, 180, 50, [C.wT, "#f2ede4", "#e3dccf"]);
  s += box(-60, -94, 0, 120, 188, 54, [C.navy, C.navy2, "#0f2742"]);
  s += poly([[-60, 94, 20], [60, 94, 20], [60, 94, 30], [-60, 94, 30]], C.red);
  s += logoMark(...P(-15, 0, 54), 1, "#fff");
  return s;
})(), "Printed paperboard sleeve over a tray");

svg("gift-box", (() => {
  OX = 400; OY = 360;
  let s = shadow(400, 475, 240, 36);
  s += box(-120, -120, 0, 240, 240, 120, [C.navy, C.navy2, "#0f2742"]);
  s += box(-128, -128, 120, 256, 256, 40, [C.navy, "#1c3a60", "#122c4b"]);
  s += poly([[-128, -12, 160], [128, -12, 160], [128, 12, 160], [-128, 12, 160]], C.red);
  s += poly([[-12, -128, 160], [12, -128, 160], [12, 128, 160], [-12, 128, 160]], C.red);
  s += poly([[-128, 128, 120], [-12, 128, 120], [-12, 128, 160], [-128, 128, 160]], "rgba(0,0,0,0)");
  s += poly([[-12, 128, 0], [12, 128, 0], [12, 128, 160], [-12, 128, 160]], C.red2);
  s += poly([[128, -12, 0], [128, 12, 0], [128, 12, 160], [128, -12, 160]], C.red2);
  return s;
})(), "Premium gift box with lid and ribbon band");

svg("rigid-box", (() => {
  OX = 400; OY = 370;
  let s = shadow(400, 475, 250, 36);
  s += box(-130, -90, 0, 260, 180, 80, ["#1a1d24", "#23272f", "#15181e"]);
  s += poly([[-118, -78, 80], [118, -78, 80], [118, 78, 80], [-118, 78, 80]], "#efe7da");
  s += box(-60, -40, 80, 120, 80, 14, [C.wT, C.wL, C.wR]);
  // lid floating above, rotated feel
  OY = 250; OX = 430;
  s += box(-136, -96, 80, 272, 192, 36, ["#1f232b", "#2a2f38", "#181b21"]);
  s += poly([[-30, 96, 92], [30, 96, 92], [30, 96, 104], [-30, 96, 104]], "#c9a45a");
  return s;
})(), "Rigid presentation box with lid lifted", { k: 0.82, dy: 50 });

svg("paper-bag", (() => {
  let s = shadow(400, 480, 190, 28);
  s += path("M290,200 L470,200 L490,470 L270,470 Z", C.kL);
  s += path("M470,200 L540,180 L560,450 L490,470 Z", C.kR);
  s += path("M290,200 L470,200 L540,180 L360,180 Z", C.kIn);
  s += `<path d="M330,200 C330,120 430,120 430,200" fill="none" stroke="${C.kEdge}" stroke-width="9" stroke-linecap="round"/>`;
  s += path("M285,300 L478,300 L482,350 L281,350 Z", C.navy, 'stroke="none"');
  s += logoMark(350, 318, 1.2, "#fff");
  return s;
})(), "Printed kraft paper carry bag");

// ================== FOODSERVICE ==================
const stripes = (n, a, b) => Array.from({ length: n }, (_, i) => ({ t0: i / n, t1: (i + 0.5) / n, fill: i % 2 ? a : b }));

svg("popcorn-cone", (() => {
  let s = shadow(400, 500, 120, 20);
  s += popcorn(400, 175, 115, 30, 7);
  s += path("M290,190 L400,500 L510,190 Z", C.wT);
  for (let i = 0; i < 5; i++) s += path(`M${300 + i * 44},190 L400,500 L${322 + i * 44},190 Z`, i % 2 ? C.red : C.wT, 'stroke="none"');
  s += path("M290,190 L400,500 L510,190 Z", "none");
  s += path("M290,190 Q400,215 510,190 L505,205 Q400,230 295,205 Z", C.navy, 'stroke="none"');
  s += popcorn(400, 170, 80, 10, 11);
  return s;
})(), "Printed paper popcorn cone with popcorn");

svg("popcorn-tub", (() => {
  let s = shadow(400, 500, 170, 28);
  s += popcorn(400, 170, 150, 40, 5);
  s += cup(400, 185, 485, 160, 112, C.wT, stripes(8, C.wT, C.red), { inner: "#f5e6c4" });
  s += popcorn(400, 160, 120, 18, 13);
  const p = [400, 330];
  s += `<rect x="${p[0] - 70}" y="${p[1] - 26}" width="140" height="52" rx="4" fill="${C.navy}"/><text x="${p[0]}" y="${p[1] + 7}" text-anchor="middle" font-family="Sora, sans-serif" font-weight="700" font-size="22" fill="#fff" letter-spacing="2">POPCORN</text>`;
  return s;
})(), "Printed popcorn tub with popcorn");

svg("nachos-tray", (() => {
  OX = 400; OY = 360;
  let s = shadow(400, 460, 250, 34);
  s += box(-150, -100, 0, 300, 200, 40, [C.wT, C.wL, C.wR], {});
  s += poly([[-140, -90, 40], [60, -90, 40], [60, 90, 40], [-140, 90, 40]], "#e8dfcf");
  // dip well
  const c = P(105, 0, 40);
  s += ell(c[0], c[1], 48, 26, "#d8cdbb") + ell(c[0], c[1] + 3, 40, 20, "#f0b429") + ell(c[0] - 10, c[1] - 2, 12, 5, "#ffd76a");
  // chips
  let rnd = 4; const rand = () => ((rnd = (rnd * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 22; i++) {
    const p = P(-130 + rand() * 170, -80 + rand() * 160, 40 + rand() * 30);
    const a = rand() * 360, k = 26 + rand() * 10;
    s += `<path transform="translate(${p[0]},${p[1]}) rotate(${a})" d="M0,${-k} L${k * 0.9},${k * 0.6} L${-k * 0.9},${k * 0.6} Z" fill="${["#e9b955", "#f0c76a", "#dba443"][i % 3]}" stroke="#c18a2c" stroke-width="1"/>`;
  }
  s += poly([[-150, 100, 12], [150, 100, 12], [150, 100, 22], [-150, 100, 22]], C.red);
  return s;
})(), "Paperboard nachos tray with dip compartment");

svg("fries-carton", (() => {
  let s = shadow(400, 490, 140, 22);
  for (let i = 0; i < 16; i++) { const x = 312 + i * 11.5, top = 130 + (i * 37 % 60); s += `<rect x="${x}" y="${top}" width="14" height="${240 - top + 100}" rx="3" fill="${i % 2 ? "#f2c14e" : "#e9b23e"}" stroke="#c99327" stroke-width="1" transform="rotate(${(i - 8) * 1.6} ${x} 400)"/>`; }
  s += path("M300,250 Q400,290 500,250 L470,490 L330,490 Z", C.red);
  s += path("M300,250 Q400,210 500,250 Q400,290 300,250 Z", C.red2);
  s += path("M330,330 Q400,350 470,330 L462,400 Q400,416 338,400 Z", C.wT, 'stroke="none"');
  s += logoMark(372, 365, 1.05, C.red);
  return s;
})(), "Printed French fries scoop carton with fries");

svg("burger-box", (() => {
  OX = 400; OY = 380;
  let s = shadow(400, 470, 220, 32);
  s += box(-110, -110, 0, 220, 220, 70, [C.wT, C.wL, C.wR]);
  // open lid hinged at back
  s += poly([[-110, -110, 70], [110, -110, 70], [110, -150, 270], [-110, -150, 270]], C.wR);
  s += poly([[-100, -112, 80], [100, -112, 80], [100, -146, 255], [-100, -146, 255]], C.wIn);
  // burger inside
  const c = P(0, 0, 70);
  s += ell(c[0], c[1] - 10, 95, 40, "#d79a4e") + ell(c[0], c[1] - 18, 98, 34, "#5f8f3a") + ell(c[0], c[1] - 26, 92, 32, "#6b3a22") + ell(c[0], c[1] - 34, 96, 30, "#f2c14e") + `<path d="M${c[0] - 92},${c[1] - 40} Q${c[0]},${c[1] - 150} ${c[0] + 92},${c[1] - 40} Q${c[0]},${c[1] - 20} ${c[0] - 92},${c[1] - 40}Z" fill="#dca055"/>`;
  for (let i = 0; i < 9; i++) s += ell(c[0] - 50 + (i % 5) * 25, c[1] - 85 + Math.floor(i / 5) * 18, 3, 1.6, "#fff4dc");
  s += poly([[-110, 110, 25], [110, 110, 25], [110, 110, 40], [-110, 110, 40]], C.red);
  return s;
})(), "Printed clamshell burger box with burger", { k: 0.8, dy: 64 });

svg("food-tray", (() => {
  OX = 400; OY = 360;
  let s = shadow(400, 460, 240, 32);
  s += box(-150, -80, 0, 300, 160, 38, [C.kT, C.kL, C.kR]);
  s += poly([[-140, -70, 38], [140, -70, 38], [140, 70, 38], [-140, 70, 38]], C.kIn);
  for (let i = 0; i < 6; i++) { const p = P(-100 + i * 40, -10 + (i % 2) * 30, 50); s += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="24" ry="16" fill="#c26a2c"/><ellipse cx="${p[0] - 6}" cy="${p[1] - 5}" rx="8" ry="4" fill="#e8a25d"/>`; }
  return s;
})(), "Open paperboard food tray with snacks");

svg("ice-cream-cup", (() => {
  let s = shadow(400, 490, 150, 24);
  s += `<circle cx="400" cy="205" r="92" fill="#f6d1d6"/><circle cx="350" cy="225" r="40" fill="#f9dde1"/><circle cx="455" cy="225" r="38" fill="#efb7c0"/><path d="M330,170 q20,-30 50,-12" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6"/>`;
  s += cup(400, 260, 480, 140, 100, C.wT, [{ t0: 0.2, t1: 0.55, fill: C.navy }, { t0: 0.55, t1: 0.62, fill: C.red }], { inner: "#f6d1d6" });
  s += logoMark(372, 318, 1.05, "#fff");
  return s;
})(), "Printed paper ice cream cup with a scoop");

svg("beverage-cups", (() => {
  let s = shadow(400, 495, 230, 30);
  // cold cup
  s += cup(510, 190, 480, 92, 66, "#f3f6f8", [{ t0: 0.3, t1: 0.7, fill: C.red }], { inner: "#6b3a22" });
  s += `<rect x="525" y="110" width="10" height="110" fill="${C.navy}" transform="rotate(12 530 165)"/>`;
  s += path("M418,190 Q510,170 602,190 L598,175 Q510,150 422,175 Z", "rgba(220,235,245,0.9)");
  // hot cup with lid
  s += cup(320, 210, 490, 98, 70, C.wT, [{ t0: 0.25, t1: 0.62, fill: C.navy }], { noRim: true });
  s += path("M216,212 L424,212 L418,192 L222,192 Z", "#e7e2d8");
  s += path("M232,192 Q320,150 408,192 Z", "#f3efe7");
  s += ell(320, 212, 104, 14, "#ddd6ca");
  s += logoMark(292, 300, 1.05, "#fff");
  return s;
})(), "Printed hot paper cup with lid beside a cold cup");

svg("cup-sleeve", (() => {
  let s = shadow(400, 495, 150, 24);
  s += cup(400, 170, 490, 120, 86, C.wT, [{ t0: 0.32, t1: 0.72, fill: C.kL }]);
  for (let i = 0; i < 18; i++) { const y = 170 + 320 * 0.32 + i * 7; const r = 120 - 34 * ((y - 170) / 320); s += `<path d="M${400 - r},${y} A${r},${r * 0.22} 0 0 0 ${400 + r},${y}" fill="none" stroke="${C.kEdge}" stroke-width="1" opacity="0.5"/>`; }
  s += `<rect x="345" y="330" width="110" height="34" rx="3" fill="${C.navy}"/>` + logoMark(374, 342, 1, "#fff");
  return s;
})(), "Corrugated sleeve on a hot paper cup");

svg("pizza-box", (() => {
  OX = 400; OY = 380;
  let s = shadow(400, 470, 260, 36);
  s += box(-150, -150, 0, 300, 300, 36, [C.kT, C.kL, C.kR]);
  s += poly([[-150, -150, 36], [150, -150, 36], [150, -200, 330], [-150, -200, 330]], C.kR);
  s += poly([[-140, -148, 46], [140, -148, 46], [140, -192, 316], [-140, -192, 316]], C.kIn);
  const c = P(0, 0, 36);
  s += ell(c[0], c[1], 200, 104, "#d9a35a") + ell(c[0], c[1] - 3, 182, 94, "#c9442b") + ell(c[0], c[1] - 5, 170, 86, "#f2c45a");
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; s += ell(c[0] + Math.cos(a) * 100, c[1] + Math.sin(a) * 50 - 5, 18, 9, "#a8321f"); }
  s += poly([[-150, 150, 10], [150, 150, 10], [150, 150, 22], [-150, 150, 22]], C.red);
  return s;
})(), "Open corrugated pizza box with pizza", { k: 0.76, dy: 64 });

svg("sandwich-box", (() => {
  OX = 400; OY = 380;
  let s = shadow(400, 470, 220, 30);
  // triangular wedge: base triangle extruded
  const t = (z) => [[-120, -40, z], [120, -40, z], [0, 60, z]];
  const [a, b] = [t(0), t(150)];
  s += poly([a[0], a[2], b[2], b[0]], C.wL);
  s += poly([a[2], a[1], b[1], b[2]], C.wR);
  s += poly(b, C.wT);
  // window on right face
  s += poly([[90, -15, 30], [20, 43, 30], [20, 43, 120], [90, -15, 120]], "#d8e6ec", 'opacity="0.9"');
  const m = P(55, 14, 75);
  s += `<path d="M${m[0] - 40},${m[1] + 10} l75,-38" stroke="#f3d9a4" stroke-width="20"/><path d="M${m[0] - 40},${m[1] + 22} l75,-38" stroke="#6f9a3e" stroke-width="7"/><path d="M${m[0] - 40},${m[1] + 32} l75,-38" stroke="#c75a3a" stroke-width="8"/><path d="M${m[0] - 40},${m[1] + 44} l75,-38" stroke="#f3d9a4" stroke-width="18"/>`;
  s += poly([[-120, -40, 10], [0, 60, 10], [0, 60, 24], [-120, -40, 24]], C.navy);
  return s;
})(), "Paperboard sandwich wedge box with window", { k: 1.05, dy: 10 });

svg("bakery-box", (() => {
  OX = 400; OY = 370;
  let s = shadow(400, 470, 240, 34);
  s += box(-130, -110, 0, 260, 220, 120, [C.wT, C.wL, C.wR], { noTop: true });
  s += poly([[-130, -110, 120], [130, -110, 120], [130, 110, 120], [-130, 110, 120]], C.wT);
  s += poly([[-90, -70, 121], [90, -70, 121], [90, 70, 121], [-90, 70, 121]], "#d3e3ea");
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const p = P(-60 + i * 60, -35 + j * 70, 121); s += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="26" ry="14" fill="#c98b47" opacity="0.85"/><ellipse cx="${p[0] - 6}" cy="${p[1] - 4}" rx="10" ry="4" fill="#f0c88d" opacity="0.85"/>`; }
  s += poly([[-90, -70, 122], [90, -70, 122], [10, -30, 122], [-90, -30, 122]], "rgba(255,255,255,0.35)");
  s += poly([[-130, 110, 50], [130, 110, 50], [130, 110, 66], [-130, 110, 66]], C.red);
  return s;
})(), "Bakery box with a window showing pastries");

svg("takeaway-box", (() => {
  let s = shadow(400, 490, 160, 24);
  s += path("M290,230 L510,230 L480,480 L320,480 Z", C.wT);
  s += path("M290,230 L330,150 L470,150 L510,230 Z", C.wL);
  s += path("M330,150 L400,120 L470,150 Z", C.wR);
  s += `<path d="M330,150 C330,70 470,70 470,150" fill="none" stroke="#a7a7a7" stroke-width="5"/>`;
  s += path("M300,300 L500,300 L494,350 L306,350 Z", C.red, 'stroke="none"');
  s += logoMark(372, 318, 1.05, "#fff");
  return s;
})(), "Folding paper takeaway box with wire handle");

svg("qsr-range", (() => {
  let s = shadow(400, 500, 280, 34);
  // burger box left
  OX = 230; OY = 430;
  s += box(-80, -80, 0, 160, 160, 90, [C.wT, C.wL, C.wR]);
  s += poly([[-80, 80, 35], [80, 80, 35], [80, 80, 50], [-80, 80, 50]], C.red);
  // fries center
  for (let i = 0; i < 10; i++) { const x = 352 + i * 10; s += `<rect x="${x}" y="${190 + (i * 23 % 40)}" width="12" height="200" rx="3" fill="#f2c14e" stroke="#c99327" stroke-width="1"/>`; }
  s += path("M340,270 Q400,295 460,270 L442,470 L358,470 Z", C.red);
  s += logoMark(374, 360, 1, "#fff");
  // cup right
  s += cup(580, 190, 470, 80, 58, C.wT, [{ t0: 0.3, t1: 0.65, fill: C.navy }], { noRim: true });
  s += path("M494,192 L666,192 L660,176 L500,176 Z", "#e7e2d8") + ell(580, 192, 86, 12, "#ddd6ca");
  return s;
})(), "Coordinated QSR range: burger box, fries carton and cup");

// ================== FLEXIBLE ==================
const filmTail = (cx, by, r, h, fill) => `<path d="M${cx + r},${by - h + 8} C${cx + r + 120},${by - h + 30} ${cx + r + 170},${by - 40} ${cx + r + 230},${by - 10} L${cx + r + 240},${by + 30} C${cx + r + 160},${by + 10} ${cx + r + 110},${by - 10} ${cx + r},${by}" fill="${fill}" stroke="${C.filmEdge}" stroke-width="1.2"/>`;

function filmRoll(name, title, body, top, tail, extra = "") {
  svg(name, shadow(430, 482, 260, 34) + roll(340, 470, 120, 300, body, { top, tail: filmTail(340, 470, 120, 300, tail), stripes: true }) + extra, title);
}
filmRoll("film-roll-clear", "Roll of clear packaging film", "rgba(190,215,228,0.95)", "rgba(214,232,240,1)", C.film);
filmRoll("film-roll-white", "Roll of translucent LDPE film", "rgba(232,236,236,0.98)", "#f4f6f6", "rgba(238,242,242,0.7)");
filmRoll("film-roll-green", "Roll of compostable shrink film", "rgba(170,205,165,0.95)", "#cfe3c8", "rgba(196,224,190,0.6)", `<g transform="translate(560,120)"><rect x="-10" y="-26" width="150" height="40" rx="20" fill="#fff" stroke="${C.green}"/><text x="65" y="0" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="${C.green2}" letter-spacing="1">COMPOSTABLE*</text></g>`);
filmRoll("film-roll-pof", "Centre-fold POF shrink film roll", "rgba(200,222,232,0.95)", "#e0eef3", C.film, `<path d="M300,175 L300,465" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-dasharray="6 6"/>`);

svg("laminate-roll", (() => {
  let s = shadow(420, 482, 270, 34);
  const tail = `<path d="M460,180 C560,200 600,300 640,360 L700,350 C660,290 620,190 460,150 Z" fill="${C.navy}" stroke="${C.navy2}"/>`;
  s += roll(340, 470, 120, 300, C.navy2, { top: "#2d5283", tail, stripes: true });
  for (let i = 0; i < 6; i++) s += `<rect x="${222}" y="${200 + i * 45}" width="236" height="10" fill="${i % 2 ? C.red : "rgba(255,255,255,0.25)"}" opacity="0.7"/>`;
  // formed pack
  s += path("M600,370 L700,360 L712,470 L612,480 Z", C.navy) + path("M606,380 L700,371 L702,392 L608,401 Z", C.red, 'stroke="none"') + logoMark(628, 420, 0.9, "#fff");
  return s;
})(), "Printed laminate roll with a pack formed from it");

svg("barrier-film", (() => {
  let s = shadow(400, 482, 260, 34);
  s += roll(320, 470, 120, 300, "#b9c2cb", { top: "#dfe5ea", tail: filmTail(320, 470, 120, 300, "rgba(200,208,216,0.85)"), stripes: true });
  // layered callout
  s += `<g transform="translate(560,110)"><rect x="-14" y="-30" width="200" height="150" rx="8" fill="#fff" stroke="#e2d9cb"/><text x="0" y="-8" font-family="IBM Plex Mono, monospace" font-size="12" letter-spacing="1.4" fill="${C.navy}">MULTI-LAYER BARRIER</text>`;
  const L = [["#e7ecf0", "Print layer"], ["#aeb8c2", "Barrier"], ["#d9e2c8", "Adhesive"], ["#f4f1ea", "Sealant"]];
  L.forEach(([c, t], i) => { s += `<rect x="0" y="${8 + i * 26}" width="60" height="20" fill="${c}" stroke="#c9c1b3"/><text x="72" y="${23 + i * 26}" font-family="Manrope, sans-serif" font-size="13" fill="${C.ink}">${t}</text>`; });
  return s + `</g>`;
})(), "Metallised barrier film roll with layered structure");

function dispenser(name, title, film, accent) {
  OX = 400; OY = 360;
  let s = shadow(400, 470, 270, 34);
  s += box(-200, -50, 0, 400, 100, 90, [C.wT, C.wL, C.wR]);
  s += poly([[-200, 50, 0], [200, 50, 0], [200, 50, 34], [-200, 50, 34]], accent);
  s += poly([[-200, -50, 90], [200, -50, 90], [200, -90, 150], [-200, -90, 150]], C.wR);
  // film sheet pulled out
  s += poly([[-180, 50, 90], [180, 50, 90], [180, 140, 40], [-180, 140, 40]], film);
  s += poly([[-180, 140, 40], [180, 140, 40], [180, 170, 0], [-180, 170, 0]], film);
  s += logoMark(...P(-150, 50, 70), 1, C.navy);
  svg(name, s, title);
}
dispenser("cling-roll", "PVC cling film roll in a dispenser box", "rgba(205,228,238,0.7)", C.navy);
dispenser("cling-roll-green", "Compostable cling film roll in a dispenser box", "rgba(200,228,196,0.7)", C.green);

svg("ldpe-pouch", (() => {
  let s = shadow(400, 480, 230, 30);
  const pouch = (x, y, w, h, rot, content) => `<g transform="translate(${x},${y}) rotate(${rot})">${content}<rect x="0" y="0" width="${w}" height="${h}" rx="6" fill="rgba(215,232,240,0.55)" stroke="${C.filmEdge}" stroke-width="1.5"/><rect x="0" y="22" width="${w}" height="6" fill="rgba(120,160,185,0.5)"/><rect x="0" y="34" width="${w}" height="3" fill="${C.red}"/><rect x="${w * 0.1}" y="${h * 0.35}" width="10" height="${h * 0.55}" rx="5" fill="rgba(255,255,255,0.55)"/></g>`;
  s += pouch(230, 150, 200, 280, -8, `<rect x="40" y="110" width="120" height="120" rx="10" fill="#9aa6b2"/><circle cx="100" cy="170" r="30" fill="#c7cfd6"/>`);
  s += pouch(400, 170, 180, 260, 7, `<rect x="30" y="100" width="120" height="70" rx="6" fill="${C.navy2}"/><rect x="40" y="185" width="100" height="40" rx="6" fill="#c9a77f"/>`);
  return s;
})(), "Clear LDPE zip-lock pouches with contents");

svg("compostable-bag", (() => {
  let s = shadow(400, 485, 190, 28);
  s += path("M270,170 L530,170 L540,470 L260,470 Z", "#8fbf8a");
  s += path("M270,170 L330,170 L330,240 C330,290 470,290 470,240 L470,170 L530,170 L530,200 L270,200 Z", "#7aae75", 'opacity="0.6"');
  s += `<path d="M330,170 L330,120 C330,90 360,90 360,120 L360,170 M440,170 L440,120 C440,90 470,90 470,120 L470,170" fill="none" stroke="#7aae75" stroke-width="14"/>`;
  s += path("M330,170 C330,215 470,215 470,170 Z", C.bg2, 'stroke="none"');
  s += `<circle cx="400" cy="360" r="52" fill="none" stroke="#fff" stroke-width="5"/><path d="M380,380 C370,340 400,320 425,325 C425,355 410,380 380,380 Z" fill="#fff"/><text x="400" y="440" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="#fff" letter-spacing="1.5">COMPOSTABLE*</text>`;
  return s;
})(), "Green compostable carry bag");

console.log("illustrations written");
