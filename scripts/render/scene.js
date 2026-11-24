// Studio scene: renderer, lighting, sweep backdrop, auto-framing. Models live in models.js.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { MODELS } from "./models.js";
import { setSeed } from "./textures.js";

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const BG = {
  cloud: { c: "#F7F0E6", floor: "#F3EBDF" },
  sand: { c: "#EDE3D4", floor: "#E8DCCB" },
  red: { c: "#B3241A", floor: "#A01E15" },
  graphite: { c: "#2E2929", floor: "#2A2525" },
  stone: { c: "#E4E0DA", floor: "#DDD8D1" },
};

function sweep(color, size = 400) {
  // Floor that curves up into a back wall (photographic infinity cove)
  const g = new THREE.PlaneGeometry(size * 2, size * 1.6, 1, 96);
  const p = g.attributes.position;
  const flat = size * 0.55, r = 60;
  for (let i = 0; i < p.count; i++) {
    const v = p.getY(i) + size * 0.8; // 0..size*1.6 along the sheet
    let y, z;
    if (v < flat) { y = 0; z = flat - v; }
    else if (v < flat + (Math.PI / 2) * r) { const a = (v - flat) / r; y = r - Math.cos(a) * r; z = -Math.sin(a) * r; }
    else { y = r + (v - flat - (Math.PI / 2) * r); z = -r; }
    p.setXYZ(i, p.getX(i), y, z - 10);
  }
  g.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0 });
  const mesh = new THREE.Mesh(g, m); mesh.receiveShadow = true; return mesh;
}

async function shot(spec) {
  const { model, params = {}, bg = "cloud", az = -28, el = 18, fov = 24, w = 1600, h = 1200, fill = 1.0, key = 1, seed = 11, exposure = 1, offsetY = 0 } = spec;
  setSeed(seed);
  renderer.setPixelRatio(spec.dpr ?? 1.5);
  renderer.setSize(w, h);
  renderer.toneMappingExposure = exposure;
  const scene = new THREE.Scene();
  const b = BG[bg] ?? BG.cloud;
  scene.background = new THREE.Color(b.c);
  scene.environment = envTex; scene.environmentIntensity = 0.6;
  scene.add(sweep(b.floor));

  const product = await MODELS[model](params);
  product.traverse((o) => { if (o.isMesh) { o.castShadow = o.userData.noShadow ? false : true; o.receiveShadow = true; } });
  scene.add(product);

  // Ground the product and frame it
  const box = new THREE.Box3().setFromObject(product);
  product.position.y -= box.min.y; box.setFromObject(product);
  const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
  const radius = size.length() / 2;

  const key1 = new THREE.DirectionalLight("#fff6ec", 3.4 * key);
  key1.position.set(-radius * 2.2, radius * 3.2, radius * 2.0);
  key1.castShadow = true; key1.shadow.mapSize.set(2048, 2048); key1.shadow.radius = 8; key1.shadow.blurSamples = 24; key1.shadow.bias = -0.0004;
  const sc = key1.shadow.camera; const ext = radius * 2.2; sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 0.1; sc.far = radius * 12;
  key1.target = product; scene.add(key1);
  const rim = new THREE.DirectionalLight("#ffffff", 0.9 * key); rim.position.set(radius * 2.5, radius * 1.6, -radius * 2.5); scene.add(rim);
  scene.add(new THREE.HemisphereLight("#ffffff", b.floor, 0.25));

  const cam = new THREE.PerspectiveCamera(fov, w / h, 0.1, 5000);
  const azr = THREE.MathUtils.degToRad(az), elr = THREE.MathUtils.degToRad(el);
  const vfov = THREE.MathUtils.degToRad(fov), hfov = 2 * Math.atan(Math.tan(vfov / 2) * (w / h));
  const dist = radius / Math.sin(Math.min(vfov, hfov) / 2) * (0.78 / fill);
  const target = center.clone(); target.y += offsetY * size.y;
  cam.position.set(target.x + Math.sin(azr) * Math.cos(elr) * dist, target.y + Math.sin(elr) * dist, target.z + Math.cos(azr) * Math.cos(elr) * dist);
  cam.lookAt(target);
  renderer.render(scene, cam);
  await new Promise((r) => requestAnimationFrame(r));
  renderer.render(scene, cam);
  scene.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); } });
  return true;
}

window.shot = shot;
window.ready = true;
