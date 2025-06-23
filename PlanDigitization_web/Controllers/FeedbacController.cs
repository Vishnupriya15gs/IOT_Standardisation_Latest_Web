using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using Newtonsoft.Json;
using NLog;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static PlanDigitization_web.FilterConfig;

namespace PlanDigitization_web.Controllers
{
    [SessionTimeout]
    public class FeedbacController : Controller
    {

        public readonly Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];


        public async Task<ActionResult> Index()
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

        public async Task<ActionResult> Feedback()
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

        // GET: Feedbac
        //public ActionResult Index()
        //{
        //    return View();
        //}

        [HttpPost]
        public ActionResult Index(PlanDigitization_web.Models.MailModel objModelMail, HttpPostedFileBase fileUploader, Models.feedback aa)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                if (ModelState.IsValid)
                {

                    aa.QueryType = "Insert";
                    aa.CompanyCode = Session["CompanyCode"].ToString();
                    aa.PlantCode = Session["PlantCode"].ToString();
                    aa.LineCode = Session["LineCode"].ToString();
                    aa.Feedback = objModelMail.Subject;
                    aa.FB_Comments = objModelMail.Body;
                    aa.UserName = Session["UserName"].ToString();
                    aa.FB_Date = DateTime.Now;
                    using (var client = new HttpClient())
                    {
                        client.BaseAddress = new Uri(Baseurl);
                        client.DefaultRequestHeaders.Clear();
                        var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());

                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.feedback>("api/UserSettings/feedback_details", aa).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            ///-----------mail-------------------///
                            string filename = Path.GetFileName(fileUploader.FileName);
                            string extension = Path.GetExtension(filename);
                            string from = "tealappmailer1@titan.co.in";
                            if (extension == ".png" || extension == ".jpg" || extension == ".jpeg" || extension == ".txt")
                            {
                                using (MailMessage mail = new MailMessage(from, from))
                                {
                                    mail.Subject = objModelMail.Subject;
                                    string username = "Feedback from " + Session["UserName"].ToString() + "\n";
                                    mail.Body += username;
                                    mail.Body += "\n Comments:" + objModelMail.Body;
                                    if (fileUploader != null)
                                    {
                                        string fileName = Path.GetFileName(fileUploader.FileName);
                                        mail.Attachments.Add(new Attachment(fileUploader.InputStream, fileName));
                                    }
                                    mail.IsBodyHtml = false;
                                    SmtpClient smtp = new SmtpClient();
                                    smtp.Host = "smtp-mail.outlook.com";
                                    smtp.EnableSsl = true;
                                    NetworkCredential networkCredential = new NetworkCredential(from, "Teal@2024");
                                    smtp.UseDefaultCredentials = true;
                                    smtp.Credentials = networkCredential;
                                    mail.To.Add("vishnupriyasampath@titan.co.in");
                                    mail.To.Add("faj@titan.co.in");
                                    mail.To.Add("annefebronia@titan.co.in");
                                    mail.To.Add("akashadi@titan.co.in");
                                    smtp.Port = 587;
                                    smtp.Send(mail);
                                    TempData["message"] = "Mail sent";
                                    ViewBag.Message = "Sent";
                                    return View("Index");
                                }
                            }
                            else
                            {
                                TempData["message"] = "File extension not supported";
                                return View("Index");
                            }
                        }
                        else
                        {

                            return View("Index");
                        }
                    }


                }
                else
                {
                    return View();
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }

        }



        //[HttpPost]
        //public ActionResult Feedback(PlanDigitization_web.Models.MailModel objModelMail, HttpPostedFileBase fileUploader, Models.feedback aa)
        //{
        //    if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
        //    {
        //        if (ModelState.IsValid)
        //        {

        //            aa.QueryType = "Insert";
        //            aa.CompanyCode = Session["CompanyCode"].ToString();
        //            aa.PlantCode = Session["PlantCode"].ToString();
        //            aa.LineCode = Session["LineCode"].ToString();
        //            aa.Feedback = objModelMail.Subject;
        //            aa.FB_Comments = objModelMail.Body;
        //            aa.UserName = Session["UserName"].ToString();
        //            aa.FB_Date = DateTime.Now;
        //            using (var client = new HttpClient())
        //            {
        //                client.BaseAddress = new Uri(Baseurl);
        //                client.DefaultRequestHeaders.Clear();
        //                var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
        //                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());

        //                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //                HttpResponseMessage response = client.PostAsJsonAsync<Models.feedback>("api/UserSettings/feedback_details", aa).Result;
        //                if (response.IsSuccessStatusCode)
        //                {
        //                    ///-----------mail-------------------///
        //                    string filename = Path.GetFileName(fileUploader.FileName);
        //                    string extension = Path.GetExtension(filename);
        //                    string from = "tealrmpadmin@titan.co.in";
        //                    if (extension == ".png" || extension == ".jpg" || extension == ".jpeg" || extension == ".txt")
        //                    {
        //                        using (MailMessage mail = new MailMessage(from, from))
        //                        {
        //                            mail.Subject = objModelMail.Subject;
        //                            string username = "Feedback from " + Session["UserName"].ToString() + "\n";
        //                            mail.Body += username;
        //                            mail.Body += "\n Comments:" + objModelMail.Body;
        //                            if (fileUploader != null)
        //                            {
        //                                string fileName = Path.GetFileName(fileUploader.FileName);
        //                                mail.Attachments.Add(new Attachment(fileUploader.InputStream, fileName));
        //                            }
        //                            mail.IsBodyHtml = false;
        //                            SmtpClient smtp = new SmtpClient 
        //                            { 
        //                                Host = "smtp.gmail.com",
        //                                EnableSsl = true
        //                            };

        //                            NetworkCredential networkCredential = new NetworkCredential(from, "coupleofshoes@2018");
        //                            smtp.UseDefaultCredentials = true;
        //                            smtp.Credentials = networkCredential;
        //                            smtp.Port = 587;
        //                            smtp.Send(mail);
        //                            TempData["message"] = "Mail sent";
        //                            ViewBag.Message = "Sent";
        //                            return View("Feedback");
        //                        }
        //                    }
        //                    else
        //                    {
        //                        TempData["message"] = "File extension not supported";
        //                        return View("Feedback");
        //                    }
        //                }
        //                else
        //                {

        //                    return View("Feedback");
        //                }
        //            }


        //        }
        //        else
        //        {
        //            return View();
        //        }
        //    }
        //    else
        //    {
        //        return RedirectToAction("Settings_err", "Main");
        //    }

        //}
        [HttpPost]
        public ActionResult Feedback(PlanDigitization_web.Models.MailModel objModelMail, HttpPostedFileBase fileUploader, Models.feedback aa)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                if (ModelState.IsValid)
                {

                    aa.QueryType = "Insert";
                    aa.CompanyCode = Session["CompanyCode"].ToString();
                    aa.PlantCode = Session["PlantCode"].ToString();
                    aa.LineCode = Session["LineCode"].ToString();
                    aa.Feedback = objModelMail.Subject;
                    aa.FB_Comments = objModelMail.Body;
                    aa.UserName = Session["UserName"].ToString();
                    aa.FB_Date = DateTime.Now;
                    aa.FB_Document = fileUploader.FileName;
                    using (var client = new HttpClient())
                    {
                        client.BaseAddress = new Uri(Baseurl);
                        client.DefaultRequestHeaders.Clear();
                        var user1 = Session["Token"].ToString() + ':' + Session["UserName"];
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1.ToString());

                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        HttpResponseMessage response = client.PostAsJsonAsync<Models.feedback>("api/UserSettings/feedback_details", aa).Result;
                        var data = response.Content.ReadAsStringAsync().Result;
                        var msg = JsonConvert.DeserializeObject(data);
                        if (fileUploader != null)
                        {
                            string filename = string.Empty;
                            string filePath = string.Empty;
                            string path = Server.MapPath("~/Feedbackimage/");
                            if (!Directory.Exists(path))
                            {
                                Directory.CreateDirectory(path);
                            }
                            filePath = path + Path.GetFileName(fileUploader.FileName);
                            filename = Path.GetFileName(fileUploader.FileName);
                            string extension = Path.GetExtension(fileUploader.FileName);
                            fileUploader.SaveAs(filePath);
                        }
                        if (msg.ToString() != "Already")
                        {
                            //TempData["message"] = msg;

                            if (response.IsSuccessStatusCode)
                            {
                                ///-----------mail-------------------///
                                string filename = Path.GetFileName(fileUploader.FileName);
                                string extension = Path.GetExtension(filename);
                                string from = "tealappmailer1@titan.co.in";
                                if (extension == ".png" || extension == ".jpg" || extension == ".jpeg" || extension == ".txt")
                                {
                                    using (MailMessage mail = new MailMessage(from, from))
                                    {
                                        mail.Subject = objModelMail.Subject;
                                        string username = "Feedback from " + Session["UserName"].ToString() + "\n";
                                        mail.Body += username;
                                        mail.Body += "\n Comments:" + objModelMail.Body;
                                        if (fileUploader != null)
                                        {
                                            string fileName = Path.GetFileName(fileUploader.FileName);

                                            mail.Attachments.Add(new Attachment(fileUploader.InputStream, fileName));
                                        }
                                        mail.IsBodyHtml = false;
                                        SmtpClient smtp = new SmtpClient
                                        {
                                            Host = "smtp-mail.outlook.com",
                                            EnableSsl = true
                                        };
                                        smtp.UseDefaultCredentials = false;
                                        
                                        mail.To.Add("vishnupriyasampath@titan.co.in");
                                        mail.To.Add("faj@titan.co.in");
                                        mail.To.Add("annefebronia@titan.co.in");
                                        mail.To.Add("akashadi@titan.co.in");
                                        smtp.Port = 587;
                                        smtp.Send(mail);
                                        TempData["message"] = "Mail sent";
                                        //ViewBag.Message = "Sent";
                                        return View("Feedback");
                                    }
                                }
                                else
                                {
                                    TempData["message"] = "File extension not supported";
                                    return View("Feedback");
                                }
                            }
                            else
                            {

                                return View("Feedback");
                            }
                        }
                        else
                        {
                            TempData["message"] = msg;
                            return View();
                        }
                    }


                }
                else
                {
                    return View();
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }

        }



        [HttpPost]
        public async Task<ActionResult> Add_feedback(Models.feedback aa)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    aa.QueryType = "Insert";
                    aa.CompanyCode = Session["CompanyCode"].ToString();
                    aa.PlantCode = Session["PlantCode"].ToString();
                    aa.LineCode = Session["LineCode"].ToString();
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
                            HttpResponseMessage response = client.PostAsJsonAsync<Models.feedback>("api/UserSettings/feedback_details", aa).Result;
                            if (response.IsSuccessStatusCode)
                            {
                                var res = response.Content.ReadAsStringAsync().Result;
                                var msg = JsonConvert.DeserializeObject(res);
                                TempData["message"] = msg;
                            }
                            return RedirectToAction("Index", "Feedbac");
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