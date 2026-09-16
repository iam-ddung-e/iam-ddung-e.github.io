'use strict';
const CACHE = 'app-cache-be32c82f8b07';
const PRECACHE = ["./", "index.html", "assets/AssetManifest.bin", "assets/AssetManifest.bin.json", "assets/FontManifest.json", "assets/NOTICES", "assets/assets/app_icon.png", "assets/assets/data/schedule.enc", "assets/assets/deck_plans/deck_04.jpg", "assets/assets/deck_plans/deck_04.webp", "assets/assets/deck_plans/deck_05.jpg", "assets/assets/deck_plans/deck_05.webp", "assets/assets/deck_plans/deck_06.jpg", "assets/assets/deck_plans/deck_06.webp", "assets/assets/deck_plans/deck_07.jpg", "assets/assets/deck_plans/deck_07.webp", "assets/assets/deck_plans/deck_08.jpg", "assets/assets/deck_plans/deck_08.webp", "assets/assets/deck_plans/deck_09.jpg", "assets/assets/deck_plans/deck_09.png", "assets/assets/deck_plans/deck_09.webp", "assets/assets/deck_plans/deck_10.jpg", "assets/assets/deck_plans/deck_10.png", "assets/assets/deck_plans/deck_10.webp", "assets/assets/deck_plans/deck_11.jpg", "assets/assets/deck_plans/deck_11.png", "assets/assets/deck_plans/deck_11.webp", "assets/assets/deck_plans/deck_12.jpg", "assets/assets/deck_plans/deck_12.png", "assets/assets/deck_plans/deck_12.webp", "assets/assets/deck_plans/deck_13.jpg", "assets/assets/deck_plans/deck_13.png", "assets/assets/deck_plans/deck_13.webp", "assets/assets/deck_plans/deck_15.jpg", "assets/assets/deck_plans/deck_15.png", "assets/assets/deck_plans/deck_15.webp", "assets/assets/deck_plans/deck_16.jpg", "assets/assets/deck_plans/deck_16.png", "assets/assets/deck_plans/deck_16.webp", "assets/assets/deck_plans/deck_17.jpg", "assets/assets/deck_plans/deck_17.png", "assets/assets/deck_plans/deck_17.webp", "assets/assets/deck_plans/deck_18.jpg", "assets/assets/deck_plans/deck_18.png", "assets/assets/deck_plans/deck_18.webp", "assets/assets/deck_plans/deck_19.jpg", "assets/assets/deck_plans/deck_19.webp", "assets/assets/deck_plans/deck_20.jpg", "assets/assets/deck_plans/deck_20.webp", "assets/assets/icons/room_thema/icon_aladdin.svg", "assets/assets/icons/room_thema/icon_encanto.svg", "assets/assets/icons/room_thema/icon_finding_nemo.svg", "assets/assets/icons/room_thema/icon_frozen.svg", "assets/assets/icons/room_thema/icon_ironman.svg", "assets/assets/icons/room_thema/icon_lion_king.svg", "assets/assets/icons/room_thema/icon_little_mermaid.svg", "assets/assets/icons/room_thema/icon_marvel.svg", "assets/assets/icons/room_thema/icon_moana.svg", "assets/assets/icons/room_thema/icon_spiderman.svg", "assets/assets/icons/room_thema/icon_thor.svg", "assets/assets/icons/room_thema/icon_up.svg", "assets/fonts/MaterialIcons-Regular.otf", "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf", "assets/shaders/ink_sparkle.frag", "assets/shaders/stretch_effect.frag", "canvaskit/canvaskit.js", "canvaskit/canvaskit.js.symbols", "canvaskit/canvaskit.wasm", "canvaskit/chromium/canvaskit.js", "canvaskit/chromium/canvaskit.js.symbols", "canvaskit/chromium/canvaskit.wasm", "canvaskit/skwasm.js", "canvaskit/skwasm.js.symbols", "canvaskit/skwasm.wasm", "canvaskit/skwasm_heavy.js", "canvaskit/skwasm_heavy.js.symbols", "canvaskit/skwasm_heavy.wasm", "canvaskit/wimp.js", "canvaskit/wimp.js.symbols", "canvaskit/wimp.wasm", "favicon.png", "flutter.js", "flutter_bootstrap.js", "icons/Icon-192.png", "icons/Icon-512.png", "icons/Icon-maskable-192.png", "icons/Icon-maskable-512.png", "index.html", "main.dart.js", "manifest.json", "version.json"];

async function broadcast(msg) {
  const cs = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  cs.forEach((c) => c.postMessage(msg));
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const total = PRECACHE.length;
    let done = 0;
    for (const url of PRECACHE) {
      try { await cache.add(url); } catch (e) {}
      done++;
      if (done % 3 === 0 || done === total) {
        await broadcast({ type: 'cache-progress', current: done, total });
      }
    }
    await broadcast({ type: 'cache-complete', total });
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  const d = event.data;
  if (d && d.type === 'status') {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE);
      const keys = await cache.keys();
      const done = keys.length;
      const total = PRECACHE.length;
      if (event.source && event.source.postMessage) {
        event.source.postMessage({ type: 'status', current: done, total, complete: done >= total });
      }
    })());
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(req);
      if (response && response.status === 200 && response.type === 'basic') {
        cache.put(req, response.clone());
      }
      return response;
    } catch (e) {
      if (req.mode === 'navigate') {
        const idx = await cache.match('index.html');
        if (idx) return idx;
      }
      throw e;
    }
  })());
});
