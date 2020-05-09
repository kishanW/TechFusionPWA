using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Demo.Data;
using Demo.Entities;
using Demo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebPush;

namespace Demo.Controllers
{
	public class HomeController : Controller
	{
		private readonly PwaDemoContext _context;

		public HomeController(PwaDemoContext context)
		{
			_context = context;
		}

		public IActionResult Index()
		{
			return View();
		}

		public IActionResult Privacy()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel {RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier});
		}

		[HttpPost]
		public IActionResult Subscribe([FromBody] WebPushModel subscriptionModel)
		{
			var newSubscription = new WebPushSubscription
			                      {
				                      Auth = subscriptionModel.Auth,
				                      EndPoint = subscriptionModel.EndPoint,
				                      P256dH = subscriptionModel.P256dH
			                      };
			_context.WebPushSubscriptions.Add(newSubscription);
			_context.SaveChanges();
			return Ok(newSubscription);
		}

		[HttpPost]
		public IActionResult UnSubscribe([FromBody] WebPushModel subscriptionModel)
		{
			var subscriptionToDelete = Get(subscriptionModel.EndPoint, subscriptionModel.P256dH, subscriptionModel.Auth);
			if (subscriptionToDelete != null)
			{
				_context.WebPushSubscriptions.Remove(subscriptionToDelete);
				_context.SaveChanges();
				return Ok(subscriptionToDelete);
			}

			return Ok();
		}

		public IActionResult SuperAwesomePage()
		{
			return View();
		}
		
		[HttpPost]
		public IActionResult SendMessage([FromBody] SendMessageModel sendMessageModel)
		{
			var webPushOptions = GetWebPushOptions();
			var webPushClient = new WebPushClient();

			var savedSubscriptions = _context.WebPushSubscriptions.ToList();
			foreach (var savedSubscription in savedSubscriptions)
			{
				try
				{
					var webPushSubscription = new PushSubscription(savedSubscription.EndPoint, savedSubscription.P256dH, savedSubscription.Auth);
					webPushClient.SendNotification(webPushSubscription, sendMessageModel.Message, webPushOptions);
				}
				catch (WebPushException ex)
				{
					var sss = 1;
					//figure out what to do here -- delete from server? 
				}
			}
			return Ok();
		}

		private WebPushSubscription Get(string endPoint, string p256dH, string auth)
		{
			var subscription = _context.WebPushSubscriptions.FirstOrDefault(x => x.Auth == auth && x.P256dH == p256dH && x.EndPoint == endPoint);
			return subscription;
		}

		private Dictionary<string, object> GetWebPushOptions()
		{
			var subject = "mailto:kishanw@live.com";
			var publicKey = "BPXeq_JIEnkyFB2e53_X4DTA7swWEDUu7s-OHgQNZG06ubdJaUlqolAbN4ZxAxbm5rwrO9jw2LqXDDDZWINwfh4";
			var privateKey = "IYsJsEcYd47f-PU9TIjd_4wIkZwNaRBzfVEKeeI8QHo";
			var vapidDetails = new VapidDetails(subject, publicKey, privateKey);

			var options = new Dictionary<string, object>
			              {
				              ["vapidDetails"] = vapidDetails,
				              ["TTL"] = 3600
			              };

			return options;
		}

		public IActionResult GenerateVapidKeys()
		{
			var vapidKeys = VapidHelper.GenerateVapidKeys();
			return Ok(vapidKeys);
		}
	}
}