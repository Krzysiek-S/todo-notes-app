import { createClient } from "@supabase/supabase-js";

export const CreateSupabaseClient = (supabaseAccessToken) => {
  if (!supabaseAccessToken) {
    throw new Error("No Supabase access token provided");
  }
  const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );
};
