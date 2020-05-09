using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Demo.Data
{
    public static class DbInitializer
    {
	    public static void Initialize(PwaDemoContext context)
	    {
		    context.Database.EnsureCreated();
	    }
    }
}
