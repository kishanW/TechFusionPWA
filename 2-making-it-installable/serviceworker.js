/*
use https://web-push-codelab.glitch.me/ to:
- get the app server keys
- send test push messages
*/

self.addEventListener("install", function (event) {
  console.log("[Service Worker] install event: ", event);

  console.log("[service worker] precaching assets on install");
  event.waitUntil(precache());
  self.skipWaiting();
});

self.addEventListener("fetch", function (event) {
  console.log("[Service Worker] fetch event fired", event);

  var request = event.request;
  if (request.method === "GET") {
    event.respondWith(
      fetch(request).catch(function (error) {
        console.error(
          "[onfetch] Failed. Serving cached offline fallback " + error
        );

        if (request.url.endsWith(".png")) {
          return caches.open(cacheName).then(function (cache) {
            return cache.match("offline-image.png");
          });
        } else {
          return caches.open(cacheName).then(function (cache) {
            return cache.match(request).then(function (matching) {
              return matching || Promise.reject("no-match");
            });
          });
        }
      })
    );
  }
});

var cacheName = "TechFusionPWA_CACHE";
function precache() {
  return caches.open(cacheName).then(function (cache) {
    return cache.addAll([
      "libraries/jquery-3.4.1.slim.min.js",
      "libraries/bootstap.min.css",
      "libraries/bootstrap.min.js",
      "libraries/popper.min.js",
      "index.htm",
      "/",
      "fa-logo-w-wide.png",
      "site.js",
      "site.webmanifest.json",
      "fa-logo_w_bg.png",
      "fusion-logo-transparent-200.png",
      "offline-image.png",
    ]);
  });
}

function update(request) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromCache(request) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject("no-match");
    });
  });
}
