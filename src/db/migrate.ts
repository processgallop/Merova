import { migrations } from "./migrations.generated";

/**
 * Minimal, driver-agnostic migrator. SQL files are produced by drizzle-kit
 * (`npm run db:generate`) and embedded into `migrations.generated.ts`
 * (`npm run db:embed`) so they ship inside the serverless bundle.
 */
export async function runMigrations(exec: (sql: string) => Promise<unknown>, useLock: boolean) {
  await exec(`CREATE TABLE IF NOT EXISTS "_merova_migrations" ("name" text PRIMARY KEY, "applied_at" timestamptz NOT NULL DEFAULT now())`);
  if (useLock) await exec(`SELECT pg_advisory_lock(424242)`);
  try {
    const applied = (await exec(`SELECT name FROM "_merova_migrations"`)) as unknown;
    const names = new Set(extractNames(applied));
    for (const m of migrations) {
      if (names.has(m.name)) continue;
      const statements = m.sql.split("--> statement-breakpoint").map((s) => s.trim()).filter(Boolean);
      await exec("BEGIN");
      try {
        for (const s of statements) await exec(s);
        await exec(`INSERT INTO "_merova_migrations" ("name") VALUES ('${m.name.replace(/'/g, "''")}')`);
        await exec("COMMIT");
      } catch (e) {
        await exec("ROLLBACK");
        throw e;
      }
    }
  } finally {
    if (useLock) await exec(`SELECT pg_advisory_unlock(424242)`);
  }
}

function extractNames(result: unknown): string[] {
  // postgres.js returns an array of rows; PGlite.exec returns [{ rows }]
  if (Array.isArray(result)) {
    if (result.length && typeof result[0] === "object" && result[0] && "rows" in result[0]) {
      return (result as { rows: { name: string }[] }[]).flatMap((r) => r.rows.map((x) => x.name));
    }
    return (result as { name: string }[]).map((r) => r.name).filter(Boolean);
  }
  return [];
}
