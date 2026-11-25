import { asc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { ROLE_LABEL, ROLE_PERMS } from "@/lib/auth/rbac";
import { UsersManager } from "@/components/admin/UsersManager";

export const metadata = { title: "Users & roles" };

export default async function UsersPage() {
  const me = await requireUser("users.manage");
  const db = await getDb();
  const users = await db.select().from(t.users).orderBy(asc(t.users.createdAt));
  return (
    <UsersManager
      me={me.id}
      users={users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, mfaEnabled: u.mfaEnabled, lastLoginAt: u.lastLoginAt?.toISOString() ?? null, locked: Boolean(u.lockedUntil && u.lockedUntil > new Date()) }))}
      roles={Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label, perms: ROLE_PERMS[value as keyof typeof ROLE_PERMS] }))}
    />
  );
}
