"use client";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Emblem, Logo } from "@/components/brand/Logo";
import { loginAction, mfaAction, type LoginState } from "./actions";

export function AuthCard({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-cloud px-4 py-16">
      <Emblem mode="line" strokeWidth={1.4} className="pointer-events-none absolute -left-[10%] top-[10%] w-[80%] opacity-25" />
      <div className="relative w-full max-w-md border border-line bg-surface p-8 shadow-[0_40px_80px_-40px_rgb(31_27_27/0.35)] sm:p-10">
        <Logo height={28} />
        <h1 className="mt-10 font-display text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm">{intro}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state.error ? <p role="alert" className="text-sm font-semibold text-red">{state.error}</p> : null}
      <button type="submit" className="btn w-full" disabled={pending}>{pending ? <Loader2 className="size-4 animate-spin" /> : null}<span>Sign in</span></button>
      <p className="text-xs text-muted">Forgotten your password? Ask a Super Administrator to reset it from Users.</p>
    </form>
  );
}

export function MfaForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(mfaAction, {});
  return (
    <form action={action} className="space-y-4">
      <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required autoFocus className="field text-center font-display text-2xl tracking-[0.5em]" aria-label="Verification code" />
      {state.error ? <p role="alert" className="text-sm font-semibold text-red">{state.error}</p> : null}
      <button type="submit" className="btn w-full" disabled={pending}><span>Verify</span></button>
    </form>
  );
}
