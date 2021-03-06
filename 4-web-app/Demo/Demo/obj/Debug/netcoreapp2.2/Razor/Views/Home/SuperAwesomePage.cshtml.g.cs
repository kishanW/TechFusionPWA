#pragma checksum "C:\Users\kwanigasinghe\Documents\GitHub\TechFusionPWA\4-web-app\Demo\Demo\Views\Home\SuperAwesomePage.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "2cd8f9ee2fc04a67c742f78db133cbbb938dd039"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Home_SuperAwesomePage), @"mvc.1.0.view", @"/Views/Home/SuperAwesomePage.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Home/SuperAwesomePage.cshtml", typeof(AspNetCore.Views_Home_SuperAwesomePage))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "C:\Users\kwanigasinghe\Documents\GitHub\TechFusionPWA\4-web-app\Demo\Demo\Views\_ViewImports.cshtml"
using Demo;

#line default
#line hidden
#line 2 "C:\Users\kwanigasinghe\Documents\GitHub\TechFusionPWA\4-web-app\Demo\Demo\Views\_ViewImports.cshtml"
using Demo.Models;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"2cd8f9ee2fc04a67c742f78db133cbbb938dd039", @"/Views/Home/SuperAwesomePage.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"e18407c5b9dabc62761fc6cdd8f67817f22bc556", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_SuperAwesomePage : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#line 1 "C:\Users\kwanigasinghe\Documents\GitHub\TechFusionPWA\4-web-app\Demo\Demo\Views\Home\SuperAwesomePage.cshtml"
  
    ViewData["Title"] = "Home Page";

#line default
#line hidden
            BeginContext(45, 814, true);
            WriteLiteral(@"
<div class=""row"">
    <div class=""col-lg-12"">
	    <h1 class=""display-4"">TechFusion PWA Demo</h1>
    </div>
</div>

<div class=""row"" id=""vueApp"">
    
    <div class=""col-lg-3"">
        
		<p>
            Type something to send out as a push notification...
		</p>
        
		<input type=""text"" name=""myMessage"" placeholder=""your message"" class=""form-control"" v-model=""myMessage""/>

		<button class=""btn btn-primary"" v-on:click=""SendPushMessage"">
			Send
		</button>
    </div>

</div>

<!--Vue JS/ Axios-->
<script src=""https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.17/vue.min.js""></script>
<script src=""https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js""></script>
<script>
	var vueApp = new Vue({
		el: ""#vueApp"",
		data: {
			myMessage: '',
			sendMessageUrl: '");
            EndContext();
            BeginContext(860, 25, false);
#line 36 "C:\Users\kwanigasinghe\Documents\GitHub\TechFusionPWA\4-web-app\Demo\Demo\Views\Home\SuperAwesomePage.cshtml"
                        Write(Url.Action("SendMessage"));

#line default
#line hidden
            EndContext();
            BeginContext(885, 408, true);
            WriteLiteral(@"'
		},
		computed: {
			
		},
		methods: {
			SendPushMessage()
			{
				var sendMessageServerUrl = this.sendMessageUrl;
				var message = this.myMessage;
				axios.post(sendMessageServerUrl,
						{
							message: message
						})
					.then(function ()
					{
						console.log(""message sent"");
					});
			}
		}
	});
	Vue.config.devtools = true;
	window.vueApp2 = vueApp;
</script>");
            EndContext();
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
