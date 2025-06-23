using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Script.Serialization;
using ClosedXML.Excel;
using static PlanDigitization_web.FilterConfig;

using PlanDigitization_web.Models;

namespace PlanDigitization_web.Controllers
{
    [SessionTimeout]
    public class UserSettingsController : Controller
    {
        public readonly Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];
        // Cutomer Details
        public async Task<ActionResult> Customer_setting(Models.usersettings U)
        {
            try
            {
                U.QueryType = "Customer";
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                        List<Models.Customer> DasList = new List<Models.Customer>();
                        var data = response.Content.ReadAsStringAsync().Result;
                        DasList = JsonConvert.DeserializeObject<List<Models.Customer>>(data);
                        return View(DasList);
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }


        //mail Settings
        public async Task<ActionResult> Mail_settings(Models.usersettings U)
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
        /// Insert Mail Details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Add_Report_Mail(Models.reportMail dept)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    dept.QueryType = "Insert";
                    dept.CompanyCode = Session["CompanyCode"].ToString();
                    dept.PlantCode = Session["PlantCode"].ToString();
                    dept.linecode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.reportMail>("api/UserSettings/edit_delete_mail_details", dept).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("mail_settings", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

        /// <summary>Report_Mail_details
        /// Update Department Details
        /// </summary>
        /// <param name="dept"></param>
        /// <returns></returns>
        /// 

        [HttpPost]
        public async Task<ActionResult> Insert_URL(Models.URL_table d)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    d.QueryType = "Insert";
                    d.CompanyCode = Session["CompanyCode"].ToString();
                    d.PlantCode = Session["PlantCode"].ToString();
                    d.LineCode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.URL_table>("api/UserSettings/URL_details1", d).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = "Inserted";//response.Content.ReadAsStringAsync().Result;
                                var msg = "Inserted"; ;// JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("URL_settings", "UserSettings");
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
        public async Task<ActionResult> Update_Report_Mail(Models.reportMail dept)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    dept.QueryType = "Update";
                    dept.CompanyCode = Session["CompanyCode"].ToString();
                    dept.PlantCode = Session["PlantCode"].ToString();
                    dept.linecode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.reportMail>("api/UserSettings/edit_delete_mail_details", dept).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Mail_settings", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }


        //Line Settings
        public async Task<ActionResult> Line_settings(Models.usersettings U)
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
        /// Insert Mail Details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Add_Line(Models.reportMail dept)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    dept.QueryType = "Insert";
                    dept.CompanyCode = Session["CompanyCode"].ToString();
                    dept.PlantCode = Session["PlantCode"].ToString();
                    dept.linecode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.reportMail>("api/UserSettings/edit_delete_linesetting_details", dept).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Line_settings", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

        /// <summary>Report_Mail_details
        /// Update Department Details
        /// </summary>
        /// <param name="dept"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Line(Models.reportMail dept)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    dept.QueryType = "Update";
                    dept.CompanyCode = Session["CompanyCode"].ToString();
                    dept.PlantCode = Session["PlantCode"].ToString();
                    dept.linecode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.reportMail>("api/UserSettings/edit_delete_linesetting_details", dept).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Line_settings", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }




        //Plant Details
        public async Task<ActionResult> Plant_details(Models.usersettings U)
        {
            if (this.HasPermission("PlantSetting-View"))
            {
                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        U.QueryType = "Customer_Plant";
                        U.Parameter1 = Session["CompanyCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                                List<Models.plant> DasList = new List<Models.plant>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.plant>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }


                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        //Function Details
        public async Task<ActionResult> Function_details(Models.usersettings U)
        {
            if (this.HasPermission("FunctionSetting-View"))
            {
                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        U.QueryType = "NewCustomer_Function_details";
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter = Session["PlantCode"].ToString();
                        //U.Parameter2 = Session["LineCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                                List<Models.Function> DasList = new List<Models.Function>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Function>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }

                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        //Operation Settings
        public async Task<ActionResult> Operation_settings(Models.usersettings U)
        {
            if (this.HasPermission("FunctionSetting-View"))
            {
                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        U.QueryType = "NewCompany_Operations_select";
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter = Session["PlantCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        U.LineCode = Session["LineCode"].ToString();

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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Values/settings_details", U).Result;
                                List<Models.Operations> DasList = new List<Models.Operations>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Operations>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        //Assets Settings
        public async Task<ActionResult> Assets_settings(Models.usersettings U)
        {
            if (this.HasPermission("AssetSetting-View"))
            {
                if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
                {
                    try
                    {
                        U.QueryType = "Customer_Assetsdetails";
                        U.Parameter = Session["PlantCode"].ToString();
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter2 = Session["LineCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.LineCode = Session["LineCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/List_Asset_details", U).Result;
                                List<Models.assets> DasList = new List<Models.assets>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.assets>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        //Product Settings
        public async Task<ActionResult> Product_details(Models.usersettings U)
        {
            if (this.HasPermission("ProductSetting-View"))
            {
                if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
                {
                    try
                    {
                        U.QueryType = "NewCustomer_Product_details";
                        U.Parameter = Session["PlantCode"].ToString();
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter2 = Session["LineCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.LineCode = Session["LineCode"].ToString();

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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Values/settings_details", U).Result;
                                List<Models.Products> DasList = new List<Models.Products>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Products>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        //Holiday Settings
        public async Task<ActionResult> holiday_details(Models.usersettings U)
        {
            if (this.HasPermission("HolidaySetting-View"))
            {
                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        U.QueryType = "Customer_Holiday_details";
                        U.Parameter1 = Session["CompanyCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                                List<Models.Holiday> DasList = new List<Models.Holiday>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Holiday>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        //Users Settings
        public async Task<ActionResult> Users_settings(Models.usersettings U)
        {
            if (this.HasPermission("UserSetting-View"))
            {
                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        U.QueryType = "Customer_User_details";
                        U.Parameter = Session["CompanyCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                                List<Models.users> DasList = new List<Models.users>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.users>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }

                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        //Roles Settings
        public async Task<ActionResult> Roles_settings(Models.usersettings U)
        {

            if (Session["CompanyCode"] != null)
            {
                try
                {
                    U.QueryType = "Role_details";
                    U.Parameter1 = Session["CompanyCode"].ToString();
                    U.Parameter = Session["PlantCode"].ToString();
                    U.Parameter2 = Session["LineCode"].ToString();
                    U.CompanyCode = Session["CompanyCode"].ToString();
                    U.PlantCode = Session["PlantCode"].ToString();
                    U.LineCode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                            List<Models.Roles> DasList = new List<Models.Roles>();
                            var data = response.Content.ReadAsStringAsync().Result;
                            DasList = JsonConvert.DeserializeObject<List<Models.Roles>>(data);
                            return View(DasList);
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

        public async Task<ActionResult> Dept_settings(Models.usersettings U)
        {
            if (this.HasPermission("DepartmentSetting-View"))
            {
                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        U.QueryType = "newDept_details";
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter = Session["PlantCode"].ToString();
                        //U.Parameter2 = Session["LineCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        //   U.LineCode = Session["LineCode"].ToString();

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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                                List<Models.Department> DasList = new List<Models.Department>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Department>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        public async Task<ActionResult> URL_settings(Models.usersettings U)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    U.QueryType = "Portal_URL_details";
                    U.Parameter1 = Session["CompanyCode"].ToString();
                    U.Parameter = Session["PlantCode"].ToString();
                    U.CompanyCode = Session["CompanyCode"].ToString();
                    U.PlantCode = Session["PlantCode"].ToString();

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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                            List<Models.URL_table> DasList = new List<Models.URL_table>();
                            var data = response.Content.ReadAsStringAsync().Result;
                            DasList = JsonConvert.DeserializeObject<List<Models.URL_table>>(data);
                            return View(DasList);
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }


        //SKill Settings
        public async Task<ActionResult> Skill_settings(Models.usersettings U)
        {

            if (this.HasPermission("SkillSetting-View"))
            {
                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        U.QueryType = "NewCustomer_Skill_details";
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter = Session["PlantCode"].ToString();
                        U.Parameter2 = Session["LineCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        U.LineCode = Session["LineCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Values/settings_details", U).Result;
                                List<Models.Skill> DasList = new List<Models.Skill>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Skill>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

      
        







        /// <summary>
        /// Insert Losses data details
        /// </summary>
        /// <param name="LO"></param>
        /// <returns></returns>
       
        /// <summary>
        /// Update Losses data details
        /// </summary>
        /// <param name="LO"></param>
        /// <returns></returns>
     

        /// <summary>
        /// Insert Loss Category data details
        /// </summary>
        /// <param name="LO"></param>
        /// <returns></returns>
       
        /// <summary>
        /// Update Loss Category data details
        /// </summary>
        /// <param name="LO"></param>
        /// <returns></returns>

        /// <summary>
        /// Insert Loss Type data details
        /// </summary>
        /// <param name="LO"></param>
        /// <returns></returns>
      
        /// <summary>
        /// Update Loss Type data details
        /// </summary>
        /// <param name="LO"></param>
        /// <returns></returns>
       

        //Tool List
        public async Task<ActionResult> Tool_list(Models.usersettings U)
        {

            if (this.HasPermission("ToolListSetting-View"))
            {
                if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
                {
                    try
                    {
                        U.QueryType = "NewCustomer_Toolsdetails";
                        U.Parameter = Session["PlantCode"].ToString();
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter2 = Session["LineCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        U.LineCode = Session["LineCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Values/settings_details", U).Result;
                                List<Models.Toollist> DasList = new List<Models.Toollist>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Toollist>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

    
        //Shift Settings
        public async Task<ActionResult> Shift_settings(Models.usersettings U)
        {

            if (this.HasPermission("ShiftSetting-View"))
            {
                if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
                {
                    try
                    {
                        U.QueryType = "NewCustomer_Shift_details";
                        U.Parameter = Session["PlantCode"].ToString();
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter2 = Session["LineCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        U.LineCode = Session["LineCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Values/settings_details", U).Result;
                                List<Models.Shift> DasList = new List<Models.Shift>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Shift>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        public async Task<ActionResult> AddShift(Models.usersettings U)
        {

            if (this.HasPermission("ShiftSetting-View"))
            {
                if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
                {
                    try
                    {
                        U.QueryType = "Customer_Shift_details";
                        U.Parameter = Session["PlantCode"].ToString();
                        U.Parameter1 = Session["CompanyCode"].ToString();

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
                                List<Models.Shift> DasList = new List<Models.Shift>();
                                U.Flag = "LineCode";
                                U.CompanyCode = Session["CompanyCode"].ToString();
                                U.PlantCode = Session["PlantCode"].ToString();
                                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Toollife/GetSettingdatas1", U).Result;

                                string apiResponse = response.Content.ReadAsStringAsync().Result;
                                var result = JsonConvert.DeserializeObject<Models.RootObject>(apiResponse);
                                //DasList = JsonConvert.DeserializeObject<List<Models.Shift>>(apiResponse);
                                // var LC = result.data.Select(p => p.FirstName).ToList();





                                ViewBag.LineCode = new SelectList(DasList, "Name", "Code");
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        public async Task<ActionResult> AddShift1(Models.usersettings U)
        {

            if (this.HasPermission("ShiftSetting-View"))
            {
                if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
                {
                    try
                    {
                        U.QueryType = "Customer_Shift_details";
                        U.Parameter = Session["PlantCode"].ToString();
                        U.Parameter1 = Session["CompanyCode"].ToString();



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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                                List<Models.Shift> DasList = new List<Models.Shift>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Shift>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        public async Task<ActionResult> EditShift(Models.usersettings U)
        {

            if (this.HasPermission("ShiftSetting-View"))
            {
                if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
                {
                    List<Models.Shift> model = new List<Models.Shift>();
                    try
                    {
                        var input = new
                        {
                            QueryType = U.QueryType,
                            Parameter = U.Parameter,
                            CompanyCode = Session["CompanyCode"].ToString(),
                            PlantCode = Session["PlantCode"].ToString(),
                            LineCode = Session["LineCode"].ToString()


                        };

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
                                var response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/User_settings_details1", U).Result;
                                List<Models.Shift> DasList = new List<Models.Shift>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                // DasList = JsonConvert.DeserializeObject<List<Models.Shift>>(data);
                                model = (new JavaScriptSerializer()).Deserialize<List<Models.Shift>>(data);
                                return Json(new { result = model, url = Url.Action("EditShift1", "UserSettings") });
                                //return View(model);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }

                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }

            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }

        }
        /// <summary>
        /// Insert Department Details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Add_Dept(Models.Department dept)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    dept.QueryType = "Insert";
                    dept.CompanyCode = Session["CompanyCode"].ToString();
                    dept.PlantCode = Session["PlantCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Department>("api/UserSettings/Dept_details", dept).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Dept_settings", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

        /// <summary>
        /// Update Department Details
        /// </summary>
        /// <param name="dept"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_dept(Models.Department dept)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    dept.QueryType = "Update";
                    dept.CompanyCode = Session["CompanyCode"].ToString();
                    dept.PlantCode = Session["PlantCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Department>("api/UserSettings/Dept_details", dept).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Dept_settings", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

        /// <summary>
        /// Update Department Details
        /// </summary>
        /// <param name="dept"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_URL(Models.URL_table d)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    d.QueryType = "Update";
                    d.CompanyCode = Session["CompanyCode"].ToString();
                    d.PlantCode = Session["PlantCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.URL_table>("api/UserSettings/URL_details", d).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("URL_settings", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }


        /// <summary>
        /// Insert Role & Permission details
        /// </summary>
        /// <param name="permissions"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        //[HttpPost]
        //public async Task<ActionResult> Add_Permission(List<PlanDigitization_web.Models.Permission> permissions, List<PlanDigitization_web.Models.Roles> role)
        //{
        //    try
        //    {
        //        using (var client = new HttpClient())
        //        {

        //            client.BaseAddress = new Uri(Baseurl);
        //            client.DefaultRequestHeaders.Clear();
        //            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //            foreach (var roledetails in role)
        //            {
        //                roledetails.QueryType = roledetails.QueryType;
        //                roledetails.CompanyCode = Session["CompanyCode"].ToString();
        //                roledetails.PlantCode = Session["PlantCode"].ToString();

        //                var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
        //                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
        //                var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
        //                if (responseMessage.IsSuccessStatusCode)
        //                {
        //                    HttpResponseMessage response = client.PostAsJsonAsync<Models.Roles>("api/UserSettings/Roles_details", roledetails).Result;

        //                    var res = response.Content.ReadAsStringAsync().Result;

        //                    var msg_total = JsonConvert.DeserializeObject(res);

        //                    var msg = "";
        //                    var grpid = "";
        //                    if (msg_total.ToString().Substring(0, 8) == "Inserted")
        //                    {
        //                        grpid = msg_total.ToString().Substring(8);
        //                        msg = msg_total.ToString().Substring(0, 8);
        //                    }
        //                    else if (msg_total.ToString().Substring(0, 7) == "Updated")
        //                    {
        //                        grpid = msg_total.ToString().Substring(7);
        //                        msg = msg_total.ToString().Substring(0, 7);
        //                    }
        //                    else
        //                    {
        //                        msg = msg_total.ToString();
        //                    }

        //                    TempData["message"] = msg;

        //                    if (msg.ToString() == "Inserted" || msg.ToString() == "Updated")
        //                    {

        //                        foreach (var permissiondetails in permissions)
        //                        {
        //                            permissiondetails.QueryType = permissiondetails.QueryType;
        //                            permissiondetails.RoleID = grpid;
        //                            permissiondetails.CompanyCode = Session["CompanyCode"].ToString();
        //                            HttpResponseMessage response1 = client.PostAsJsonAsync<Models.Permission>("api/UserSettings/Permission_details", permissiondetails).Result;
        //                            if (response1.IsSuccessStatusCode)
        //                            {
        //                                var res1 = response1.Content.ReadAsStringAsync().Result;
        //                                var msg1 = JsonConvert.DeserializeObject(res1);
        //                                TempData["message"] = msg1;
        //                            }
        //                        }
        //                    }
        //                }
        //                else
        //                {
        //                    TempData["message"] = "Token is not valid";
        //                    return RedirectToAction("Login", "Main");
        //                }
        //            }
        //            return Json("ok", JsonRequestBehavior.AllowGet);

        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        Logger.Warn(e);
        //        return RedirectToAction("Error_Page", "Main");
        //    }
        //}

        /// <summary>
        /// Insert Role & Permission details
        /// </summary>
        /// <param name="permissions"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Add_Permission(List<PlanDigitization_web.Models.Permission> permissions, List<PlanDigitization_web.Models.Roles> role)
        {
            try
            {

                using (var client = new HttpClient())
                {


                    client.BaseAddress = new Uri(Baseurl);
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    int permission_count = 0;
                    foreach (var roledetails in role)
                    {
                        roledetails.QueryType = roledetails.QueryType;
                        roledetails.CompanyCode = Session["CompanyCode"].ToString();
                        roledetails.PlantCode = Session["PlantCode"].ToString();

                        var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                        var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Roles>("api/UserSettings/Roles_details", roledetails).Result;

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

                            TempData["message"] = msg;

                            //if (msg.ToString() == "Inserted" || msg.ToString() == "Updated")
                            //{

                            //    foreach (var permissiondetails in permissions)
                            //    {
                            //        permissiondetails.QueryType = permissiondetails.QueryType;
                            //        permissiondetails.RoleID = grpid;
                            //        permissiondetails.CompanyCode = Session["CompanyCode"].ToString();
                            //        HttpResponseMessage response1 = client.PostAsJsonAsync<Models.Permission>("api/UserSettings/Permission_details", permissiondetails).Result;
                            //        if (response1.IsSuccessStatusCode)
                            //        {
                            //            var res1 = response1.Content.ReadAsStringAsync().Result;
                            //            var msg1 = JsonConvert.DeserializeObject(res1);
                            //            TempData["message"] = msg1;
                            //        }
                            //    }
                            //}



                            for (int i = 0; i < permissions.Count(); i++)
                            {
                                Console.WriteLine(permissions[i]);
                                permissions[i].QueryType = permissions[i].QueryType;
                                permissions[i].RoleID = grpid;
                                permissions[i].CompanyCode = Session["CompanyCode"].ToString();
                                HttpResponseMessage response1 = client.PostAsJsonAsync<Models.Permission>("api/UserSettings/Permission_details", permissions[i]).Result;
                                if (response1.IsSuccessStatusCode)
                                {
                                    var res1 = response1.Content.ReadAsStringAsync().Result;
                                    var msg1 = JsonConvert.DeserializeObject(res1);
                                    TempData["message"] = msg1;
                                }

                                permission_count++;

                                if (permissions.Count() < 0)
                                {
                                    continue;
                                }
                            }



                        }
                        else
                        {
                            TempData["message"] = "Token is not valid";
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




        [HttpPost]
        public async Task<ActionResult> Add_Permission1(GroupData groupData, Role R)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    if (R.QueryType == "Update")
                    {
                        R.QueryType = "Update";
                    }
                    else
                    {
                        R.QueryType = "Insert";
                    }

                    R.CompanyCode = Session["CompanyCode"].ToString();
                    R.PlantCode = Session["PlantCode"].ToString();
                    R.Line_Code = Session["LineCode"].ToString();
                    client.BaseAddress = new Uri(Baseurl);
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                    var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                    if (responseMessage.IsSuccessStatusCode)
                    {
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Role>("api/UserSettings/Roles_details1", R).Result;

                        //var res = response.Content.ReadAsStringAsync().Result;

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

                        TempData["message"] = msg;

                        if (msg.ToString() == "Inserted" || msg.ToString() == "Updated")
                        {
                            foreach (Models.Permission permissiondetails in groupData.Permission_data)
                            {
                                if (permissiondetails.View_form == "1")
                                {
                                    permissiondetails.View_form = permissiondetails.View_form;
                                }
                                else
                                {
                                    permissiondetails.View_form = "0";
                                }
                                if (permissiondetails.Add_form == "1")
                                {
                                    permissiondetails.Add_form = permissiondetails.Add_form;
                                }
                                else
                                {
                                    permissiondetails.Add_form = "0";
                                }
                                if (permissiondetails.Edit_form == "1")
                                {
                                    permissiondetails.Edit_form = permissiondetails.Edit_form;
                                }
                                else
                                {
                                    permissiondetails.Edit_form = "0";
                                }
                                if (permissiondetails.Delete_form == "1")
                                {
                                    permissiondetails.Delete_form = permissiondetails.Delete_form;
                                }
                                else
                                {
                                    permissiondetails.Delete_form = "0";
                                }

                                if (R.QueryType == "Update")
                                {
                                    permissiondetails.QueryType = "Update";
                                }
                                else
                                {
                                    permissiondetails.QueryType = "Insert";
                                }


                                permissiondetails.RoleID = grpid;
                                permissiondetails.CompanyCode = Session["CompanyCode"].ToString();
                                HttpResponseMessage response1 = client.PostAsJsonAsync<Models.Permission>("api/UserSettings/Permission_details1", permissiondetails).Result;
                                if (response1.IsSuccessStatusCode)
                                {
                                    var res1 = response1.Content.ReadAsStringAsync().Result;
                                    var msg1 = JsonConvert.DeserializeObject(res1);
                                    TempData["message"] = msg1;
                                    //return RedirectToAction("Roles_settings", "UserSettings");
                                }

                            }
                        }
                        return RedirectToAction("Roles_settings", "UserSettings");
                    }


                    else
                    {
                        TempData["message"] = "Token is not valid";
                        return RedirectToAction("Login", "Main");
                    }

                    //return Json("ok", JsonRequestBehavior.AllowGet);
                    //return RedirectToAction("Roles_settings", "UserSettings");

                }
            }
            catch (Exception e)
            {
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }




        [HttpPost]
        public async Task<ActionResult> Set_CompanyCode(string id, Models.Customer Cus)
        {
            try
            {
                Session["CompanyCode"] = id;
                Session["CompanyName"] = Cus;

                HttpCookie companycode = new HttpCookie("companycode");
                companycode.Value = id;
                companycode.HttpOnly = false;
                companycode.SameSite = SameSiteMode.Lax;
                companycode.Expires.Add(new TimeSpan(0, 1, 0));
                Response.Cookies.Add(companycode);

                Session["PlantCode"] = null;
                Cus.CompanyCode = id;
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
                        HttpResponseMessage loginres = client.PostAsJsonAsync<Models.Customer>("api/UserSettings/Get_Customer_details", Cus).Result;
                        List<Models.Customer> DasList = new List<Models.Customer>();
                        if (loginres.IsSuccessStatusCode)
                        {
                            var customer_data = loginres.Content.ReadAsStringAsync().Result;
                            DasList = JsonConvert.DeserializeObject<List<Models.Customer>>(customer_data);
                            Session["CompanyName"] = DasList[0].CompanyName;
                            if (DasList.Count != 0)
                            {
                                Session["CustomerLogo"] = DasList[0].Logo;
                            }
                            else
                            {
                                Session["CustomerLogo"] = null;
                            }
                        }
                    }
                    else
                    {
                        TempData["message"] = "Token is not valid";
                        return RedirectToAction("Login", "Main");
                    }
                }
                return Json("ok", JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }



        public async Task<ActionResult> Set_PlantCode(string id, Models.plant P)

        {

            try
            {
                Session["PlantCode"] = id;
                //P.PlantCode = id;

                //Session["PlantID"] = id;
                P.PlantID = id;



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
                        HttpResponseMessage loginres = client.PostAsJsonAsync<Models.plant>("api/UserSettings/Get_Plant_details", P).Result;
                        List<Models.plant> DasList = new List<Models.plant>();
                        if (loginres.IsSuccessStatusCode)
                        {
                            var plant_data = loginres.Content.ReadAsStringAsync().Result;
                            DasList = JsonConvert.DeserializeObject<List<Models.plant>>(plant_data);
                            Session["PlantName"] = DasList[0].PlantName;


                        }

                    }
                    else
                    {
                        TempData["message"] = "Token is not valid";
                        return RedirectToAction("Login", "Main");
                    }
                }
                return Json("ok", JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }

        }


        public async Task<ActionResult> Set_LineCode(string id, Models.Function F)

        {

            try
            {
                Session["LineCode"] = id;
                //Session["FunctionID"] = id;
                //F.FunctionID = id;

                //Session["LineCode"] = id;
                F.FunctionID = id;


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
                        HttpResponseMessage loginres = client.PostAsJsonAsync<Models.Function>("api/UserSettings/Get_Line_details", F).Result;
                        List<Models.Function> DasList = new List<Models.Function>();
                        if (loginres.IsSuccessStatusCode)
                        {
                            var line_data = loginres.Content.ReadAsStringAsync().Result;
                            DasList = JsonConvert.DeserializeObject<List<Models.Function>>(line_data);
                            Session["LineName"] = DasList[0].FunctionName;


                        }
                    }

                    else
                    {
                        TempData["message"] = "Token is not valid";
                        return RedirectToAction("Login", "Main");
                    }
                }
                return Json("ok", JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }


        //[HttpPost]
        //public async Task<ActionResult> Set_CompanyCode(string id, Models.Customer Cus)
        //{
        //    try
        //    {
        //        Session["CompanyCode"] = id;
        //        Session["PlantCode"] = null;
        //        Cus.CompanyCode = id;
        //        using (var client = new HttpClient())
        //        {
        //            client.BaseAddress = new Uri(Baseurl);
        //            client.DefaultRequestHeaders.Clear();
        //            var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
        //            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
        //            var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
        //            if (responseMessage.IsSuccessStatusCode)
        //            {
        //                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //                HttpResponseMessage loginres = client.PostAsJsonAsync<Models.Customer>("api/UserSettings/Get_Customer_details", Cus).Result;
        //                List<Models.Customer> DasList = new List<Models.Customer>();
        //                if (loginres.IsSuccessStatusCode)
        //                {
        //                    var customer_data = loginres.Content.ReadAsStringAsync().Result;
        //                    DasList = JsonConvert.DeserializeObject<List<Models.Customer>>(customer_data);
        //                    if (DasList.Count != 0)
        //                    {
        //                        Session["CustomerLogo"] = DasList[0].Logo;
        //                    }
        //                    else
        //                    {
        //                        Session["CustomerLogo"] = null;
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                TempData["message"] = "Token is not valid";
        //                return RedirectToAction("Login", "Main");
        //            }
        //        }
        //        return Json("ok", JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Logger.Warn(e);
        //        return RedirectToAction("Error_Page", "Main");
        //    }
        //}


        //[HttpPost]
        //public ActionResult Set_PlantCode(string id)
        //{
        //    Session["PlantCode"] = id;
        //    HttpCookie plantcode = new HttpCookie("plantcode");
        //    plantcode.Value = id;
        //    plantcode.HttpOnly = false;
        //    plantcode.SameSite = SameSiteMode.Lax;
        //    plantcode.Expires.Add(new TimeSpan(0, 1, 0));
        //    Response.Cookies.Add(plantcode);
        //    return Json("ok", JsonRequestBehavior.AllowGet);
        //}



        //[HttpPost]
        //public ActionResult Set_PlantCode(string id)
        //{
        //    Session["PlantCode"] = id;
        //    return Json("ok", JsonRequestBehavior.AllowGet);
        //}



        //[HttpPost]
        //public ActionResult Set_LineCode(string id)
        //{
        //    Session["LineCode"] = id;
        //    //Session["PlantCode"] = id;
        //    HttpCookie linecode = new HttpCookie("linecode");
        //    linecode.Value = id;
        //    linecode.HttpOnly = false;
        //    linecode.SameSite = SameSiteMode.Lax;
        //    linecode.Expires.Add(new TimeSpan(0, 1, 0));
        //    Response.Cookies.Add(linecode);
        //    return Json("ok", JsonRequestBehavior.AllowGet);
        //}




        //[HttpPost]
        //public ActionResult Set_LineCode(string id)
        //{
        //    Session["LineCode"] = id;
        //    return Json("ok", JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        public ActionResult Set_DeptCode(string id)
        {
            Session["DeptCode"] = id;
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Insert Customer details
        /// </summary>
        /// <param name="C"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Add_Customer(Models.Customer C, HttpPostedFileBase Logo)
        {
            C.QueryType = "Insert";
            string filename = string.Empty;
            string filepath = string.Empty;
            if (Logo != null)
            {
                string path = Server.MapPath("~/Images/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                filepath = path + Path.GetFileName(Logo.FileName);
                filename = Path.GetFileName(Logo.FileName);
                string extension = Path.GetExtension(Logo.FileName);
                Logo.SaveAs(filepath);
                C.Logo = filename;
            }
            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg" };
            var checkextension = Path.GetExtension(Logo.FileName).ToLower();

            if (allowedExtensions.Contains(checkextension))
            {
                try
                {
                    TempData["notice"] = "Select png or jpg or jpeg";
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Customer>("api/UserSettings/Customer_details", C).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Customer_setting", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            return RedirectToAction("Settings_err", "Main");


        }
        /// <summary>
        /// Update Customer Details
        /// </summary>
        /// <param name="C"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Customer(Models.Customer C, HttpPostedFileBase Logo)
        {
            C.QueryType = "Update";
            string filename = string.Empty;
            string filepath = string.Empty;
            if (Logo != null)
            {
                string path = Server.MapPath("~/Images/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                filepath = path + Path.GetFileName(Logo.FileName);
                filename = Path.GetFileName(Logo.FileName);
                string extension = Path.GetExtension(Logo.FileName);
                Logo.SaveAs(filepath);
                C.Logo = filename;
            }
            else
            {
                C.Logo = C.PreLogo;
            }
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Customer>("api/UserSettings/Customer_details", C).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Customer_setting", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }

        /// <summary>
        /// Insert Plant Details
        /// </summary>
        /// <param name="P"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Add_Plant(Models.plant P)
        {
            P.QueryType = "Insert";
            P.ParentOrganization = Session["CompanyCode"].ToString();
            P.IsActive = "Active";
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.plant>("api/UserSettings/Plant_details", P).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Plant_details", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }

        /// <summary>
        /// Update Plant Details
        /// </summary>
        /// <param name="P"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Plant(Models.plant P)
        {
            P.QueryType = "Update";
            P.ParentOrganization = Session["CompanyCode"].ToString();
            //P.IsActive = "Active";
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.plant>("api/UserSettings/Plant_details", P).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Plant_details", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }

        /// <summary>
        /// Insert Function Details
        /// </summary>
        /// <param name="F"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Insert_Function(Models.Function F)
        {
            F.QueryType = "Insert";
            F.CompanyCode = Session["CompanyCode"].ToString();
            F.Parameter2 = Session["LineCode"].ToString();
            F.IsActive = "Active";
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Function>("api/UserSettings/Function_details", F).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Function_details", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }

        /// <summary>
        /// Update Function Details
        /// </summary>
        /// <param name="F"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Function(Models.Function F)
        {
            try
            {
                F.QueryType = "Update";
                F.CompanyCode = Session["CompanyCode"].ToString();
                F.Parameter2 = Session["LineCode"].ToString();
                F.IsActive = "Active";
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Function>("api/UserSettings/Function_details", F).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Function_details", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }

        /// <summary>
        /// Insert SkillSet Details
        /// </summary>
        /// <param name="S"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Insert_Skillset(Models.Skill S)
        {
            try
            {
                S.QueryType = "Insert";
                S.CompanyCode = Session["CompanyCode"].ToString();
                S.Plant_Code = Session["PlantCode"].ToString();
                S.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Skill>("api/UserSettings/Skills_details", S).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Skill_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }

        /// <summary>
        /// Update SkillSet Details
        /// </summary>
        /// <param name="S"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Skillset(Models.Skill S)
        {
            try
            {
                S.QueryType = "Update";
                S.CompanyCode = Session["CompanyCode"].ToString();
                S.Plant_Code = Session["PlantCode"].ToString();
                S.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Skill>("api/UserSettings/Skills_details", S).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Skill_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Insert User details
        /// </summary>
        /// <param name="U"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Insert_users(Models.users U)
        {
            try
            {
                U.QueryType = "Insert";
                U.CompanyCode = Session["CompanyCode"].ToString();
                U.PlantCode = Session["PlantCode"].ToString();
                U.IsActive = "Active";

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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.users>("api/UserSettings/Users_details", U).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Users_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Update User details
        /// </summary>
        /// <param name="U"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_users(Models.users U)
        {
            try
            {
                U.QueryType = "Update";
                U.CompanyCode = Session["CompanyCode"].ToString();
                U.PlantCode = Session["PlantCode"].ToString();
                U.IsActive = "Active";
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.users>("api/UserSettings/Users_details", U).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Users_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Insert Asset Details
        /// </summary>
        /// <param name="A"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Insert_assetdetails(Models.assets A)
        {
            try
            {
                A.QueryType = "Insert";
                A.CompanyCode = Session["CompanyCode"].ToString();
                A.PlantCode = Session["PlantCode"].ToString();
                A.FunctionName = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.assets>("api/UserSettings/Assets_details", A).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Assets_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Update Asset Details
        /// </summary>
        /// <param name="A"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_assetdetails(Models.assets A)
        {
            try
            {
                A.QueryType = "Update";
                A.CompanyCode = Session["CompanyCode"].ToString();
                A.PlantCode = Session["PlantCode"].ToString();
                A.FunctionName = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.assets>("api/UserSettings/Assets_details", A).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Assets_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Insert Operation details
        /// </summary>
        /// <param name="O"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Insert_Operation(Models.Operations O)
        {
            try
            {
                O.QueryType = "Insert";
                O.CompanyCode = Session["CompanyCode"].ToString();
                O.PlantCode = Session["PlantCode"].ToString();
                O.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Operations>("api/UserSettings/Operation_details", O).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Operation_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Update Operation details
        /// </summary>
        /// <param name="O"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Operation(Models.Operations O)
        {
            try
            {
                O.QueryType = "Update";
                O.CompanyCode = Session["CompanyCode"].ToString();
                O.PlantCode = Session["PlantCode"].ToString();
                O.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Operations>("api/UserSettings/Operation_details", O).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Operation_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Insert Product Details
        /// </summary>
        /// <param name="P"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Insert_Productdetails(Models.Products P, HttpPostedFileBase file)
        {
            try
            {
                if (file != null && file.ContentLength > 0)
                {
                    //var image = new ImageModel
                    //{
                    //    Name = file.FileName,
                    //    ContentType = file.ContentType
                    //};

                    using (var binaryReader = new BinaryReader(file.InputStream))
                    {
                        P.ImgData = binaryReader.ReadBytes(file.ContentLength);
                    }
                }


                P.QueryType = "Insert";
                P.CompanyCode = Session["CompanyCode"].ToString();
                P.PlantCode = Session["PlantCode"].ToString();
                P.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Products>("api/UserSettings/Product_details", P).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Product_details", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Update Product Details
        /// </summary>
        /// <param name="P"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Productdetails(Models.Products P, HttpPostedFileBase file)
        {
            try
            {
                if (file != null && file.ContentLength > 0)
                {

                    using (var binaryReader = new BinaryReader(file.InputStream))
                    {
                        P.ImgData = binaryReader.ReadBytes(file.ContentLength);
                    }

                }
                P.QueryType = "Update";
                P.CompanyCode = Session["CompanyCode"].ToString();
                P.PlantCode = Session["PlantCode"].ToString();
                P.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Products>("api/UserSettings/Product_details", P).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Product_details", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Insert Holiday Details
        /// </summary>
        /// <param name="H"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Insert_Holiday(Models.Holiday H)
        {
            try
            {
                H.QueryType = "Insert";
                H.CompanyCode = Session["CompanyCode"].ToString();
                H.PlantID = Session["PlantCode"].ToString();
                H.LineCode = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Holiday>("api/UserSettings/Holiday_details", H).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("holiday_details", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Update Holiday details
        /// </summary>
        /// <param name="H"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Holiday(Models.Holiday H)
        {
            try
            {
                H.QueryType = "Update";
                H.CompanyCode = Session["CompanyCode"].ToString();
                H.PlantID = Session["PlantCode"].ToString();
                H.LineCode = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Holiday>("api/UserSettings/Holiday_details", H).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("holiday_details", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Insert Operator Skill details
        /// </summary>
        /// <param name="OS"></param>
        /// <returns></returns>
      
        /// <summary>
        /// Update Operator Skill details
        /// </summary>
        /// <param name="OS"></param>
        /// <returns></returns>
       
        /// <summary>
        /// Insert Alarmdetails
        /// </summary>
        /// <param name="AL"></param>
        /// <returns></returns>
     
        /// <summary>
        /// Update Alarm details
        /// </summary>
        /// <param name="AL"></param>
        /// <returns></returns>
       
        /// <summary>
        /// Insert Rejection data details
        /// </summary>
        /// <param name="RJ"></param>
        /// <returns></returns>
      
        /// <summary>
        /// Update Rejection data details
        /// </summary>
        /// <param name="RJ"></param>
        /// <returns></returns>
      

        /// <summary>
        /// Insert Toollist details
        /// </summary>
        /// <param name="TO"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Insert_Toollist(Models.Toollist TO)
        {
            try
            {
                TO.QueryType = "Insert";
                TO.CompanyCode = Session["CompanyCode"].ToString();
                TO.PlantCode = Session["PlantCode"].ToString();
                TO.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Toollist>("api/UserSettings/Tooli_list_details", TO).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Tool_list", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }


        [HttpPost]
        public async Task<ActionResult> Add_Tools(List<PlanDigitization_web.Models.Toollist> permissions, List<PlanDigitization_web.Models.Toollist> role)

        {
            try
            {
                using (var client = new HttpClient())
                {

                    client.BaseAddress = new Uri(Baseurl);
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    foreach (var roledetails in role)
                    {
                        roledetails.QueryType = roledetails.QueryType;
                        roledetails.CompanyCode = Session["CompanyCode"].ToString();
                        roledetails.PlantCode = Session["PlantCode"].ToString();
                        roledetails.Line_Code = Session["LineCode"].ToString();
                        var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                        var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Toollist>("api/UserSettings/Tooli_list_details", roledetails).Result;

                            var res = response.Content.ReadAsStringAsync().Result;

                            var msg_total = JsonConvert.DeserializeObject(res);

                            var msg = "";
                            var grpid = "";
                            if (msg_total.ToString().Substring(0, 8) == "Inserted")
                            {
                                //grpid = msg_total.ToString().Substring(8);
                                msg = msg_total.ToString().Substring(0, 8);
                            }
                            else if (msg_total.ToString().Substring(0, 7) == "Updated")
                            {
                                // grpid = msg_total.ToString().Substring(7);
                                msg = msg_total.ToString().Substring(0, 7);
                            }
                            else
                            {
                                msg = msg_total.ToString();
                            }

                            TempData["message"] = msg;

                            if (msg.ToString() == "Inserted" || msg.ToString() == "Updated" /*|| msg.ToString() == "Already ToolID" || msg.ToString() == "Already ToolName"*/)
                            {

                                foreach (var permissiondetails in permissions)
                                {
                                    if (msg.ToString() == "Inserted")
                                    {
                                        permissiondetails.QueryType = "Insert";
                                    }
                                    if (msg.ToString() == "Updated")
                                    {
                                        permissiondetails.QueryType = "Update";
                                    }
                                    if (msg.ToString() == "Already ToolID" || msg.ToString() == "Already ToolName")
                                    {
                                        permissiondetails.QueryType = "Insert";
                                    }

                                    permissiondetails.QueryType = permissiondetails.QueryType;
                                    permissiondetails.ToolID = permissiondetails.ToolID;
                                    permissiondetails.ToolName = permissiondetails.ToolName;
                                    permissiondetails.SerialNo = permissiondetails.SerialNo;
                                    permissiondetails.ToolID = permissiondetails.ToolID;
                                    permissiondetails.RatedLifeCycle = permissiondetails.RatedLifeCycle;
                                    permissiondetails.Rectext = permissiondetails.Rectext;
                                    permissiondetails.Subassembly = permissiondetails.Subassembly;
                                    permissiondetails.Machine_Code = permissiondetails.Machine_Code;
                                    permissiondetails.Part_number = permissiondetails.Part_number;

                                    permissiondetails.CompanyCode = Session["CompanyCode"].ToString();
                                    permissiondetails.PlantCode = Session["PlantCode"].ToString();
                                    permissiondetails.Line_Code = Session["LineCode"].ToString();
                                    HttpResponseMessage response1 = client.PostAsJsonAsync<Models.Toollist>("api/UserSettings/Insert_LifeCycle", permissiondetails).Result;
                                    if (response1.IsSuccessStatusCode)
                                    {
                                        var res1 = response1.Content.ReadAsStringAsync().Result;
                                        var msg1 = JsonConvert.DeserializeObject(res1);
                                        TempData["message"] = msg1;
                                    }
                                }
                            }
                        }
                        else
                        {
                            TempData["message"] = "Token is not valid";
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


        /// <summary>
        /// Update Toollist details
        /// </summary>
        /// <param name="TO"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Toollist(Models.Toollist TO)
        {
            try
            {
                TO.QueryType = "Update";
                TO.CompanyCode = Session["CompanyCode"].ToString();
                TO.PlantCode = Session["PlantCode"].ToString();
                TO.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Toollist>("api/UserSettings/Tooli_list_details", TO).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Tool_list", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Insert Operator details
        /// </summary>
        /// <param name="OP"></param>
        /// <returns></returns>
      
        /// <summary>
        /// Update Operator Details
        /// </summary>
        /// <param name="OP"></param>
        /// <returns></returns>
       
        /// <summary>
        /// Insert Shift Setting details
        /// </summary>
        /// <param name="S"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Insert_Shifts(Models.Shift S)
        {
            try
            {
                S.QueryType = "Insert";
                S.CompanyCode = Session["CompanyCode"].ToString();
                S.PlantCode = Session["PlantCode"].ToString();
                S.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Shift>("api/UserSettings/Shiftsettings_details", S).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Shift_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        /// <summary>
        /// Update Shift Setting details
        /// </summary>
        /// <param name="S"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Update_Shift(Models.Shift S)
        {
            try
            {
                S.QueryType = "Update";
                S.CompanyCode = Session["CompanyCode"].ToString();
                S.PlantCode = Session["PlantCode"].ToString();
                S.Line_Code = Session["LineCode"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Shift>("api/UserSettings/Shiftsettings_details", S).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Shift_settings", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }

        public ActionResult Target_Production(Models.usersettings U)
        {
            if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
            {

                U.Parameter = Session["PlantCode"].ToString();
                U.Parameter1 = Session["CompanyCode"].ToString();
                U.Parameter2 = Session["LineCode"].ToString();
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(Baseurl);
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/production_plan", U).Result;
                    List<Models.production_plan> DasList = new List<Models.production_plan>();
                    if (response.IsSuccessStatusCode)
                    {
                        var data = response.Content.ReadAsStringAsync().Result;
                        DasList = JsonConvert.DeserializeObject<List<Models.production_plan>>(data);
                        return View(DasList);
                    }
                    else
                    {
                        return RedirectToAction("Target_Production", "UserSettings");

                    }


                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

        [HttpPost]
        public async Task<ActionResult> Insert_tproduction(Models.production_setting A, FormCollection f)
        {
            try
            {
                A.querytype = "Insert";
                A.companycode = Session["CompanyCode"].ToString();
                A.plantcode = Session["PlantCode"].ToString();
                A.linecode = Session["LineCode"].ToString();
                A.fromdate = Convert.ToDateTime(Request.Form["start"]);
                A.todate = Convert.ToDateTime(Request.Form["end"]);
                //A.linecode = Request.Form["linecode"];
                A.productname = Request.Form["variantcode"];
                A.targetproduction = Request.Form["target"];
                A.shiftid = Request.Form["shiftcode"];
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.production_setting>("api/UserSettings/Production_setting", A).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Target_Production", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }
        [HttpPost]
        public async Task<ActionResult> Update_tproduction(Models.production_setting A, FormCollection f)
        {
            try
            {
                A.querytype = "Update";
                A.companycode = Session["CompanyCode"].ToString();
                A.plantcode = Session["PlantCode"].ToString();
                A.linecode = Session["LineCode"].ToString();
                A.fromdate = Convert.ToDateTime(Request.Form["estart"]);
                A.todate = Convert.ToDateTime(Request.Form["eend"]);
                //A.linecode = Request.Form["elinecode"];
                A.productname = Request.Form["evariantcode"];
                A.targetproduction = Request.Form["etarget"];
                A.shiftid = Request.Form["eshiftcode"];
                A.id = Convert.ToInt32(Request.Form["eid"]);
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.production_setting>("api/UserSettings/Production_setting", A).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                        return RedirectToAction("Target_Production", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }

        //return to view displaying ewon details
        public async Task<ActionResult> Ewon_Details(Models.usersettings U)
        {
            if (this.HasPermission("GatewayDetails-View"))
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
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        // details returned to edit ewon details
        [HttpPost]
        public async Task<ActionResult> Update_Ewon_Details(Models.Ewondetails details)
        {
            if (this.HasPermission("GatewayDetails-Edit"))
            {
                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        details.QueryType = "Update";
                        details.CompanyCode = Session["CompanyCode"].ToString();
                        details.PlantCode = Session["PlantCode"].ToString();
                        details.linecode = Session["LineCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.Ewondetails>("api/UserSettings/edit_update_Ewondetails", details).Result;
                                if (response.IsSuccessStatusCode)
                                {
                                    var res = response.Content.ReadAsStringAsync().Result;
                                    var msg = JsonConvert.DeserializeObject(res);
                                    TempData["message"] = msg;
                                }
                                return RedirectToAction("Ewon_Details", "UserSettings");
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }
        [HttpPost]
        public async Task<ActionResult> Add_Ewon_Details(Models.Ewondetails details)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    details.QueryType = "Insert";
                    details.CompanyCode = Session["CompanyCode"].ToString();
                    details.PlantCode = Session["PlantCode"].ToString();
                    details.linecode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Ewondetails>("api/UserSettings/edit_update_Ewondetails", details).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Ewon_Details", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }
        //[HttpPost]
        public async Task<ActionResult> UserGroup_settings(Models.usersettings U)
        {

            if (Session["CompanyCode"] != null)
            {
                try
                {
                    U.QueryType = "Groups_Users";
                    U.Parameter1 = Session["CompanyCode"].ToString();
                    U.Parameter = Session["PlantCode"].ToString();
                    U.Parameter2 = Session["LineCode"].ToString();
                    U.CompanyCode = Session["CompanyCode"].ToString();
                    U.PlantCode = Session["PlantCode"].ToString();
                    U.LineCode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Values/settings_details", U).Result;
                            List<Models.UserGroups> DasList = new List<Models.UserGroups>();
                            var data = response.Content.ReadAsStringAsync().Result;
                            DasList = JsonConvert.DeserializeObject<List<Models.UserGroups>>(data);
                            return View(DasList);
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

        //[HttpPost]
        //public async Task<ActionResult> Add_Groups_Users(List<PlanDigitization_web.Models.UserGroup_Allocation> permissions, List<PlanDigitization_web.Models.UserGroups> grp)
        //{
        //    if (Session["CompanyCode"] != null)
        //    {
        //        try
        //        {
        //            using (var client = new HttpClient())
        //            {

        //                client.BaseAddress = new Uri(Baseurl);
        //                client.DefaultRequestHeaders.Clear();
        //                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //                foreach (var groupdetails in grp)
        //                {
        //                    groupdetails.QueryType = groupdetails.QueryType;
        //                    groupdetails.CompanyCode = Session["CompanyCode"].ToString();
        //                    groupdetails.PlantCode = Session["PlantCode"].ToString();
        //                    groupdetails.Line_Code = Session["LineCode"].ToString();
        //                    var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
        //                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
        //                    var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
        //                    if (responseMessage.IsSuccessStatusCode)
        //                    {
        //                        HttpResponseMessage response = client.PostAsJsonAsync<Models.UserGroups>("api/UserSettings/Groupsusers_details", groupdetails).Result;

        //                        var res = response.Content.ReadAsStringAsync().Result;
        //                        var msg_total = JsonConvert.DeserializeObject(res);
        //                        var msg = "";
        //                        var grpid = "";
        //                        if (groupdetails.QueryType == "Insert")
        //                        {
        //                            grpid = msg_total.ToString().Substring(8);
        //                            msg = msg_total.ToString().Substring(0, 8);
        //                        }
        //                        if (groupdetails.QueryType == "Update")
        //                        {
        //                            grpid = msg_total.ToString().Substring(7);
        //                            msg = msg_total.ToString().Substring(0, 7);
        //                        }
        //                        TempData["message"] = msg;
        //                        if (msg.ToString() == "Inserted" || msg.ToString() == "Updated")
        //                        {
        //                            HttpResponseMessage response2 = client.PostAsJsonAsync<Models.UserGroups>("api/UserSettings/UserGroup_Deletion", groupdetails).Result;
        //                            if (permissions != null)
        //                            {
        //                                foreach (var permissiondetails in permissions)
        //                                {
        //                                    permissiondetails.QueryType = permissiondetails.QueryType;
        //                                    permissiondetails.CompanyCode = Session["CompanyCode"].ToString();
        //                                    permissiondetails.PlantCode = Session["PlantCode"].ToString();
        //                                    permissiondetails.LineCode = Session["LineCode"].ToString();
        //                                    permissiondetails.UserID = permissiondetails.UserID;
        //                                    permissiondetails.GroupID = grpid;
        //                                    HttpResponseMessage response1 = client.PostAsJsonAsync<Models.UserGroup_Allocation>("api/UserSettings/UserGroup_Allocation", permissiondetails).Result;
        //                                    if (response1.IsSuccessStatusCode)
        //                                    {
        //                                        var res1 = response1.Content.ReadAsStringAsync().Result;
        //                                        var msg1 = JsonConvert.DeserializeObject(res1);
        //                                        TempData["message"] = msg1;
        //                                    }
        //                                }
        //                            }

        //                        }
        //                    }
        //                    else
        //                    {
        //                        TempData["message"] = "Token is not valid";
        //                        return RedirectToAction("Login", "Main");
        //                    }
        //                }
        //                return Json("ok", JsonRequestBehavior.AllowGet);

        //            }
        //        }
        //        catch (Exception e)
        //        {
        //            Logger.Warn(e);
        //            return RedirectToAction("Error_Page", "Main");
        //        }
        //    }
        //    else
        //    {
        //        return RedirectToAction("Settings_err", "Main");
        //    }

        //}


        [HttpPost]
        public async Task<ActionResult> Add_Groups_Users(List<PlanDigitization_web.Models.UserGroup_Allocation> permissions, List<PlanDigitization_web.Models.UserGroups> grp)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    using (var client = new HttpClient())
                    {
                        var respon = "";
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.UserGroups>("api/UserSettings/Groupsusers_details", groupdetails).Result;

                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg_total = JsonConvert.DeserializeObject(res);
                                var msg = "";
                                var grpid = "";
                                if (groupdetails.QueryType == "Insert")
                                {
                                    grpid = msg_total.ToString().Substring(8);
                                    msg = msg_total.ToString().Substring(0, 8);
                                }
                                if (groupdetails.QueryType == "Update")
                                {
                                    grpid = msg_total.ToString().Substring(7);
                                    msg = msg_total.ToString().Substring(0, 7);
                                }
                                TempData["message"] = msg;
                                respon = msg.Trim();
                                if (msg.ToString() == "Inserted" || msg.ToString() == "Updated")
                                {
                                    HttpResponseMessage response2 = client.PostAsJsonAsync<Models.UserGroups>("api/UserSettings/UserGroup_Deletion", groupdetails).Result;
                                    if (permissions != null)
                                    {
                                        foreach (var permissiondetails in permissions)
                                        {
                                            permissiondetails.QueryType = permissiondetails.QueryType;
                                            permissiondetails.CompanyCode = Session["CompanyCode"].ToString();
                                            permissiondetails.PlantCode = Session["PlantCode"].ToString();
                                            permissiondetails.LineCode = Session["LineCode"].ToString();
                                            permissiondetails.UserID = permissiondetails.UserID;
                                            permissiondetails.GroupID = grpid;
                                            HttpResponseMessage response1 = client.PostAsJsonAsync<Models.UserGroup_Allocation>("api/UserSettings/UserGroup_Allocation", permissiondetails).Result;
                                            if (response1.IsSuccessStatusCode)
                                            {
                                                var res1 = response1.Content.ReadAsStringAsync().Result;
                                                var msg1 = JsonConvert.DeserializeObject(res1);
                                                TempData["message"] = msg1;
                                                respon = TempData["message"].ToString();
                                            }
                                        }
                                    }

                                }
                            }
                            else
                            {
                                TempData["message"] = "Token is not valid";
                                return RedirectToAction("Login", "Main");
                            }
                        }
                        return Json(respon, JsonRequestBehavior.AllowGet);

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
        public ActionResult Set_MachineCode(string id)
        {
            Session["Machine_code"] = id;
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Set_ShiftID(string id)
        {
            Session["ShiftID"] = id;
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetMachShift()
        {
            var machine_code = Session["Machine_code"].ToString();
            var shiftid = Session["ShiftID"].ToString();
            var result = new { machine_code = machine_code, shiftid = shiftid };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
       
        
       


        public async Task<ActionResult> Area_settings(Models.usersettings U)
        {
            if (this.HasPermission("AreaSetting-View"))
            {

                if (Session["CompanyCode"] != null)

                {
                    try
                    {
                        U.QueryType = "Area_details";
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter = Session["PlantCode"].ToString();
                        //U.Parameter2 = Session["LineCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        //  U.LineCode = Session["LineCode"].ToString();

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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                                List<Models.Area> DasList = new List<Models.Area>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Area>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }



        [HttpPost]
        public async Task<ActionResult> Add_Area(Models.Area area)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    area.QueryType = "Insert";
                    area.CompanyCode = Session["CompanyCode"].ToString();
                    area.PlantCode = Session["PlantCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Area>("api/UserSettings/Area_details", area).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Area_settings", "UserSettings");
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
        public async Task<ActionResult> Update_area(Models.Area area)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    area.QueryType = "Update";
                    area.CompanyCode = Session["CompanyCode"].ToString();
                    area.PlantCode = Session["PlantCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Area>("api/UserSettings/Area_details", area).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Area_settings", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

        public async Task<ActionResult> Subassembly_settings(Models.usersettings U)
        {
            if (this.HasPermission("SubassemblySetting-View"))
            {
                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        U.QueryType = "Subassembly_details";
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter = Session["PlantCode"].ToString();
                        U.Parameter2 = Session["LineCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        U.LineCode = Session["LineCode"].ToString();

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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Values/settings_details", U).Result;
                                List<Models.Subassembly> DasList = new List<Models.Subassembly>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Subassembly>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }
        }

        //add subassembly

        [HttpPost]
        public async Task<ActionResult> Add_Subassembly(Models.Subassembly sub)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    sub.QueryType = "Insert";
                    sub.CompanyCode = Session["CompanyCode"].ToString();
                    sub.PlantCode = Session["PlantCode"].ToString();
                    sub.LineCode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Subassembly>("api/UserSettings/Subassembly_details", sub).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Subassembly_settings", "UserSettings");
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
        public async Task<ActionResult> Update_Subassembly(Models.Subassembly sub)
        {
            if (Session["CompanyCode"] != null)
            {
                try
                {
                    sub.QueryType = "Update";
                    sub.CompanyCode = Session["CompanyCode"].ToString();
                    sub.PlantCode = Session["PlantCode"].ToString();
                    sub.LineCode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Subassembly>("api/UserSettings/Subassembly_details", sub).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Subassembly_settings", "UserSettings");
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
                    Logger.Warn(e);
                    return RedirectToAction("Error_Page", "Main");
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

        public ActionResult EmployeeLineRole()
        {
            return View();
        }


        public async Task<ActionResult> EmployeeLinePermission(Models.usersettings U)
        {
            if (this.HasPermission("LineRoleSetting-View"))
            {

                if (Session["CompanyCode"] != null)
                {
                    try
                    {
                        U.QueryType = "LineRole_details";
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter = Session["PlantCode"].ToString();
                        //U.Parameter2 = Session["LineCode"].ToString();
                        //U.CompanyCode = Session["CompanyCode"].ToString();
                        //U.PlantCode = Session["PlantCode"].ToString();
                        //U.LineCode = Session["LineCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/settings_details", U).Result;
                                List<Models.Roles> DasList = new List<Models.Roles>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Roles>>(data);
                                return View(DasList);
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
                        Logger.Warn(e);
                        return RedirectToAction("Error_Page", "Main");
                    }
                }
                else
                {
                    return RedirectToAction("Settings_err", "Main");
                }
            }
            else
            {
                return RedirectToAction("Unauth_page", "Main");
            }

        }

        [HttpPost]
        public async Task<ActionResult> Add_Line_Permission(List<PlanDigitization_web.Models.Line_Permission> permissions, List<PlanDigitization_web.Models.Roles> role)
        {

            if (Session["CompanyCode"] != null)
            {
                try
                {
                    //if (permissions == null)
                    //{
                    //    TempData["msg"] = "No Line Selected";
                    //    return RedirectToAction("EmployeeLinePermission", "UserSettings");
                    //}
                    using (var client = new HttpClient())
                    {

                        client.BaseAddress = new Uri(Baseurl);
                        client.DefaultRequestHeaders.Clear();
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        foreach (var roledetails in role)
                        {
                            roledetails.QueryType = roledetails.QueryType;
                            roledetails.CompanyCode = Session["CompanyCode"].ToString();
                            roledetails.PlantCode = Session["PlantCode"].ToString();
                            // roledetails.Line_Code = Session["LineCode"].ToString();
                            var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                            var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");
                            if (responseMessage.IsSuccessStatusCode)
                            {
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.Roles>("api/UserSettings/Line_Roles_details", roledetails).Result;

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

                                TempData["message"] = msg;

                                if (msg.ToString() == "Inserted" || msg.ToString() == "Updated")
                                {

                                    //if(roledetails.QueryType=="Update")
                                    // {
                                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                                    var responseMessagedel = await client.GetAsync("api/UserSettings/GetEmployee");
                                    usersettings us = new usersettings();
                                    us.QueryType = "Delete_Permissions_edit";
                                    us.Parameter = roledetails.RoleID;
                                    HttpResponseMessage responsedel = client.PostAsJsonAsync<Models.usersettings>("api/UserSettings/delete_User_settings_details", us).Result;
                                    if (responsedel.IsSuccessStatusCode)
                                    {
                                        foreach (var permissiondetails in permissions)
                                        {
                                            permissiondetails.QueryType = permissiondetails.QueryType;
                                            permissiondetails.RoleID = grpid;
                                            permissiondetails.CompanyCode = Session["CompanyCode"].ToString();
                                            HttpResponseMessage response1 = client.PostAsJsonAsync<Models.Line_Permission>("api/UserSettings/Line_Permission_details", permissiondetails).Result;
                                            if (response1.IsSuccessStatusCode)
                                            {
                                                var res1 = response1.Content.ReadAsStringAsync().Result;
                                                var msg1 = JsonConvert.DeserializeObject(res1);
                                                TempData["message"] = msg1;
                                            }
                                        }
                                    }
                                    //}


                                }
                            }
                            else
                            {
                                TempData["message"] = "Token is not valid";
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

        //Cycle Time Settings
        public async Task<ActionResult> cycletime_settings(Models.usersettings U)
        {
            if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
            {
                if (this.HasPermission("CycleTimeSetting-View"))
                {
                    try
                    {
                        U.QueryType = "Get_cycle_time";
                        U.Parameter = Session["PlantCode"].ToString();
                        U.Parameter1 = Session["CompanyCode"].ToString();
                        U.Parameter2 = Session["LineCode"].ToString();
                        U.CompanyCode = Session["CompanyCode"].ToString();
                        U.PlantCode = Session["PlantCode"].ToString();
                        U.LineCode = Session["LineCode"].ToString();
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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Values/settings_details", U).Result;
                                List<Models.Cycletime_setting> DasList = new List<Models.Cycletime_setting>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.Cycletime_setting>>(data);
                                return View(DasList);
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
        public async Task<ActionResult> Insert_Update_CycleTime(Models.Cycletime_setting Cy)
        {
            if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
            {
                Cy.CompanyCode = Session["CompanyCode"].ToString();
                Cy.PlantCode = Session["PlantCode"].ToString();
                Cy.Line_Code = Session["LineCode"].ToString();
                Cy.Status = "Y";

                var chk_value = Cy.if_applicable;
                var cycle_val = string.Empty;

                //if (Cy.QueryType == "Insert")
                //{
                //    if (chk_value != "Y")
                //    {
                //        Cy.Cycle_time = "0";
                //    }
                //}

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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.Cycletime_setting>("api/UserSettings/Cycle_time_details", Cy).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("cycletime_settings", "UserSettings");
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
        public ActionResult Insert_CycleTime(Models.Cycletime_setting Cy)
        {

            if (Session["CompanyCode"] != null || Session["PlantCode"] != null)
            {
                try
                {
                    var messgae = string.Empty;

                    using (var client = new HttpClient())
                    {
                        client.BaseAddress = new Uri(Baseurl);
                        client.DefaultRequestHeaders.Clear();
                        var user1 = Session["Token"].ToString() + ':' + Session["UserName"];

                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Cycletime_setting>("api/UserSettings/Cycle_time_details", Cy).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);

                            messgae = msg.ToString();
                        }
                        return Json(messgae, JsonRequestBehavior.AllowGet);
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }






        [HttpPost]
        public async Task<ActionResult> Show_holiday(Models.Customer Cus)
        {

            //Cus.CompanyCode = Session["CompanyCode"].ToString();
            //Cus.PlantID = Session["PlantCode"].ToString();
            //Cus.LineCode = Session["LineCode"].ToString();
            Cus.CompanyCode = Session["CompanyCode"].ToString();
            if (Session["PlantCode"] != null)
            {
                Cus.PlantID = Session["PlantCode"].ToString();
            }
            if (Session["LineCode"] != null)
            {
                Cus.LineCode = Session["LineCode"].ToString();
            }

            var return_msg = string.Empty;

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
                    HttpResponseMessage loginres = client.PostAsJsonAsync<Models.Customer>("api/UserSettings/Show_Holiday_details", Cus).Result;
                    List<Models.Customer> DasList = new List<Models.Customer>();
                    if (loginres.IsSuccessStatusCode)
                    {
                        var myString = loginres.Content.ReadAsStringAsync().Result;

                        Session["Holiday"] = myString;

                        var customer_data = myString.Trim('"');



                        if (customer_data == "")
                        {
                            return_msg = "";
                        }
                        else if (customer_data == "1")
                        {
                            return_msg = "Production is not started";
                        }
                        else if (customer_data == "2")
                        {
                            return_msg = "Sunday";
                        }
                        else
                        {
                            return_msg = "Holiday :" + customer_data;
                        }


                    }
                }
                else
                {
                    TempData["message"] = "Token is not valid";
                    return RedirectToAction("Login", "Main");
                }
            }

            return Json(return_msg, JsonRequestBehavior.AllowGet);

        }





        public ActionResult download_sample_sheet()
        {
            if (Session["UserName"] != null)
            {
                try
                {
                    string path = "~/samples/alarm_sample_sheet.xls";
                    return File(path, "application/vnd.ms-excel", "alarm_sample_sheet.xls");
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            else
            {
                return RedirectToAction("Login", "Main");
            }
        }

        [HttpPost]
        public async Task<ActionResult> DownloadExcel(Models.usersettings U)
        {

            U.QueryType = "Get_alarm_details";
            U.Parameter1 = Session["PlantCode"].ToString();
            U.Parameter = Session["CompanyCode"].ToString();
            U.Parameter2 = Session["LineCode"].ToString();
            U.CompanyCode = Session["CompanyCode"].ToString();
            U.PlantCode = Session["PlantCode"].ToString();
            U.LineCode = Session["LineCode"].ToString();
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
                    HttpResponseMessage response = client.PostAsJsonAsync<Models.usersettings>("api/Values/Download_Search_details", U).Result;
                    List<Models.Alarm> DasList = new List<Models.Alarm>();
                    var data = response.Content.ReadAsStringAsync().Result;
                    DasList = JsonConvert.DeserializeObject<List<Models.Alarm>>(data);
                    //return View(DasList);

                    DataTable dt = new DataTable("Grid");
                    dt.Columns.AddRange(new DataColumn[5] { new DataColumn("Alarm ID"),
                                                     new DataColumn("Alarm Description"),
                                                     new DataColumn("Asset Name"),
                                                     new DataColumn("Function Name"),
                                                     new DataColumn("File Name")
                                                   });

                    foreach (var insurance in DasList)
                    {
                        dt.Rows.Add(insurance.Alarm_ID, insurance.Alarm_Description, insurance.AssetName, insurance.FunctionName, insurance.FileName);
                    }

                    using (XLWorkbook wb = new XLWorkbook())
                    {
                        wb.Worksheets.Add(dt);
                        using (MemoryStream stream = new MemoryStream())
                        {
                            wb.SaveAs(stream);
                            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Alarm_details.xlsx");
                        }
                    }

                }
            }
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        public void DlteUploadexcl()
        {
            DirectoryInfo d = new DirectoryInfo(Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/upload_excel/")));//Assuming Test is your Folder
            FileInfo[] Files = d.GetFiles(); //Getting Text files

            foreach (FileInfo file11 in d.EnumerateFiles())
            {
                if (file11 != null)
                {
                    try
                    {
                        file11.Delete();
                    }
                    catch (IOException ex)
                    {

                    }
                }

            }
        }



        public async Task<ActionResult> Insert_Production(Models.Production P)
        {

            P.QueryType = "Insert";
            P.CompanyCode = Session["CompanyCode"].ToString();
            P.PlantCode = Session["PlantCode"].ToString();
            P.Line_Code = Session["LineCode"].ToString();




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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Production>("api/UserSettings/Target_Production", P).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                            TempData["SelectedShift"] = P.Shift;
                        }
                        return RedirectToAction("TargetProductionPlan", "UserSettings");
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
                Logger.Warn(e);
                return RedirectToAction("Error_Page", "Main");
            }
        }




        public ActionResult TargetProductionPlan()
        {
            if (this.HasPermission("TargetProductionPlan-View"))
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
                return RedirectToAction("Unauth_page", "Main");

            }
        }



    }
}
