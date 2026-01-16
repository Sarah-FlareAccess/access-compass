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
        flowType: 'implicit',
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Client-Info': 'access-compass',
        },
      },
    })
  : null;

console.log('[Supabase] Client created:', !!supabase);

// Expose to window for debugging (remove in production)
if (supabase) {
  (window as unknown as { supabase: typeof supabase }).supabase = supabase;
}

// Helper to check if Supabase is enabled
export const isSupabaseEnabled = () => supabase !== null;

// Direct REST API helper (bypasses Supabase JS client issues)
export const supabaseRest = {
  async query(table: string, select = '*', filters?: Record<string, string>) {
    if (!supabaseUrl || !supabaseAnonKey) return { data: null, error: 'Not configured' };

    let url = `${supabaseUrl}/rest/v1/${table}?select=${select}`;
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        url += `&${key}=eq.${value}`;
      });
    }

    const response = await fetch(url, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!response.ok) {
      return { data: null, error: await response.text() };
    }
    return { data: await response.json(), error: null };
  },

  async insert(table: string, data: Record<string, unknown>) {
    if (!supabaseUrl || !supabaseAnonKey) return { data: null, error: 'Not configured' };

    const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { data: null, error: await response.text() };
    }
    return { data: await response.json(), error: null };
  },

  async update(table: string, data: Record<string, unknown>, filters: Record<string, string>) {
    if (!supabaseUrl || !supabaseAnonKey) return { data: null, error: 'Not configured' };

    let url = `${supabaseUrl}/rest/v1/${table}?`;
    Object.entries(filters).forEach(([key, value], index) => {
      url += `${index > 0 ? '&' : ''}${key}=eq.${value}`;
    });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { data: null, error: await response.text() };
    }
    return { data: await response.json(), error: null };
  },

  async delete(table: string, filters: Record<string, string>) {
    if (!supabaseUrl || !supabaseAnonKey) return { data: null, error: 'Not configured' };

    let url = `${supabaseUrl}/rest/v1/${table}?`;
    Object.entries(filters).forEach(([key, value], index) => {
      url += `${index > 0 ? '&' : ''}${key}=eq.${value}`;
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!response.ok) {
      return { data: null, error: await response.text() };
    }
    return { data: null, error: null };
  },
};

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as unknown as { supabaseRest: typeof supabaseRest }).supabaseRest = supabaseRest;
}

// Warm-up query using direct REST (more reliable)
export const warmUpConnection = async () => {
  console.log('[Supabase] Warming up connection...');
  const startTime = Date.now();

  try {
    const { data, error } = await supabaseRest.query('organisations', 'id');
    const duration = Date.now() - startTime;
    if (error) {
      console.warn('[Supabase] Warm-up failed:', error);
    } else {
      console.log(`[Supabase] Connection warm-up complete (${duration}ms)`, data);
    }
  } catch (error) {
    console.warn('[Supabase] Warm-up query failed:', error);
  }
};

// Auto warm-up on module load
warmUpConnection();
