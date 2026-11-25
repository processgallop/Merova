import { asc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { ListView } from "@/components/admin/ListView";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";

export const metadata = { title: "Resources" };

export default async function ResourcesAdmin() {
  const user = await requireUser("content.view");
  const db = await getDb();
  const rows = await db.select().from(t.resources).orderBy(asc(t.resources.sortOrder));
  return (
    <ListView
      title="Resources & PDFs"
      intro="Catalogue, company profile, brochures and technical documents shown on the Resources page. Product flyers are managed on each product (Media & flyer tab)."
      newHref="/admin/resources/new"
      newLabel="Add resource"
      columns={["Type", "File"]}
      reorderEntity="resource"
      canEdit={can(user.role, "content.edit")}
      canPublish={can(user.role, "content.publish")}
      rows={rows.map((r) => ({ id: r.id, title: r.title, subtitle: r.description.slice(0, 80), href: `/admin/resources/${r.id}`, status: r.status, cols: [r.kind, <a key="f" href={r.fileUrl} target="_blank" rel="noreferrer" className="underline">{r.fileUrl.split("/").pop()}</a>], search: `${r.title} ${r.kind}` }))}
    />
  );
}
