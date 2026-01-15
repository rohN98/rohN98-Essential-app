
const CACHE_NAME = 'essential-os-v15';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'index.tsx',
  'App.tsx',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/run',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Adding assets one by one to ensure failure doesn't block the whole cache
      return Promise.allSettled(ASSETS_TO_CACHE.map(url => cache.add(url)));
    })
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

// The fetch handler is critical for "Install app" prompt to appear in Chrome.
self.addEventListener('fetch', (event) => {
  // Pass-through strategy for now to avoid breaking the transpiler, 
  // but presence of handler triggers the prompt.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
