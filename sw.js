
const CACHE_NAME = 'essential-os-v13';
const OFFLINE_URL = 'index.html';

const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/run',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Strategy: Network First for Logic/TSX, Cache First for Static Assets
  if (event.request.url.includes('.tsx') || event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          if (response.ok && event.request.method === 'GET') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }
});
