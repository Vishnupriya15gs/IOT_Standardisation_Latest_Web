
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Mvc;

using static PlanDigitization_web.FilterConfig;

namespace PlanDigitization_web.Controllers
{

    [SessionTimeout]
    public class ToolLifeController : Controller
    {
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];
        public ActionResult ToolLifeLiveDashboard()
        {
            if (this.HasPermission("ToolLifeLive-View"))
            {

                return View();
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        //[HttpPost]
        //public ActionResult PreventiveMaintanenceDashboard1(Models.ToolLife1 m)
        //{
        //    m.CompanyCode = Session["CompanyCode"].ToString();
        //    m.PlantCode = Session["PlantCode"].ToString();
        //    m.Flag = "preventive";
        //    m.linename = m.linecode;
        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri(Baseurl);
        //        client.DefaultRequestHeaders.Clear();
        //        var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
        //        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
        //        HttpResponseMessage response = client.PostAsJsonAsync<Models.ToolLife1>("api/ToolLife/Addtoolmaintenance", m).Result;

        //        if (response.IsSuccessStatusCode)
        //        {
        //            List<Models.ToolLife1> DasList = new List<Models.ToolLife1>();
        //            var data = response.Content.ReadAsStringAsync().Result;
        //            DasList = JsonConvert.DeserializeObject<List<Models.ToolLife1>>(data);
        //            return View(DasList);
        //            TempData["toollife"] = new Models.ToolLife1();
        //            return RedirectToAction("PreventiveMaintanenceDashboard", "ToolLife");
        //        }
        //        else
        //        {
        //            return RedirectToAction("Login", "Main");
        //        }
        //    }
        //}
        public ActionResult ToolLifeHistoricDashboard()
        {
            if (Session["CompanyCode"] != null)
            {
              return View();
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }
        public ActionResult PreventiveMaintanenceDashboard()
        {
            //Models.ToolLife1 std = (Models.ToolLife1)TempData["toollife"];
            
            if (Session["CompanyCode"] != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }
        public ActionResult NewMaintanenceDash()
        {
            if (Session["CompanyCode"] != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }


        /// <summary>
        /// Update Shift Setting details
        /// </summary>
        /// <param name="S"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Tool(Models.ToolLife S)
        {
            try
            {
                S.QueryType = "Update";
                S.CompanyCode = Session["CompanyCode"].ToString();
                S.PlantCode = Session["PlantCode"].ToString();
                S.LineCode = Session["LineCode"].ToString();
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(Baseurl);
                    client.DefaultRequestHeaders.Clear();
                    var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                    var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                    if (responseMessage.IsSuccessStatusCode)
                    {
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.ToolLife>("api/Toollife/Update_tool", S).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("NewMaintanenceDash", "ToolLife");
                    }
                    else
                    {
                        TempData["message"] = "Token is not valid";
                        return RedirectToAction("Login", "Main");
                    }
                }
            }
            catch (Exception e)
            {
                //Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }

    }
}