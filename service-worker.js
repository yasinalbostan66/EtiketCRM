// service-worker.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Pass-through handler
    event.respondWith(fetch(event.request));
});
