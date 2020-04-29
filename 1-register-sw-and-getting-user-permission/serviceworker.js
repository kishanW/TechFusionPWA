self.addEventListener("install", function (event) {
  console.log("[Service Worker] install event: ", event);
  self.skipWaiting();
});
