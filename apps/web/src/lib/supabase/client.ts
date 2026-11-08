import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
let client: SupabaseClient<Database> | undefined;

// Browser storage is the web adapter. A future mobile client can supply its own storage.
export function getSupabase() {
  if (typeof window === "undefined")
    throw new Error(
      "The browser client is not available during server rendering.",
    );
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key)
      throw new Error("Supabase is not configured for this environment.");
    client = createClient<Database>(url, key, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}

const exchanges = new Map<
  string,
  ReturnType<ReturnType<typeof getSupabase>["auth"]["exchangeCodeForSession"]>
>();
export function exchangeAuthCode(code: string) {
  // React Strict Mode may mount the callback twice. A one-time code must only be exchanged once.
  if (!exchanges.has(code))
    exchanges.set(code, getSupabase().auth.exchangeCodeForSession(code));
  return exchanges.get(code)!;
}
