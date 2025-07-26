using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlanDigitization_web.Controllers
{
    public class OverallOEEController : Controller
    {
        // GET: OverallOEE

        string Baseurl = @System.Configuration.ConfigurationManager.AppSettings["url"];
        public ActionResult OverallOEE()
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

            return View();
        }
    }
}