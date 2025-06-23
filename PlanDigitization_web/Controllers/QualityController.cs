using System;
using System.Web.Mvc;
using static PlanDigitization_web.FilterConfig;

namespace PlanDigitization_web.Controllers
{
    [SessionTimeout]
    public class QualityController : Controller
    {
        // GET: Quality
        public ActionResult Index()
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
        public ActionResult QualityLiveDashboard()
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
        public ActionResult QualityHistoricDashboard()
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
        

        //Historic+Live+MIS
        public ActionResult Quality()
        {

            if (this.HasPermission("Qualityhistlive-View"))
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
        //Historic+Live+MIS
        public ActionResult LiveRejection()
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


        public ActionResult RejReasonsamplesheet()
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                try
                {
                    string path = "~/Files/samples_rej_reason.xlsx";
                    return File(path, "application/vnd.ms-excel", "LessonLearnt.xlsx");
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            else
            {
                return RedirectToAction("Settings_err", "Main");
            }
        }

    }
}