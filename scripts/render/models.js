// Parametric packaging models. Units ≈ centimetres. Every brand shown is a fictitious sample brand.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { art, artwork, board, bumpPaper, flute, kraft, noiseCanvas, paperCanvas, rnd, tape, tex } from "./textures.js";

const V = (x, y) => new THREE.Vector2(x, y);
const RED = "#D52B1E";
const G = () => new THREE.Group();

/* ───────── materials ───────── */
const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0, ...o });
const phys = (o) => new THREE.MeshPhysicalMaterial({ roughness: 0.4, metalness: 0, ...o });
export const M = {
  kraft: (shade) => std({ map: kraft(shade), roughness: 0.92, bumpMap: bumpPaper(), bumpScale: 0.6 }),
  kraftIn: () => std({ map: kraft("#C9A27A"), roughness: 0.95 }),
  board: (shade) => std({ map: board(shade), roughness: 0.75, bumpMap: bumpPaper(), bumpScale: 0.3 }),
  grey: () => std({ map: board("#9B958C"), roughness: 0.95 }),
  print: (t, rough = 0.42, clear = 0.25) => phys({ map: t, roughness: rough, clearcoat: clear, clearcoatRoughness: 0.35 }),
  matte: (t) => std({ map: t, roughness: 0.7 }),
  color: (c, rough = 0.6) => std({ color: c, roughness: rough }),
  gloss: (c, rough = 0.25) => phys({ color: c, roughness: rough, clearcoat: 0.6 }),
  clear: (tint = "#ffffff", rough = 0.06, thick = 0.15) => phys({ color: tint, transmission: 1, thickness: thick, roughness: rough, ior: 1.5, transparent: true, side: THREE.DoubleSide }),
  frost: (tint = "#f2f2f0", rough = 0.45) => phys({ color: tint, transmission: 0.85, thickness: 0.3, roughness: rough, ior: 1.45, transparent: true, side: THREE.DoubleSide }),
  film: (tint = "#f4f6f6") => phys({ color: tint, transmission: 0.55, thickness: 4, roughness: 0.12, ior: 1.5, clearcoat: 1, clearcoatRoughness: 0.05 }),
  fibre: (shade = "#E9E1CF") => std({ map: tex(paperCanvas(shade, { speck: 0.25, fibre: 0.3, dark: "#6b5a3a" })), roughness: 0.97, bumpMap: bumpPaper(), bumpScale: 2 }),
  compost: (shade = "#EDEBE0") => phys({ color: shade, roughness: 0.55, sheen: 0.3, transmission: 0.15, thickness: 0.2 }),
  flute: (walls, rep) => std({ map: flute(walls, rep), roughness: 0.95 }),
  metal: (c = "#c7ccd0") => std({ color: c, metalness: 1, roughness: 0.22 }),
};

/* ───────── primitives ───────── */
export function slab(w, h, d, mats) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats); return m; }
const six = (o) => [o.px, o.nx, o.py, o.ny, o.pz, o.nz];

/** Open-top box (corrugated or carton) with optional outward flaps. */
export function openBox({ w, h, d, t = 0.45, outer, inner, edge, front, flaps = true, flapAngle = 2.05, flapLen, sideFront }) {
  const g = G(); const fr = front ?? outer;
  { const bt = slab(w, t, d, inner); bt.position.set(0, t / 2, 0); g.add(bt); }
  const fw = slab(w, h, t, six({ px: edge, nx: edge, py: edge, ny: edge, pz: fr, nz: inner })); fw.position.set(0, h / 2, d / 2 - t / 2); g.add(fw);
  const bw = slab(w, h, t, six({ px: edge, nx: edge, py: edge, ny: edge, pz: inner, nz: outer })); bw.position.set(0, h / 2, -d / 2 + t / 2); g.add(bw);
  const lw = slab(t, h, d - 2 * t, six({ px: inner, nx: sideFront ?? outer, py: edge, ny: edge, pz: edge, nz: edge })); lw.position.set(-w / 2 + t / 2, h / 2, 0); g.add(lw);
  const rw = slab(t, h, d - 2 * t, six({ px: sideFront ?? outer, nx: inner, py: edge, ny: edge, pz: edge, nz: edge })); rw.position.set(w / 2 - t / 2, h / 2, 0); g.add(rw);
  if (flaps) {
    const L = flapLen ?? Math.min(w, d) / 2;
    const mk = (fw_, axis, pos, rot) => { const p = G(); p.position.copy(pos); const f = slab(...fw_); f.position.y = L / 2; p.add(f); p.rotation[axis] = rot; g.add(p); };
    mk([w, L, t, six({ px: edge, nx: edge, py: edge, ny: edge, pz: inner, nz: outer })], "x", new THREE.Vector3(0, h, d / 2 - t / 2), flapAngle);
    mk([w, L, t, six({ px: edge, nx: edge, py: edge, ny: edge, pz: outer, nz: inner })], "x", new THREE.Vector3(0, h, -d / 2 + t / 2), -flapAngle * 0.92);
    mk([t, L, d - 2 * t, six({ px: inner, nx: outer, py: edge, ny: edge, pz: edge, nz: edge })], "z", new THREE.Vector3(-w / 2 + t / 2, h, 0), flapAngle * 0.88);
    mk([t, L, d - 2 * t, six({ px: outer, nx: inner, py: edge, ny: edge, pz: edge, nz: edge })], "z", new THREE.Vector3(w / 2 - t / 2, h, 0), -flapAngle * 0.95);
  }
  return g;
}

/** Closed box with per-face materials and optional tape along the top seam. */
export function closedBox({ w, h, d, top, side, front, back, bottom, tapeColor, seam = true, round = 0 }) {
  const g = G();
  const mats = six({ px: side, nx: side, py: top, ny: bottom ?? side, pz: front ?? side, nz: back ?? side });
  const body = round ? new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, round), front ?? side) : slab(w, h, d, mats);
  body.position.y = h / 2; g.add(body);
  if (tapeColor) {
    const tp = slab(w * 0.16, 0.05, d + 0.02, std({ map: tape(tapeColor), roughness: 0.3 })); tp.position.set(0, h + 0.025, 0); g.add(tp);
    const tf = slab(w * 0.16, h * 0.22, 0.05, std({ map: tape(tapeColor), roughness: 0.3 })); tf.position.set(0, h - h * 0.11, d / 2 + 0.03); g.add(tf);
  }
  if (seam) { const s = slab(0.08, 0.02, d * 0.98, M.color("#7a5634", 1)); s.position.set(0, h + 0.012, 0); g.add(s); }
  return g;
}

/** Thin-walled lathe vessel (cup, tub, bowl, cone). profile radii bottom→top. */
export function vessel({ rb, rt, h, t = 0.06, outer, inner, bottom, rim = true, rimColor, segs = 96, flatSides = 0, open = true }) {
  const g = G(); const n = flatSides || segs;
  const side = (r0, r1, y0, y1, mat, flip) => {
    const pts = flip ? [V(r1, y1), V(r0, y0)] : [V(r0, y0), V(r1, y1)];
    const geo = new THREE.LatheGeometry(pts, n); const m = new THREE.Mesh(geo, mat); if (flatSides) m.rotation.y = Math.PI / n; return m;
  };
  g.add(side(rb, rt, 0, h, outer, false));
  g.add(side(rb - t, rt - t, t, h, inner ?? outer, true));
  const bot = new THREE.Mesh(new THREE.CircleGeometry(rb - t, n), bottom ?? inner ?? outer); bot.rotation.x = -Math.PI / 2; bot.position.y = t; if (flatSides) bot.rotation.z = Math.PI / n; g.add(bot);
  const under = new THREE.Mesh(new THREE.CircleGeometry(rb, n), bottom ?? inner ?? outer); under.rotation.x = Math.PI / 2; under.position.y = 0.001; g.add(under);
  if (rim) { const tor = new THREE.Mesh(new THREE.TorusGeometry(rt - t / 2, Math.max(t * 1.6, 0.09), 12, n), rimColor ? M.color(rimColor, 0.5) : inner ?? outer); tor.rotation.x = Math.PI / 2; tor.position.y = h; if (flatSides) tor.rotation.z = Math.PI / n; g.add(tor); }
  return g;
}

/** Rectangular tapered tray via 4-sided lathe scaled in x. */
export function tray({ wb, db, wt, dt, h, t = 0.08, outer, inner, rim = true }) {
  const g = vessel({ rb: (db / 2) * Math.SQRT2, rt: (dt / 2) * Math.SQRT2, h, t, outer, inner, flatSides: 4, rim });
  g.scale.x = wb / db; return g;
}

/** Tube along a curve (handles, ropes, ribbons). */
export function rope(points, r, mat) { const c = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))); return new THREE.Mesh(new THREE.TubeGeometry(c, 64, r, 10, false), mat); }

/** Stack of thin sheets. */
export function sheets({ w, d, n = 12, t = 0.04, mat, edgeMat, jitter = 0.6, rot = 0.04 }) {
  const g = G(); for (let i = 0; i < n; i++) { const s = slab(w, t, d, six({ px: edgeMat ?? mat, nx: edgeMat ?? mat, py: mat, ny: mat, pz: edgeMat ?? mat, nz: edgeMat ?? mat })); s.position.set((rnd() - 0.5) * jitter, t / 2 + i * t, (rnd() - 0.5) * jitter); s.rotation.y = (rnd() - 0.5) * rot; g.add(s); } return g;
}

/** Film / paper roll lying or standing. */
export function roll({ r = 6, len = 30, core = 1.9, mat, coreMat, endMat, standing = false }) {
  const g = G();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 96, 1, true), mat); g.add(body);
  const ringC = document.createElement("canvas"); ringC.width = ringC.height = 512; const rg = ringC.getContext("2d");
  rg.fillStyle = "#ddd"; rg.fillRect(0, 0, 512, 512);
  const ringTex = endMat ?? (() => { for (let i = 0; i < 60; i++) { rg.strokeStyle = i % 2 ? "rgba(255,255,255,.5)" : "rgba(160,170,175,.35)"; rg.lineWidth = 2; rg.beginPath(); rg.arc(256, 256, 256 * (core / r) + i * ((256 - 256 * (core / r)) / 60), 0, Math.PI * 2); rg.stroke(); } return phys({ map: tex(ringC), roughness: 0.2, clearcoat: 1, transmission: 0.3, thickness: 1 }); })();
  for (const s of [1, -1]) { const e = new THREE.Mesh(new THREE.RingGeometry(core, r, 96), ringTex); e.rotation.x = -s * Math.PI / 2; e.position.y = (s * len) / 2; g.add(e); }
  const c = new THREE.Mesh(new THREE.CylinderGeometry(core, core, len + 0.4, 48, 1, true), coreMat ?? M.kraft()); g.add(c);
  const ci = new THREE.Mesh(new THREE.CylinderGeometry(core - 0.3, core - 0.3, len + 0.4, 48, 1, true), M.kraftIn()); ci.material.side = THREE.BackSide; g.add(ci);
  for (const s of [1, -1]) { const e = new THREE.Mesh(new THREE.RingGeometry(core - 0.3, core, 48), M.kraft()); e.rotation.x = -s * Math.PI / 2; e.position.y = s * (len / 2 + 0.2); g.add(e); }
  if (!standing) { g.rotation.z = Math.PI / 2; } g.position.y = standing ? len / 2 : r;
  const w = G(); w.add(g); return w;
}

/* ───────── food & props ───────── */
function popcorn(n, spread, h0, mound) {
  const g = G(); const geo = new THREE.IcosahedronGeometry(0.75, 1); const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const f = 0.7 + rnd() * 0.6; p.setXYZ(i, p.getX(i) * f, p.getY(i) * f, p.getZ(i) * f); } geo.computeVertexNormals();
  const mat = std({ map: tex(noiseCanvas("#F4E7C6", "#D9B26A", 900)), roughness: 0.85 });
  const im = new THREE.InstancedMesh(geo, mat, n); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * spread; const y = h0 + rnd() * 1.2 + (1 - r / spread) * mound; e.set(rnd() * 6, rnd() * 6, rnd() * 6); q.setFromEuler(e); const s = 0.8 + rnd() * 0.6; m4.compose(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r), q, new THREE.Vector3(s, s, s)); im.setMatrixAt(i, m4); }
  g.add(im); return g;
}
function fries(n, spread, h0, len = 9) {
  const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.7, len, 0.7), std({ color: "#E9B44C", roughness: 0.6 }), n); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) { e.set((rnd() - 0.5) * 0.5, rnd() * 3, (rnd() - 0.5) * 0.5); q.setFromEuler(e); m4.compose(new THREE.Vector3((rnd() - 0.5) * spread, h0 + rnd() * 2.5, (rnd() - 0.5) * spread * 0.5), q, new THREE.Vector3(1, 0.7 + rnd() * 0.5, 1)); im.setMatrixAt(i, m4); }
  const g = G(); g.add(im); return g;
}
function chips(n, spread, h0) {
  const sh = new THREE.Shape([V(0, 2.4), V(-2, -1.2), V(2, -1.2)]); const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: false });
  const im = new THREE.InstancedMesh(geo, std({ color: "#E4B65A", roughness: 0.7 }), n); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) { e.set(-Math.PI / 2 + (rnd() - 0.5) * 0.9, rnd() * 6, (rnd() - 0.5) * 0.9); q.setFromEuler(e); m4.compose(new THREE.Vector3((rnd() - 0.5) * spread, h0 + rnd() * 1.6, (rnd() - 0.5) * spread * 0.6), q, new THREE.Vector3(1, 1, 1)); im.setMatrixAt(i, m4); }
  const g = G(); g.add(im); return g;
}
function burger(s = 1) {
  const g = G(); const cyl = (r, h, c, y, rough = 0.6) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.98, h, 48), std({ color: c, roughness: rough })); m.position.y = y; g.add(m); };
  cyl(5.2, 1.4, "#C98A3E", 0.7); cyl(5.4, 1.2, "#4A2A1A", 2.0, 0.8); cyl(5.6, 0.25, "#F2C230", 2.75, 0.4); cyl(5.5, 0.3, "#5FA040", 3.0, 0.6);
  const top = new THREE.Mesh(new THREE.SphereGeometry(5.3, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), std({ color: "#C98A3E", roughness: 0.55 })); top.scale.y = 0.62; top.position.y = 3.2; g.add(top);
  const seeds = new THREE.InstancedMesh(new THREE.SphereGeometry(0.16, 6, 4), M.color("#F5EBD3"), 40); const m4 = new THREE.Matrix4();
  for (let i = 0; i < 40; i++) { const a = rnd() * Math.PI * 2, r = rnd() * 4; const y = 3.2 + Math.sqrt(Math.max(0, 5.3 * 5.3 - r * r)) * 0.62; m4.makeTranslation(Math.cos(a) * r, y, Math.sin(a) * r); seeds.setMatrixAt(i, m4); } g.add(seeds);
  g.scale.setScalar(s); return g;
}
function mithai(n, w, d, y) {
  const g = G(); const cols = ["#F2D7A2", "#E9A13B", "#F6EFE2", "#C9733A", "#EDE0B8"];
  const cs = Math.ceil(Math.sqrt(n * w / d)), rs = Math.ceil(n / cs);
  for (let i = 0; i < n; i++) { const cx = i % cs, rz = Math.floor(i / cs); const kind = i % 3;
    const geo = kind === 0 ? new RoundedBoxGeometry(2.6, 1.2, 2.6, 2, 0.35) : kind === 1 ? new THREE.SphereGeometry(1.3, 24, 16) : new THREE.CylinderGeometry(1.4, 1.4, 1.0, 6);
    const m = new THREE.Mesh(geo, std({ color: cols[i % cols.length], roughness: 0.55 }));
    m.position.set(-w / 2 + (cx + 0.5) * (w / cs), y + (kind === 1 ? 1.2 : 0.6), -d / 2 + (rz + 0.5) * (d / rs)); if (kind === 2) m.rotation.y = 0.3; g.add(m);
    if (kind === 0) { const foil = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), M.metal("#d9dcdf")); foil.rotation.x = -Math.PI / 2; foil.position.set(m.position.x, y + 1.22, m.position.z); g.add(foil); }
  }
  return g;
}
function bottle(h = 14, r = 2.6, c = "#5B2A1F", label) {
  const g = G(); const pts = [V(0, 0), V(r, 0), V(r, h * 0.62), V(r * 0.45, h * 0.8), V(r * 0.38, h * 0.94), V(0, h * 0.94)];
  const b = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), phys({ color: c, roughness: 0.08, transmission: 0.4, thickness: 2, ior: 1.5 })); g.add(b);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.42, r * 0.42, h * 0.1, 32), M.color("#E8E3DA", 0.4)); cap.position.y = h * 0.97; g.add(cap);
  if (label) { const l = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.02, r + 0.02, h * 0.32, 64, 1, true), M.print(label, 0.5, 0.1)); l.position.y = h * 0.3; g.add(l); }
  return g;
}
function cupcake() { const g = G(); const base = vessel({ rb: 1.8, rt: 2.4, h: 2.6, t: 0.05, outer: M.color("#D52B1E", 0.6), rim: false, flatSides: 24 }); g.add(base); const top = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), std({ color: "#F7E9EF", roughness: 0.7 })); top.scale.y = 0.8; top.position.y = 2.6; g.add(top); return g; }
function sapling() { const g = G(); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 9, 8), M.color("#5b4a2a")); st.position.y = 4.5; g.add(st); for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 8), std({ color: i % 2 ? "#4E8A3A" : "#62A047", roughness: 0.6 })); l.scale.set(1.3, 0.35, 0.7); l.position.set(Math.cos(i * 2) * 1.2, 5 + i * 0.7, Math.sin(i * 2) * 1.2); l.rotation.y = i; g.add(l); } return g; }
function cutleryPiece(kind, mat) {
  let sh;
  if (kind === "spoon") { sh = new THREE.Shape(); sh.moveTo(-0.35, 0); sh.lineTo(-0.3, 10); sh.bezierCurveTo(-2.2, 10.5, -2.2, 15.5, 0, 15.8); sh.bezierCurveTo(2.2, 15.5, 2.2, 10.5, 0.3, 10); sh.lineTo(0.35, 0); sh.lineTo(-0.35, 0); }
  else if (kind === "fork") { sh = new THREE.Shape(); sh.moveTo(-0.35, 0); sh.lineTo(-0.35, 9.6); sh.lineTo(-1.6, 11); sh.lineTo(-1.6, 15.6); sh.lineTo(-1.1, 15.6); sh.lineTo(-1.1, 12.4); sh.lineTo(-0.55, 12.4); sh.lineTo(-0.55, 15.6); sh.lineTo(0.55, 15.6); sh.lineTo(0.55, 12.4); sh.lineTo(1.1, 12.4); sh.lineTo(1.1, 15.6); sh.lineTo(1.6, 15.6); sh.lineTo(1.6, 11); sh.lineTo(0.35, 9.6); sh.lineTo(0.35, 0); }
  else { sh = new THREE.Shape(); sh.moveTo(-0.4, 0); sh.lineTo(-0.4, 9.5); sh.lineTo(-0.9, 10); sh.quadraticCurveTo(-1.0, 15.5, 0.2, 16); sh.lineTo(0.9, 10); sh.lineTo(0.4, 9.5); sh.lineTo(0.4, 0); }
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.25, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 2 }), mat); m.rotation.x = -Math.PI / 2; m.position.y = 0.2; return m;
}

/* ───────── composite helpers ───────── */
const place = (o, x = 0, y = 0, z = 0, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; return o; };
function corrugated({ w, h, d, ply = 1, printed, open = false, shade = "#B98B5E", flapAngle }) {
  const edge = M.flute(ply, Math.max(2, Math.round(w / 8)));
  const outer = M.kraft(shade), inner = M.kraftIn();
  const front = printed ? M.matte(art("kraftprint", { text: printed.text, sub: printed.sub, color: printed.color ?? "#3a2a1f", base: shade })) : outer;
  if (open) return openBox({ w, h, d, t: 0.25 * ply + 0.2, outer, inner, edge, front, flapAngle });
  return closedBox({ w, h, d, top: outer, side: outer, front, tapeColor: "#C69C66" });
}
function carton({ w, h, d, artTex, sideTex, topTex, open = false, base = "#F6F3EC" }) {
  const p = artTex ? M.print(artTex) : M.board(base), s = sideTex ? M.print(sideTex) : p, tp = topTex ? M.print(topTex) : s;
  if (open) return openBox({ w, h, d, t: 0.05, outer: s, inner: M.board("#EEE9E0"), edge: M.board("#E3DED4"), front: p, flapLen: d * 0.95, flapAngle: 1.9 });
  return closedBox({ w, h, d, top: tp, side: s, front: p, back: p, seam: false });
}
function cupMesh({ rb = 2.6, rt = 4.0, h = 10, artTex, inner = "#ffffff", rimColor = "#f4f1ea", lid, double = false, sleeve }) {
  const g = G();
  g.add(vessel({ rb, rt, h, t: double ? 0.18 : 0.06, outer: artTex ? M.print(artTex, 0.45, 0.2) : M.board(), inner: M.color(inner, 0.5), rimColor }));
  if (sleeve) { const k = (rt - rb) / h; const s = vessel({ rb: rb + k * h * 0.3 + 0.08, rt: rb + k * h * 0.72 + 0.08, h: h * 0.42, t: 0.02, outer: sleeve, inner: M.kraftIn(), rim: false }); s.position.y = h * 0.3; s.children.splice(2); g.add(s); }
  if (lid) { const l = new THREE.Mesh(new THREE.CylinderGeometry(rt - 0.2, rt + 0.15, 0.9, 64), lid === "clear" ? M.clear() : M.gloss(lid === true ? "#F3F1EC" : lid, 0.3)); l.position.y = h + 0.4; g.add(l); const l2 = new THREE.Mesh(new THREE.CylinderGeometry(rt * 0.55, rt - 0.3, 0.7, 64), l.material); l2.position.y = h + 1.1; g.add(l2); }
  return g;
}
function plasticCup({ rb = 2.8, rt = 4.4, h = 12, tint = "#ffffff", frosted = false, lid, fill }) {
  const g = G(); const mat = frosted ? M.frost(tint) : M.clear(tint);
  const pts = []; for (let i = 0; i <= 10; i++) pts.push(V(rb + ((rt - rb) * i) / 10, (h * i) / 10));
  const side = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), mat); side.userData.noShadow = false; g.add(side);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(rt, 0.12, 12, 96), mat); rim.rotation.x = Math.PI / 2; rim.position.y = h; g.add(rim);
  const bot = new THREE.Mesh(new THREE.CircleGeometry(rb, 64), mat); bot.rotation.x = -Math.PI / 2; bot.position.y = 0.05; g.add(bot);
  if (fill) { const fh = h * fill.level; const k = (rt - rb) / h; const f = new THREE.Mesh(new THREE.CylinderGeometry(rb + k * fh - 0.1, rb - 0.1, fh, 64), phys({ color: fill.color, roughness: 0.2, transmission: fill.trans ?? 0, thickness: 3 })); f.position.y = fh / 2 + 0.1; g.add(f); }
  if (lid === "dome") { const d = new THREE.Mesh(new THREE.SphereGeometry(rt + 0.1, 64, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat); d.scale.y = 0.6; d.position.y = h; g.add(d); }
  if (lid === "flat") { const d = new THREE.Mesh(new THREE.CylinderGeometry(rt + 0.15, rt + 0.15, 0.5, 64), mat); d.position.y = h + 0.2; g.add(d); }
  return g;
}
function bag({ w = 26, h = 32, d = 12, front, side, inner, handle = "twist", handleMat, t = 0.06 }) {
  const g = openBox({ w, h, d, t, outer: side, inner, edge: inner, front, flaps: false, sideFront: side });
  const hm = handleMat ?? side;
  for (const z of [d / 2, -d / 2]) {
    if (handle === "none") break;
    const r = handle === "rope" ? 0.35 : handle === "flat" ? 0.12 : 0.28;
    const hdl = rope([[-w * 0.2, h - 2, z * 1.01], [-w * 0.2, h + 6, z * 1.02], [0, h + 9, z * 1.02], [w * 0.2, h + 6, z * 1.02], [w * 0.2, h - 2, z * 1.01]], r, hm);
    if (handle === "flat") hdl.scale.z = 3;
    g.add(hdl);
  }
  return g;
}
function pouch({ w = 16, h = 22, d = 5, artTex, mat, gusset = true, zip = true }) {
  const geo = new THREE.BoxGeometry(w, h, d, 32, 48, 8); const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const yn = (y + h / 2) / h; const xn = Math.abs(x) / (w / 2);
    let th = gusset ? 0.35 + 0.65 * Math.pow(Math.max(0, 1 - yn), 0.6) : 0.15 + 0.85 * Math.sin(Math.PI * Math.min(1, yn * 1.05)) * 0.9;
    if (yn > 0.88) th *= Math.max(0.03, (1 - yn) / 0.12) * 0.6; th *= Math.pow(1 - Math.pow(xn, 6), 0.5);
    p.setXYZ(i, x, y, (z / (d / 2)) * (d / 2) * th);
  }
  geo.computeVertexNormals(); const m = new THREE.Mesh(geo, mat ?? M.print(artTex, 0.32, 0.6)); m.position.y = h / 2; const g = G(); g.add(m);
  if (zip) { const zp = slab(w * 0.96, 0.35, d * 0.12, M.gloss("#e6e2da")); zp.position.y = h * 0.86; g.add(zp); }
  return g;
}

/* ───────── models ───────── */
export const MODELS = {
  // ── PAPER
  foldingCartons: () => { const g = G();
    g.add(place(carton({ w: 9, h: 14, d: 5, artTex: art("band", { text: "LUMÉ", sub: "Daily Face Serum", color: RED }), sideTex: art("band", { color: RED, y: 0.55 }) }), -5, 0, 1, 0.35));
    g.add(place(carton({ w: 8, h: 18, d: 8, artTex: art("wave", { text: "Terra Tea", color: "#2A2626", base: "#F1E9DA" }), sideTex: art("wave", { color: "#2A2626", base: "#F1E9DA" }) }), 6, 0, -3, -0.25));
    g.add(place(carton({ w: 12, h: 8, d: 8, artTex: art("pattern", { text: "NOVA", color: RED }), open: true }), 2, 0, 9, 0.1)); return g; },
  monoCartons: () => { const g = G(); const L = art("pharma", { text: "Cetrivon 10", color: RED });
    for (let i = 0; i < 4; i++) g.add(place(carton({ w: 6, h: 12, d: 4, artTex: L, sideTex: art("band", { color: "#2E7D6B", y: 0.8, bh: 0.08 }) }), -9 + i * 6.6, 0, 0, 0.12));
    g.add(place(bottle(13, 2.2, "#8C3B1E", art("label", { text: "SYRUP", sub: "100 ml", color: "#2E7D6B" })), 8, 0, 7)); return g; },
  sweetBoxes: () => { const g = G(); const A = art("mithai", { text: "Mithai Ghar" });
    const b = openBox({ w: 22, h: 4.5, d: 16, t: 0.08, outer: M.print(A), inner: M.color("#F2E6CC", 0.6), edge: M.board("#E8DCC0"), flaps: false }); g.add(b); g.add(mithai(12, 20, 14, 0.1));
    const lid = closedBox({ w: 22.4, h: 4, d: 16.4, top: M.print(A), side: M.print(art("mithai", { text: " ", sub: " " })), seam: false }); lid.position.set(4, 0, -14); lid.rotation.set(-1.1, 0.15, 0); lid.position.y = 8; g.add(lid); return g; },
  cakeBoxes: () => { const g = G(); const A = art("band", { text: "Butter & Bloom", color: "#D99AA5", base: "#FFFFFF" });
    const cb = closedBox({ w: 20, h: 14, d: 20, top: M.print(A), side: M.print(art("pattern", { color: "#F0C9CF", base: "#FFFFFF" })), front: M.print(A), seam: false }); g.add(place(cb, -6, 0, -2, 0.3));
    const pb = openBox({ w: 18, h: 6, d: 12, t: 0.05, outer: M.board("#FFFFFF"), inner: M.board("#FFFFFF"), edge: M.board("#EEE"), flaps: false }); g.add(place(pb, 10, 0, 8, -0.2));
    for (let i = 0; i < 3; i++) g.add(place(cupcake(), 10 - 5 + i * 5 * Math.cos(0.2), 0.1, 8 + i * 5 * Math.sin(0.2))); return g; },
  rigidBoxes: () => { const g = G(); const W = 24, D = 16;
    const blk = phys({ color: "#1E1B1B", roughness: 0.55, clearcoat: 0.2, sheen: 0.4 }), inside = std({ color: "#7A160E", roughness: 0.9 });
    g.add(openBox({ w: W, h: 7, d: D, t: 0.3, outer: blk, inner: inside, edge: M.grey(), flaps: false }));
    const ins = slab(W - 0.6, 1.5, D - 0.6, std({ color: "#5c120c", roughness: 0.95 })); ins.position.y = 5.2; g.add(ins);
    const watch = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.5, 24, 64), M.metal("#d8c08a")); watch.rotation.x = -Math.PI / 2.4; watch.position.y = 6.8; g.add(watch);
    const lid = closedBox({ w: W + 0.6, h: 3.5, d: D + 0.6, top: phys({ map: art("plain", { base: "#1E1B1B" }), roughness: 0.55, sheen: 0.4 }), side: blk, seam: false }); lid.position.set(W + 3, 0, -6); lid.rotation.y = 0.35; g.add(lid);
    const foil = new THREE.Mesh(new THREE.RingGeometry(3, 3.4, 64), M.metal("#d8c08a")); foil.rotation.x = -Math.PI / 2; foil.position.set(W + 3, 3.52, -6); g.add(foil); return g; },
  hamper: () => { const g = G(); const A = art("mithai", { base: RED, text: "Shubh Utsav", sub: "FESTIVE COLLECTION" });
    g.add(openBox({ w: 34, h: 9, d: 24, t: 0.25, outer: M.print(A), inner: M.color("#F4E2B8", 0.7), edge: M.grey(), flaps: false }));
    for (const x of [-5.5, 5.5]) { const p = slab(0.25, 8, 23.4, M.color("#E8D3A4")); p.position.set(x, 4.5, 0); g.add(p); }
    g.add(place(bottle(12, 2.6, "#5B2A1F"), -11, 0.2, 0)); g.add(mithai(4, 9, 18, 0.2));
    const jar = vessel({ rb: 3.2, rt: 3.2, h: 7, t: 0.1, outer: M.clear("#fff2d8"), rim: false }); g.add(place(jar, 11, 0.2, -4)); const jar2 = vessel({ rb: 3, rt: 3, h: 6, t: 0.1, outer: M.clear("#fff2d8"), rim: false }); g.add(place(jar2, 11, 0.2, 5));
    const rib = rope([[-17, 9.2, 4], [-6, 9.4, 2], [6, 9.4, 1], [17, 9.2, -2]], 0.4, M.gloss("#E3B45C", 0.3)); g.add(rib); return g; },
  paperCups: () => { const g = G(); const A = art("wave", { text: "BREW & CO.", color: RED, base: "#FFFFFF" });
    g.add(place(cupMesh({ rb: 2.6, rt: 4.0, h: 10, artTex: A, lid: true, sleeve: M.kraft() }), -5, 0, 0));
    g.add(place(cupMesh({ rb: 3.0, rt: 4.5, h: 13, artTex: art("band", { text: "BREW & CO.", color: RED, base: "#FFFFFF", y: 0.4 }) }), 5, 0, -2));
    for (let i = 0; i < 4; i++) g.add(place(cupMesh({ rb: 2.2, rt: 3.2, h: 7.5, artTex: A }), 1 + i * 0, i * 1.1, 9)); return g; },
  iceCreamCups: () => { const g = G(); const cols = [["#F7C6D0", "Strawberry"], ["#7B4A2F", "Choco"], ["#F3E3B3", "Vanilla"]];
    cols.forEach(([c, n], i) => { const cup = cupMesh({ rb: 2.6, rt: 3.6, h: 5.5, artTex: art("band", { text: "SCOOP", color: RED, base: "#FFFFFF", y: 0.45, bh: 0.3 }) }); g.add(place(cup, -9 + i * 9, 0, i === 1 ? -3 : 2));
      const sc = new THREE.Mesh(new THREE.SphereGeometry(3.3, 32, 24), std({ color: c, roughness: 0.75 })); sc.scale.y = 0.75; sc.position.set(-9 + i * 9, 6.6, i === 1 ? -3 : 2); g.add(sc); });
    const tub = cupMesh({ rb: 5, rt: 6, h: 8, artTex: art("pattern", { text: "SCOOP", color: RED }), lid: true }); g.add(place(tub, 4, 0, 12)); return g; },
  popcornTubs: () => { const g = G(); const A = art("stripes", { text: "SHOWTIME", color: RED, base: "#FFFFFF", n: 12 });
    const big = vessel({ rb: 5, rt: 8, h: 20, t: 0.1, outer: M.print(A, 0.5, 0.15), inner: M.color("#ffffff", 0.6), flatSides: 8, rimColor: "#ffffff" }); g.add(big); g.add(popcorn(260, 7.6, 18.5, 3.4));
    const sm = vessel({ rb: 3.4, rt: 5.4, h: 13, t: 0.08, outer: M.print(A, 0.5, 0.15), inner: M.color("#ffffff", 0.6), flatSides: 8 }); g.add(place(sm, 13, 0, 6)); const p2 = popcorn(110, 5, 12, 2.4); g.add(place(p2, 13, 0, 6));
    const spill = popcorn(26, 9, 0, 0); g.add(place(spill, 6, 0, 12)); return g; },
  popcornCones: () => { const g = G(); const A = art("stripes", { text: "", color: RED, base: "#FFFFFF", n: 16 });
    for (let i = 0; i < 3; i++) { const c = G(); const cone = vessel({ rb: 0.3, rt: 5, h: 17, t: 0.05, outer: M.print(A, 0.5, 0.1), inner: M.color("#fff"), rim: true, rimColor: "#ffffff" }); c.add(cone); c.add(popcorn(70, 4.5, 16, 2.2));
      c.rotation.z = (i - 1) * 0.12; c.position.set(-9 + i * 9, 3, i === 1 ? -3 : 0); g.add(c); }
    const stand = slab(30, 3, 10, M.color("#2A2626", 0.4)); stand.position.y = 1.5; g.add(stand); return g; },
  nachosTrays: () => { const g = G(); const A = art("pattern", { color: RED, base: "#FFFFFF" });
    for (let k = 0; k < 2; k++) { const t = tray({ wb: 16, db: 11, wt: 20, dt: 15, h: 4.5, outer: M.print(A, 0.5, 0.1), inner: M.board("#FFFFFF") }); const tg = G(); tg.add(t);
      const well = vessel({ rb: 2.4, rt: 3.2, h: 3, t: 0.06, outer: M.board("#FFFFFF"), inner: M.board("#FFFFFF") }); well.position.set(5, 0.1, 0); tg.add(well);
      const dip = new THREE.Mesh(new THREE.CircleGeometry(3.0, 48), std({ color: "#F0A830", roughness: 0.3 })); dip.rotation.x = -Math.PI / 2; dip.position.set(5, 2.6, 0); tg.add(dip);
      const c = chips(34, 9, 1.4); c.position.x = -2.5; tg.add(c); g.add(place(tg, k * 4 - 6, k * 0, k * -16 + 6, 0.2 - k * 0.5)); }
    return g; },
  friesCartons: () => { const g = G(); const A = art("band", { text: "CRISP", color: RED, base: "#FFFFFF", y: 0.35, bh: 0.35 });
    for (let i = 0; i < 2; i++) { const t = tray({ wb: 10, db: 4.5, wt: 12, dt: 7, h: 12, outer: M.print(A, 0.45, 0.2), inner: M.color("#C9281C", 0.6), rim: false }); const fg = G(); fg.add(t); fg.add(fries(36, 9, 6, 10)); g.add(place(fg, -7 + i * 13, 0, i * -5, -0.2 + i * 0.4)); }
    const spill = fries(6, 10, 0, 8); spill.rotation.z = Math.PI / 2; spill.position.set(4, 0.4, 9); g.add(spill); return g; },
  burgerBoxes: () => { const g = G(); const kraftP = M.matte(art("kraftprint", { text: "GRILLHOUSE", color: "#2A2626" }));
    const base = tray({ wb: 13, db: 13, wt: 14, dt: 14, h: 4, outer: kraftP, inner: M.kraftIn() }); g.add(base); g.add(place(burger(1.05), 0, 0.3, 0));
    const closed = G(); const cb = tray({ wb: 13, db: 13, wt: 14, dt: 14, h: 4, outer: kraftP, inner: M.kraftIn() }); closed.add(cb); const ct = tray({ wb: 13, db: 13, wt: 14, dt: 14, h: 4.5, outer: kraftP, inner: M.kraftIn() }); ct.rotation.x = Math.PI; ct.position.y = 8.5; closed.add(ct); g.add(place(closed, 17, 0, -6, 0.4)); return g; },
  sandwichBoxes: () => { const g = G();
    for (let i = 0; i < 3; i++) { const sh = new THREE.Shape([V(0, 0), V(13, 0), V(0, 13)]); const geo = new THREE.ExtrudeGeometry(sh, { depth: 6.5, bevelEnabled: true, bevelSize: 0.15, bevelThickness: 0.15, bevelSegments: 2 }); geo.center();
      const m = new THREE.Mesh(geo, i === 1 ? M.color("#F6F3EC", 0.7) : M.kraft()); m.rotation.y = Math.PI / 2; const w = G(); w.add(m); const band = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.6, 9.4), M.color("#D52B1E", 0.5)); band.rotation.x = Math.PI / 4; band.position.set(0, -0.5, -0.4); w.add(band);
      g.add(place(w, -9 + i * 9, 0, i === 1 ? -4 : 2, 0.5 - i * 0.4)); }
    return g; },
  paperTrays: () => { const g = G(); for (let i = 0; i < 3; i++) { const t = tray({ wb: 15, db: 8, wt: 18, dt: 11, h: 3.6, outer: i === 1 ? M.print(art("pattern", { color: RED, base: "#FFFFFF" })) : M.kraft(), inner: i === 1 ? M.board("#FFFFFF") : M.kraftIn() }); const tg = G(); tg.add(t); if (i !== 2) tg.add(i === 0 ? fries(14, 10, 1, 6) : chips(14, 10, 0.8)); g.add(place(tg, -10 + i * 10, 0, (i % 2) * -8, 0.3)); } return g; },
  paperBowls: () => { const g = G(); const K = M.kraft();
    const b = vessel({ rb: 5, rt: 7.4, h: 6.5, t: 0.08, outer: K, inner: M.board("#F2ECE0") }); g.add(b);
    const curry = new THREE.Mesh(new THREE.CircleGeometry(6.9, 64), std({ color: "#C4682A", roughness: 0.35 })); curry.rotation.x = -Math.PI / 2; curry.position.y = 5.6; g.add(curry);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(7.6, 7.6, 0.7, 64), K); lid.rotation.set(1.2, 0, 0.1); lid.position.set(5, 6, -10); g.add(lid);
    const b2 = vessel({ rb: 4, rt: 5.6, h: 9, t: 0.08, outer: M.print(art("band", { text: "Bowlful", color: RED, base: "#FFFFFF", y: 0.42 })), inner: M.board("#F2ECE0") }); g.add(place(b2, 14, 0, 2)); return g; },
  takeawayBoxes: () => { const g = G(); const K = M.matte(art("kraftprint", { text: "WOK STAR", color: RED }));
    for (let i = 0; i < 2; i++) { const t = tray({ wb: 9, db: 9, wt: 12, dt: 11, h: 11, outer: K, inner: M.board("#F5EFE4") }); const tg = G(); tg.add(t);
      for (const s of [1, -1]) { const p = G(); const f = slab(12, 5.5, 0.06, K); f.position.y = 2.75; p.add(f); p.position.set(0, 11, s * 5.5); p.rotation.x = s * 0.6; tg.add(p); }
      const h = rope([[-6, 10, 0], [-4, 17, 0], [4, 17, 0], [6, 10, 0]], 0.08, M.metal()); tg.add(h); g.add(place(tg, -8 + i * 15, 0, i * -4, 0.4)); }
    const meal = closedBox({ w: 18, h: 5, d: 13, top: M.matte(art("kraftprint", { text: "WOK STAR", color: RED })), side: M.kraft(), seam: false }); g.add(place(meal, 2, 0, 12, -0.2)); return g; },
  cupSleeves: () => { const g = G(); const S = M.print(art("wave", { text: "BREW & CO.", color: "#FFFFFF", base: RED, ink: "#FFFFFF" }), 0.6, 0);
    g.add(place(cupMesh({ rb: 3, rt: 4.4, h: 12, artTex: art("plain", { base: "#FFFFFF" }), lid: true, sleeve: S }), -4, 0, 0));
    for (let i = 0; i < 3; i++) { const s = vessel({ rb: 4.0, rt: 4.6, h: 5, t: 0.03, outer: S, inner: M.kraftIn(), rim: false }); s.children.splice(2); s.rotation.z = Math.PI / 2; g.add(place(s, 8, 4.3, -2 + i * 5.5, 0.2)); }
    return g; },
  pizzaBoxes: () => { const g = G(); const P = M.matte(art("kraftprint", { text: "FORNO", sub: "WOOD-FIRED PIZZA", color: RED, base: "#C9A37B" }));
    const b = openBox({ w: 30, h: 4, d: 30, t: 0.3, outer: M.kraft("#C9A37B"), inner: M.board("#F3EEE4"), edge: M.flute(1, 3), flaps: false }); g.add(b);
    const pz = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 1.2, 64), std({ map: tex(noiseCanvas("#E8B04B", "#B23A1E", 3500)), roughness: 0.6 })); pz.position.y = 1; g.add(pz);
    const crust = new THREE.Mesh(new THREE.TorusGeometry(13, 0.9, 16, 64), M.color("#D29B4E", 0.7)); crust.rotation.x = Math.PI / 2; crust.position.y = 1.4; g.add(crust);
    const lid = slab(30, 0.3, 30, six({ px: M.flute(1, 3), nx: M.flute(1, 3), py: P, ny: M.board("#F3EEE4"), pz: M.flute(1, 3), nz: M.flute(1, 3) })); const lp = G(); lid.position.z = -15; lp.add(lid); lp.position.set(0, 4, 15); lp.rotation.x = 0; const hinge = G(); hinge.position.set(0, 4, -15); lid.position.set(0, 0, 15); hinge.add(lid); hinge.rotation.x = -1.25; g.add(hinge);
    const stack = closedBox({ w: 30, h: 8, d: 30, top: P, side: M.flute(1, 3), seam: false }); g.add(place(stack, 34, 0, -6, 0.2)); return g; },
  carryBags: () => { const g = G();
    g.add(place(bag({ front: M.matte(art("kraftprint", { text: "harvest", sub: "MARKET · EST. 2019", color: "#2A2626" })), side: M.kraft(), inner: M.kraftIn(), handleMat: M.kraft() }), -15, 0, 0, 0.35));
    g.add(place(bag({ w: 24, h: 30, d: 11, front: M.matte(art("band", { text: "harvest", color: RED, base: "#F7F3EC", y: 0.6 })), side: M.board("#F7F3EC"), inner: M.board("#EEE9E0"), handle: "flat", handleMat: M.board("#F7F3EC") }), 12, 0, -4, -0.3)); return g; },
  foodBags: () => { const g = G(); const b = bag({ w: 18, h: 30, d: 10, front: M.matte(art("kraftprint", { text: "Bakehouse", sub: "FRESH EVERY MORNING", color: RED })), side: M.kraft(), inner: M.kraftIn(), handle: "none" }); g.add(place(b, -6, 0, 0, 0.3));
    const loaf = new THREE.Mesh(new THREE.CapsuleGeometry(2.6, 22, 8, 24), std({ color: "#C48B4A", roughness: 0.7 })); loaf.position.set(-6, 26, -1); loaf.rotation.z = 0.15; g.add(loaf);
    const flat = closedBox({ w: 16, h: 0.4, d: 26, top: M.matte(art("kraftprint", { text: "Bakehouse", color: RED })), side: M.kraft(), seam: false }); g.add(place(flat, 13, 0, 4, -0.5)); return g; },
  premiumBags: () => { const g = G(); const blk = phys({ map: art("band", { text: "MAISON", color: "#1E1B1B", base: "#1E1B1B", y: 0.4, bh: 0.2 }), roughness: 0.65, sheen: 0.3 });
    g.add(place(bag({ w: 26, h: 30, d: 11, front: blk, side: phys({ color: "#1E1B1B", roughness: 0.65 }), inner: M.color(RED, 0.9), handle: "rope", handleMat: M.gloss(RED, 0.35) }), -10, 0, 0, 0.25));
    g.add(place(bag({ w: 20, h: 26, d: 9, front: M.print(art("band", { text: "MAISON", color: RED, base: "#FBF7F0", y: 0.4 }), 0.35, 0.4), side: M.print(art("plain", { base: "#FBF7F0" }), 0.35, 0.4), inner: M.color(RED, 0.9), handle: "rope", handleMat: M.gloss("#1E1B1B", 0.35) }), 14, 0, -6, -0.35)); return g; },
  labelRolls: () => { const g = G(); for (let i = 0; i < 3; i++) { const t = art("label", { text: ["ORCHARD", "HONEY", "CHAI"][i], color: [RED, "#E3A21A", "#2A2626"][i] }, { repeat: [10, 1] }); g.add(place(roll({ r: 5.5, len: 8, core: 3.8, mat: M.print(t, 0.4, 0.4), standing: true, endMat: M.board("#FFFFFF") }), -10 + i * 11, 0, (i % 2) * -6)); }
    const jar = vessel({ rb: 3.4, rt: 3.4, h: 8, t: 0.15, outer: M.clear("#ffd28a"), rim: false }); g.add(place(jar, 4, 0, 10)); const lbl = new THREE.Mesh(new THREE.CylinderGeometry(3.42, 3.42, 4, 64, 1, true, -1.2, 2.4), M.print(art("label", { text: "HONEY", color: "#E3A21A" }), 0.4, 0.3)); lbl.position.set(4, 4, 10); g.add(lbl); return g; },
  barcodeLabels: () => { const g = G(); const t = art("label", { text: "SHIP TO", sub: "AWB 2318 0045 77", color: "#1E1B1B", base: "#FFFFFF" }, { repeat: [12, 1] });
    g.add(place(roll({ r: 6, len: 10.5, core: 2, mat: M.matte(t), standing: true, endMat: M.board("#FFFFFF") }), -12, 0, 2));
    const box = corrugated({ w: 26, h: 18, d: 20 }); g.add(place(box, 8, 0, -2, -0.4));
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(10, 7), M.matte(art("label", { text: "SHIP TO", sub: "Pune 411 019 · 2.4 kg", color: "#1E1B1B", base: "#FFFFFF" }))); lab.position.set(8 + Math.sin(-0.4) * 10.05, 9, -2 + Math.cos(-0.4) * 10.05); lab.rotation.y = -0.4; g.add(lab); return g; },
  stickers: () => { const g = G(); const A = art("mithai", { text: "Mithai Ghar" }); const b = closedBox({ w: 20, h: 5, d: 14, top: M.print(A), side: M.print(art("mithai", { text: " ", sub: " " })), seam: false }); g.add(b);
    const seal = new THREE.Mesh(new THREE.CircleGeometry(2.4, 64), M.print(art("band", { text: "SEALED", color: RED, base: RED, y: 0.38, bh: 0.24 }), 0.3, 0.6)); seal.position.set(0, 3.2, 7.02); g.add(seal);
    for (let i = 0; i < 6; i++) { const s = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), M.print(art("band", { text: ["FRESH", "SALE", "NEW"][i % 3], color: [RED, "#E3A21A", "#2A2626"][i % 3], base: [RED, "#E3A21A", "#2A2626"][i % 3], y: 0.38, bh: 0.24 }), 0.3, 0.6)); s.rotation.x = -Math.PI / 2; s.rotation.z = rnd(); s.position.set(14 + (i % 3) * 5, 0.05 + i * 0.01, -4 + Math.floor(i / 3) * 5.2); g.add(s); }
    return g; },
  butterPaper: () => { const g = G(); const bp = phys({ color: "#F8F3E4", roughness: 0.3, transmission: 0.55, thickness: 0.1, transparent: true, side: THREE.DoubleSide });
    g.add(sheets({ w: 24, d: 18, n: 26, t: 0.06, mat: bp, jitter: 1.2, rot: 0.12 })); g.add(place(mithai(6, 14, 10, 1.6), 0, 0, 0));
    g.add(place(roll({ r: 4, len: 30, core: 1.6, mat: phys({ color: "#F3EBD6", roughness: 0.25, clearcoat: 0.6 }) }), 0, 0, -16, 0.1)); return g; },
  wrapSheets: () => { const g = G(); const A = art("pattern", { color: RED, base: "#FBF7F0" });
    g.add(sheets({ w: 26, d: 26, n: 20, t: 0.05, mat: M.matte(A), jitter: 1.5, rot: 0.3 }));
    const wrapped = new THREE.Mesh(new THREE.CapsuleGeometry(3.8, 9, 8, 32), M.matte(A)); wrapped.rotation.z = Math.PI / 2; wrapped.rotation.y = 0.5; wrapped.position.set(4, 4.8, 18); g.add(wrapped);
    g.add(place(burger(0.75), -10, 1, 18)); return g; },
  kraftRolls: () => { const g = G(); g.add(place(roll({ r: 9, len: 60, core: 4, mat: M.kraft(), endMat: M.kraft("#A97B4F") }), 0, 0, 0));
    const un = slab(60, 0.05, 30, M.kraft()); un.position.set(0, 0.03, 24); g.add(un); const parcel = closedBox({ w: 16, h: 10, d: 12, top: M.kraft(), side: M.kraft(), seam: false }); g.add(place(parcel, 14, 0.1, 26, 0.4));
    const tw = rope([[6, 10.2, 26], [14, 10.4, 26], [22, 10.2, 26]], 0.12, M.color("#E9E1CF")); tw.rotation.y = 0; g.add(tw); return g; },
  brochures: () => { const g = G(); for (let i = 0; i < 5; i++) { const s = slab(21, 0.5, 29.7, six({ px: M.board(), nx: M.board(), py: M.print(art("news", { text: ["Annual Review", "Product Guide", "Company Profile", "Catalogue 2027", "Capabilities"][i], color: [RED, "#2A2626", RED, "#454040", RED][i] }), 0.35, 0.4), ny: M.board(), pz: M.board(), nz: M.board() })); s.position.set(-8 + i * 4, 0.25 + i * 0.5, i * -2.5); s.rotation.y = -0.6 + i * 0.25; g.add(s); } return g; },
  flyers: () => { const g = G(); const A = art("news", { text: "Spring Offer", color: RED });
    for (let i = 0; i < 3; i++) { const p = slab(10, 0.05, 21, six({ px: M.board(), nx: M.board(), py: M.print(A, 0.4, 0.2), ny: M.board(), pz: M.board(), nz: M.board() })); p.position.set(-10 + i * 10.2, 0.03 + (i === 1 ? 1.2 : 0), 0); p.rotation.z = i === 0 ? 0.12 : i === 2 ? -0.12 : 0; g.add(p); }
    const st = sheets({ w: 14.8, d: 21, n: 30, t: 0.03, mat: M.print(art("news", { text: "Product Leaflet", color: "#2A2626" }), 0.5, 0.1), edgeMat: M.board(), jitter: 0.3 }); g.add(place(st, 18, 0, -6, 0.4));
    const carton2 = carton({ w: 6, h: 12, d: 4, artTex: art("pharma", { color: RED }) }); g.add(place(carton2, -20, 0, -8, 0.4)); return g; },
  cupCarriers: () => { const g = G(); const F = M.fibre("#D8CDB5"); const base = slab(20, 1.2, 20, F); base.position.y = 0.6; g.add(base);
    for (const [x, z] of [[-5, -5], [5, -5], [-5, 5], [5, 5]]) { const ring = vessel({ rb: 3.2, rt: 3.8, h: 4, t: 0.35, outer: F, inner: F, rim: false }); g.add(place(ring, x, 0, z)); }
    const A = art("wave", { text: "BREW & CO.", color: RED, base: "#FFFFFF" }); for (const [x, z] of [[-5, -5], [5, 5], [5, -5]]) g.add(place(cupMesh({ rb: 2.9, rt: 4.2, h: 11, artTex: A, lid: true }), x, 1.4, z));
    const handle = slab(2, 8, 18, F); handle.position.y = 4; g.add(handle); return g; },

  // ── PLASTIC
  filmRolls: ({ tint = "#eef3f4", n = 3, len = 32, r = 6, printed } = {}) => { const g = G(); for (let i = 0; i < n; i++) { const m = printed ? M.print(art("wave", { text: "CRUNCH", color: printed, base: "#ffffff" }, { repeat: [4, 1] }), 0.15, 1) : M.film(tint); g.add(place(roll({ r: r - i * 0.6, len, mat: m }), i * 3 - 3, 0, i * -14 + 8, (i - 1) * 0.15)); } return g; },
  shrinkPack: ({ tint = "#ffffff" } = {}) => { const g = G(); const items = G();
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) items.add(place(carton({ w: 6, h: 9, d: 6, artTex: art("band", { text: "NOVA", color: RED, base: "#FFFFFF" }) }), -6.2 + i * 6.2, 0, -3.1 + j * 6.2));
    g.add(items); const wrap = new THREE.Mesh(new RoundedBoxGeometry(19.4, 9.6, 13, 6, 1.4), M.clear(tint, 0.03, 0.05)); wrap.position.y = 4.8; g.add(wrap);
    g.add(place(roll({ r: 5, len: 30, mat: M.film() }), 0, 0, -16, 0.2)); return g; },
  peShrink: () => { const g = G(); const tr = openBox({ w: 24, h: 3, d: 16, t: 0.35, outer: M.kraft(), inner: M.kraftIn(), edge: M.flute(1, 3), flaps: false }); g.add(tr);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const b = plasticCup({ rb: 3.6, rt: 3.6, h: 22, tint: "#e8f4ff", fill: { level: 0.85, color: "#E8A23A", trans: 0.2 } }); const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 1.6, 24), M.color(RED, 0.4)); cap.position.y = 23; b.add(cap); g.add(place(b, -7.8 + i * 7.8, 0.4, -3.9 + j * 7.8)); }
    const wrap = new THREE.Mesh(new RoundedBoxGeometry(24.4, 22, 16.4, 6, 2.5), M.clear("#ffffff", 0.08, 0.05)); wrap.position.y = 11.5; g.add(wrap); return g; },
  stretchPallet: () => { const g = G(); const pal = G(); for (let i = 0; i < 3; i++) { const p = slab(80, 1.5, 9, M.color("#B58A5C", 0.9)); p.position.set(0, 12.75, -35 + i * 35); pal.add(p); const b = slab(80, 10, 8, M.color("#A87C50", 0.9)); b.position.set(0, 6, -35 + i * 35); pal.add(b); } for (let i = 0; i < 6; i++) { const p = slab(80, 1.5, 12, M.color("#B58A5C", 0.9)); p.position.set(0, 14, -34 + i * 13.6); pal.add(p); } g.add(pal);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) g.add(place(corrugated({ w: 39, h: 28, d: 39 }), -19.75 + i * 39.5, 14.8 + k * 28.2, -19.75 + j * 39.5));
    const wrap = new THREE.Mesh(new RoundedBoxGeometry(81, 50, 81, 4, 3), M.clear("#f2f7f8", 0.18, 0.05)); wrap.position.y = 15 + 25; g.add(wrap);
    g.add(place(roll({ r: 6, len: 50, mat: M.film(), standing: true }), 58, 0, 30)); return g; },
  clingBox: ({ compost = false } = {}) => { const g = G(); const A = art("band", { text: compost ? "FRESHWRAP · compostable" : "FRESHWRAP", color: compost ? "#6B7F4E" : RED, base: "#FFFFFF", y: 0.3, bh: 0.4 });
    g.add(closedBox({ w: 32, h: 6, d: 6, top: M.print(A), side: M.print(art("plain", { base: compost ? "#6B7F4E" : RED })), front: M.print(A), seam: false }));
    const r = roll({ r: 2.6, len: 30, mat: compost ? M.compost("#f2f0e6") : M.film("#f7fafa") }); g.add(place(r, 0, 0, 12));
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(29, 14, 20, 10), compost ? M.frost("#f4f2e8", 0.35) : M.clear("#ffffff", 0.08)); const p = sheet.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 0.4) * 0.2 + Math.sin(p.getY(i) * 0.5) * 0.3); sheet.geometry.computeVertexNormals(); sheet.rotation.x = -Math.PI / 2.1; sheet.position.set(0, 1.8, 21); g.add(sheet);
    const bowl = vessel({ rb: 5, rt: 8, h: 6, t: 0.3, outer: M.gloss("#F3F1EC", 0.2), inner: M.gloss("#F3F1EC", 0.2) }); g.add(place(bowl, 22, 0, 18)); return g; },
  bubble: () => { const g = G(); const mat = M.clear("#f6fbfc", 0.12, 0.3);
    const sheet = G(); const base = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), mat); base.rotation.x = -Math.PI / 2; base.position.y = 0.05; sheet.add(base);
    const bub = new THREE.InstancedMesh(new THREE.SphereGeometry(0.55, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat, 1600); const m4 = new THREE.Matrix4(); let k = 0;
    for (let x = -19.5; x < 19.5 && k < 1600; x += 1.3) for (let z = -14.5; z < 14.5 && k < 1600; z += 1.3) { m4.makeTranslation(x + ((z * 10) % 2 ? 0.65 : 0), 0.05, z); bub.setMatrixAt(k++, m4); } bub.count = k; sheet.add(bub); g.add(sheet);
    const r = roll({ r: 8, len: 40, mat: M.frost("#eef6f8", 0.25) }); g.add(place(r, 0, 0, -24));
    const glass = plasticCup({ rb: 2.6, rt: 3.4, h: 13, tint: "#ffffff" }); g.add(place(glass, 6, 0.3, 4)); return g; },
  ldpePouches: () => { const g = G(); const mat = M.frost("#f6f6f2", 0.18);
    for (let i = 0; i < 3; i++) { const p = pouch({ w: 16, h: 22, d: 1.2, mat, gusset: false, zip: true }); p.rotation.x = -Math.PI / 2; p.position.set(-15 + i * 15, 0.6 + i * 0.05, (i % 2) * 6 - 6 + 11); p.rotation.z = (i - 1) * 0.12; g.add(p); }
    for (let i = 0; i < 4; i++) { const n = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2, 6), M.metal("#9aa1a6")); n.rotation.z = Math.PI / 2; n.position.set(-14 + i * 1.8, 1.4, 2); g.add(n); } return g; },
  courierBags: ({ compost = false } = {}) => { const g = G(); const base = compost ? "#E9E6D8" : "#9AA0A6";
    for (let i = 0; i < 4; i++) { const t = i === 3 ? art("band", { text: compost ? "loom · compostable mailer" : "loom", color: compost ? "#6B7F4E" : RED, base: compost ? "#EFECE0" : "#FFFFFF", y: 0.42, bh: 0.16 }) : art("plain", { base }); const s = slab(30, 0.6, 38, six({ px: M.color(base), nx: M.color(base), py: compost ? M.matte(t) : M.print(t, 0.35, 0.3), ny: M.color(base), pz: M.color(base), nz: M.color(base) })); s.geometry = new RoundedBoxGeometry(30, 0.6, 38, 2, 0.28); s.material = compost ? M.matte(t) : M.print(t, 0.35, 0.3); s.position.set(i * 1.6, 0.3 + i * 0.62, -i * 1.2); s.rotation.y = -0.1 + i * 0.08; g.add(s); }
    const fold = slab(18, 4, 12, M.color("#D9D2C3", 0.9)); fold.geometry = new RoundedBoxGeometry(18, 4, 12, 3, 1.5); fold.position.set(26, 2, 8); g.add(fold); return g; },
  pouches: () => { const g = G(); const designs = [["CRUNCH", RED], ["MASALA", "#E3A21A"], ["ROAST", "#2A2626"]];
    designs.forEach(([t, c], i) => g.add(place(pouch({ w: 15, h: 22, d: 6, artTex: art("band", { text: t, color: c, base: "#FFFFFF", y: 0.45, bh: 0.25, sub: "Net wt. 200 g" }) }), -15 + i * 15, 0, i === 1 ? -4 : 2, (i - 1) * -0.25)));
    return g; },
  laminateRoll: () => MODELS.filmRolls({ printed: RED, n: 2, r: 9, len: 34 }),
  plasticContainers: () => { const g = G(); const clr = M.clear("#ffffff", 0.08, 0.2);
    for (let i = 0; i < 3; i++) { const c = vessel({ rb: 5.4, rt: 6.2, h: 6, t: 0.1, outer: clr, inner: clr, rim: true }); const fill = new THREE.Mesh(new THREE.CylinderGeometry(5.9, 5.3, 4.5, 64), std({ color: ["#C4682A", "#E9D9A6", "#7A3E1D"][i], roughness: 0.5 })); fill.position.y = 2.4; c.add(fill);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 0.8, 64), clr); lid.position.y = 6.4; c.add(lid); g.add(place(c, i * 4 - 4, i * 6.9, i * 1)); }
    const rect = new THREE.Mesh(new RoundedBoxGeometry(18, 6, 12, 4, 1), clr); rect.position.set(18, 3, 6); g.add(rect); const rf = new THREE.Mesh(new RoundedBoxGeometry(17, 4, 11, 4, 0.8), std({ color: "#E9B44C", roughness: 0.6 })); rf.position.set(18, 2.2, 6); g.add(rf); return g; },
  clamshell: () => { const g = G(); const clr = M.clear("#ffffff", 0.05, 0.15); const b = new THREE.Mesh(new RoundedBoxGeometry(16, 5, 16, 4, 1.2), clr); b.position.y = 2.5; g.add(b);
    for (let i = 0; i < 2; i++) { const c = cupcake(); c.scale.setScalar(1.1); g.add(place(c, -3.5 + i * 7, 0.3, 0)); }
    const lid = new THREE.Mesh(new RoundedBoxGeometry(16, 4, 16, 4, 1.2), clr); const hinge = G(); lid.position.set(0, 0, -8); hinge.add(lid); hinge.position.set(0, 5, -8); hinge.rotation.x = -1.9; g.add(hinge); return g; },
  petGlasses: () => { const g = G(); g.add(plasticCup({ rb: 2.9, rt: 4.5, h: 13, lid: "dome", fill: { level: 0.85, color: "#7A4A2C" } })); g.add(place(plasticCup({ rb: 2.9, rt: 4.5, h: 13, lid: "flat", fill: { level: 0.85, color: "#F2A6B6" } }), 11, 0, -3));
    for (let i = 0; i < 4; i++) g.add(place(plasticCup({ rb: 2.9, rt: 4.5, h: 13 }), -11, i * 1.4, -2)); const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 22, 12), M.color(RED, 0.4)); straw.position.set(1, 13, 0); straw.rotation.z = -0.2; g.add(straw); return g; },
  ppGlasses: () => { const g = G(); for (let i = 0; i < 6; i++) g.add(place(plasticCup({ rb: 2.4, rt: 3.6, h: 9, frosted: true, tint: "#fbfbf8" }), -8, i * 1.15, 0));
    g.add(place(plasticCup({ rb: 2.4, rt: 3.6, h: 9, frosted: true, tint: "#fbfbf8", fill: { level: 0.7, color: "#dceef3", trans: 0.9 } }), 4, 0, 2)); g.add(place(plasticCup({ rb: 2.4, rt: 3.6, h: 9, frosted: true, tint: "#fbfbf8" }), 11, 0, -4)); return g; },

  // ── COMPOSTABLE
  compostCarry: () => { const g = G(); const mat = M.compost("#ECEADF");
    const b = pouch({ w: 30, h: 42, d: 9, mat, gusset: false, zip: false }); g.add(b);
    const cut = new THREE.Mesh(new THREE.CircleGeometry(4, 32), M.color("#F7F0E6")); cut.position.set(0, 37, 4.6); cut.scale.y = 0.6; g.add(cut);
    const lbl = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), M.matte(art("band", { text: "compostable", color: "#6B7F4E", base: "#ECEADF", y: 0.3, bh: 0.4 }))); lbl.position.set(0, 18, 4.1); g.add(lbl);
    g.add(place(new THREE.Mesh(new THREE.SphereGeometry(3.6, 32, 16), std({ color: "#E9541E", roughness: 0.5 })), 17, 3.6, 8)); g.add(place(new THREE.Mesh(new THREE.SphereGeometry(3.2, 32, 16), std({ color: "#7DB343", roughness: 0.5 })), 22, 3.2, 2)); return g; },
  garbageRoll: () => { const g = G(); g.add(roll({ r: 6, len: 32, core: 1.4, mat: M.compost("#DCE0CF") }));
    const bin = vessel({ rb: 9, rt: 10, h: 24, t: 0.4, outer: M.gloss("#2A2626", 0.4), inner: M.compost("#DCE0CF") }); g.add(place(bin, 26, 0, -6)); const over = new THREE.Mesh(new THREE.TorusGeometry(10.1, 0.7, 12, 64), M.compost("#DCE0CF")); over.rotation.x = Math.PI / 2; over.position.set(26, 23.6, -6); g.add(over); return g; },
  compostMailer: () => MODELS.courierBags({ compost: true }),
  nurseryBags: () => { const g = G(); for (let i = 0; i < 5; i++) { const b = vessel({ rb: 4.2, rt: 4.6, h: 12, t: 0.08, outer: M.compost(i % 2 ? "#3E3A34" : "#4A453D"), inner: M.color("#4a3626", 0.95), rim: false }); const soil = new THREE.Mesh(new THREE.CircleGeometry(4.5, 48), std({ map: tex(noiseCanvas("#3d2a1c", "#6a4a2e", 3000)), roughness: 1 })); soil.rotation.x = -Math.PI / 2; soil.position.y = 11; b.add(soil); const s = sapling(); s.position.y = 11; b.add(s); g.add(place(b, (i % 3) * 10 - 10, 0, Math.floor(i / 3) * 10 - 4)); } return g; },
  laundryBags: () => { const g = G(); const b = pouch({ w: 34, h: 46, d: 10, mat: M.compost("#EEECE2"), gusset: false, zip: false }); g.add(b);
    const lbl = new THREE.Mesh(new THREE.PlaneGeometry(22, 14), M.matte(art("news", { text: "Laundry · Room ___", color: "#6B7F4E", base: "#EEECE2" }))); lbl.position.set(0, 24, 4.6); g.add(lbl);
    const draw = rope([[-15, 42, 2], [-6, 44, 6], [6, 44, 6], [15, 42, 2]], 0.3, M.color("#6B7F4E")); g.add(draw);
    for (let i = 0; i < 3; i++) { const t = new THREE.Mesh(new RoundedBoxGeometry(22, 3.2, 14, 4, 1.4), std({ color: ["#FFFFFF", "#F0E9DC", "#E7E2D8"][i], roughness: 0.95 })); t.position.set(30, 1.6 + i * 3.2, 4); g.add(t); } return g; },
  compostPouch: () => { const g = G(); g.add(pouch({ w: 15, h: 23, d: 6, artTex: art("kraftprint", { text: "Hill Estate", sub: "WHOLE BEAN COFFEE", color: "#2A2626", base: "#C9AE88" }) }));
    g.add(place(pouch({ w: 13, h: 19, d: 5, artTex: art("band", { text: "leaf & co", color: "#6B7F4E", base: "#EFECE0", y: 0.5 }) }), 14, 0, -5, -0.3));
    const beans = G(); const bg = new THREE.SphereGeometry(0.6, 12, 8); for (let i = 0; i < 40; i++) { const b = new THREE.Mesh(bg, M.color("#4A2A18", 0.5)); b.scale.set(1, 0.6, 0.8); b.position.set(-6 + rnd() * 10, 0.4, 8 + rnd() * 5); b.rotation.y = rnd() * 6; beans.add(b); } g.add(beans); return g; },
  compostFilm: () => { const g = G(); g.add(roll({ r: 7, len: 36, mat: M.compost("#EDEBDD") })); g.add(place(roll({ r: 5, len: 30, mat: M.compost("#E6E8D6") }), 4, 0, -14, 0.2));
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(36, 18, 24, 10), M.frost("#f2f1e6", 0.4)); sh.rotation.x = -Math.PI / 2; sh.position.set(0, 0.05, 16); g.add(sh); return g; },
  compostShrink: () => { const g = MODELS.shrinkPack({ tint: "#f6f4ea" }); return g; },
  compostCling: () => MODELS.clingBox({ compost: true }),
  fibreClamshell: () => { const g = G(); const F = M.fibre();
    const base = tray({ wb: 18, db: 14, wt: 21, dt: 17, h: 5, t: 0.25, outer: F, inner: F }); g.add(base);
    const rice = new THREE.Mesh(new RoundedBoxGeometry(12, 2.2, 13, 3, 1), std({ map: tex(noiseCanvas("#F6F1E4", "#E2D6BC", 4000)), roughness: 0.9 })); rice.position.set(-3, 2.6, 0); g.add(rice);
    const cur = new THREE.Mesh(new RoundedBoxGeometry(6, 1.8, 12, 3, 0.8), std({ color: "#B5541E", roughness: 0.35 })); cur.position.set(6, 2.4, 0); g.add(cur);
    const closed = G(); const c1 = tray({ wb: 18, db: 14, wt: 21, dt: 17, h: 5, t: 0.25, outer: F, inner: F }); closed.add(c1); const c2 = tray({ wb: 18, db: 14, wt: 21, dt: 17, h: 5, t: 0.25, outer: F, inner: F }); c2.rotation.x = Math.PI; c2.position.y = 10; closed.add(c2); g.add(place(closed, 26, 0, -6, 0.4)); return g; },
  fibreTrays: () => { const g = G(); const F = M.fibre(); const base = tray({ wb: 30, db: 22, wt: 32, dt: 24, h: 3, t: 0.3, outer: F, inner: F }); g.add(base);
    for (const [x, z, w, d] of [[-7, 4, 14, 11], [7.5, 4, 13, 11]]) { const wall = slab(0.4, 2.6, d, F); wall.position.set(x + w / 2, 1.5, z); }
    const div1 = slab(29, 2.6, 0.4, F); div1.position.set(0, 1.5, -2); g.add(div1); for (const x of [-7.5, 2.5]) { const d = slab(0.4, 2.6, 8, F); d.position.set(x, 1.5, -6.5); g.add(d); } const d2 = slab(0.4, 2.6, 9, F); d2.position.set(2, 1.5, 3); g.add(d2);
    const foods = [["#C4682A", -12, -6.5], ["#E9C46A", -2.5, -6.5], ["#7A9E3A", 8.5, -6.5], ["#F6F1E4", -6, 3.5], ["#B5541E", 9, 3.5]]; foods.forEach(([c, x, z], i) => { const f = new THREE.Mesh(new RoundedBoxGeometry(i < 3 ? 8 : 14, 1.6, i < 3 ? 6.5 : 7.5, 3, 0.7), std({ color: c, roughness: 0.5 })); f.position.set(x, 1.2, z); g.add(f); });
    const plate = vessel({ rb: 8, rt: 12, h: 2, t: 0.3, outer: F, inner: F }); g.add(place(plate, 30, 0, -8)); return g; },
  compostCups: () => { const g = G(); const A = art("band", { text: "compostable-lined", color: "#6B7F4E", base: "#F4F1E8", y: 0.6, bh: 0.16 });
    g.add(cupMesh({ rb: 2.8, rt: 4.2, h: 11, artTex: A, lid: "#D8CDB5" })); g.add(place(cupMesh({ rb: 2.6, rt: 3.8, h: 9, artTex: A }), 10, 0, -3));
    g.add(place(plasticCup({ rb: 2.9, rt: 4.4, h: 12, tint: "#fbfbf2", fill: { level: 0.8, color: "#E8B04B", trans: 0.3 } }), -10, 0, -2)); return g; },
  cutlery: () => { const g = G(); const mat = std({ color: "#E9DDBF", roughness: 0.5 }); ["spoon", "fork", "knife", "spoon", "fork"].forEach((k, i) => { const p = cutleryPiece(k, mat); p.rotation.z = -0.5 + i * 0.25; p.position.x = -6 + i * 3; g.add(p); });
    const linen = slab(40, 0.1, 22, M.color("#6B7F4E", 0.95)); linen.position.set(0, 0.05, 6); g.add(linen); return g; },

  // ── CORRUGATED
  rsc: ({ ply = 1, w = 30, h = 22, d = 24, printed, bigger } = {}) => { const g = G();
    g.add(place(corrugated({ w, h, d, ply, printed }), -w * 0.55, 0, -4, 0.3));
    g.add(place(corrugated({ w: w * 0.8, h: h * 0.8, d: d * 0.8, ply, printed }), -w * 0.55 + 2, h, -4, 0.15));
    g.add(place(corrugated({ w, h, d, ply, open: true, printed }), w * 0.6, 0, 6, -0.45)); return g; },
  dieCut: () => { const g = G(); const P = M.print(art("pattern", { color: RED, base: "#FBF7F0" }), 0.6, 0.1); const inner = M.board("#FBF7F0");
    const b = openBox({ w: 26, h: 7, d: 20, t: 0.25, outer: M.kraft(), inner, edge: M.flute(1, 4), front: M.kraft(), flaps: false }); g.add(b);
    const lid = slab(26, 0.25, 20, six({ px: M.flute(1, 4), nx: M.flute(1, 4), py: M.kraft(), ny: P, pz: M.flute(1, 4), nz: M.flute(1, 4) })); const hg = G(); lid.position.set(0, 0, 10); hg.add(lid); hg.position.set(0, 7, -10); hg.rotation.x = -1.95; g.add(hg);
    const tuck = slab(26, 0.2, 5, M.kraft()); const tg = G(); tuck.position.set(0, 0, 2.5); tg.add(tuck); tg.position.set(0, 0, 10); tg.rotation.x = 1.4; hg.add(tg);
    const cl = closedBox({ w: 22, h: 6, d: 16, top: M.kraft(), side: M.flute(1, 3), front: M.kraft(), seam: false }); g.add(place(cl, 26, 0, 4, -0.4)); return g; },
  heavyExport: () => { const g = G(); const mark = { text: "EXPORT", sub: "HANDLE WITH CARE · C/NO 14/40 · NET 32 KG", color: "#2A2626" };
    const pal = G(); for (let i = 0; i < 3; i++) { const b = slab(100, 10, 8, M.color("#A87C50", 0.9)); b.position.set(0, 5, -40 + i * 40); pal.add(b); } for (let i = 0; i < 7; i++) { const p = slab(100, 1.5, 11, M.color("#B58A5C", 0.9)); p.position.set(0, 10.75, -42 + i * 14); pal.add(p); } g.add(pal);
    g.add(place(corrugated({ w: 96, h: 60, d: 90, ply: 3, printed: mark, shade: "#A87B4F" }), 0, 11.5, 0));
    g.add(place(corrugated({ w: 48, h: 36, d: 40, ply: 2, printed: mark, shade: "#B08353" }), 80, 0, 20, -0.3)); return g; },
  ecomBoxes: () => { const g = G(); const R = M.print(art("wave", { text: "loom", color: "#FFFFFF", base: RED, ink: "#FFFFFF" }), 0.55, 0.1);
    const b = openBox({ w: 30, h: 9, d: 22, t: 0.25, outer: R, inner: M.board("#FFFFFF"), edge: M.flute(1, 4), flaps: false }); g.add(b);
    const tissue = new THREE.Mesh(new THREE.PlaneGeometry(28, 20, 20, 14), std({ color: "#F6EFE6", roughness: 0.9, side: THREE.DoubleSide })); const p = tissue.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 0.7) * 0.5 + Math.cos(p.getY(i) * 0.9) * 0.4); tissue.geometry.computeVertexNormals(); tissue.rotation.x = -Math.PI / 2; tissue.position.y = 7; g.add(tissue);
    const lid = slab(30, 0.25, 22, six({ px: M.flute(1, 4), nx: M.flute(1, 4), py: R, ny: M.board("#FFFFFF"), pz: M.flute(1, 4), nz: M.flute(1, 4) })); const hg = G(); lid.position.set(0, 0, 11); hg.add(lid); hg.position.set(0, 9, -11); hg.rotation.x = -1.85; g.add(hg);
    const cl = closedBox({ w: 26, h: 8, d: 18, top: R, side: R, seam: false }); g.add(place(cl, 30, 0, 6, -0.35)); g.add(place(corrugated({ w: 24, h: 16, d: 20 }), 30, 8, 6, -0.25)); return g; },
  inserts: () => { const g = G(); const b = openBox({ w: 30, h: 20, d: 18, t: 0.5, outer: M.kraft(), inner: M.kraftIn(), edge: M.flute(2, 4), flapAngle: 2.2 }); g.add(b);
    const ins = slab(29, 1.2, 17, M.kraft()); ins.position.y = 12; g.add(ins); for (let i = 0; i < 3; i++) { const bt = bottle(24, 3, ["#3A1F14", "#4E6B2F", "#5B2A1F"][i]); g.add(place(bt, -9 + i * 9, 0.6, 0)); }
    const fit = slab(30, 1.2, 18, M.kraft()); fit.position.set(32, 0.6, 6); g.add(fit); for (let i = 0; i < 3; i++) { const hole = new THREE.Mesh(new THREE.CircleGeometry(3.1, 48), M.color("#3b2a1c", 1)); hole.rotation.x = -Math.PI / 2; hole.position.set(23 + i * 9, 1.22, 6); g.add(hole); } return g; },
  corrSheets: () => { const g = G(); const s = sheets({ w: 60, d: 40, n: 14, t: 0.4, mat: M.kraft(), edgeMat: M.flute(1, 10), jitter: 1.4, rot: 0.05 }); g.add(s);
    const s2 = sheets({ w: 50, d: 34, n: 8, t: 0.8, mat: M.kraft("#A97B4F"), edgeMat: M.flute(2, 8), jitter: 1, rot: 0.06 }); g.add(place(s2, 4, 5.8, 2, 0.2));
    g.add(place(roll({ r: 12, len: 50, core: 3.5, mat: M.kraft(), endMat: M.flute(1, 1) }), 0, 0, -38)); return g; },
  partitions: () => { const g = G(); const b = openBox({ w: 30, h: 22, d: 20, t: 0.45, outer: M.kraft(), inner: M.kraftIn(), edge: M.flute(1, 4), flapAngle: 2.2 }); g.add(b);
    for (let i = 1; i < 4; i++) { const p = slab(0.3, 21, 19, six({ px: M.kraftIn(), nx: M.kraftIn(), py: M.flute(1, 2), ny: M.kraftIn(), pz: M.flute(1, 2), nz: M.flute(1, 2) })); p.position.set(-15 + i * 7.5, 10.5, 0); g.add(p); }
    for (let j = 1; j < 3; j++) { const p = slab(29, 21, 0.3, six({ px: M.flute(1, 2), nx: M.flute(1, 2), py: M.flute(1, 4), ny: M.kraftIn(), pz: M.kraftIn(), nz: M.kraftIn() })); p.position.set(0, 10.5, -10 + j * 6.66); g.add(p); }
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) if ((i + j) % 3) g.add(place(bottle(28, 2.6, "#2E4A28"), -11.25 + i * 7.5, 0.5, -6.66 + j * 6.66)); return g; },
  corrTrays: () => { const g = G(); for (let k = 0; k < 2; k++) { const t = openBox({ w: 36, h: 6, d: 24, t: 0.4, outer: M.kraft(), inner: M.kraftIn(), edge: M.flute(1, 4), flaps: false }); const tg = G(); tg.add(t);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const s = new THREE.Mesh(new THREE.SphereGeometry(3.6, 32, 16), std({ color: k ? "#E9541E" : "#D52B1E", roughness: 0.45 })); s.position.set(-13.2 + i * 8.8, 4.2, -7.6 + j * 7.6); tg.add(s); }
      g.add(place(tg, k * 6, k * 8.2, k * -4, k * 0.1)); } return g; },
  display: () => { const g = G(); const R = M.print(art("band", { text: "CRUNCH", color: RED, base: "#FFFFFF", y: 0.2, bh: 0.5 }), 0.5, 0.1);
    const base = openBox({ w: 36, h: 8, d: 22, t: 0.35, outer: R, inner: M.board("#FFFFFF"), edge: M.flute(1, 4), flaps: false }); g.add(base);
    const header = slab(36, 22, 0.35, six({ px: M.flute(1, 1), nx: M.flute(1, 1), py: M.flute(1, 4), ny: M.flute(1, 4), pz: M.print(art("wave", { text: "CRUNCH · NEW", color: RED, base: "#FFFFFF" })), nz: M.kraft() })); header.position.set(0, 19, -10.8); g.add(header);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const p = pouch({ w: 7.5, h: 11, d: 3, artTex: art("band", { text: "CRUNCH", color: RED, base: "#FFFFFF", y: 0.4 }), zip: false }); p.rotation.x = -0.25; g.add(place(p, -12.6 + i * 8.4, 1 + j * 2, -4 + j * 8)); } return g; },
};

/** Composite of several models: items = [[model, params, x, z, ry, scale]] */
MODELS.combo = async ({ items }) => { const g = G(); for (const [m, p, x = 0, z = 0, ry = 0, s = 1] of items) { const o = await MODELS[m](p ?? {}); o.scale.setScalar(s); const b = new THREE.Box3().setFromObject(o); o.position.set(x, -b.min.y, z); o.rotation.y = ry; g.add(o); } return g; };
