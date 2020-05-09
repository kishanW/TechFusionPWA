using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo.Entities
{
    public class WebPushSubscription
    {
	    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
	    public virtual string EndPoint { get; set; }
	    public virtual string P256dH { get; set; }
	    public virtual string Auth { get; set; }
    }
}
