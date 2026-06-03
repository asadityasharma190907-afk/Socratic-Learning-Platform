const CACHE_NAME = 'sahai-shiksha-cache-v1';
const ASSETS_TO_CACHE = [
  '/student',
  '/teacher',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap'
];

// Perform installation and cache initial shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercept network requests
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Bypass API routes and hot-reloads (dev server)
  if (requestUrl.pathname.startsWith('/api') || requestUrl.pathname.includes('webpack') || requestUrl.pathname.includes('hot-update')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version
        return cachedResponse;
      }

      // Fallback to fetching over the network
      return fetch(event.request).then((response) => {
        // If not a valid successful response, just return it
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cache the newly retrieved Next.js static asset for subsequent offline visits
        if (requestUrl.pathname.startsWith('/_next/static/')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      }).catch(() => {
        // Offline and resource not in cache
        if (event.request.mode === 'navigate') {
          return caches.match('/student');
        }
      });
    })
  );
});
