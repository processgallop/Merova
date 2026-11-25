"use server";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { getDb, schema as t } from "@/db";
import { sessionUser } from "@/lib/auth/session";
import { newSecret, otpauthUrl, verifyTotp } from "@/lib/auth/totp";
import { audit, type ActionResult } from "@/lib/admin/audit";

export async function startMfaAction(): Promise<ActionResult<{ secret: string; qr: string }>> {
  const u = await sessionUser();
  if (!u) return { ok: false, error: "Please sign in again." };
  const secret = newSecret();
  const db = await getDb();
  await db.update(t.users).set({ mfaSecret: secret, mfaEnabled: false }).where(eq(t.users.id, u.id));
  return { ok: true, data: { secret, qr: await QRCode.toDataURL(otpauthUrl(secret, u.email), { margin: 1, width: 220 }) } };
}

export async function confirmMfaAction(code: string): Promise<ActionResult> {
  const u = await sessionUser();
  if (!u) return { ok: false, error: "Please sign in again." };
  const db = await getDb();
  const [user] = await db.select().from(t.users).where(eq(t.users.id, u.id));
  if (!user?.mfaSecret || !verifyTotp(user.mfaSecret, code)) return { ok: false, error: "That code is not valid. Try the current code from your app." };
  await db.update(t.users).set({ mfaEnabled: true }).where(eq(t.users.id, u.id));
  await db.update(t.sessions).set({ mfaPassed: true }).where(eq(t.sessions.id, u.sessionId));
  await audit(u, "enable_mfa", "user", u.id);
  return { ok: true, message: "Two-step verification is now on." };
}

export async function disableMfaAction(code: string): Promise<ActionResult> {
  const u = await sessionUser();
  if (!u) return { ok: false, error: "Please sign in again." };
  const db = await getDb();
  const [user] = await db.select().from(t.users).where(eq(t.users.id, u.id));
  if (!user?.mfaSecret || !verifyTotp(user.mfaSecret, code)) return { ok: false, error: "Enter a valid code to turn two-step verification off." };
  await db.update(t.users).set({ mfaEnabled: false, mfaSecret: null }).where(eq(t.users.id, u.id));
  await audit(u, "disable_mfa", "user", u.id);
  return { ok: true, message: "Two-step verification turned off." };
}
