"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Copy, Plus, ShieldCheck } from "lucide-react";
import { createUserAction, resetMfaAction, resetPasswordAction, updateUserAction } from "@/app/admin/(panel)/users/actions";
import { toast } from "./Toast";

type U = { id: string; name: string; email: string; role: string; active: boolean; mfaEnabled: boolean; lastLoginAt: string | null; locked: boolean };

export function UsersManager({ me, users, roles }: { me: string; users: U[]; roles: { value: string; label: string; perms: string[] }[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({ name: "", email: "", role: "read_only" });
  const [secret, setSecret] = useState<{ email: string; password: string } | null>(null);
  const run = <T,>(fn: () => Promise<{ ok: boolean; error?: string; message?: string; data?: T }>, after?: (d?: T) => void) => start(async () => { const r = await fn(); toast(r.ok ? r.message ?? "Done." : r.error ?? "Failed.", r.ok ? "ok" : "error"); if (r.ok) { after?.(r.data); router.refresh(); } });
  return (
    <div className="space-y-8">
      <div><h1 className="font-display text-3xl font-bold">Users &amp; roles</h1><p className="mt-1 text-sm">Every privileged action is checked on the server against the user&apos;s role. New users receive a temporary password and must change it on first sign-in.</p></div>
      {secret ? (
        <div role="alert" className="rounded-[3px] border-2 border-red bg-white p-4 text-sm">
          <p className="font-semibold text-heading">Temporary password for {secret.email}</p>
          <p className="mt-2 flex items-center gap-2"><code className="rounded bg-[#f5f1eb] px-2 py-1 text-base">{secret.password}</code><button type="button" className="btn btn-outline btn-sm" onClick={() => { navigator.clipboard?.writeText(secret.password); toast("Copied."); }}><Copy className="size-4" /><span>Copy</span></button></p>
          <p className="mt-2 text-muted">Share it securely. It is shown only once and must be changed at first sign-in.</p>
          <button type="button" className="mt-2 text-xs underline" onClick={() => setSecret(null)}>Dismiss</button>
        </div>
      ) : null}
      <section className="rounded-[3px] border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold">Add a user</h2>
        <form className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_220px_auto]" onSubmit={(e) => { e.preventDefault(); run(() => createUserAction(form), (d) => { if (d) setSecret({ email: form.email, password: (d as { password: string }).password }); setForm({ name: "", email: "", role: "read_only" }); }); }}>
          <input aria-label="Name" required className="field !min-h-10 text-sm" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input aria-label="Email" required type="email" className="field !min-h-10 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <select aria-label="Role" className="field !min-h-10 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>
          <button type="submit" className="btn btn-sm" disabled={pending}><Plus className="size-4" /><span>Create user</span></button>
        </form>
      </section>
      <div className="overflow-x-auto rounded-[3px] border border-line bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-line bg-[#faf7f3] text-left text-xs uppercase text-muted"><tr><th className="px-3 py-3">User</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Security</th><th className="px-3 py-3">Last sign-in</th><th className="px-3 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className={u.active ? "" : "opacity-60"}>
                <td className="px-3 py-2.5"><span className="block font-semibold text-heading">{u.name}{u.id === me ? " (you)" : ""}</span><span className="text-xs text-muted">{u.email}</span></td>
                <td className="px-3 py-2.5"><select aria-label={`Role for ${u.name}`} className="field !min-h-9 text-sm" defaultValue={u.role} disabled={pending} onChange={(e) => run(() => updateUserAction(u.id, { role: e.target.value }))}>{roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select></td>
                <td className="px-3 py-2.5 text-xs">{u.mfaEnabled ? <span className="flex items-center gap-1 text-emerald-700"><ShieldCheck className="size-3.5" />2-step on</span> : "Password only"}{u.locked ? <span className="block text-red">Locked</span> : null}{!u.active ? <span className="block">Deactivated</span> : null}</td>
                <td className="px-3 py-2.5 text-xs">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("en-GB") : "Never"}</td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" className="btn btn-outline btn-sm !min-h-8" onClick={() => window.confirm(`Generate a new temporary password for ${u.email}?`) && run(() => resetPasswordAction(u.id), (d) => d && setSecret({ email: u.email, password: (d as { password: string }).password }))}><span>Reset password</span></button>
                    {u.mfaEnabled ? <button type="button" className="btn btn-outline btn-sm !min-h-8" onClick={() => run(() => resetMfaAction(u.id))}><span>Reset 2-step</span></button> : null}
                    {u.id !== me ? <button type="button" className="btn btn-outline btn-sm !min-h-8" onClick={() => run(() => updateUserAction(u.id, { active: !u.active }))}><span>{u.active ? "Deactivate" : "Reactivate"}</span></button> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="rounded-[3px] border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold">Role permissions</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{roles.map((r) => <div key={r.value} className="rounded-[3px] bg-[#faf7f3] p-3 text-xs"><p className="text-sm font-semibold text-heading">{r.label}</p><p className="mt-1 text-muted">{r.perms.join(" · ")}</p></div>)}</div>
      </section>
    </div>
  );
}
