import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/session";
import { AuthCard, LoginForm } from "../forms";

export const metadata = { title: "Sign in — Merova Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentUser()) redirect("/admin");
  return (
    <AuthCard title="Sign in" intro="Merova website administration. Authorised staff only.">
      <LoginForm />
    </AuthCard>
  );
}
