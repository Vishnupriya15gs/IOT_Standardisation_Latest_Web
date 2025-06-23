using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PlanDigitization_web
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
        public class SessionTimeoutAttribute : ActionFilterAttribute
        {

            public override void OnActionExecuting(ActionExecutingContext filterContext)
            {
                try
                {
                    HttpContext ctx = HttpContext.Current;
                if (HttpContext.Current.Session["UserID"] == null)
                {
                    filterContext.Result = new RedirectResult("~/Main/Login");
                    return;
                }
                base.OnActionExecuting(filterContext);
                
                    var RequestUrl = filterContext.HttpContext.Request.RawUrl;
                    var encurl = HttpUtility.UrlEncode(RequestUrl);
                    if(encurl.Contains("%26") || encurl.Contains("%3d") || encurl.Contains("%3c") || encurl.Contains("%27") || encurl.Contains("%253c") || encurl.Contains("%253e"))
                            {
                        var routeValueDictionary = new RouteValueDictionary
                            {
                                {"controller", "Main"},
                                {"Home", "Error"}
                             };
                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(routeValueDictionary));


                    }
                    //if (RequestUrl != null)
                    //{
                    //    var queryUrl = filterContext.HttpContext.Request.QueryString["t"];
                    //    //var queryUrl = filterContext.HttpContext.Request.Url;
                    //    if (queryUrl.Contains("%26") || queryUrl.Contains("%3"))
                    //    {
                    //        var routeValueDictionary = new RouteValueDictionary
                    //        {
                    //            {"controller", "Error"},
                    //            {"action", "Index"}
                    //         };
                    //        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(routeValueDictionary));
                    //    }
                    //}
                }
                catch (HttpRequestValidationException exception)
                {
                    var routeValueDictionary = new RouteValueDictionary { { "controller", "Error" }, { "Main", "Login" } };
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(routeValueDictionary));
                }
            }

            
            public override void OnResultExecuting(ResultExecutingContext filterContext)
            {
                if (filterContext == null) throw new ArgumentNullException("filterContext");

                var cache = GetCache(filterContext);

                cache.SetExpires(DateTime.Now.AddDays(-1));
                cache.SetValidUntilExpires(false);
                cache.SetRevalidation(HttpCacheRevalidation.AllCaches);
                cache.SetCacheability(HttpCacheability.NoCache);
                cache.SetNoStore();
               

                base.OnResultExecuting(filterContext);
            }

            /// <summary>
            /// Get the reponse cache
            /// </summary>
            /// <param name="filterContext"></param>
            /// <returns></returns>
            protected virtual HttpCachePolicyBase GetCache(ResultExecutingContext filterContext)
            {
                return filterContext.HttpContext.Response.Cache;
            }
        }
    }
}
