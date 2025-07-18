import { useEffect, useState } from 'react';

export function useCacheStatus() {
  const [status, setStatus] = useState({ loading: true, allCached: false, details: [] });

  useEffect(() => {
    let isMounted = true;
    async function checkCache() {
      try {
        const res = await fetch('/sw-cache-status');
        const data = await res.json();
        if (isMounted) setStatus({ loading: false, ...data });
      } catch {
        if (isMounted) setStatus({ loading: false, allCached: false, details: [] });
      }
    }
    checkCache();
    return () => { isMounted = false; };
  }, []);

  return status;
}
