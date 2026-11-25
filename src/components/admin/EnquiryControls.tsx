"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteEnquiryAction, updateEnquiryAction } from "@/app/admin/(panel)/enquiries/actions";
import { ENQUIRY_STATUS_LABEL } from "@/lib/admin/enquiry-status";
import { toast } from "./Toast";

export function EnquiryControls({ id, status, assignedTo, users, notes, canEdit, canDelete }: { id: string; status: string; assignedTo: string | null; users: { id: string; name: string }[]; notes: { id: number; kind: string; body: string; userName: string | null; createdAt: string }[]; canEdit: boolean; canDelete: boolean }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const run = (patch: Parameters<typeof updateEnquiryAction>[1], after?: () => void) =>
    start(async () => {
      const r = await updateEnquiryAction(id, patch);
      toast(r.ok ? r.message ?? "Saved." : r.error, r.ok ? "ok" : "error");
      if (r.ok) { after?.(); router.refresh(); }
    });
  return (
    <aside className="space-y-4">
      <div className="rounded-[3px] border border-line bg-white p-4">
        <label className="block text-sm"><span className="field-label">Lead status</span>
          <select className="field !min-h-10" defaultValue={status} disabled={!canEdit || pending} onChange={(e) => run({ status: e.target.value })}>
            {Object.entries(ENQUIRY_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="mt-3 block text-sm"><span className="field-label">Assigned to</span>
          <select className="field !min-h-10" defaultValue={assignedTo ?? ""} disabled={!canEdit || pending} onChange={(e) => run({ assignedTo: e.target.value || null })}>
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </label>
      </div>
      <div className="rounded-[3px] border border-line bg-white p-4">
        <p className="font-semibold text-heading">Notes &amp; history</p>
        {canEdit ? (
          <div className="mt-3">
            <textarea className="field text-sm" rows={3} placeholder="Add an internal note…" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Internal note" />
            <button type="button" className="btn btn-sm mt-2" disabled={!note.trim() || pending} onClick={() => run({ note }, () => setNote(""))}><span>Add note</span></button>
          </div>
        ) : null}
        <ol className="mt-4 space-y-3 border-l border-line pl-4">
          {notes.slice().reverse().map((n) => (
            <li key={n.id} className="text-sm">
              <p className={n.kind === "note" ? "whitespace-pre-wrap text-heading" : "text-muted"}>{n.body}</p>
              <p className="text-xs text-muted">{n.userName ?? "System"} · {new Date(n.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
            </li>
          ))}
          <li className="text-xs text-muted">Enquiry received</li>
        </ol>
      </div>
      {canDelete ? (
        <button type="button" className="btn btn-outline btn-sm w-full !text-red" disabled={pending} onClick={() => window.confirm("Delete this enquiry and its attachments permanently? Check your data-retention policy first.") && start(async () => { const r = await deleteEnquiryAction(id); toast(r.ok ? r.message ?? "Deleted." : r.error, r.ok ? "ok" : "error"); if (r.ok) router.replace("/admin/enquiries"); })}><span>Delete enquiry</span></button>
      ) : null}
    </aside>
  );
}
