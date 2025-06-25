
import { createClient } from '@supabase/supabase-js';

// Ensure you have a .env file at the root of your project with:
// VITE_SUPABASE_URL=your_supabase_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = 'https://jzzyrbaapysjydvjyars.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6enlyYmFhcHlzanlkdmp5YXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTg1MTUsImV4cCI6MjA2NTk5NDUxNX0.UEuZlYS3Cu-_pGdbSFhLv-mc8G_rHFuVrXoVFLeugcA';

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = "Supabase URL or Anon Key is not defined. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file and ensure Vite is configured to load them.";
  console.error(errorMessage);
  // In a real app, you might want to display this message to the user or prevent the app from loading.
  // Supabase client will throw an error if URL/key are invalid/missing when `createClient` is called.
  // This check provides an earlier, more specific warning.
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
