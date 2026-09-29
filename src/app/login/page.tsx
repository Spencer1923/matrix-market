import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  // Server action: runs on the server when the form is submitted
  async function login(formData: FormData) {
    "use server";
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    // Wrong credentials: back to the form with an error flag
    if (error) redirect("/login?error=1");
    redirect("/admin");
  }

  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-2xl font-bold">Admin login</h1>
      {error && <p className="mt-2 text-red-600">Wrong email or password.</p>}
      <form action={login} className="mt-6 flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" required className="rounded border p-2" />
        <input name="password" type="password" placeholder="Password" required className="rounded border p-2" />
        <button className="rounded bg-black px-4 py-2 text-white">Log in</button>
      </form>
    </main>
  );
}