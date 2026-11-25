"use server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema as t } from "@/db";
import { authorize, AuthError } from "@/lib/auth/session";
import { audit, type ActionResult } from "@/lib/admin/audit";
import { ENQUIRY_STATUS_LABEL } from "@/lib/admin/enquiry-status";

const STATUSES = z.enum(["new", "contacted", "under_review", "quotation_in_progress", "quotation_sent", "negotiation", "converted", "closed_lost"]);

export async function updateEnquiryAction(id: string, patch: { status?: string; assignedTo?: string | null; note?: string }): Promise<ActionResult> {
  try {
    const user = await authorize("enquiries.edit");
    const db = await getDb();
    const [e] = await db.select().from(t.enquiries).where(eq(t.enquiries.id, id));
    if (!e) return { ok: false, error: "Enquiry not found." };
    if (patch.status !== undefined) {
      const s = STATUSES.parse(patch.status);
      if (s !== e.status) {
        await db.update(t.enquiries).set({ status: s, updatedAt: new Date() }).where(eq(t.enquiries.id, id));
        await db.insert(t.enquiryNotes).values({ enquiryId: id, userId: user.id, userName: user.name, kind: "status", body: `Status: ${ENQUIRY_STATUS_LABEL[e.status]} → ${ENQUIRY_STATUS_LABEL[s]}` });
      }
    }
    if (patch.assignedTo !== undefined) {
      const assignee = patch.assignedTo ? (await db.select().from(t.users).where(eq(t.users.id, patch.assignedTo)))[0] : null;
      if (patch.assignedTo && !assignee) return { ok: false, error: "User not found." };
      await db.update(t.enquiries).set({ assignedTo: assignee?.id ?? null, updatedAt: new Date() }).where(eq(t.enquiries.id, id));
      await db.insert(t.enquiryNotes).values({ enquiryId: id, userId: user.id, userName: user.name, kind: "assign", body: assignee ? `Assigned to ${assignee.name}` : "Unassigned" });
    }
    if (patch.note) {
      const body = z.string().trim().min(1).max(5000).parse(patch.note);
      await db.insert(t.enquiryNotes).values({ enquiryId: id, userId: user.id, userName: user.name, kind: "note", body });
    }
    await audit(user, "update", "enquiry", id, e.reference);
    return { ok: true, message: "Enquiry updated." };
  } catch (err) {
    return { ok: false, error: err instanceof AuthError ? err.message : err instanceof z.ZodError ? "Invalid value." : "Update failed." };
  }
}

export async function markReadAction(id: string) {
  try {
    await authorize("enquiries.view");
    const db = await getDb();
    await db.update(t.enquiries).set({ isRead: true }).where(eq(t.enquiries.id, id));
  } catch {
    /* non-critical */
  }
}

export async function deleteEnquiryAction(id: string): Promise<ActionResult> {
  try {
    const user = await authorize("enquiries.delete");
    const db = await getDb();
    const [e] = await db.select().from(t.enquiries).where(eq(t.enquiries.id, id));
    if (!e) return { ok: false, error: "Not found." };
    for (const f of e.files) await db.delete(t.media).where(eq(t.media.id, f.mediaId));
    await db.delete(t.enquiries).where(eq(t.enquiries.id, id));
    await audit(user, "delete", "enquiry", id, e.reference);
    return { ok: true, message: "Enquiry and attachments deleted." };
  } catch (err) {
    return { ok: false, error: err instanceof AuthError ? err.message : "Delete failed." };
  }
}
