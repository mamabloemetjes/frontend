import { env } from "@/lib/env";
import { createClient } from "@supabase/supabase-js";
export const client = createClient(env.supabaseUrl, env.supabaseAnonKey);
