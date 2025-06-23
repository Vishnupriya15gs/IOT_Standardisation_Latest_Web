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

namespace PlanDigitization_web.Controllers
{
    public class MisReportWebController : Controller
    {

        public readonly Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];


        // GET: MisReportWeb

        public async Task<ActionResult> MIS_Group_settings(Models.usersettings U)
        {

            //if (this.HasPermission("ShiftSetting-View"))
            //{
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    U.QueryType = "Get_MISGroup";
                    U.Parameter1 = Session["CompanyCode"].ToString();
                    U.Parameter = Session["PlantCode"].ToString();
                    U.Parameter2 = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details_Lines", U).Result;
                            List<Models.mis_group> DasList = new List<Models.mis_group>();
                            var data = response.Content.ReadAsStringAsync().Result;
                            DasList = JsonConvert.DeserializeObject<List<Models.mis_group>>(data);
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
                return RedirectToAction("Settings_err", "Main");
            }
            //}
            //else
            //{
            //    return RedirectToAction("Unauth_page", "Main");
            //}
        }

        [HttpPost]
        public async Task<ActionResult> Add_MIS_Groups_Users(List<PlanDigitization_web.Models.mis_group_allowcation> permissions, List<PlanDigitization_web.Models.mis_group> grp)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    using (var client = new HttpClient())
                    {

                        client.BaseAddress = new Uri(Baseurl);
                        client.DefaultRequestHeaders.Clear();
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        foreach (var groupdetails in grp)
                        {
                            groupdetails.QueryType = groupdetails.QueryType;
                            groupdetails.CompanyCode = Session["CompanyCode"].ToString();
                            groupdetails.PlantCode = Session["PlantCode"].ToString();
                            groupdetails.Line_Code = Session["LineCode"].ToString();
                            var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                            var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                            if (responseMessage.IsSuccessStatusCode)
                            {
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.mis_group>("api/MISReport/Groupsusers_details", groupdetails).Result;

                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg_total = JsonConvert.DeserializeObject(res);
                                var msg = "";
                                var grpid = "";

                                if (msg_total.ToString().Substring(0, 8) == "Inserted")
                                {
                                    grpid = msg_total.ToString().Substring(8);
                                    msg = msg_total.ToString().Substring(0, 8);
                                }
                                else if (msg_total.ToString().Substring(0, 7) == "Updated")
                                {
                                    grpid = msg_total.ToString().Substring(7);
                                    msg = msg_total.ToString().Substring(0, 7);
                                }
                                else
                                {
                                    msg = msg_total.ToString();
                                }

                                //if (groupdetails.QueryType == "Insert")
                                //{
                                //    grpid = msg_total.ToString().Substring(8);
                                //    msg = msg_total.ToString().Substring(0, 8);
                                //}
                                //if (groupdetails.QueryType == "Update")
                                //{
                                //    grpid = msg_total.ToString().Substring(7);
                                //    msg = msg_total.ToString().Substring(0, 7);
                                //}
                                TempData["message"] = msg;
                                if (msg.ToString() == "Inserted" || msg.ToString() == "Updated")
                                {
                                    HttpResponseMessage response2 = client.PostAsJsonAsync<Models.mis_group>("api/MISReport/UserGroup_Deletion", groupdetails).Result;
                                    if (permissions != null)
                                    {
                                        foreach (var permissiondetails in permissions)
                                        {
                                            permissiondetails.QueryType = permissiondetails.QueryType;
                                            permissiondetails.CompanyCode = Session["CompanyCode"].ToString();
                                            permissiondetails.PlantCode = Session["PlantCode"].ToString();
                                            permissiondetails.Line_Code = Session["LineCode"].ToString();
                                            permissiondetails.UserID = permissiondetails.UserID;
                                            permissiondetails.GroupID = grpid;
                                            HttpResponseMessage response1 = client.PostAsJsonAsync<Models.mis_group_allowcation>("api/MISReport/UserGroup_Allocation", permissiondetails).Result;
                                            if (response1.IsSuccessStatusCode)
                                            {
                                                var res1 = response1.Content.ReadAsStringAsync().Result;
                                                var msg1 = JsonConvert.DeserializeObject(res1);
                                                // TempData["message"] = msg1;
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                TempData["message"] = "Session Timeout";
                                return RedirectToAction("Login", "Main");
                            }
                        }
                        return Json("ok", JsonRequestBehavior.AllowGet);
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


        public async Task<ActionResult> MIS_Report_settings(Models.usersettings U)
        {
            //if (this.HasPermission("ShiftSetting-View"))
            //{
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    U.QueryType = "Get_MISReport";
                    U.Parameter1 = Session["CompanyCode"].ToString();
                    U.Parameter = Session["PlantCode"].ToString();
                    U.Parameter2 = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details_Lines", U).Result;
                            List<Models.mis_report> DasList = new List<Models.mis_report>();
                            var data = response.Content.ReadAsStringAsync().Result;
                            DasList = JsonConvert.DeserializeObject<List<Models.mis_report>>(data);
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
                return RedirectToAction("Settings_err", "Main");
            }
            //}
            //else
            //{
            //    return RedirectToAction("Unauth_page", "Main");
            //}
        }

        [HttpPost]
        public async Task<ActionResult> Add_Group_Report(List<PlanDigitization_web.Models.mis_report_allowcation> permissions, List<PlanDigitization_web.Models.mis_report> grp)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    using (var client = new HttpClient())
                    {

                        client.BaseAddress = new Uri(Baseurl);
                        client.DefaultRequestHeaders.Clear();
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        foreach (var groupdetails in grp)
                        {
                            groupdetails.QueryType = groupdetails.QueryType;
                            groupdetails.CompanyCode = Session["CompanyCode"].ToString();
                            groupdetails.PlantCode = Session["PlantCode"].ToString();
                            groupdetails.Line_Code = Session["LineCode"].ToString();
                            var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                            var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                            if (responseMessage.IsSuccessStatusCode)
                            {
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.mis_report>("api/MISReport/Add_Reportset_details", groupdetails).Result;

                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg_total = JsonConvert.DeserializeObject(res);
                                var msg = "";
                                var grpid = "";

                                if (msg_total.ToString().Substring(0, 8) == "Inserted")
                                {
                                    grpid = msg_total.ToString().Substring(8);
                                    msg = msg_total.ToString().Substring(0, 8);
                                }
                                else if (msg_total.ToString().Substring(0, 7) == "Updated")
                                {
                                    grpid = msg_total.ToString().Substring(7);
                                    msg = msg_total.ToString().Substring(0, 7);
                                }
                                else
                                {
                                    msg = msg_total.ToString();
                                }

                                //if (groupdetails.QueryType == "Insert")
                                //{
                                //    grpid = msg_total.ToString().Substring(8);
                                //    msg = msg_total.ToString().Substring(0, 8);
                                //}
                                //if (groupdetails.QueryType == "Update")
                                //{
                                //    grpid = msg_total.ToString().Substring(7);
                                //    msg = msg_total.ToString().Substring(0, 7);
                                //}
                                TempData["message"] = msg;
                                if (msg.ToString() == "Inserted" || msg.ToString() == "Updated")
                                {
                                    HttpResponseMessage response2 = client.PostAsJsonAsync<Models.mis_report>("api/MISReport/ReportSet_Deletion", groupdetails).Result;
                                    if (permissions != null)
                                    {
                                        foreach (var permissiondetails in permissions)
                                        {
                                            permissiondetails.QueryType = permissiondetails.QueryType;
                                            permissiondetails.CompanyCode = Session["CompanyCode"].ToString();
                                            permissiondetails.PlantCode = Session["PlantCode"].ToString();
                                            permissiondetails.Line_Code = Session["LineCode"].ToString();
                                            permissiondetails.ReportName = permissiondetails.ReportName;
                                            permissiondetails.ReportID = grpid;
                                            permissiondetails.GroupID = groupdetails.GroupID;
                                            HttpResponseMessage response1 = client.PostAsJsonAsync<Models.mis_report_allowcation>("api/MISReport/Report_Allocation", permissiondetails).Result;
                                            if (response1.IsSuccessStatusCode)
                                            {
                                                var res1 = response1.Content.ReadAsStringAsync().Result;
                                                var msg1 = JsonConvert.DeserializeObject(res1);
                                                // TempData["message"] = msg1;
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                TempData["message"] = "Session Timeout";
                                return RedirectToAction("Login", "Main");
                            }
                        }
                        return Json("ok", JsonRequestBehavior.AllowGet);
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