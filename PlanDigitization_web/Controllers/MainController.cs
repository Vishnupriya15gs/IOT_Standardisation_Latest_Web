using CaptchaMvc.HtmlHelpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog;
using System;
using System.Collections.Generic;
using System.EnterpriseServices.CompensatingResourceManager;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.SessionState;


namespace PlanDigitization_web.Controllers
{

    public class MainController : Controller
    {
        public readonly Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];
        static string key { get; set; } = "A!9HHhi%XjjYY4YP2@Nob009X";

        //View Login Page
        public ActionResult Login()
        {
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
            Response.Cache.SetNoStore();

            return View();
        }

        //public string GetCookieValueOrDefault(string cookieName)
        //{

        //    var cookie = Request.Cookies[cookieName];
        //    cookie.Secure = true;
        //    cookie.HttpOnly = true;
        //    cookie.Path += ";SameSite=Strict";

        //    //cookie.Expires = DateTime.Now.AddMinutes(-1);
        //    if (cookie == null)
        //    {
        //        return "";
        //    }
        //    return cookie.Value;
        //}


        HttpCookie cookie = new HttpCookie("UserName");

        public string GetCookieValueOrDefault(string cookieName)
        {

            HttpCookie cookie = Request.Cookies[cookieName];
            Response.Cookies.Add(cookie);
            if (cookie == null)
            {
                return "";
            }
            return cookie.Value;
        }

        //public ActionResult otplogin()
        //{
        //    return View();
        //}




        public ActionResult otplogin()
        {
            return View();
        }

        public ActionResult NewDashboard(Models.Loginmodel lo)
        {
            //if (Session["S_id"].ToString() != null)
            //{
            //    if (Session["S_id"].ToString() != Request.Cookies["ASP.NET_SessionId"].Value)
            //    {
            //        Response.Cookies["ASP.NET_SessionId"].Value = Request.Cookies["ASP.NET_SessionId"].Value + GenerateHashKey();
            //    }
            //    else
            //    {

            //    }
            //}
            //if (Response.Cookies["ASP.NET_SessionId"] != null)
            //{
            //    Response.Cookies["ASP.NET_SessionId"].Value = Request.Cookies["ASP.NET_SessionId"].Value + GenerateHashKey();
            //}
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }


            // //var uid = Session["UserID"].ToString();
            // var authto = Session["AuthToken"].ToString();
            // string[] stringSeparators = new string[] { "." };
            // string[] names = authto.Split(stringSeparators, StringSplitOptions.None);
            //if(uid == names[1])
            // {
            //     return View();
            // }
            // else
            // {
            //     return RedirectToAction("Login", "Main");
            // }
            //if (Session["UserID"] != null && Session["AuthToken"] != null)
            //{
            //    if ((Session["AuthToken"].ToString().Equals(Request.Cookies["ASP.NET_SessionID"].Value)))
            //    {
            //        return View();
            //    }
            //    else
            //    {
            //        return RedirectToAction("Login", "Main");
            //    }
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Main");
            //}
            //return View();
            // ------ UUID (random ids)-------
            //lo.UserName = Session["UserName"].ToString();
            //var sesid = Session["UserSessionId"];
            ////var sesid = Request.Cookies["ASP.NET_SessionID"].Value;
            //lo.UserSessionId = sesid.ToString();

            //using (var client = new HttpClient())
            //{
            //    client.BaseAddress = new Uri(Baseurl);
            //    client.DefaultRequestHeaders.Clear();
            //    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //    HttpResponseMessage response = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/CheckSessionId", lo).Result;

            //        var res = response.Content.ReadAsStringAsync().Result;
            //        Models.Loginmodelres loginmodelres = new JavaScriptSerializer().Deserialize<Models.Loginmodelres>(res);

            //        JObject json = JObject.Parse(res);
            //        var loginmessage = json["loginstatus"].ToString();
            //    if (loginmessage == "Not Applicable")
            //    {
            //        return View();

            //    }
            //    else
            //    {
            //        return RedirectToAction("Login", "Main");
            //    }
            //}
            //string randomHash = GetCookieValueOrDefault("UserID");
            //if (randomHash != "")
            //{
            //    try
            //    {
            //        return View();
            //    }
            //    catch (Exception ex)
            //    {
            //        throw ex;
            //    }
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Main");
            //}


        }


        //View Dashboard
        public ActionResult Dashboard(Models.Loginmodel lo)
        {
            //if (Session["S_id"].ToString() != null)
            //{
            //    if (Session["S_id"].ToString() != Request.Cookies["ASP.NET_SessionId"].Value)
            //    {
            //        Response.Cookies["ASP.NET_SessionId"].Value = Request.Cookies["ASP.NET_SessionId"].Value + GenerateHashKey();
            //    }
            //    else
            //    {

            //    }
            //}
            //if (Response.Cookies["ASP.NET_SessionId"] != null)
            //{
            //    Response.Cookies["ASP.NET_SessionId"].Value = Request.Cookies["ASP.NET_SessionId"].Value + GenerateHashKey();
            //}
            // return View();

            string randomHash = GetCookieValueOrDefault("UserID");
            if (randomHash != "")
            {
                try
                {
                    return View();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return RedirectToAction("Login", "Main");
            }


            // //var uid = Session["UserID"].ToString();
            // var authto = Session["AuthToken"].ToString();
            // string[] stringSeparators = new string[] { "." };
            // string[] names = authto.Split(stringSeparators, StringSplitOptions.None);
            //if(uid == names[1])
            // {
            //     return View();
            // }
            // else
            // {
            //     return RedirectToAction("Login", "Main");
            // }
            //if (Session["UserID"] != null && Session["AuthToken"] != null)
            //{
            //    if ((Session["AuthToken"].ToString().Equals(Request.Cookies["ASP.NET_SessionID"].Value)))
            //    {
            //        return View();
            //    }
            //    else
            //    {
            //        return RedirectToAction("Login", "Main");
            //    }
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Main");
            //}
            //return View();
            // ------ UUID (random ids)-------
            //lo.UserName = Session["UserName"].ToString();
            //var sesid = Session["UserSessionId"];
            ////var sesid = Request.Cookies["ASP.NET_SessionID"].Value;
            //lo.UserSessionId = sesid.ToString();

            //using (var client = new HttpClient())
            //{
            //    client.BaseAddress = new Uri(Baseurl);
            //    client.DefaultRequestHeaders.Clear();
            //    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //    HttpResponseMessage response = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/CheckSessionId", lo).Result;

            //        var res = response.Content.ReadAsStringAsync().Result;
            //        Models.Loginmodelres loginmodelres = new JavaScriptSerializer().Deserialize<Models.Loginmodelres>(res);

            //        JObject json = JObject.Parse(res);
            //        var loginmessage = json["loginstatus"].ToString();
            //    if (loginmessage == "Not Applicable")
            //    {
            //        return View();

            //    }
            //    else
            //    {
            //        return RedirectToAction("Login", "Main");
            //    }
            //}
            //string randomHash = GetCookieValueOrDefault("UserID");
            //if (randomHash != "")
            //{
            //    try
            //    {
            //        return View();
            //    }
            //    catch (Exception ex)
            //    {
            //        throw ex;
            //    }
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Main");
            //}


        }

        private string GenerateHashKey()
        {
            StringBuilder myStr = new StringBuilder();
            myStr.Append(Request.Browser.Browser);
            myStr.Append(Request.Browser.Platform);
            myStr.Append(Request.Browser.MajorVersion);
            myStr.Append(Request.Browser.MinorVersion);
            //myStr.Append(Request.LogonUserIdentity.User.Value);
            SHA1 sha = new SHA1CryptoServiceProvider();
            byte[] hashdata = sha.ComputeHash(Encoding.UTF8.GetBytes(myStr.ToString()));
            return Convert.ToBase64String(hashdata);
        }
        public ActionResult Settings_err()
        {
            return View();
        }

        //View Forgot Password
        public ActionResult Forgot()
        {
            return View();
        }

        //View Change Password
        public ActionResult ChangePassword()
        {
            return View();
        }

        public ActionResult Logout()
        {

            Response.Cookies["UserID"].Value = "";
            Session["CompanyCode"] = "";
            Session["CompanyName"] = "";
            Session["LineCode"] = "";
            Session["UserID"] = "";
            Session["UserName"] = "";
            Session["User_Function"] = "";
            Session["IsSuperAdmin"] = "";
            Session["Role"] = "";
            Session["PlantCode"] = "";
            Session["Token"] = "";
            Session["CustomerLogo"] = null;
            Session["Email"] = "";
            Session["toggle"] = '0';
            return RedirectToAction("Login", "Main");

        }

        public ActionResult Toggleadmin()
        {
            Session["toggle"] = '1';
            //Session["UserName"] = "dineshbuba@gmail.com";
            return Json("1", JsonRequestBehavior.AllowGet);
        }
        public ActionResult Toggleadminuncheck()
        {
            Session["toggle"] = '0';
            return RedirectToAction("NewDash", "Main");
        }


        public async Task<ActionResult> Checklogin(Models.Loginmodel lo)
        {
            //if (this.IsCaptchaValid("Validate your captcha"))
            //{
            //TempData["lockno"] = 0;
            //TempData["time"] = DateTime.Now;
            //DateTime begin1 = DateTime.Now.AddHours(5);
            //DateTime begin2 = begin1.AddMinutes(30);
            //Session["Currentlogin"] = begin2.ToString("dd-mm-yyyy HH:mm:ss");

            Response.Cookies["UserID"].Value = string.Empty;
            Session["CompanyCode"] = string.Empty;
            Session["CompanyName"] = string.Empty;
            Session["LineCode"] = string.Empty;
            Session["UserID"] = string.Empty;
            Session["UserName"] = string.Empty;
            Session["User_Function"] = string.Empty;
            Session["IsSuperAdmin"] = string.Empty;
            Session["Role"] = string.Empty;
            Session["PlantCode"] = string.Empty;
            Session["Token"] = string.Empty;
            Session["CustomerLogo"] = null;
            Session["Email"] = string.Empty;


            //if ((Convert.ToInt32(Session["lockno"]) == 5) && (DateTime.Now) <= Convert.ToDateTime(Session["time"]))
            //{
            //    var diff = (Convert.ToInt32(Convert.ToDateTime(Session["time"]).ToString("mm"))) - (Convert.ToInt32(DateTime.Now.ToString("mm")));
            //    TempData["message"] = "Your account is locked.Retry after " + diff + " minutes.";
            //    return View("Login");
            //}
            try
            {
                var tokenbased = string.Empty;

                using (var client = new HttpClient())
                {
                    //DateTime begin = DateTime.Now.AddHours(5);

                    // lo.lastlogin = begin.AddMinutes(30).ToString("yyyy-mm-dd HH:mm:ss");
                    lo.lastlogin = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                    client.BaseAddress = new Uri(Baseurl);
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    HttpResponseMessage response = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/Check_login", lo).Result;
                    // var response = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/Check_login", lo).Result;
                    if (response.IsSuccessStatusCode)
                    {
                        var res = response.Content.ReadAsStringAsync().Result;
                        Models.Loginmodelres loginmodelres = new JavaScriptSerializer().Deserialize<Models.Loginmodelres>(res);

                        JObject json = JObject.Parse(res);
                        var loginmessage = json["loginstatus"].ToString();

                        JObject json1 = JObject.Parse(res);
                        var lastloginres = json1["lastlogindate"].ToString();
                        JObject json2 = JObject.Parse(res);
                        var Token = json1["token"].ToString();


                        //Models.Loginmodelres loginmodelres = new JavaScriptSerializer().Deserialize<Models.Loginmodelres>(res);

                        //TempData["message"] = loginmessage;

                        //TempData["message"] = lastloginres;

                        TempData["message"] = loginmessage;

                        List<Models.login> DasList = new List<Models.login>();

                        if (loginmessage == "Login Successfull...!")
                        {
                            //HttpContext.Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
                            string userSession = Guid.NewGuid().ToString();
                            //var sesid = Request.Cookies["ASP.NET_SessionID"].Value;
                            //Response.Cookies.Add(new HttpCookie("ASP.NET_SessionID", ""));
                            //Response.Cookies["ASP.NET_SessionID"].Value = userSession;
                            //Session["AuthToken"] = userSession + Session["UserID"];
                            //var va = Request.Cookies["ASP.NET_SessionID"].Value;
                            //var va1 = Session["AuthToken"];
                            //Response.Cookies.Add(new HttpCookie("AuthToken", userSession));
                            //lo.UserName = Session["UserName"].ToString();
                            lo.UserSessionId = userSession;
                            //HttpResponseMessage sessionres = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/InsertSessionId", lo).Result;
                            //if (sessionres.IsSuccessStatusCode)
                            //{
                            Session["Token"] = Token;
                            HttpCookie TId = new HttpCookie("TId");
                            TId.Value = Token;
                            TId.HttpOnly = false;
                            TId.SameSite = SameSiteMode.Lax;
                            TId.Expires.Add(new TimeSpan(0, 1, 0));
                            Response.Cookies.Add(TId);
                            Session["S_id"] = Request.Cookies["ASP.NET_SessionId"].Value;
                            var user1 = Token + ':' + lo.UserName;

                            client.DefaultRequestHeaders.Clear();
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
                            var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");

                            //HttpResponseMessage response1 = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/GetEmployee",).Result;
                            if (responseMessage.IsSuccessStatusCode)
                            {
                                HttpResponseMessage loginres = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/Get_Login_details", lo).Result;
                                if (loginres.IsSuccessStatusCode)
                                {
                                    var login_data = loginres.Content.ReadAsStringAsync().Result;
                                    DasList = JsonConvert.DeserializeObject<List<Models.login>>(login_data);

                                    //Response.Cookies["UserID"].Value = DasList[0].UserID;

                                    //HttpCookie cookie = Request.Cookies["UserID"];
                                    //cookie.Secure = true;
                                    //cookie.HttpOnly = true;
                                    Session["CompanyCode"] = DasList[0].CompanyCode;
                                    Session["CompanyName"] = DasList[0].CompanyName;
                                    Session["Currentlogin"] = DasList[0].CurrentLoginDate;
                                    Session["UserID"] = DasList[0].UserID;
                                    Session["UserName"] = DasList[0].UserName;
                                    HttpCookie Usercheck = new HttpCookie("Usercheck");
                                    Usercheck.Value = DasList[0].UserName;
                                    Usercheck.HttpOnly = false;
                                    Usercheck.SameSite = SameSiteMode.Lax;
                                    Usercheck.Expires.Add(new TimeSpan(0, 1, 0));
                                    Response.Cookies.Add(Usercheck);
                                    Session["User_Function"] = DasList[0].User_Function;
                                    Session["IsSuperAdmin"] = DasList[0].IsSuperAdmin;
                                    Session["Role"] = DasList[0].RoleName;
                                    Session["PlantCode"] = DasList[0].PlantCode;
                                    Session["LineCode"] = DasList[0].Line_Code;
                                    Session["CustomerLogo"] = null;
                                    Session["toggle"] = '0';

                                    if (DasList[0].Logo != null)
                                    {
                                        if (DasList[0].Logo.ToString() != "")
                                        {
                                            Session["CustomerLogo"] = DasList[0].Logo;
                                        }
                                        else
                                        {
                                            Session["CustomerLogo"] = null;
                                        }
                                    }
                                    else
                                    {
                                        Session["CustomerLogo"] = null;
                                    }
                                    Session["Email"] = DasList[0].Email;
                                    //Session["lastlogin"] = loginmodelres.lastlogindate.ToString();
                                    Session["lastlogin"] = lastloginres;
                                    DateTime dt2 = Convert.ToDateTime(DasList[0].CurrentLoginDate);

                                    Session["Currentlogin"] = dt2;
                                    HttpCookie Lastlogin = new HttpCookie("Lastlogin");
                                    Lastlogin.Value = lastloginres;
                                    Lastlogin.HttpOnly = false;
                                    Lastlogin.SameSite = SameSiteMode.Lax;
                                    Lastlogin.Expires.Add(new TimeSpan(0, 1, 0));
                                    Response.Cookies.Add(Lastlogin);
                                    Session["IsAdmin"] = DasList[0].IsAdmin;

                                    string _browserInfo = Request.Browser.Browser
                                                            + Request.Browser.Version
                                                            + Request.UserAgent + "~"
                                                             + Request.ServerVariables["REMOTE_ADDR"];

                                    string _sessionValue = Convert.ToString(Session["UserID"]) + "^"
                                                            + DateTime.Now.Ticks + "^"
                                                            + _browserInfo + "^"
                                                            + System.Guid.NewGuid();


                                    byte[] _encodeAsBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(_sessionValue);
                                    string _encryptedString = System.Convert.ToBase64String(_encodeAsBytes);
                                    Session["encryptedSession"] = _encryptedString;

                                }
                            }

                            else
                            {
                                TempData["message"] = "Session Timeout";
                                return View("Login");
                            }

                            Session["AuthToken"] = userSession + "." + Session["UserID"];

                            var va1 = Session["AuthToken"];
                            //}
                        }
                        else
                        {
                            int temp = Convert.ToInt32(Session["lockno"]);
                            temp = temp + 1;
                            Session["lockno"] = temp;
                            var temp2 = Session["lockno"];
                            Session["time"] = DateTime.Now.AddMinutes(5);
                            var temp3 = Session["time"];

                            Logger.Warn("Login Failed for user");
                            TempData["message1"] = "Attempt " + Session["lockno"] + "of 5";
                        }
                        //TempData["message"] = "Test1";
                        return View("Login");
                    }
                    //}
                    //TempData["message"] = "Test2";
                    return View("Login");
                }
            }
            catch (Exception e)
            {
                Logger.Warn(e);
                return RedirectToAction("Error", "Home");
                //return Redirect("~/Views/Shared/Error.cshtml");

            }
            //}
            //else
            //{
            //    TempData["message"] = "Please enter the captcha";
            //    return View("Login");
            //}
        }





        //public async Task<ActionResult> Checklogin(Models.Loginmodel lo)
        //{
        //    if (this.IsCaptchaValid("Validate your captcha"))
        //    {
        //        //TempData["lockno"] = 0;
        //        //TempData["time"] = DateTime.Now;
        //        if ((Convert.ToInt32(Session["lockno"]) == 5) && (DateTime.Now) <= Convert.ToDateTime(Session["time"]))
        //        {
        //            var diff = (Convert.ToInt32(Convert.ToDateTime(Session["time"]).ToString("mm"))) - (Convert.ToInt32(DateTime.Now.ToString("mm")));
        //            TempData["message"] = "Your account is locked.Retry after " + diff + " minutes.";
        //            return View("Login");
        //        }
        //        try
        //        {
        //            var tokenbased = string.Empty;

        //            using (var client = new HttpClient())
        //            {

        //                lo.lastlogin = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        //                client.BaseAddress = new Uri(Baseurl);
        //                client.DefaultRequestHeaders.Clear();
        //                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        //                HttpResponseMessage response = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/Check_login", lo).Result;
        //                // var response = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/Check_login", lo).Result;
        //                if (response.IsSuccessStatusCode)
        //                {
        //                    var res = response.Content.ReadAsStringAsync().Result;
        //                    Models.Loginmodelres loginmodelres = new JavaScriptSerializer().Deserialize<Models.Loginmodelres>(res);

        //                    JObject json = JObject.Parse(res);
        //                    var loginmessage = json["loginstatus"].ToString();

        //                    JObject json1 = JObject.Parse(res);
        //                    var lastloginres = json1["lastlogindate"].ToString();
        //                    JObject json2 = JObject.Parse(res);
        //                    var Token = json1["token"].ToString();


        //                    //Models.Loginmodelres loginmodelres = new JavaScriptSerializer().Deserialize<Models.Loginmodelres>(res);

        //                    TempData["message"] = loginmessage;
        //                    //TempData["message"] = lastloginres;
        //                    List<Models.login> DasList = new List<Models.login>();

        //                    if (loginmessage == "Login Successfull...!")
        //                    {
        //                        //HttpContext.Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
        //                        string userSession = Guid.NewGuid().ToString();
        //                        //var sesid = Request.Cookies["ASP.NET_SessionID"].Value;
        //                        //Response.Cookies.Add(new HttpCookie("ASP.NET_SessionID", ""));
        //                        //Response.Cookies["ASP.NET_SessionID"].Value = userSession;
        //                        //Session["AuthToken"] = userSession + Session["UserID"];
        //                        //var va = Request.Cookies["ASP.NET_SessionID"].Value;
        //                        //var va1 = Session["AuthToken"];
        //                        //Response.Cookies.Add(new HttpCookie("AuthToken", userSession));
        //                        //lo.UserName = Session["UserName"].ToString();
        //                        lo.UserSessionId = userSession;
        //                        //HttpResponseMessage sessionres = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/InsertSessionId", lo).Result;
        //                        //if (sessionres.IsSuccessStatusCode)
        //                        //{
        //                        Session["Token"] = Token;
        //                        Session["S_id"] = Request.Cookies["ASP.NET_SessionId"].Value;
        //                        var user1 = Token + ':' + lo.UserName;

        //                        client.DefaultRequestHeaders.Clear();
        //                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());
        //                        var responseMessage = await client.GetAsync("api/UserSettings/GetEmployee");

        //                        //HttpResponseMessage response1 = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/GetEmployee",).Result;
        //                        if (responseMessage.IsSuccessStatusCode)
        //                        {
        //                            HttpResponseMessage loginres = client.PostAsJsonAsync<Models.Loginmodel>("api/UserSettings/Get_Login_details", lo).Result;
        //                            if (loginres.IsSuccessStatusCode)
        //                            {
        //                                var login_data = loginres.Content.ReadAsStringAsync().Result;
        //                                DasList = JsonConvert.DeserializeObject<List<Models.login>>(login_data);

        //                                //Response.Cookies["UserID"].Value = DasList[0].UserID;

        //                                //HttpCookie cookie = Request.Cookies["UserID"];
        //                                //cookie.Secure = true;
        //                                //cookie.HttpOnly = true;
        //                                Session["CompanyCode"] = DasList[0].CompanyCode;
        //                                Session["UserID"] = DasList[0].UserID;
        //                                Session["UserName"] = DasList[0].UserName;
        //                                Session["User_Function"] = DasList[0].User_Function;
        //                                Session["IsSuperAdmin"] = DasList[0].IsSuperAdmin;
        //                                Session["Role"] = DasList[0].RoleName;
        //                                Session["PlantCode"] = DasList[0].PlantCode;
        //                                Session["LineCode"] = DasList[0].Line_Code;
        //                                Session["CustomerLogo"] = null;
        //                                if (DasList[0].Logo != null)
        //                                {
        //                                    if (DasList[0].Logo.ToString() != "")
        //                                    {
        //                                        Session["CustomerLogo"] = DasList[0].Logo;
        //                                    }
        //                                    else
        //                                    {
        //                                        Session["CustomerLogo"] = null;
        //                                    }
        //                                }
        //                                else
        //                                {
        //                                    Session["CustomerLogo"] = null;
        //                                }
        //                                Session["Email"] = DasList[0].Email;
        //                                //Session["lastlogin"] = loginmodelres.lastlogindate.ToString();
        //                                Session["lastlogin"] = lastloginres;
        //                                Session["IsAdmin"] = DasList[0].IsAdmin;

        //                                string _browserInfo = Request.Browser.Browser
        //                                                        + Request.Browser.Version
        //                                                        + Request.UserAgent + "~"
        //                                                            + Request.ServerVariables["REMOTE_ADDR"];

        //                                string _sessionValue = Convert.ToString(Session["UserID"]) + "^"
        //                                                        + DateTime.Now.Ticks + "^"
        //                                                        + _browserInfo + "^"
        //                                                        + System.Guid.NewGuid();


        //                                byte[] _encodeAsBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(_sessionValue);
        //                                string _encryptedString = System.Convert.ToBase64String(_encodeAsBytes);
        //                                Session["encryptedSession"] = _encryptedString;

        //                            }

        //                        }

        //                        else
        //                        {
        //                            TempData["message"] = "Session Timeout";
        //                            return View("Login");
        //                        }

        //                        Session["AuthToken"] = userSession + "." + Session["UserID"];

        //                        var va1 = Session["AuthToken"];
        //                        //}
        //                    }
        //                    else
        //                    {
        //                        int temp = Convert.ToInt32(Session["lockno"]);
        //                        temp = temp + 1;
        //                        Session["lockno"] = temp;
        //                        var temp2 = Session["lockno"];
        //                        Session["time"] = DateTime.Now.AddMinutes(5);
        //                        var temp3 = Session["time"];

        //                        Logger.Warn("Login Failed for user");
        //                        TempData["message1"] = "Attempt " + Session["lockno"] + "of 5";

        //                    }
        //                    //TempData["message"] = "Test1";
        //                    return View("Login");
        //                }
        //                //}
        //                TempData["message"] = "Test2";
        //                return View("Login");
        //            }
        //        }
        //        catch (Exception e)
        //        {
        //            Logger.Warn(e);
        //            return RedirectToAction("Error", "Home");
        //            //return Redirect("~/Views/Shared/Error.cshtml");

        //        }
        //    }
        //    else
        //    {
        //        TempData["message"] = "Captcha invalid";
        //        return View("Login");
        //    }
        //}


        public ActionResult Error_page()
        {
            return View();
        }
        public ActionResult Line_details()
        {
            return View();
        }
        public ActionResult ChangeForgotPass()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ChangePwd(Models.Changepassword C)
        {
            try
            {
                C.Input1 = Session["Email"].ToString();
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
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.Changepassword>("api/UserSettings/Changepassword", C).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var res = response.Content.ReadAsStringAsync().Result;
                            var msg = JsonConvert.DeserializeObject(res);
                            TempData["message"] = msg;
                        }
                    }
                    else
                    {
                        TempData["message"] = "Session Timeout";
                        return View("Login");
                    }
                    return View("ChangePassword");
                }
            }
            catch (Exception e)
            {
                Logger.Warn(e);
                return RedirectToAction("Error_page", "Main");
            }
        }

        public ActionResult ChangeForgotPwd(Models.Changepassword C)
        {
            try
            {
                //C.Input1 = Session["Email"].ToString();
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(Baseurl);
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage response = client.PostAsJsonAsync<Models.Changepassword>("api/UserSettings/Changepassword", C).Result;
                    if (response.IsSuccessStatusCode)
                    {
                        var res = response.Content.ReadAsStringAsync().Result;
                        var msg = JsonConvert.DeserializeObject(res);
                        TempData["message"] = msg;
                    }
                    return View("ChangeForgotPass");
                }
            }
            catch (Exception e)
            {
                Logger.Warn(e);
                return RedirectToAction("Error_page", "Main");
            }
        }

        public ActionResult Unauth_page()
        {
            return View();
        }
        public static string Encrypt(string text)
        {
            using (var md5 = new MD5CryptoServiceProvider())
            {
                using (var tdes = new TripleDESCryptoServiceProvider())
                {
                    tdes.Key = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                    tdes.Mode = CipherMode.ECB;
                    tdes.Padding = PaddingMode.PKCS7;

                    using (var transform = tdes.CreateEncryptor())
                    {
                        byte[] textBytes = UTF8Encoding.UTF8.GetBytes(text);
                        byte[] bytes = transform.TransformFinalBlock(textBytes, 0, textBytes.Length);
                        return Convert.ToBase64String(bytes, 0, bytes.Length);
                    }
                }
            }
        }

        [HttpPost]
        public ActionResult GetSettingdatas1(Models.ToolLife1 C)

        {
            //string randomHash = GetCookieValueOrDefault("UserName");
            //if (randomHash != "")
            //{
            try
            {
                //if (this.HasPermission("settingsdeptjob-View"))
                //{
                var string1 = C.CompanyCode + C.PlantCode;

                var mdshash = Encrypt(string1);

                C.HashId = mdshash;
                string apiUrl = Baseurl + "api/Toollife";
                var user1 = Session["Token"].ToString() + ':' + Session["UserName"].ToString();
                var input = new
                {
                    HashId = mdshash,
                    CompanyCode = C.CompanyCode,
                    PlantCode = C.PlantCode,
                    LineCode = C.Linecode,
                    Flag = C.Flag,
                    MachineCode = C.MachineCode

                };
                string inputJson = (new JavaScriptSerializer()).Serialize(input);
                WebClient client = new WebClient();
                client.Headers["Content-type"] = "application/json";
                client.Encoding = Encoding.UTF8;
                client.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + user1);
                string json = client.UploadString(apiUrl + "/GetSettingdatas1", inputJson);
                //List<Models.ToolLife1> model = (new JavaScriptSerializer()).Deserialize<List<Models.ToolLife1>>(json);
                object yourOjbect = new JavaScriptSerializer().DeserializeObject(json);
                //string response = (new JavaScriptSerializer()).Deserialize<string>(json);
                return Json(yourOjbect, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Login");
            //}
        }
        [HttpPost]
        public ActionResult GetSettingdatas2(Models.ToolLife1 C)

        {
            //string randomHash = GetCookieValueOrDefault("UserName");
            //if (randomHash != "")
            //{
            try
            {
                //if (this.HasPermission("settingsdeptjob-View"))
                //{
                var string1 = C.CompanyCode + C.PlantCode;

                var mdshash = Encrypt(string1);

                C.HashId = mdshash;
                string apiUrl = Baseurl + "api/Toollife";
                var user1 = Session["Token"].ToString() + ':' + Session["UserName"].ToString();
                var input = new
                {
                    HashId = mdshash,
                    CompanyCode = C.CompanyCode,
                    PlantCode = C.PlantCode,
                    LineCode = C.Linecode,
                    Flag = C.Flag

                };
                string inputJson = (new JavaScriptSerializer()).Serialize(input);
                WebClient client = new WebClient();
                client.Headers["Content-type"] = "application/json";
                client.Encoding = Encoding.UTF8;
                client.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + user1);
                string json = client.UploadString(apiUrl + "/GetSettingdatas2", inputJson);
                //List<Models.ToolLife1> model = (new JavaScriptSerializer()).Deserialize<List<Models.ToolLife1>>(json);
                object yourOjbect = new JavaScriptSerializer().DeserializeObject(json);
                //string response = (new JavaScriptSerializer()).Deserialize<string>(json);
                return Json(yourOjbect, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Login");
            //}
        }
        [HttpPost]
        public ActionResult Getvariabledetails(Models.Variable_Property C)

        {
            //string randomHash = GetCookieValueOrDefault("UserName");
            //if (randomHash != "")
            //{
            try
            {
                //if (this.HasPermission("settingsdeptjob-View"))
                //{
                var string1 = C.CompanyCode + C.PlantCode;

                var mdshash = Encrypt(string1);

                C.HashId = mdshash;
                string apiUrl = Baseurl + "api/Toollife";
                var user1 = Session["Token"].ToString() + ':' + Session["UserName"].ToString();
                var input = new
                {
                    HashId = mdshash,
                    CompanyCode = C.CompanyCode,
                    PlantCode = C.PlantCode,
                    LineCode = C.Linecode,
                    Flag = C.Flag,
                    Parameter = C.Parameter,
                    MachineCode = C.MachineCode

                };
                string inputJson = (new JavaScriptSerializer()).Serialize(input);
                WebClient client = new WebClient();
                client.Headers["Content-type"] = "application/json";
                client.Encoding = Encoding.UTF8;
                client.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + user1);
                string json = client.UploadString(apiUrl + "/Getvariablesettings", inputJson);
                //List<Models.ToolLife1> model = (new JavaScriptSerializer()).Deserialize<List<Models.ToolLife1>>(json);
                object yourOjbect = new JavaScriptSerializer().DeserializeObject(json);
                //string response = (new JavaScriptSerializer()).Deserialize<string>(json);
                return Json(yourOjbect, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Login");
            //}
        }

        [HttpPost]
        public ActionResult GetAlertList(Models.ToolLife1 C)

        {
            //string randomHash = GetCookieValueOrDefault("UserName");
            //if (randomHash != "")
            //{
            try
            {
                //if (this.HasPermission("settingsdeptjob-View"))
                //{
                var string1 = C.CompanyCode + C.PlantCode;

                var mdshash = Encrypt(string1);

                C.HashId = mdshash;
                string apiUrl = Baseurl + "api/Toollife";
                var user1 = Session["Token"].ToString() + ':' + Session["UserName"].ToString();
                var input = new
                {
                    HashId = mdshash,
                    CompanyCode = C.CompanyCode,
                    PlantCode = C.PlantCode,
                    LineCode = C.Linecode,
                    Flag = C.Flag,
                    MachineCode = C.MachineCode

                };
                string inputJson = (new JavaScriptSerializer()).Serialize(input);
                WebClient client = new WebClient();
                client.Headers["Content-type"] = "application/json";
                client.Encoding = Encoding.UTF8;
                client.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + user1);
                string json = client.UploadString(apiUrl + "/GetAlertSettingdatas1", inputJson);
                //List<Models.ToolLife1> model = (new JavaScriptSerializer()).Deserialize<List<Models.ToolLife1>>(json);
                object yourOjbect = new JavaScriptSerializer().DeserializeObject(json);
                //string response = (new JavaScriptSerializer()).Deserialize<string>(json);
                return Json(yourOjbect, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Login");
            //}
        }


        public ActionResult NewDash(Models.Loginmodel lo)
        {
            string _browserInfo = Request.Browser.Browser + Request.Browser.Version + Request.UserAgent + "~" + Request.ServerVariables["REMOTE_ADDR"];
            string _sessionValue = Convert.ToString(Session["UserId"]) + "^" + DateTime.Now.Ticks + "^" + _browserInfo + "^" + System.Guid.NewGuid();
            byte[] _encodeAsBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(_sessionValue);
            string _encryptedString = System.Convert.ToBase64String(_encodeAsBytes);
            Session["encryptedSession"] = _encryptedString;

            return View();


        }
        [HttpPost]
        public ActionResult GetMasterdata(Models.ToolLife1 C)

        {
            //string randomHash = GetCookieValueOrDefault("UserName");
            //if (randomHash != "")
            //{
            try
            {
                //if (this.HasPermission("settingsdeptjob-View"))
                //{
                var string1 = C.CompanyCode + C.PlantCode;

                var mdshash = Encrypt(string1);

                C.HashId = mdshash;
                string apiUrl = Baseurl + "api/Values";
                var user1 = Session["Token"].ToString() + ':' + Session["UserName"].ToString();
                var input = new
                {
                    HashId = mdshash,
                    CompanyCode = C.CompanyCode,
                    PlantCode = C.PlantCode,
                    LineCode = C.Linecode,
                    Flag = C.Flag,
                    MachineCode = C.MachineCode,
                    Parameter = C.Parameter

                };
                string inputJson = (new JavaScriptSerializer()).Serialize(input);
                WebClient client = new WebClient();
                client.Headers["Content-type"] = "application/json";
                client.Encoding = Encoding.UTF8;
                client.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + user1);
                string json = client.UploadString(apiUrl + "/GetSettingdatas1", inputJson);
                //List<Models.ToolLife1> model = (new JavaScriptSerializer()).Deserialize<List<Models.ToolLife1>>(json);
                object yourOjbect = new JavaScriptSerializer().DeserializeObject(json);
                //string response = (new JavaScriptSerializer()).Deserialize<string>(json);
                return Json(yourOjbect, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Login");
            //}
        }


        //Central Dashboard
        public ActionResult CentralDash()
        {
            return View();
        }



    }
}