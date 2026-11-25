import { desc, eq } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { toItem } from "@/lib/admin/media";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const metadata = { title: "Media library" };

export default async function MediaPage() {
  await requireUser("media.edit");
  const db = await getDb();
  const rows = await db.select().from(t.media).where(eq(t.media.isPrivate, false)).orderBy(desc(t.media.createdAt));
  return <MediaLibrary items={rows.map(toItem)} />;
}
