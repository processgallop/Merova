"use client";
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import { changePasswordAction } from "@/app/admin/(auth)/actions";
import { confirmMfaAction, disableMfaAction, startMfaAction } from "@/app/admin/(panel)/account/actions";
import { toast } from "./Toast";

export function AccountForms({ mfaEnabled, mustChange }: { mfaEnabled: boolean; mustChange: boolean }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(changePasswordAction, {});
  const [setup, setSetup] = useState<{ secret: string; qr: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, start] = useTransition();
  if (state.ok) router.refresh();
  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-[3px] border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold">Change password</h2>
        {mustChange ? <p className="mt-1 text-sm font-semibold text-red">You are using a temporary password. Choose a new one to continue.</p> : null}
        <form action={action} className="mt-4 grid gap-3">
          <label className="text-sm"><span className="field-label">Current password</span><input name="current" type="password" autoComplete="current-password" required className="field !min-h-10" /></label>
          <label className="text-sm"><span className="field-label">New password</span><input name="next" type="password" autoComplete="new-password" required minLength={10} className="field !min-h-10" /><span className="text-xs text-muted">At least 10 characters, with letters and numbers.</span></label>
          <label className="text-sm"><span className="field-label">Confirm new password</span><input name="confirm" type="password" autoComplete="new-password" required className="field !min-h-10" /></label>
          {state.error ? <p role="alert" className="text-sm font-semibold text-red">{state.error}</p> : null}
          {state.ok ? <p role="status" className="text-sm font-semibold text-emerald-700">Password changed. Other sessions have been signed out.</p> : null}
          <button type="submit" className="btn btn-sm w-fit" disabled={pending}><span>Update password</span></button>
        </form>
      </section>
      <section className="rounded-[3px] border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold">Two-step verification</h2>
        <p className="mt-1 text-sm">Protect your account with a code from an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password…).</p>
        {mfaEnabled ? (
          <div className="mt-4 flex flex-wrap items-end gap-2">
            <p className="w-full text-sm font-semibold text-emerald-700">Two-step verification is on.</p>
            <input aria-label="Current code" inputMode="numeric" maxLength={6} className="field !min-h-10 !w-40 text-center tracking-widest" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => start(async () => { const r = await disableMfaAction(code); toast(r.ok ? r.message ?? "Done." : r.error, r.ok ? "ok" : "error"); if (r.ok) router.refresh(); })}><span>Turn off</span></button>
          </div>
        ) : setup ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-[220px_1fr]">
            <img src={setup.qr} alt="QR code to add Merova Admin to your authenticator app" className="size-[220px] border border-line" />
            <div className="text-sm">
              <p>Scan the code, or enter this key manually:</p>
              <code className="mt-2 block break-all rounded bg-[#f5f1eb] p-2 text-xs">{setup.secret}</code>
              <label className="mt-4 block"><span className="field-label">Enter the 6-digit code to confirm</span><input inputMode="numeric" maxLength={6} className="field !min-h-10 !w-40 text-center tracking-widest" value={code} onChange={(e) => setCode(e.target.value)} /></label>
              <button type="button" className="btn btn-sm mt-3" disabled={busy || code.length !== 6} onClick={() => start(async () => { const r = await confirmMfaAction(code); toast(r.ok ? r.message ?? "Done." : r.error, r.ok ? "ok" : "error"); if (r.ok) { setSetup(null); setCode(""); router.refresh(); } })}><span>Confirm &amp; turn on</span></button>
            </div>
          </div>
        ) : (
          <button type="button" className="btn btn-sm mt-4" disabled={busy} onClick={() => start(async () => { const r = await startMfaAction(); if (r.ok && r.data) setSetup(r.data); else if (!r.ok) toast(r.error, "error"); })}><span>Set up two-step verification</span></button>
        )}
      </section>
    </div>
  );
}
