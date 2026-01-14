import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('[Supabase] URL configured:', !!supabaseUrl);
console.log('[Supabase] Key configured:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Using localStorage-only mode. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to enable database sync.'
  );
}

// Create Supabase client (will be null if credentials not provided)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

console.log('[Supabase] Client created:', !!supabase);

// Helper to check if Supabase is enabled
export const isSupabaseEnabled = () => supabase !== null;

// Warm-up query to wake up the connection (reduces latency for subsequent requests)
// Call this early in the app lifecycle
export const warmUpConnection = async () => {
  if (!supabase) return;

  console.log('[Supabase] Warming up connection...');
  const startTime = Date.now();

  try {
    // Simple lightweight query to wake up the database
    await supabase.from('organisations').select('id').limit(1);
    const duration = Date.now() - startTime;
    console.log(`[Supabase] Connection warm-up complete (${duration}ms)`);
  } catch (error) {
    console.warn('[Supabase] Warm-up query failed:', error);
  }
};

// Auto warm-up on module load (runs once when app starts)
if (supabase) {
  warmUpConnection();
}
