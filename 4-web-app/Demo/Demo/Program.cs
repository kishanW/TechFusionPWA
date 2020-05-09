﻿using System;
using Demo.Data;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace Demo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // CreateWebHostBuilder(args).Build().Run();

            var host = CreateWebHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
	            var services = scope.ServiceProvider;
	            try
	            {
		            var context = services.GetRequiredService<PwaDemoContext>();
		            DbInitializer.Initialize(context);
	            }
	            catch (Exception ex)
	            {
		            var logger = services.GetRequiredService<ILogger<Program>>();
		            logger.LogError(ex, "An error occurred while seeding the database.");
	            }
            }

            host.Run();
        }


        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
