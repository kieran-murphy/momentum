// Registered only in production (see components/ServiceWorkerRegister.tsx).
// This is a runtime cache only — there's no hardcoded list of hashed build
// filenames to keep in sync, so pages and assets get cached as visitors hit
// them instead of being precached up front.
const CACHE_NAME = "momentum-v1";
const BASE_PATH = "/momentum";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE_PATH)) return;

  // Page navigations: prefer the network so visitors get the latest build
  // when online, falling back to whatever shell is cached when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) ?? caches.match(`${BASE_PATH}/`))
    );
    return;
  }

  // Static assets (hashed JS/CSS, icons): cache-first, since a given
  // filename's content never changes once built.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
