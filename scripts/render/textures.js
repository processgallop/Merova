// Procedural textures for packaging renders (canvas-based, deterministic per seed).
import * as THREE from "three";

let seed = 7;
export const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
export const setSeed = (s) => (seed = s);

const cache = new Map();
function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; }
export function tex(c, { repeat = [1, 1], srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = 8;
  return t;
}

/** Fibrous paper / board base with speckle. */
export function paperCanvas(base, { w = 1024, h = 1024, speck = 0.06, fibre = 0.05, dark = "#000" } = {}) {
  const [c, g] = canvas(w, h);
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  const n = Math.floor(w * h * speck / 40);
  for (let i = 0; i < n; i++) {
    g.globalAlpha = 0.04 + rnd() * 0.08; g.fillStyle = rnd() > 0.5 ? dark : "#fff";
    g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2);
  }
  g.lineWidth = 0.6;
  for (let i = 0; i < w * fibre * 6; i++) {
    g.globalAlpha = 0.03 + rnd() * 0.05; g.strokeStyle = rnd() > 0.5 ? dark : "#fff";
    const x = rnd() * w, y = rnd() * h, a = rnd() * Math.PI, l = 4 + rnd() * 14;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  g.globalAlpha = 1;
  return c;
}
export function kraft(shade = "#B98B5E") { const k = "k" + shade; if (!cache.has(k)) cache.set(k, tex(paperCanvas(shade, { speck: 0.12, fibre: 0.12, dark: "#3a2410" }))); return cache.get(k); }
export function board(shade = "#F6F3EC") { const k = "b" + shade; if (!cache.has(k)) cache.set(k, tex(paperCanvas(shade, { speck: 0.03, fibre: 0.02 }))); return cache.get(k); }
export function bumpPaper() { if (!cache.has("bump")) cache.set("bump", tex(paperCanvas("#808080", { speck: 0.3, fibre: 0.3 }), { srgb: false })); return cache.get("bump"); }

/** Corrugated cross-section: liners with a sine flute between. walls = 1 (3-ply), 2 (5-ply), 3 (7-ply). */
export function fluteCanvas(walls = 1, liner = "#B98B5E", medium = "#A87A4E") {
  const w = 512, h = 128, [c, g] = canvas(w, h);
  g.fillStyle = "#6d4a2a"; g.fillRect(0, 0, w, h);
  const linerH = 10, gap = (h - linerH * (walls + 1)) / walls;
  for (let i = 0; i <= walls; i++) { g.fillStyle = liner; g.fillRect(0, i * (linerH + gap), w, linerH); }
  g.strokeStyle = medium; g.lineWidth = 6;
  for (let i = 0; i < walls; i++) {
    const y0 = linerH + i * (linerH + gap), amp = gap / 2 - 3, mid = y0 + gap / 2, per = 22 + i * 6;
    g.beginPath(); for (let x = 0; x <= w; x += 2) g.lineTo(x, mid + Math.sin((x / per) * Math.PI * 2) * amp); g.stroke();
  }
  return c;
}
export const flute = (walls, repeatX = 4) => tex(fluteCanvas(walls), { repeat: [repeatX, 1] });

/** Printed artwork designs. Each returns a canvas. All brands are fictitious sample brands. */
export function artwork(kind, opt = {}) {
  const { w = 1024, h = 1024, color = "#D52B1E", ink = "#1E1B1B", base = "#F7F3EC", text = "", sub = "" } = opt;
  const [c, g] = canvas(w, h);
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  const font = (s, wgt = 700) => `${wgt} ${s}px "Helvetica Neue", Arial, sans-serif`;
  const centerText = (t, y, s, col, wgt) => { g.fillStyle = col; g.font = font(s, wgt); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, w / 2, y); };
  switch (kind) {
    case "stripes": { // cinema candy stripes
      const n = opt.n ?? 10; for (let i = 0; i < n; i++) if (i % 2 === 0) { g.fillStyle = color; g.fillRect((i * w) / n, 0, w / n, h); }
      if (text) { g.fillStyle = base; g.beginPath(); g.ellipse(w / 2, h * 0.5, w * 0.3, h * 0.16, 0, 0, Math.PI * 2); g.fill(); centerText(text, h * 0.5, h * 0.09, color, 800); }
      break; }
    case "band": { // white with red band and wordmark
      g.fillStyle = color; g.fillRect(0, h * (opt.y ?? 0.55), w, h * (opt.bh ?? 0.22));
      if (text) centerText(text, h * ((opt.y ?? 0.55) + (opt.bh ?? 0.22) / 2), h * 0.075, base, 700);
      if (sub) centerText(sub, h * 0.32, h * 0.045, ink, 500);
      break; }
    case "wave": { // flowing ribbon pattern
      g.strokeStyle = color; g.lineWidth = h * 0.05; g.lineCap = "round";
      for (let k = 0; k < 3; k++) { g.globalAlpha = 1 - k * 0.3; g.beginPath(); for (let x = -20; x <= w + 20; x += 8) g.lineTo(x, h * (0.35 + k * 0.17) + Math.sin(x / w * Math.PI * 3 + k) * h * 0.06); g.stroke(); }
      g.globalAlpha = 1; if (text) centerText(text, h * 0.16, h * 0.07, ink, 700);
      break; }
    case "mithai": { // festive pattern: gold lattice on deep red
      g.fillStyle = opt.base ?? "#9E1B14"; g.fillRect(0, 0, w, h);
      g.strokeStyle = "#E3B45C"; g.lineWidth = 3; const s = 64;
      for (let y = 0; y < h + s; y += s) for (let x = 0; x < w + s; x += s) { g.beginPath(); g.moveTo(x, y - s / 2); g.lineTo(x + s / 2, y); g.lineTo(x, y + s / 2); g.lineTo(x - s / 2, y); g.closePath(); g.stroke(); g.beginPath(); g.arc(x, y, 5, 0, Math.PI * 2); g.fillStyle = "#E3B45C"; g.fill(); }
      g.fillStyle = "#F4E2B8"; g.beginPath(); g.ellipse(w / 2, h / 2, w * 0.3, h * 0.18, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#C79A3E"; g.lineWidth = 6; g.stroke();
      centerText(text || "Mithai Ghar", h / 2 - h * 0.02, h * 0.08, "#7A160E", 700); centerText(sub || "SWEETS · SINCE EST.", h / 2 + h * 0.07, h * 0.03, "#7A160E", 600);
      break; }
    case "pattern": { // dotted grid
      g.fillStyle = color; for (let y = 20; y < h; y += 44) for (let x = 20 + ((y / 44) % 2) * 22; x < w; x += 44) { g.beginPath(); g.arc(x, y, 6, 0, Math.PI * 2); g.fill(); }
      if (text) { g.fillStyle = base; g.fillRect(w * 0.15, h * 0.4, w * 0.7, h * 0.2); centerText(text, h * 0.5, h * 0.08, color, 800); }
      break; }
    case "label": { // product label: panel layout
      g.fillStyle = color; g.fillRect(0, 0, w, h * 0.3);
      centerText(text || "ORCHARD", h * 0.15, h * 0.11, base, 800);
      centerText(sub || "Cold-pressed · 250 ml", h * 0.45, h * 0.06, ink, 500);
      g.fillStyle = ink; for (let i = 0; i < 26; i++) g.fillRect(w * 0.3 + i * (w * 0.4 / 26), h * 0.62, (i % 3 ? 3 : 7) * (w / 1024), h * 0.2);
      break; }
    case "kraftprint": { // one-colour print on kraft
      g.drawImage(paperCanvas(opt.base ?? "#B98B5E", { w, h, speck: 0.12, fibre: 0.12, dark: "#3a2410" }), 0, 0);
      g.globalAlpha = 0.9; centerText(text || "FRESH", h * 0.45, h * 0.1, color, 800);
      if (sub) centerText(sub, h * 0.58, h * 0.04, color, 600); g.globalAlpha = 1;
      break; }
    case "pharma": {
      g.fillStyle = color; g.fillRect(0, 0, w * 0.08, h);
      g.fillStyle = "#2E7D6B"; g.fillRect(w * 0.08, h * 0.72, w, h * 0.04);
      g.textAlign = "left"; g.fillStyle = ink; g.font = font(h * 0.08, 700); g.fillText(text || "Cetrivon 10", w * 0.15, h * 0.3);
      g.font = font(h * 0.04, 500); g.fillStyle = "#555"; g.fillText(sub || "10 × 10 tablets", w * 0.15, h * 0.42);
      g.fillStyle = "#ddd"; g.fillRect(w * 0.15, h * 0.82, w * 0.3, h * 0.1);
      break; }
    case "news": { // brochure/flyer page
      g.fillStyle = color; g.fillRect(0, 0, w, h * 0.42);
      g.fillStyle = "#fff"; g.textAlign = "left"; g.font = font(h * 0.07, 700); g.fillText(text || "Annual Review", w * 0.08, h * 0.25);
      g.fillStyle = "#cfc7c0"; for (let i = 0; i < 9; i++) g.fillRect(w * 0.08, h * (0.5 + i * 0.045), w * (0.84 - (i % 3) * 0.12), h * 0.014);
      g.fillStyle = opt.ink2 ?? "#2A2626"; g.fillRect(w * 0.55, h * 0.06, w * 0.37, h * 0.3);
      break; }
    case "plain": default: break;
  }
  return c;
}
export const art = (kind, opt = {}, texOpt = {}) => tex(artwork(kind, opt), texOpt);

/** Tape texture. */
export function tape(color = "#C9A06A") { const [c, g] = canvas(64, 256); g.fillStyle = color; g.fillRect(0, 0, 64, 256); g.globalAlpha = 0.12; g.fillStyle = "#fff"; g.fillRect(0, 0, 64, 6); g.fillRect(0, 250, 64, 6); return tex(c); }

/** Popcorn / food noise colour. */
export function noiseCanvas(base, var1, n = 2000, w = 256) { const [c, g] = canvas(w, w); g.fillStyle = base; g.fillRect(0, 0, w, w); for (let i = 0; i < n; i++) { g.globalAlpha = 0.2; g.fillStyle = var1; g.fillRect(rnd() * w, rnd() * w, 3, 3); } return c; }
