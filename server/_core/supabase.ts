import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Client serveur avec la service role key (accès complet, côté serveur uniquement)
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
