using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlanDigitization_web.Controllers
{
   

    public class CycletimeController : Controller
    {
        // GET: Cycletime
        public ActionResult Index()
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
        public ActionResult Cycletime_live()
        {
            if (Session["CompanyCode"] != null)
            {
                if (this.HasPermission("CycleTimeLive-View"))
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



        public ActionResult ActualvsTargetCycletime()
        {
            if (Session["CompanyCode"] != null)
            {
                if (this.HasPermission("ActualvsTargetCycletime-View"))
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



        public ActionResult Cycletime_histogram()
        {
            if (Session["CompanyCode"] != null)
            {
                if (this.HasPermission("CycleTimeHistoric-View"))
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
        //[HttpPost]
        //public ActionResult Set_Mc_Code(string id)
        //{
        //    Session["McCode"] = id;
        //    return Json("ok", JsonRequestBehavior.AllowGet);
        //}

        public ActionResult MachineWiseCycleTime()
        {
            if (Session["CompanyCode"] != null)
            {
                if (this.HasPermission("MachineWiseCycleTime-View"))
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

    }

}