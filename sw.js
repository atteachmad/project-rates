/* Service worker Project Rates — cache cangkang aplikasi agar cepat & bisa di-install (PWA).
   Panggilan API (script.google.com) TIDAK pernah di-cache. */
const VERSION = 'pr-v4';
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

/* ===== PUSH (Firebase Cloud Messaging): tampilkan notifikasi walau aplikasi / browser tertutup ===== */
self.addEventListener('push', (e) => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (_) { try { p = { body: e.data.text() }; } catch (__) {} }
  const d = p.data || p.notification || p;
  const urgent = d.urgent === '1' || d.urgent === true;
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    cs.forEach((c) => c.postMessage({ type: 'push', data: d }));                   // aplikasi terbuka: segera cek task & bunyikan dering di dalam aplikasi
    if (cs.some((c) => c.visibilityState === 'visible')) return;                     // sedang dilihat pengguna: cukup banner di dalam aplikasi
    await self.registration.showNotification(d.title || 'Project Rates', {
      body: d.body || '', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
      tag: d.tag || 'pr', renotify: true, requireInteraction: urgent,
      vibrate: urgent ? [400, 150, 400, 150, 400, 150, 400] : [200, 100, 200],
      data: { url: d.url || './' }
    });
  })());
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    if (cs[0]) { cs[0].postMessage({ type: 'nav', url }); return cs[0].focus(); }
    return self.clients.openWindow(url);
  }));
});
