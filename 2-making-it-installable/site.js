var pwaApp = {
  //https://web-push-codelab.glitch.me/
  _appServerPublicKey:
    "BJvVmATX5GfhjxnWWgy0RR4BsLB0qA-DnRasUiDvDbdgngMaxeV8lpoCdAahwcQbHltdjgku55Kukd02QM5jYoE",
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

//CODE FOR APP INSTALLATION
//https://web.dev/customize-install/

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

window.addEventListener("appinstalled", (evt) => {
  console.log("a2hs installed", evt);
  pwaApp.AddMessage("success", "App intall event - app successfully installed");
});
