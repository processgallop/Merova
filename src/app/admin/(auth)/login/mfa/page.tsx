import { redirect } from "next/navigation";
import { sessionUser } from "@/lib/auth/session";
import { AuthCard, MfaForm } from "../../forms";

export const metadata = { title: "Verify — Merova Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function MfaPage() {
  const u = await sessionUser();
  if (!u) redirect("/admin/login");
  if (!u.mfaEnabled || u.mfaPassed) redirect("/admin");
  return (
    <AuthCard title="Two-step verification" intro="Enter the 6-digit code from your authenticator app.">
      <MfaForm />
    </AuthCard>
  );
}
