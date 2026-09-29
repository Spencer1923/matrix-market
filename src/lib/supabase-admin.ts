import { createClient } from "@supabase/supabase-js";

// Full-access client for server code only (API routes, webhooks).
// Never import this into a file that starts with "use client".
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);