// Este hook registra el Service Worker al cargar la app
import { useEffect } from 'react';

export function useServiceWorker() {
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
}
