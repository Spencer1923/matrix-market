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
    <main className="mx-auto max-w-sm px-8 py-20">
      <h1 className="text-2xl font-bold text-navy">Admin login</h1>
      <p className="mt-1 text-sm text-muted">Sign in to manage products and orders.</p>
      {/* Error messages use red so they stand out from the brand colors */}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          Wrong email or password.
        </p>
      )}
      <form action={login} className="mt-6 flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border border-navy/20 px-4 py-2 focus:border-electric focus:outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="rounded-lg border border-navy/20 px-4 py-2 focus:border-electric focus:outline-none"
        />
        <button className="rounded-lg bg-electric px-4 py-2 font-semibold text-white transition hover:bg-navy">
          Log in
        </button>
      </form>
    </main>
  );
}