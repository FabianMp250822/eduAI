import { useEffect } from 'react';

/**
 * Pre-carga rutas dinámicas relevantes para el usuario y las almacena en el cache del Service Worker.
 * @param {string[]} routes - Lista de rutas absolutas a precargar (ej: ['/dashboard/1/matematicas', ...])
 */
export function usePrecacheDynamicRoutes(routes: string[]) {
  useEffect(() => {
    if ('serviceWorker' in navigator && Array.isArray(routes) && routes.length > 0) {
      navigator.serviceWorker.ready.then(() => {
        routes.forEach((route) => {
          fetch(route, { credentials: 'include' })
            .catch(() => {/* ignorar errores si offline */});
        });
      });
    }
  }, [routes]);
}
