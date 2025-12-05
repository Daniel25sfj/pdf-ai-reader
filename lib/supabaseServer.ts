import { createClient } from "@supabase/supabase-js";

// Lazily create the client so that a missing env var
// does NOT crash the build at import time.
// We keep the type as `any` to avoid tight coupling to the DB schema
// in the frontend build.
let cachedClient: any = null;

export function getSupabaseServer(): any {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing SUPABASE configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  return cachedClient;
}
