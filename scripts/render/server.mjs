import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const root = process.cwd();
const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
export function serve(port = 4599) {
  const s = http.createServer((req, res) => {
    const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
    if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": types[path.extname(p)] ?? "application/octet-stream" }); fs.createReadStream(p).pipe(res);
  });
  return new Promise((r) => s.listen(port, () => r(s)));
}
