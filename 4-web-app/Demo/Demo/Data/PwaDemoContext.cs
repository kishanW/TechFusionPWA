using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Demo.Entities;
using Microsoft.EntityFrameworkCore;

namespace Demo.Data
{
    public class PwaDemoContext: DbContext
    {
	    public PwaDemoContext(DbContextOptions<PwaDemoContext> options) : base(options)
	    {
	    }

	    protected override void OnModelCreating(ModelBuilder modelBuilder)
	    {
		    modelBuilder.Entity<WebPushSubscription>().ToTable("WebPushSubscription").HasKey(x => x.Id);
	    }

	    public DbSet<WebPushSubscription> WebPushSubscriptions { get; set; }
    }
}
