import { createClient } from "@supabase/supabase-js";

// One shared client, so any page can `import { supabase } from "@/lib/supabase"`
// The "!" tells TypeScript these env variables definitely exist
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);