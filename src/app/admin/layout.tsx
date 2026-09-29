import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();

  // getClaims() verifies the login token's signature (safer than trusting the cookie)
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email;

  // Not logged in, or logged in as someone other than the admin: send to login
  if (!email || email !== process.env.ADMIN_EMAIL) redirect("/login");

  return <>{children}</>;
}