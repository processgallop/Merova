/**
 * Database client.
 *
 * - Production: set DATABASE_URL to any PostgreSQL database (Neon, Supabase,
 *   RDS, Vercel Marketplace Postgres…). Migrations run and the initial content
 *   is seeded automatically on first connection.
 * - Local development / tests: without DATABASE_URL an embedded PostgreSQL
 *   (PGlite) is used, persisted to `.data/pglite`.
 * - Build workers and serverless deployments without DATABASE_URL use an
 *   in-memory PGlite seeded from the same content. That mode is NOT persistent
 *   and the admin dashboard says so (see `dbMode()`).
 */
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";
import { runMigrations } from "./migrate";

export type DB = PgDatabase<PgQueryResultHKT, typeof schema>;
export { schema };

type Mode = "postgres" | "pglite-file" | "pglite-memory";

const g = globalThis as unknown as { __merovaDb?: Promise<DB>; __merovaDbMode?: Mode };

export function dbMode(): Mode {
  if (process.env.DATABASE_URL) return "postgres";
  const building = process.env.NEXT_PHASE === "phase-production-build";
  if (building || process.env.VERCEL || process.env.PGLITE_MEMORY === "1") return "pglite-memory";
  return "pglite-file";
}

export const isPersistent = () => dbMode() !== "pglite-memory";

async function connect(): Promise<DB> {
  const mode = dbMode();
  g.__merovaDbMode = mode;
  let db: DB;
  let exec: (sql: string) => Promise<unknown>;
  if (mode === "postgres") {
    const { default: postgres } = await import("postgres");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const client = postgres(process.env.DATABASE_URL!, {
      max: Number(process.env.DATABASE_POOL_MAX ?? 5),
      prepare: false,
      idle_timeout: 20,
      onnotice: () => {},
    });
    db = drizzle(client, { schema }) as unknown as DB;
    exec = (q) => client.unsafe(q);
  } else {
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    const dir = mode === "pglite-file" ? process.env.PGLITE_DIR ?? ".data/pglite" : undefined;
    if (dir) {
      const { mkdirSync } = await import("node:fs");
      mkdirSync(dir, { recursive: true });
    }
    const client = dir ? new PGlite(dir) : new PGlite();
    await client.waitReady;
    db = drizzle(client, { schema }) as unknown as DB;
    exec = (q) => client.exec(q);
  }
  await runMigrations(exec, mode === "postgres");
  const { seedIfEmpty } = await import("./seed");
  await seedIfEmpty(db, exec);
  return db;
}

export function getDb(): Promise<DB> {
  if (!g.__merovaDb) {
    g.__merovaDb = connect().catch((e) => {
      g.__merovaDb = undefined;
      throw e;
    });
  }
  return g.__merovaDb;
}
