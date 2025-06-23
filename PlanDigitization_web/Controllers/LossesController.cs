using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlanDigitization_web.Controllers
{
    public class LossesController : Controller
    {
        // GET: Losses
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
        public ActionResult Loss_Live()
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
        public ActionResult Loss_Historic()
        {
            if (Session["CompanyCode"] != null && Session["PlantCode"] != null && Session["LineCode"] != null)
            {
                if (this.HasPermission("Loss_Historic-View"))
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
        public ActionResult Loss_HistoricTest()
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