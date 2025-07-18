
import { createClient } from '@supabase/supabase-js';

// Ensure that the environment variables are defined before creating the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = "Supabase URL or Anon Key is not defined. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file and ensure Vite is configured to load them.";
  console.error(errorMessage);
  // In a real app, you might want to display this message to the user or prevent the app from loading.
  // Supabase client will throw an error if URL/key are invalid/missing when `createClient` is called.
  // This check provides an earlier, more specific warning.
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
