import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

// Helper to check if Supabase is enabled
export const isSupabaseEnabled = () => supabase !== null;

// Get the current user's JWT token for authenticated REST calls
async function getAuthToken(): Promise<string> {
  if (supabase) {
    try {
      // Race against a timeout to prevent hanging
      const result = await Promise.race([
        supabase.auth.getSession(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
      ]);
      if (result && 'data' in result && result.data.session?.access_token) {
        return result.data.session.access_token;
      }
    } catch {
      // Fall through to anon key
    }
  }
  return supabaseAnonKey || '';
}

// Direct REST API helper (bypasses Supabase JS client issues)
export const supabaseRest = {
  async query(table: string, select = '*', filters?: Record<string, string>) {
    if (!supabaseUrl || !supabaseAnonKey) return { data: null, error: 'Not configured' };

    const token = await getAuthToken();

    let url = `${supabaseUrl}/rest/v1/${table}?select=${select}`;
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        url += `&${key}=eq.${value}`;
      });
    }

    const response = await fetch(url, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { data: null, error: await response.text() };
    }
    return { data: await response.json(), error: null };
  },

  async insert(table: string, data: Record<string, unknown>) {
    if (!supabaseUrl || !supabaseAnonKey) return { data: null, error: 'Not configured' };

    const token = await getAuthToken();

    const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${token}`,
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

    const token = await getAuthToken();

    let url = `${supabaseUrl}/rest/v1/${table}?`;
    Object.entries(filters).forEach(([key, value], index) => {
      url += `${index > 0 ? '&' : ''}${key}=eq.${value}`;
    });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${token}`,
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

    const token = await getAuthToken();

    let url = `${supabaseUrl}/rest/v1/${table}?`;
    Object.entries(filters).forEach(([key, value], index) => {
      url += `${index > 0 ? '&' : ''}${key}=eq.${value}`;
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { data: null, error: await response.text() };
    }
    return { data: null, error: null };
  },
};

// Warm-up query using direct REST (more reliable)
export const warmUpConnection = async () => {
  try {
    const { error } = await supabaseRest.query('organisations', 'id');
    if (error) {
      // Warm-up is non-critical; silently ignore
    }
  } catch {
    // Warm-up is non-critical; silently ignore
  }
};

// Auto warm-up on module load
warmUpConnection();
