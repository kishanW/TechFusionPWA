var pwaApp = {
  //https://web-push-codelab.glitch.me/
  _appServerPublicKey: "",
  //"BJvVmATX5GfhjxnWWgy0RR4BsLB0qA-DnRasUiDvDbdgngMaxeV8lpoCdAahwcQbHltdjgku55Kukd02QM5jYoE",
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

            if (isSubscribed) {
              $("#pushSubscriptionTextArea").val(JSON.stringify(subscription));
            }
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

        $("#pushSubscriptionTextArea").val(JSON.stringify(subscription));

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
        $("#pushSubscriptionTextArea").val("");

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

  UpdateButtons: function () {
    //update buttons
    $("#appserverpubkeyready").toggleClass(
      "d-none",
      !pwaApp._appServerPublicKey
    );
    $("#togglePushSubscription").attr(
      "disabled",
      pwaApp._appServerPublicKey ? null : "disabled"
    );
  },
};

$(document).ready(function () {
  //try to populate app server key
  pwaApp._appServerPublicKey = localStorage.getItem("appServerPublicKey");

  //updaye ui after trying to load the app server key from local storage
  $("#appserverpubkey").val(pwaApp._appServerPublicKey);
  pwaApp.UpdateButtons();

  //register service worker
  pwaApp.RegisterServiceWorker();
});

$(document).on("change", "#appserverpubkey", function (e) {
  //save the app server key in memory and to local storage
  var appServerPubKey = $(this).val();
  pwaApp._appServerPublicKey = appServerPubKey.trim();
  localStorage.setItem("appServerPublicKey", pwaApp._appServerPublicKey);

  //update buttons
  pwaApp.UpdateButtons();
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

//CODE FOR APP INSTALLATION
let deferredPrompt;
const addBtn = document.querySelector("#installButton");
addBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = "block";

  addBtn.addEventListener("click", (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = "none";
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt = null;
    });
  });
});
