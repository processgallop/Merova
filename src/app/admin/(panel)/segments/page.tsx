import { asc } from "drizzle-orm";
import { getDb, schema as t } from "@/db";
import { ListView } from "@/components/admin/ListView";
import { SegmentReassign } from "@/components/admin/SegmentReassign";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";

export const metadata = { title: "Segments" };

export default async function SegmentsAdmin() {
  const user = await requireUser("catalog.view");
  const db = await getDb();
  const [segments, products] = await Promise.all([db.select().from(t.segments).orderBy(asc(t.segments.sortOrder)), db.select({ segmentId: t.products.segmentId }).from(t.products)]);
  const n = (id: number) => products.filter((p) => p.segmentId === id).length;
  return (
    <div className="space-y-10">
      <ListView
        title="Product segments"
        intro="The five principal product segments. Renaming a segment or changing its URL can create a redirect automatically."
        newHref="/admin/segments/new"
        newLabel="Add segment"
        columns={["Code", "Families", "Products"]}
        reorderEntity="segment"
        canEdit={can(user.role, "catalog.edit")}
        canPublish={can(user.role, "catalog.publish")}
        rows={segments.map((s) => ({ id: s.id, title: s.name, subtitle: `/products/${s.slug}`, href: `/admin/segments/${s.id}`, status: s.status, thumb: s.image?.url ?? null, cols: [s.code, s.families.length, n(s.id)], search: `${s.name} ${s.slug}` }))}
      />
      {can(user.role, "catalog.publish") ? <SegmentReassign segments={segments.map((s) => ({ id: s.id, name: s.name, count: n(s.id) }))} /> : null}
    </div>
  );
}
