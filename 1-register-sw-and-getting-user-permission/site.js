var pwaApp = {
  isSubScribedToPush: false,
  serviceWorkerRegistration: undefined,

  RegisterServiceWorker: function () {
    pwaApp.AddMessage("light", "Installation starting");

    if ("serviceWorker" in navigator && "PushManager" in window) {
      pwaApp.AddMessage("light", "service worker supported");

      navigator.serviceWorker
        .register("/serviceworker.js")
        .then(function (swReg) {
          pwaApp.serviceWorkerRegistration = swReg;
          console.log(
            "[site.js] service worker installed",
            pwaApp.serviceWorkerRegistration
          );
          pwaApp.AddMessage(
            "success",
            "Installation complete. Open up browser dev tools/ debugger to see more info."
          );
        })
        .catch(function (registerSwError) {
          console.error(
            "[site.js] Service worker error - unable to register",
            registerSwError
          );
          pwaApp.AddMessage(
            "danger",
            "Installation failed. Please see the console logging"
          );
        });
    } else {
      console.error("[site.js] Push messaging is not supported");
      pwaApp.AddMessage("danger", "Service worker is not supported");
    }
  },
  AddMessage: function (messageType, message) {
    var messageListElem = $("#serviceWorkerInstallMessages");
    messageListElem.append(
      "<li class='list-group-item list-group-item-" +
        messageType +
        "'>" +
        message +
        "</li>"
    );
  },
};

$(document).ready(function () {
  pwaApp.RegisterServiceWorker();
});
