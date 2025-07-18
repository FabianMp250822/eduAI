'use client';

import { useEffect } from 'react';

// This component registers the Service Worker when the app loads.
// It is marked as a client component because it uses the useEffect hook
// and interacts with browser-specific APIs like `navigator`.

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch((err) => {
          // eslint-disable-next-line no-console
          console.error('SW registration failed:', err);
        });
      });
    }
  }, []);

  return null; // This component doesn't render anything.
}
