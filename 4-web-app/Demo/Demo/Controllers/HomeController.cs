using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Demo.Data;
using Demo.Entities;
using Demo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

		public IActionResult SendMessage()
		{
			return Ok();
		}

		private WebPushSubscription Get(string endPoint, string p256dH, string auth)
		{
			var subscription = _context.WebPushSubscriptions.FirstOrDefault(x => x.Auth == auth && x.P256dH == p256dH && x.EndPoint == endPoint);
			return subscription;
		}
	}
}