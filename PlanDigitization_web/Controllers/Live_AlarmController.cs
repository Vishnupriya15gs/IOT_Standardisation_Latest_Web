using Newtonsoft.Json;
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
    public class Live_AlarmController : Controller
    {
        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];

        public ActionResult Live_alarm()
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

        public ActionResult Historic_alarm()
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

    }
}