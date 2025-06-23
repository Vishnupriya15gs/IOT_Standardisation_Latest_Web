 using Microsoft.Owin;
using Newtonsoft.Json;
using Owin;

[assembly: OwinStartupAttribute(typeof(PlantDigitization.Startup))]
namespace PlantDigitization
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.None
            };

            // ConfigureAuth(app);
        }
       
  
    
    }
}
