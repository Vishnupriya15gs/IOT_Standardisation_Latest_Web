using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using static PlanDigitization_web.FilterConfig;
using Newtonsoft.Json;

namespace PlanDigitization_web.Controllers
{
    public class DataViewController : Controller
    {
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];
        // GET: DataView
        public ActionResult Index()
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                if (this.HasPermission("Rawtableview-View"))
                {

                    return View();
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
        public async Task<ActionResult> UploadManual(Models.manual A)
        {
            if (this.HasPermission("UploadManualSetting-View"))
            {
                if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
                {

                    try
                    {
                        using (var client = new HttpClient())
                        {
                            A.QueryType = "File_details";
                            A.CompanyCode = Session["CompanyCode"].ToString();
                            A.PlantCode = Session["PlantCode"].ToString();
                            A.linecode = Session["LineCode"].ToString();
                            A.UserName = Session["UserName"].ToString();

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
                                HttpResponseMessage response = client.PostAsJsonAsync<Models.manual>("api/UserSettings/uploaddetails", A).Result;
                                List<Models.manual> DasList = new List<Models.manual>();
                                var data = response.Content.ReadAsStringAsync().Result;
                                DasList = JsonConvert.DeserializeObject<List<Models.manual>>(data);
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
        public async Task<ActionResult> UploadFile(HttpPostedFileBase fileUploader,Models.manual aa)
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                string  CompanyCode = Session["CompanyCode"].ToString();
            string PlantCode = Session["PlantCode"].ToString();
            string linecode = Session["LineCode"].ToString();

            string path_f= Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/Manuals/" + CompanyCode + "/" + PlantCode + "/" + linecode), fileUploader.FileName);


            if (System.IO.File.Exists(path_f))
            {
                TempData["message"] = "File";
                return RedirectToAction("UploadManual", "DataView");
            }

            bool folderexists = Directory.Exists(Server.MapPath("~/Manuals/" + CompanyCode + "/"+PlantCode+"/"+linecode));
            if (!folderexists)
            {
                ViewBag.foldertest = "not exists";
                Directory.CreateDirectory(Server.MapPath("~/Manuals/" + CompanyCode + "/" + PlantCode + "/" + linecode));
            }

            //string _path = Path.GetFullPath(file.FileName);
            string _FileName = Path.GetFileName(fileUploader.FileName);

            var _path = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/Manuals/" + CompanyCode + "/" + PlantCode + "/" + linecode), _FileName);
            fileUploader.SaveAs(_path);


            //insert into database
            aa.QueryType = "Insert";
            aa.CompanyCode = Session["CompanyCode"].ToString();
            aa.PlantCode = Session["PlantCode"].ToString();
            aa.linecode= Session["LineCode"].ToString();
            aa.filename = _FileName;
            aa.UserName= Session["UserName"].ToString();
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
                    HttpResponseMessage response = client.PostAsJsonAsync<Models.manual>("api/UserSettings/manualupload", aa).Result;
                    if (response.IsSuccessStatusCode)
                    {
                        var res = response.Content.ReadAsStringAsync().Result;
                        var msg = JsonConvert.DeserializeObject(res);
                        TempData["message"] = msg;
                    }
                    return RedirectToAction("UploadManual", "DataView");
                }
                else
                {
                    TempData["message"] = "Session Timeout";
                    return RedirectToAction("Login", "Main");
                }
            }

            return View("UploadManual");

            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }

            
        }


        //[HttpPost]
        //public async Task<ActionResult> DownloadFile(HttpPostedFileBase fileUploader, Models.manual aa)
        //{

        //    string CompanyCode = Session["CompanyCode"].ToString();
        //    string PlantCode = Session["PlantCode"].ToString();
        //    string linecode = Session["LineCode"].ToString();

        //    string path_f = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/App_Data/" + CompanyCode + "/" + PlantCode + "/" + linecode), fileUploader.FileName);

        //    string _FileName = Path.GetFileName(fileUploader.FileName);

        //    var _path = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/App_Data/" + CompanyCode + "/" + PlantCode + "/" + linecode), _FileName);
        //    fileUploader.SaveAs(_path);


            

        //    //Read the File data into Byte Array.
        //    byte[] bytes = System.IO.File.ReadAllBytes(_path);

        //    //Send the File to Download.
        //    return File(bytes, "application/octet-stream", _FileName);
        //    TempData["message"] = "Deleted";
        //    // return View("UploadManual");

        //}


        [HttpPost]
        public void Deleteupload(Models.manual aa)
        {

            string CompanyCode = Session["CompanyCode"].ToString();
            string PlantCode = Session["PlantCode"].ToString();
            string linecode = Session["LineCode"].ToString();

            string path_f = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/Manuals/" + CompanyCode + "/" + PlantCode + "/" + linecode), aa.filename);

            System.IO.File.Delete(path_f);

           // TempData["message"] = "Deleted";

           // return View("UploadManual");

        }


        public ActionResult Daywise_Cumulative()
        {
            return View();
        }

        public ActionResult Shiftwise_production_summary()
        {
            return View();
        }

        public ActionResult Shiftwise_OEE_summary()
        {
            return View();
        }


    }
}
