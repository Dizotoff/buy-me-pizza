import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseService = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseService) {
  throw Error("Env variables not set for Supabase key or url");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseService);
