import { eq } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { currentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";

/** Serves uploaded media from the database. Private files (enquiry attachments) require a signed-in staff session. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string; name: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });
  const db = await getDb();
  const [m] = await db.select().from(t.media).where(eq(t.media.id, id)).limit(1);
  if (!m) return new Response("Not found", { status: 404 });
  if (m.path && !m.data) return Response.redirect(new URL(m.path, _req.url), 302);
  if (!m.data) return new Response("Not found", { status: 404 });
  if (m.isPrivate) {
    const user = await currentUser();
    if (!user || !can(user.role, "enquiries.view")) return new Response("Not found", { status: 404 });
  }
  const safeMime = /^(image\/(png|jpeg|webp|avif|gif)|application\/pdf|video\/mp4|font\/woff2)$/.test(m.mime) ? m.mime : "application/octet-stream";
  return new Response(new Uint8Array(m.data), {
    headers: {
      "Content-Type": safeMime,
      "Content-Length": String(m.data.length),
      "Content-Disposition": `${safeMime === "application/octet-stream" || m.isPrivate ? "attachment" : "inline"}; filename="${m.filename.replace(/[^\w.\- ]/g, "_")}"`,
      "Cache-Control": m.isPrivate ? "private, no-store" : "public, max-age=300, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
