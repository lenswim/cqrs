import { createClient } from "@supabase/supabase-js";

export const URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
export const FUNCTION_SECRET = import.meta.env.VITE_FUNCTION_SECRET as string;

export const supabase = createClient(URL, ANON);