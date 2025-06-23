using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace PlanDigitization_web.Controllers
{
    public class MainDashboardController : Controller
    {
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];
        // GET: MainDashboard
        public ActionResult MainDashboard()
        {
            string _browserInfo = Request.Browser.Browser + Request.Browser.Version + Request.UserAgent + "~" + Request.ServerVariables["REMOTE_ADDR"];
            string _sessionValue = Convert.ToString(Session["UserId"]) + "^" + DateTime.Now.Ticks + "^" + _browserInfo + "^" + System.Guid.NewGuid();
            byte[] _encodeAsBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(_sessionValue);
            string _encryptedString = System.Convert.ToBase64String(_encodeAsBytes);
            Session["encryptedSession"] = _encryptedString;

            string PlantCode = (string)Session["PlantCode"];
            string LineCode = (string)Session["LineCode"];
            string CompanyCode = (string)Session["CompanyCode"];

            string UserID = (string)Session["UserID"];
            string UserName = (string)Session["UserName"];

            if (!string.IsNullOrEmpty(LineCode))
            {
                string URL = CbmURL(PlantCode, LineCode, CompanyCode, UserID, UserName);
                Session["CBMURL"] = URL;
            }
            else
            {
                Session["CBMURL"] = "0" + "," + "#";
            }

            return View();
        }

        public string CbmURL(string PlantCode, string LineCode, string CompanyCode, string UserID, string UserName)
        {
            string result = string.Empty;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(Baseurl);
                client.DefaultRequestHeaders.Clear();
                var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                var responseMessage = client.GetAsync("api/UserSettings/GetEmployee").Result;
                if (responseMessage.IsSuccessStatusCode)
                {
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage response = client.GetAsync($"api/MainDashboard/CbmURL?PlantCode={PlantCode}&LineCode={LineCode}&CompanyCode={CompanyCode}&UserID={UserID}&UserName={UserName}").Result;
                    List<Models.Products> DasList = new List<Models.Products>();
                    result = response.Content.ReadAsStringAsync().Result;
                    //DasList = JsonConvert.DeserializeObject<List<Models.Products>>(data);
                    ///return View(DasList);
                }

            }


            return result;
        }
    }
}