import { createClient } from "@supabase/supabase-js";

// Make sure to use the correct variables, next.js server components can read process.env
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);
