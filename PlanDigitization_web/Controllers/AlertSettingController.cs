using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace PlanDigitization_web.Controllers
{
    public class AlertSettingController : Controller
    {
        public readonly Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];
        // GET: AlertSetting
        public ActionResult Index()
        {
            return View();
        }
        public async Task<ActionResult> Alert(Models.Setting A)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                if (this.HasPermission("AlertSetting-View"))
                {
                    try
                    {
                        using (var client = new HttpClient())
                        {
                            A.QueryType = "Alert_details";
                            A.Parameter1 = Session["CompanyCode"].ToString();
                            A.Parameter = Session["PlantCode"].ToString();
                            A.Parameter2 = Session["LineCode"].ToString();

                            client.BaseAddress = new Uri(Baseurl);
                            client.DefaultRequestHeaders.Clear();

                            client.BaseAddress = new Uri(Baseurl);
                            client.DefaultRequestHeaders.Clear();
                            var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                            var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                            if (responseMessage.IsSuccessStatusCode)
                            {
                                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                               
                                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.Setting>("api/Alert/Alert_details", A).Result;
                                List<Models.Alerts> DasList = new List<Models.Alerts>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Alerts>>(data);
                                return View(DasList);
                            }
                            else
                            {
                                TempData["message"] = "Session Timeout";
                                return RedirectToAction("Login", "Main");
                            }


                        }
                    }
                    catch (Exception e)
                    {
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }

                }
                else
                {
                    return RedirectToAction("Unauth_page", "Main");
                }
                
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
            
        }

        [HttpPost]
        public async Task<ActionResult> Save_Alert(Models.Alerts A)
        {
            
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    A.QueryType = "Insert";
                    A.CompanyCode = Session["CompanyCode"].ToString();
                    A.PlantCode = Session["PlantCode"].ToString();
                    A.Line_Code = Session["LineCode"].ToString();

                    using (var client = new HttpClient())
                    {
                        client.BaseAddress = new Uri(Baseurl);
                        client.DefaultRequestHeaders.Clear();

                        client.BaseAddress = new Uri(Baseurl);
                        client.DefaultRequestHeaders.Clear();
                        var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                        var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Alerts>("api/Alert/Add_Alert", A).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Alert", "AlertSetting");
                        }
                        else
                        {
                            TempData["message"] = "Session Timeout";
                            return RedirectToAction("Login", "Main");
                        }

                        
                    }
                }
                catch (Exception e)
                {
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
                
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
            
        }

        [HttpPost]
        public async Task<ActionResult> Update_Alert(Models.Alerts A)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    A.QueryType = "Update";
                    A.CompanyCode = Session["CompanyCode"].ToString();
                    A.PlantCode = Session["PlantCode"].ToString();
                    A.Line_Code = Session["LineCode"].ToString();

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
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Alerts>("api/Alert/Add_Alert", A).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Alert", "AlertSetting");
                        }
                        else
                        {
                            TempData["message"] = "Session Timeout";
                            return RedirectToAction("Login", "Main");
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
               
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
           
        }

        [HttpPost]
        public async Task<ActionResult> Bulk_Copy_Alert(Models.Alerts A)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    using (var client = new HttpClient())
                    {

                        A.CompanyCode = Session["CompanyCode"].ToString();
                        A.PlantCode = Session["PlantCode"].ToString();
                        A.Line_Code = Session["LineCode"].ToString();

                        client.BaseAddress = new Uri(Baseurl);
                        client.DefaultRequestHeaders.Clear();
                        var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                        var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Alerts>("api/Alert/Bulk_copy_alert", A).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Alert", "AlertSetting");
                        }
                        else
                        {
                            TempData["message"] = "Session Timeout";
                            return RedirectToAction("Login", "Main");
                        }

                        
                    }
                }
                catch (Exception e)
                {
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
                
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
            
        }

        [HttpPost]
        public async Task<ActionResult> Bulk_Copy_group(Models.Alerts A)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Alerts>("api/Alert/Bulk_copy_group", A).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Alert", "AlertSetting");
                        }
                        else
                        {
                            TempData["message"] = "Session Timeout";
                            return RedirectToAction("Login", "Main");
                        }


                        
                    }
                }
                catch (Exception e)
                {
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
                
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
            
        }

        //Variable Settings
        //public async Task<ActionResult> Variable_settings(Models.usersettings U)
        //{
        //    if (this.HasPermission("AlertResponding-View"))
        //    {
        //        if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
        //        {
        //            return View();
        //        }
        //        else
        //        {
        //            return RedirectToAction("Settings_err", "Main");
        //        }
        //    }
        //    else
        //    {
        //        return RedirectToAction("Settings_err", "Main");
        //    }
             
        //}

        /// <summary>
        /// Insert Variable Details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Add_Variable(Models.VariableSetting dept)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    dept.QueryType = "Insert";
                    dept.CompanyCode = Session["CompanyCode"].ToString();
                    dept.PlantCode = Session["PlantCode"].ToString();
                    dept.LineCode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.VariableSetting>("api/UserSettings/edit_delete_variablesetting_details", dept).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Variable_settings", "AlertSetting");
                        }
                        else
                        {
                            TempData["message"] = "Session Timeout";
                            return RedirectToAction("Login", "Main");
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }


        /// Update Variable Details
        /// </summary>
        /// <param name="dept"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Variable(Models.VariableSetting dept)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    dept.QueryType = "Update";
                    dept.CompanyCode = Session["CompanyCode"].ToString();
                    dept.PlantCode = Session["PlantCode"].ToString();
                    dept.LineCode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.VariableSetting>("api/UserSettings/edit_delete_variablesetting_details", dept).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Variable_settings", "AlertSetting");
                        }
                        else
                        {
                            TempData["message"] = "Session Timeout";
                            return RedirectToAction("Login", "Main");
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }


        //Responding to alert 
        public async Task<ActionResult> Alert_Responding(Models.AlertResponse result)
        {
            if (this.HasPermission("AlertResponding-View"))
            {

                if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)

                {
                    return View();
                }
                else
                {

                    return RedirectToAction("Settings_err", "Main");
                }

              
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
                
        }

        /// <summary>Responding to alert
        /// Update response Details
        /// </summary>
        /// <param name="dept"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Updateresponse(Models.AlertResponse dept)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    dept.QueryType = "Update";
                    dept.CompanyCode = Session["CompanyCode"].ToString();
                    dept.PlantCode = Session["PlantCode"].ToString();
                    dept.LineCode = Session["LineCode"].ToString();
                    dept.Last_Responded_UserName = Session["UserName"].ToString();

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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.AlertResponse>("api/UserSettings/edit_response_details", dept).Result;
                            var msg = "";
                            var res = "";
                            if (response.IsSuccessStatusCode)
                            {
                                res = response.Content.ReadAsStringAsync().Result;
                                //msg = JsonConvert.DeserializeObject(res);
                                //TempData["message"] = msg;
                            }
                            //return RedirectToAction("Alert_Responding", "AlarmSetting");
                            var response1 = (new JavaScriptSerializer()).Deserialize<string>(res);
                            return Json(response1, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            TempData["message"] = "Session Timeout";
                            return RedirectToAction("Login", "Main");
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }



    }
}