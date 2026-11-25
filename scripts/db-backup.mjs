// Logical JSON backup of every table (portable; complements provider snapshots / pg_dump).
// Usage: DATABASE_URL=postgres://… node scripts/db-backup.mjs [outDir]
import { mkdirSync, writeFileSync } from "node:fs";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  console.error("Set DATABASE_URL to the database you want to back up.");
  process.exit(1);
}
const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
const tables = (await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`).map((r) => r.tablename);
const out = {};
for (const t of tables) {
  const rows = await sql.unsafe(`SELECT * FROM "${t}"`);
  out[t] = rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, Buffer.isBuffer(v) ? { $base64: v.toString("base64") } : v])));
}
const dir = process.argv[2] ?? "backups";
mkdirSync(dir, { recursive: true });
const file = `${dir}/merova-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
writeFileSync(file, JSON.stringify({ createdAt: new Date().toISOString(), tables: out }));
console.log(`Backed up ${tables.length} tables to ${file}`);
await sql.end();
