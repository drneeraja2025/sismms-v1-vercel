// File: src/utility/SupabaseClient.ts

import { createClient } from "@supabase/supabase-js" 

// GNA-Compliant: Read environment variables prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // CRITICAL GNA Error Check: This prevents a silent, non-responsive app crash.
  throw new Error("Missing Supabase environment variables! Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel.")
}

// GNA-FIX-001 (FINAL): Create and export the single, stable Supabase client instance
// Added the final global fetch option to resolve Vercel/Browser network conflicts.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // GNA Compliant: Ensures user stays logged in
  },
  global: {
    // CRITICAL FIX: Forces the client to use the browser's native fetch, resolving 'Failed to fetch'
    fetch: fetch.bind(window),
  },
})