//bridge between frontend and supabase.

// -----------------importing hte supabase tools--------------------
import { createClient } from "@supabase/supabase-js";


// -------------------getting env variables-------------------
//get supabase project url from the .env file 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//rreads keys
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//----------------creates supabase coonection and make available across the app--------
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
