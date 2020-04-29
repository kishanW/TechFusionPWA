var pwaApp = {
  //https://web-push-codelab.glitch.me/
  _appServerPublicKey:
    "BJvVmATX5GfhjxnWWgy0RR4BsLB0qA-DnRasUiDvDbdgngMaxeV8lpoCdAahwcQbHltdjgku55Kukd02QM5jYoE",
  isSubScribedToPush: false,
  serviceWorkerRegistration: undefined,

  RegisterServiceWorker: function () {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/serviceworker.js")
        .then(function (swReg) {
          pwaApp.serviceWorkerRegistration = swReg;
          swReg.pushManager.getSubscription().then(function (subscription) {
            var isSubscribed = !(subscription === null);
            pwaApp.isSubScribedToPush = isSubscribed;

            $("#togglePushSubscription").text(
              isSubscribed
                ? "Unsubscribe from notifications"
                : "Subscribe to notifications"
            );
          });
        })
        .catch(function (registerSwError) {
          console.error(
            "[site.js] Service worker error - unable to register",
            registerSwError
          );
        });
    } else {
      console.error("[site.js] Push messaging is not supported");
    }
  },

  GetUserPermissionToSubscribe: function () {
    var getUserPermissionPromise = new Promise(function (resolve, reject) {
      pwaApp._notificationPermissionResult = Notification.requestPermission(
        function (result) {
          resolve(result);
        }
      );

      if (pwaApp._notificationPermissionResult) {
        pwaApp._notificationPermissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      if (permissionResult !== "granted") {
        throw new Error("We weren't granted permission.");
      }
    });

    return getUserPermissionPromise;
  },

  SubscribeToPushNotifications: function () {
    //check to see if we have a service worker installed
    if (!pwaApp.serviceWorkerRegistration) {
      throw new Error("A service worker must be installed");
    }

    pwaApp.serviceWorkerRegistration.pushManager
      .subscribe({
        userVisibleOnly: true, //https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#uservisibleonly_options
        //fix this
        applicationServerKey: pwaApp._urlB64ToUint8Array(
          pwaApp._appServerPublicKey
        ),
      })
      .then(function (subscription) {
        //code to send the subscription to the server
        localStorage.setItem(
          "webPushSubscription",
          JSON.stringify(subscription)
        );

        //update flag
        pwaApp.isSubScribedToPush = true;

        //update button text
        $("#togglePushSubscription").text("Unsubscribe from notifications");
      })
      .catch(function (subscribeToPushError) {
        console.error(
          "[site.js] Failed to subscribe the user: ",
          subscribeToPushError
        );
        //update button here -- if needed
      });
  },

  UnsubscribeFromPushNotifications: function () {
    pwaApp.serviceWorkerRegistration.pushManager
      .getSubscription()
      .then(function (subscription) {
        if (subscription) {
          return subscription.unsubscribe();
        }
        return undefined;
      })
      .then(function () {
        console.log("[site.js] unsubscribed from push notifications");

        //remove local storage values
        localStorage.removeItem("webPushSubscription");

        //tell server to delete the subscription from the server

        //update flags
        pwaApp.isSubScribedToPush = false;

        //update button
        $("#togglePushSubscription").text("Subscribe to push notification");
      })
      .catch(function (unsubscribeFromPushError) {
        console.log("[site.js] Error unsubscribing", unsubscribeFromPushError);
      });
  },

  _urlB64ToUint8Array: function (base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },
};

$(document).ready(function () {
  pwaApp.RegisterServiceWorker();
});

$(document).on("click", "#togglePushSubscription", function (e) {
  e.preventDefault();

  if (
    pwaApp.isSubScribedToPush &&
    confirm("Do you really want to unsubscribe?")
  ) {
    pwaApp.UnsubscribeFromPushNotifications();
  } else {
    pwaApp.GetUserPermissionToSubscribe();
    pwaApp.SubscribeToPushNotifications();
  }
});