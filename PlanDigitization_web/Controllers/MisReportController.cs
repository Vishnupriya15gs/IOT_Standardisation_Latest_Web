using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PlanDigitization_web.Models;
using System.Web.Services;
using System.Net.Http;
using System.Net;
using System.Web.Http;
using System.IO;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;

namespace PlanDigitization_web.Controllers
{


    public class MisReportController : Controller
    {

        private string SqlConnectionString = ConfigurationManager.ConnectionStrings["Auth_con"].ToString();
        string Misweapiurl = @System.Configuration.ConfigurationManager.AppSettings["miswebapiurl"];
        // GET: MisReport
        public ActionResult Index()
        {
            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);
            return View(model);
        }
        public ActionResult Misreportdetails()
        {
            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);
            return View(model);
        }

        protected bool CheckUrlStatus(string WebsiteURL)
        {
            try
            {

                var request = WebRequest.Create(WebsiteURL) as HttpWebRequest;
                request.Method = "HEAD";
                using (var response = (HttpWebResponse)request.GetResponse())
                {
                    return response.StatusCode == HttpStatusCode.OK;
                }
            }
            catch
            {
                return false;
            }
        }
        // this method is used to Check WepAPI connection working or not
        public JsonResult Checkconnection()
        {
            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);
            //model.SqlConnectionString = SqlConnectionString;
            ApiResponce apiResponce = new ApiResponce();

            try
            {
                if (CheckUrlStatus(Misweapiurl))
                {
                    apiResponce.Status = true;
                    apiResponce.Message = "WepAPI Connected";
                }
                else
                {
                    apiResponce.Status = false;
                    apiResponce.Message = "WepAPI Not Connecting";
                }
            }
            catch (Exception ex)
            {
                apiResponce.Status = false;
                apiResponce.Message = "WepAPI Not Connecting";

            }
            //return Json(apiResponce);
            return Json(apiResponce, JsonRequestBehavior.AllowGet);
        }

        // this method is used to Check Sql connection string working or not
        public JsonResult CheckSqlconnection()
        {

            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);
            //model.SqlConnectionString = SqlConnectionString;

            string conString = SqlConnectionString;
            bool isValid = false;
            SqlConnection con = null;

            ApiResponce apiResponce = new ApiResponce();

            try
            {
                con = new SqlConnection(conString);
                con.Open();
                isValid = true;
                if (isValid)
                {
                    apiResponce.Status = true;
                    apiResponce.Message = "SQL Connection String is Connected";
                }
                else
                {
                    apiResponce.Status = false;
                    apiResponce.Message = "SQL Connection String Not Connecting";
                    //isValid = false;
                }
            }
            catch (Exception ex)
            {
                isValid = false;
                apiResponce.Status = false;
                apiResponce.Message = "SQL Connection String Not Connecting";
            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    con.Close();
                }
            }
            return Json(apiResponce, JsonRequestBehavior.AllowGet);
        }

        // this method is used to Get companycode from database
        public JsonResult GetCompanyCodes()
        {

            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);
            List<SelectModel> objList = new List<SelectModel>();

            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(SqlConnectionString))
            {
                try
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("SP_MasterCodes_Get", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@strCodeType", "Company");
                    cmd.CommandTimeout = 0;
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(ds);
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        SelectModel obj = new SelectModel();
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            obj = new SelectModel();
                            obj.Value = dr.ItemArray[0].ToString();
                            obj.Text = dr.ItemArray[0].ToString();
                            objList.Add(obj);
                        }
                    }
                    else
                    {
                        objList = null;
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
            }
            return Json(objList, JsonRequestBehavior.AllowGet);
        }


        // this method is used to Get Plant Code based on companycode from database
        public JsonResult GetPlantCodes(string companyCode)
        {
            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);
            model.SqlConnectionString = SqlConnectionString;

            List<SelectModel> objList = new List<SelectModel>();

            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(SqlConnectionString))
            {
                try
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("SP_MasterCodes_Get", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@CompanyCode", SqlDbType.VarChar).Value = companyCode;
                    cmd.Parameters.AddWithValue("@strCodeType", "Plant");
                    cmd.CommandTimeout = 0;
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(ds);
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        SelectModel obj = new SelectModel();

                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            obj = new SelectModel();
                            obj.Value = dr.ItemArray[0].ToString();
                            obj.Text = dr.ItemArray[0].ToString();
                            objList.Add(obj);
                        }
                    }
                    else
                    {
                        objList = null;
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
            }
            return Json(objList, JsonRequestBehavior.AllowGet);
        }

        // this method is used to Get Line Code based on companycode,plantcode from database
        public JsonResult GetLineCodes(string companyCode, string plantCode)
        {

            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);
            model.SqlConnectionString = SqlConnectionString;

            List<SelectModel> objList = new List<SelectModel>();

            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(SqlConnectionString))
            {
                try
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("SP_MasterCodes_Get", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@CompanyCode", SqlDbType.VarChar).Value = companyCode;
                    cmd.Parameters.Add("@PlantCode", SqlDbType.VarChar).Value = plantCode;
                    cmd.Parameters.AddWithValue("@strCodeType", "Line");
                    cmd.CommandTimeout = 0;
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(ds);
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        SelectModel obj = new SelectModel();

                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            obj = new SelectModel();
                            obj.Value = dr.ItemArray[0].ToString();
                            obj.Text = dr.ItemArray[0].ToString();
                            objList.Add(obj);
                        }
                    }
                    else
                    {
                        objList = null;
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }
            }
            return Json(objList, JsonRequestBehavior.AllowGet);

        }

        // this method is used to Get Station Code based on companycode,plantcode & linecode from database
        public JsonResult GetStationCodes(string companyCode, string plantCode, string lineCode)
        {
            List<SelectModel> objList = new List<SelectModel>();
            SelectModel obj = new SelectModel();
            obj = null;
            string strConnection = "";
            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);
            model.SqlConnectionString = SqlConnectionString;

            if (companyCode == "" || plantCode == "" || lineCode == "")
            {
                objList = null;
                return Json(objList, JsonRequestBehavior.AllowGet);
            }


            DataSet ds = new DataSet();
            strConnection = GetConnectionString(companyCode, plantCode, lineCode);
            if (strConnection == "")
            {
                objList = null;
                return Json(objList, JsonRequestBehavior.AllowGet);
            }
            using (SqlConnection con = new SqlConnection(GetConnectionString(companyCode, plantCode, lineCode)))
            {
                try
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("select AssetID,AssetName from tbl_Assets with(nolock) WHERE CompanyCode=@CompanyCode and PlantCode=@PlantCode ", con);
                    cmd.Parameters.Add("@CompanyCode", SqlDbType.VarChar).Value = companyCode;
                    cmd.Parameters.Add("@PlantCode", SqlDbType.VarChar).Value = plantCode;
                    //cmd.Parameters.Add("@LineCode", SqlDbType.VarChar).Value = lineCode;
                    //cmd.Parameters.AddWithValue("@strCodeType", "Machine");
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(ds);
                    if (ds.Tables[0].Rows.Count > 0)
                    {


                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            obj = new SelectModel();
                            obj.Value = dr.ItemArray[0].ToString();
                            obj.Text = dr.ItemArray[1].ToString();
                            objList.Add(obj);
                        }
                    }
                    else
                    {
                        objList = null;
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    con.Close();
                }

            }

            return Json(objList, JsonRequestBehavior.AllowGet);

        }


        private string GetConnectionString(string companyCode, string plantCode, string lineCode)
        {
            string constr = "";

            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);

            using (var connection = new SqlConnection(SqlConnectionString))
            {
                connection.Open();

                SqlCommand Cmd = new SqlCommand("SELECT distinct connection from database_connection where CompanyCode=@CompanyCode and PlantCode=@PlantCode and LineCode=@Line_Code", connection);
                Cmd.Parameters.AddWithValue("@CompanyCode", companyCode);
                Cmd.Parameters.AddWithValue("@PlantCode", plantCode);
                Cmd.Parameters.AddWithValue("@Line_Code", lineCode);
                SqlDataAdapter da = new SqlDataAdapter(Cmd);

                if (Cmd.ExecuteScalar() != null)
                {
                    constr = Cmd.ExecuteScalar().ToString();
                }
                else
                {
                    constr = "";
                }
                return constr;
            }
        }

        // this method is used to Get Sql Connection string (WebAPI) based on companycode,plantcode & linecode from database
        public JsonResult GetSqlConnectionString(string companycode, string plantcode, string linecode)
        {


            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);

            List<SelectModel> objList = new List<SelectModel>();

            using (var connection = new SqlConnection(SqlConnectionString))
            {
                connection.Open();

                SqlCommand Cmd = new SqlCommand("SELECT distinct connection from database_connection where CompanyCode=@CompanyCode and PlantCode=@PlantCode and LineCode=@Line_Code", connection);
                Cmd.Parameters.AddWithValue("@CompanyCode", companycode);
                Cmd.Parameters.AddWithValue("@PlantCode", plantcode);
                Cmd.Parameters.AddWithValue("@Line_Code", linecode);
                SqlDataAdapter da = new SqlDataAdapter(Cmd);
                SelectModel obj = new SelectModel();

                if (Cmd.ExecuteScalar() != null)
                {
                    obj = new SelectModel();
                    obj.Text = Cmd.ExecuteScalar().ToString();
                    obj.Value = Cmd.ExecuteScalar().ToString();
                    objList.Add(obj);
                    model.SqlConnectionString = Cmd.ExecuteScalar().ToString();
                }
                else
                {
                    objList = null;
                }
            }
            return Json(objList, JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetCompanyLogo(string companycode, string plantcode, string linecode)
        {


            ExcelReportViewModel model = new ExcelReportViewModel();
            model.Date = System.DateTime.Today.AddDays(-1);

            //List<SelectModel> objList = new List<SelectModel>();
            List<FileDownloadModel> objList1 = new List<FileDownloadModel>();

            using (var connection = new SqlConnection(SqlConnectionString))
            {
                connection.Open();

                SqlCommand Cmd = new SqlCommand("SELECT Logo FROM tbl_Customer where CompanyCode=@CompanyCode", connection);
                Cmd.Parameters.AddWithValue("@CompanyCode", companycode);
                SqlDataAdapter da = new SqlDataAdapter(Cmd);
                //SelectModel obj = new SelectModel();
                FileDownloadModel obj1 = new FileDownloadModel();

                if (Cmd.ExecuteScalar() != null)
                {

                    //obj = new SelectModel();
                    obj1 = new FileDownloadModel();
                    string path = Server.MapPath("~\\Images\\" + Cmd.ExecuteScalar().ToString());
                    //var path = Path.Combine("Images", Cmd.ExecuteScalar().ToString());
                    //string path = Path.Combine(System..WebRootPath, "UploadFiles", "ExcelFiles");  Path.Combine(WebRootPath, "Images", name);
                    if (System.IO.File.Exists(path))
                    {

                        //byte[] byteData = System.IO.File.ReadAllBytes(path);
                        //string imreBase64Data = Convert.ToBase64String(byteData);
                        //string imgDataURL = string.Format("data:image/png;base64,{0}", imreBase64Data);

                        WebClient webClient = new WebClient();
                        byte[] imageData = webClient.DownloadData(path);
                        //Image image;

                        //ViewBag.ImageData = imgDataURL;
                        //return Json(imgDataURL, JsonRequestBehavior.AllowGet);

                        //imgdata = System.IO.File.ReadAllBytes(path);
                        obj1.FileBytes = imageData;
                        obj1.FileName = path;
                        objList1.Add(obj1);

                        //obj.Text = "Images/" + Cmd.ExecuteScalar().ToString();
                        //obj.Value = "Images/" + Cmd.ExecuteScalar().ToString();
                        //objList.Add(obj);
                    }
                    else
                   {
                        path = Server.MapPath("~\\Images\\Noimage.png");
                        WebClient webclient = new WebClient();
                        byte[] imageData = webclient.DownloadData(path);
                        obj1.FileBytes = imageData;
                        obj1.FileName = path;
                        objList1.Add(obj1);
                    }
                }
                else
                {
                    //objList = null;
                    objList1 = null;
                }
            }
            return Json(objList1, JsonRequestBehavior.AllowGet);
            //return Json(objList, JsonRequestBehavior.AllowGet);
        }
    }
}