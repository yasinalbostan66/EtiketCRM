// service-worker.js — v6.7 — Her güncellemede önbelleği temizler
const CACHE_VERSION = 'crm-v6.7';

// Kurulum: Eski service worker'ı hemen devral
self.addEventListener('install', (event) => {
    event.waitUntil(
        // Tüm eski önbellekleri sil
        caches.keys().then(keys => 
            Promise.all(keys.map(key => caches.delete(key)))
        ).then(() => self.skipWaiting())
    );
});

// Aktivasyon: Tüm sekmeleri hemen kontrol et
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.map(key => caches.delete(key)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: Her zaman ağdan al (önbellek YOK)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request, { cache: 'no-store' }).catch(() => {
            // Ağ yoksa tarayıcı varsayılanına bırak
            return fetch(event.request);
        })
    );
});
