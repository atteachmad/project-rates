/* Service worker Project Rates — cache cangkang aplikasi agar cepat & bisa di-install (PWA).
   Panggilan API (script.google.com) TIDAK pernah di-cache. */
const VERSION = 'pr-v3';
const SHELL = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.hostname.endsWith('google.com') || url.hostname.endsWith('googleusercontent.com')) return; // API
  if (url.origin !== location.origin) {
    // CDN (Tailwind, font): coba jaringan, cadangan cache
    e.respondWith(fetch(req).then((r) => {
      const copy = r.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return r;
    }).catch(() => caches.match(req)));
    return;
  }
  // File sendiri: jaringan dulu (selalu versi terbaru), cache bila offline
  e.respondWith(fetch(req).then((r) => {
    const copy = r.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return r;
  }).catch(() => caches.match(req).then((m) => m || caches.match('./index.html'))));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((cs) => (cs[0] ? cs[0].focus() : self.clients.openWindow('./'))));
});
