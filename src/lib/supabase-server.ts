import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// A Supabase client that reads and writes the login session from cookies.
// Used in server code (pages, server actions) for anything about "who is logged in".
export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Pages can't set cookies; the proxy below handles refreshing instead
          }
        },
      },
    }
  );
}