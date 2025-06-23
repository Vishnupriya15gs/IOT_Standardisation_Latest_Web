using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PlanDigitization_web.Controllers
{
    public class RBACController : Controller
    {
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];

        public string CallRBACApi()
        {
            string result = string.Empty;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(Baseurl);
                client.DefaultRequestHeaders.Clear();

                // Add authorization headers if required
                var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1);

                // Send a POST request (empty body since RBAC does not take parameters)
                HttpResponseMessage response = client.PostAsync("api/RBAC/RBAC", null).Result;

                if (response.IsSuccessStatusCode)
                {
                    result = response.Content.ReadAsStringAsync().Result;
                }
                else
                {
                    result = $"Error: {response.StatusCode} - {response.ReasonPhrase}";
                }
            }

            return result;
        }

    }
}
