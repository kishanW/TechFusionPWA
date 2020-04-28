//install event
self.addEventListener('install', function (event)
{
	console.log('[Service Worker] install event: ', event);
	self.skipWaiting();
});

//receiving push notifications
self.addEventListener('push', function (event) {
	var notificationRequest = JSON.parse(event.data.text());
	console.log('[Service Worker] Push Received: ', notificationRequest);

	var title = "Tech Fusion PWA Demo";//notificationRequest.Title;
	var options = {
		body: notificationRequest.TextForPushNotification || notificationRequest.Text,
		icon: '/fusion-logo-square.png',
		badge: '/fusion-logo-square.png',
		vibrate: [100, 50, 100],
		actions: [],
		tag: notificationRequest.ServerNotificationId,
		renotify: true,
		requireInteraction: notificationRequest.RequireInteraction,
		priority: notificationRequest.Priority || 0,
		timestamp: new Date(),
		data: {
			actionUrls: {},
			notificationClickUrl: notificationRequest.NotificationClickUrl
		},
		notificationClickUrl: notificationRequest.NotificationClickUrl
	};

	var notificationActions = notificationRequest.Actions;
	if (notificationActions)
	{
		notificationActions.forEach(function (notificationAction, index) {
			var action = {
				action: notificationAction.Name,
				title: notificationAction.Title
			};

			options.data.actionUrls[notificationAction.Name] = notificationAction.Url;
			options.actions.push(action);
		});
	}

	event.waitUntil(self.registration.showNotification(title, options));
});