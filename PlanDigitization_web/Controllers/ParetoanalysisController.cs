using System.Web.Mvc;
using static PlanDigitization_web.FilterConfig;

namespace PlanDigitization_web.Controllers
{
    [SessionTimeout]
    public class ParetoanalysisController : Controller
    {
        public ActionResult Paretoanalysis()
        {
            if (this.HasPermission("ParetoAnalysisHistoric-View"))
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

        public ActionResult MTTR()
        {
            if (this.HasPermission("MTTR-View"))
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

        public ActionResult MTBF()
        {
            if (this.HasPermission("MTBF-View"))
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

        public ActionResult MOA()
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
        public ActionResult AndonLive()
        {
            if (this.HasPermission("AndonLive-View"))
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


        public ActionResult DaywiseStoppageAnalysis()
        {
            if (this.HasPermission("DaywiseStoppageAnalysis-View"))
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