var pwaApp = {
  isSubScribedToPush: false,
  serviceWorkerRegistration: undefined,

  RegisterServiceWorker: function () {
    var messageListElem = $("#serviceWorkerInstallMessages");
    messageListElem.append(
      "<li class='list-group-item list-group-item-light'>Installation starting</li>"
    );

    if ("serviceWorker" in navigator && "PushManager" in window) {
      messageListElem.append(
        "<li class='list-group-item list-group-item-light'>service worker supported</li>"
      );

      navigator.serviceWorker
        .register("/serviceworker.js")
        .then(function (swReg) {
          pwaApp.serviceWorkerRegistration = swReg;
          console.log(
            "[site.js] service worker installed",
            pwaApp.serviceWorkerRegistration
          );
          messageListElem.append(
            "<li class='list-group-item list-group-item-success'>Installation complete. Open up browser dev tools/ debugger to see more info.</li>"
          );
        })
        .catch(function (registerSwError) {
          console.error(
            "[site.js] Service worker error - unable to register",
            registerSwError
          );
          messageListElem.append(
            "<li class='list-group-item list-group-item-danger'>Installation failed. Please see the console logging</li>"
          );
        });
    } else {
      console.error("[site.js] Push messaging is not supported");
      messageListElem.append(
        "<li class='list-group-item list-group-item-danger'>Service worker is not supported</li>"
      );
    }
  },
};

$(document).ready(function () {
  pwaApp.RegisterServiceWorker();
});
