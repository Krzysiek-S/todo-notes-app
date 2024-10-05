import { createClient } from "@supabase/supabase-js";

export const CreateSupabaseClient = (supabaseAccessToken) => {
  if (!supabaseAccessToken) {
    throw new Error("No Supabase access token provided");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );
};
