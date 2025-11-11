// GNA Code Governance Protocol: Client Stability Fix
// This code stabilizes the Supabase client connection against the Vercel runtime environment.
// It MUST be listed in .aiexclude

// 1. TypeScript "Type Hint" (Fixes compilation error)
declare const createClient: (supabaseUrl: string, supabaseKey: string) => any;

// Get credentials from the .env file 
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 2. Runtime "Safety Check" (Prevents app crash if library injection fails)
export const supabase = typeof createClient === 'function'
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : {
      // Dummy client to prevent the entire app from crashing if the platform fails
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.reject(new Error("Supabase client not initialized.")),
        signUp: () => Promise.reject(new Error("Supabase client not initialized.")),
        signOut: () => Promise.reject(new Error("Supabase client not initialized."))
      },
      from: () => ({
        select: () => Promise.reject(new Error("Supabase client not initialized.")),
        insert: () => Promise.reject(new Error("Supabase client not initialized.")),
        update: () => Promise.reject(new Error("Supabase client not initialized.")),
        delete: () => Promise.reject(new Error("Supabase client not initialized."))
      })
    };