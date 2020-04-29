/*
use https://web-push-codelab.glitch.me/ to:
- get the app server keys
- send test push messages
*/

self.addEventListener("install", function (event) {
  console.log("[Service Worker] install event: ", event);

  console.log("[service worker] precaching assets on install");
  event.waitUntil(precache());

  // self.skipWaiting();
});

//listen to push notifications receive event
self.addEventListener("push", function (event) {
  console.log("[Service Worker] push notification received: ", event);

  //this can be any string - you can send a stringified JSON string here too
  var notificationText = event.data.text();

  //set the options for the notification
  var options = {
    body: notificationText,
    icon: "/fa-logo_w_bg.png",
    badge: "/fa-logo_w_bg.png",
    vibrate: [100, 50, 100],
    actions: [],
    tag: "TechFusion",
    renotify: true,
    requireInteraction: true,
    priority: 0,
    timestamp: new Date(),
    data: {
      //you can store your custom data here to retrieve later
      someExampleProperty: "example property",
    },
    actions: [{ action: "view", title: "view" }],
    notificationClickUrl: "/",
  };

  event.waitUntil(
    self.registration.showNotification("Tech Fusion PWA Demo", options)
  );
});

//handle push notification click event
self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] push notification clicked", event);

  //access the notification object
  var notification = event.notification;
  var clickedButton = event.action;
  var customData = notification.data;

  //use the notification click url and open a window
  console.log(
    "[Service Worker] opening url from push notification | clicked button: ",
    clickedButton,
    "| custom data: ",
    customData
  );
  clients.openWindow("/");

  //close the notification
  event.notification.close();
});

//not-so offline support to enable the minimum requirements for this app to be a PWA

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

var cacheName = "techFusionPwaCache";
function precache() {
  return caches.open(cacheName).then(function (cache) {
    return cache.addAll([
      "./libraries/jquery-3.4.1.slim.min.js",
      "./libraries/bootstap.min.css",
      "./libraries/bootstrap.min.js",
      "./libraries/popper.min.js",
      "./index.htm",
      "./fa-logo-w-wide.png",
      "./site.js",
      "./site.webmanifest.json",
      "./fa-logo_w_bg.png",
      "./fusion-logo-transparent-200.png",
      "./offline-image.png",
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
