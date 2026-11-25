import { requireUser } from "@/lib/auth/session";
import { ROLE_LABEL } from "@/lib/auth/rbac";
import { AccountForms } from "@/components/admin/AccountForms";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold">My account</h1>
      <p className="mt-1 text-sm">{user.name} · {user.email} · {ROLE_LABEL[user.role]}</p>
      <AccountForms mfaEnabled={user.mfaEnabled} mustChange={user.mustChangePassword} />
    </div>
  );
}
