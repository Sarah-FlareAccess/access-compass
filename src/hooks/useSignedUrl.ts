import { useEffect, useState } from 'react';
import { getSignedUrl } from '../utils/signedUrlCache';

export function useSignedUrl(bucket: string, storagePath?: string | null): { url: string | null; loading: boolean } {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!storagePath) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getSignedUrl(bucket, storagePath).then(result => {
      if (!cancelled) {
        setUrl(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [bucket, storagePath]);

  return { url, loading };
}
