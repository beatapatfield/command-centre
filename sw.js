/* Command Centre service worker — offline app shell + runtime caching */
/* CACHE version is stamped automatically at deploy time (see .github/workflows/deploy.yml).
   The "__BUILD__" placeholder is replaced with a content hash of the app files, so a new
   cache — and the in-app "Update available" prompt — only appears when the app actually changes.
   If you deploy without the workflow, this stays constant (behaves like a fixed version). */
const CACHE = "command-centre-__BUILD__";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", e => {
  // Force fresh copies (bypass HTTP cache), then activate immediately so the next
  // time the app opens it silently serves the new version — no prompt needed.
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.all(SHELL.map(u => fetch(u, { cache: "reload" }).then(r => c.put(u, r)).catch(() => {})))
  ).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Page loads: network-first so updates land, fall back to cached shell offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put("./index.html", cp)); return r; })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Same-origin assets: cache-first.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(c => c || fetch(req).then(r => {
        const cp = r.clone(); caches.open(CACHE).then(ca => ca.put(req, cp)); return r;
      }))
    );
    return;
  }

  // Cross-origin (e.g. Google Fonts): stale-while-revalidate.
  e.respondWith(
    caches.match(req).then(c => {
      const net = fetch(req).then(r => {
        const cp = r.clone(); caches.open(CACHE).then(ca => ca.put(req, cp)); return r;
      }).catch(() => c);
      return c || net;
    })
  );
});
