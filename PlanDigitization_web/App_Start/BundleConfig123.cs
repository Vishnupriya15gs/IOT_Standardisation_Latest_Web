using System.Web;
using System.Web.Optimization;

namespace PlanDigitization_web
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery_vr.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/assets/css").Include(
                    "~/assets1/vendor/bootstrap/css/bootstrap.css",
                    "~/assets1/vendor/font-awesome/css/font-awesome.css",
                    "~/assets1/vendor/magnific-popup/magnific-popup.css",
                    "~/assets1/vendor/bootstrap-datepicker/css/datepicker3.css",
                    "~/assets1/vendor/jquery-ui/css/ui-lightness/jquery-ui-1.10.4.custom.css",
                    "~/assets1/vendor/bootstrap-multiselect/bootstrap-multiselect.css",
                    "~/assets1/vendor/morris/morris.css",
                    "~/assets1/stylesheets/theme.css",
                    "~/assets1/stylesheets/skins/default.css",
                    "~/assets1/stylesheets/theme-custom.css",
                    "~/assets1/vendor/select2/select2.css",
                    "~/assets1/vendor/jquery-datatables-bs3/assets/css/datatables.css"
                ));

            bundles.Add(new ScriptBundle("~/assets/firstscript").Include(
                    "~/assets1/vendor/modernizr/modernizr.js"
                ));

            bundles.Add(new ScriptBundle("~/assets/secondscript").Include(
                   "~/assets1/vendor/jquery/jquery.js",
                    "~/assets1/vendor/jquery-browser-mobile/jquery.browser.mobile.js",
                    "~/assets1/vendor/bootstrap/js/bootstrap.js",
                    "~/assets1/vendor/nanoscroller/nanoscroller.js",
                    "~/assets1/vendor/bootstrap-datepicker/js/bootstrap-datepicker.js",
                    "~/assets1/vendor/magnific-popup/magnific-popup.js",
                    "~/assets1/vendor/jquery-placeholder/jquery.placeholder.js",
                    "~/assets1/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js",
                    "~/assets1/vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.js",
                    "~/assets1/vendor/jquery-appear/jquery.appear.js",
                    "~/assets1/vendor/bootstrap-multiselect/bootstrap-multiselect.js",
                    "~/assets1/vendor/jquery-easypiechart/jquery.easypiechart.js",
                    "~/assets1/vendor/flot/jquery.flot.js",
                    "~/assets1/vendor/flot-tooltip/jquery.flot.tooltip.js",
                    "~/assets1/vendor/flot/jquery.flot.pie.js",
                    "~/assets1/vendor/flot/jquery.flot.categories.js",
                    "~/assets1/vendor/flot/jquery.flot.resize.js",
                    "~/assets1/vendor/jquery-sparkline/jquery.sparkline.js",
                    "~/assets1/vendor/raphael/raphael.js",
                    "~/assets1/vendor/morris/morris.js",
                    "~/assets1/vendor/gauge/gauge.js",
                    "~/assets1/vendor/snap-svg/snap.svg.js",
                    "~/assets1/vendor/liquid-meter/liquid.meter.js",

                    //"~/assets1/vendor/jqvmap/jquery.vmap.js",
                    //"~/assets1/vendor/jqvmap/data/jquery.vmap.sampledata.js",
                    //"~/assets1/vendor/jqvmap/maps/jquery.vmap.world.js",
                    //"~/assets1/vendor/jqvmap/maps/continents/jquery.vmap.africa.js",
                    //"~/assets1/vendor/jqvmap/maps/continents/jquery.vmap.asia.js",
                    //"~/assets1/vendor/jqvmap/maps/continents/jquery.vmap.australia.js",
                    //"~/assets1/vendor/jqvmap/maps/continents/jquery.vmap.europe.js",
                    //"~/assets1/vendor/jqvmap/maps/continents/jquery.vmap.north-america.js",
                    //"~/assets1/vendor/jqvmap/maps/continents/jquery.vmap.south-america.js",
                    "~/assets1/javascripts/theme.js",
                    "~/assets/vendor/select2/select2.js",
                    "~/assets1/javascripts/theme.custom.js",
                    "~/assets1/javascripts/theme.init.js",
                    "~/assets1/vendor/jquery-validation/jquery.validate.js",
                    "~/assets1/javascripts/forms/examples.validation.js",
                    "~/assets1/vendor/jquery-datatables/media/js/jquery.dataTables.js",
                    "~/assets1/vendor/jquery-datatables/extras/TableTools/js/dataTables.tableTools.min.js",
                    "~/assets1/vendor/jquery-datatables-bs3/assets/js/datatables.js",
                    "~/assets1/javascripts/tables/examples.datatables.default.js",
                    "~/assets1/javascripts/tables/examples.datatables.row.with.details.js",
                    "~/assets1/javascripts/tables/examples.datatables.tabletools.js",

                     "~/assets1/vendor/owl-carousel/owl.carousel.js" 

                ));
        }
    }
}
