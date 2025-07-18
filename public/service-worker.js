self.addEventListener('fetch', (event) => {
  // Endpoint especial para validar el estado del cache
  if (event.request.url.endsWith('/sw-cache-status')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const assets = ASSETS_TO_CACHE;
        const results = await Promise.all(
          assets.map(async (asset) => {
            const res = await cache.match(asset);
            return { asset, cached: !!res };
          })
        );
        const allCached = results.every(r => r.cached);
        return new Response(JSON.stringify({
          allCached,
          details: results
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }
  // ...existing code...
// Este es un Service Worker para Next.js que cachea assets y rutas para soporte offline.
const CACHE_NAME = 'eduai-cache-v1';
const OFFLINE_URL = '/_offline';

const ASSETS_TO_CACHE = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/_offline',
  // Agrega aquí más rutas o assets estáticos si es necesario
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Cacheo dinámico de rutas HTML y recursos
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((response) => {
            // Cachea nuevas peticiones GET (HTML, JS, CSS, imágenes, etc.)
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            // Si falla la red, muestra la página offline para documentos HTML
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
          });
      })
    );
    return;
  }

  // Sincronización de datos POST offline (ejemplo genérico)
  if (event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request.clone())
        .catch(() => {
          // Si está offline, guarda la petición en IndexedDB y registra sync
          savePostRequest(event.request.clone());
          self.registration.sync && self.registration.sync.register('sync-post-requests');
          // Devuelve una respuesta genérica offline
          return new Response(JSON.stringify({
            success: false,
            offline: true,
            message: 'Guardado localmente. Se enviará cuando vuelvas a estar online.'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
  }
});

// IndexedDB helpers para guardar peticiones POST offline
function savePostRequest(request) {
  const dbPromise = openDB();
  request.clone().json().then((body) => {
    dbPromise.then((db) => {
      const tx = db.transaction('postRequests', 'readwrite');
      tx.objectStore('postRequests').add({
        url: request.url,
        body,
        headers: [...request.headers],
        method: request.method,
        timestamp: Date.now(),
      });
      tx.oncomplete = () => db.close();
    });
  });
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('eduai-db', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('postRequests')) {
        db.createObjectStore('postRequests', { autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-post-requests') {
    event.waitUntil(
      sendPostRequests()
    );
  }
});

async function sendPostRequests() {
  const db = await openDB();
  const tx = db.transaction('postRequests', 'readwrite');
  const store = tx.objectStore('postRequests');
  const allRequests = store.getAll ? await new Promise((res) => {
    const req = store.getAll();
    req.onsuccess = () => res(req.result);
  }) : [];
  for (const req of allRequests) {
    try {
      await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(req.body),
      });
    } catch (e) {
      // Si falla, lo dejamos para el siguiente sync
      continue;
    }
  }
  // Limpia las peticiones después de enviarlas
  store.clear && store.clear();
  tx.oncomplete = () => db.close();
}
