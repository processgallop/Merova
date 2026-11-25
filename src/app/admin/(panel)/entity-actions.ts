"use server";
import { bulkStatus, deleteEntity, duplicateProduct, reorder, revisions, saveEntity, type EntityType } from "@/lib/admin/entities";

export async function saveEntityAction(entity: EntityType, id: number | null, data: unknown, opts: { redirectOld?: boolean }) {
  return saveEntity(entity, id, data, opts);
}
export async function deleteEntityAction(entity: EntityType, id: number, reassignTo?: number) {
  return deleteEntity(entity, id, { reassignTo });
}
export async function duplicateProductAction(id: number) {
  return duplicateProduct(id);
}
export async function reorderAction(entity: "segment" | "industry" | "product" | "page" | "resource", ids: number[]) {
  return reorder(entity, ids.filter((n) => Number.isInteger(n)));
}
export async function bulkStatusAction(entity: "product" | "post" | "page" | "industry", ids: number[], status: "draft" | "pending_review" | "approved" | "published" | "archived") {
  return bulkStatus(entity, ids.filter((n) => Number.isInteger(n)), status);
}
export async function revisionsAction(entity: EntityType, id: number) {
  return revisions(entity, id);
}
