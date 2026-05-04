import { supabase, isSupabaseEnabled } from './supabase';

interface CacheEntry {
  url: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const SIGNED_URL_TTL_SECONDS = 3600;
const REFRESH_BUFFER_MS = 60 * 1000;

export async function getSignedUrl(bucket: string, storagePath: string): Promise<string | null> {
  if (!isSupabaseEnabled() || !supabase || !storagePath) return null;
  const cacheKey = `${bucket}/${storagePath}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expiresAt > now + REFRESH_BUFFER_MS) {
    return cached.url;
  }
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);
  if (error || !data?.signedUrl) {
    return null;
  }
  cache.set(cacheKey, {
    url: data.signedUrl,
    expiresAt: now + SIGNED_URL_TTL_SECONDS * 1000,
  });
  return data.signedUrl;
}

export function invalidateSignedUrl(bucket: string, storagePath: string): void {
  cache.delete(`${bucket}/${storagePath}`);
}
