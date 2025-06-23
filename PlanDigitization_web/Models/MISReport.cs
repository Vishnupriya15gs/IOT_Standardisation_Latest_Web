using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace PlanDigitization_web.Models
{
    public class MISReport
    {
    }

    public class mis_group
    {
        public string GroupID { get; set; }
        public string GroupName { get; set; }
        public string GroupDescription { get; set; }
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
        public string Unique_id { get; set; }
    }

    public class mis_group_allowcation
    {
        public string GroupID { get; set; }
        public string UserID { get; set; }
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
    }

    public class mis_report
    {
        public string QueryType { get; set; }
        public string Unique_id { get; set; }
        public string GroupID { get; set; }
        public string groupname { get; set; }
        public string ReportID { get; set; }
        public string Shift1 { get; set; }
        public string Shift2 { get; set; }
        public string Shift3 { get; set; }
        public string Day { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
    }

    public class mis_report_allowcation
    {
        public string ReportName { get; set; }
        public string GroupID { get; set; }
        public string ReportID { get; set; }
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
    }

    public class ExcelReportViewModel
    {
        [Required]
        [DisplayFormat(DataFormatString = "{0:yyyy-mm-dd}", ApplyFormatInEditMode = true)]
        public DateTime Date { get; set; }
        [Required]

        public int UniqueID { get; set; } //= "TEAL_DTVS";

        public string CompanyCode { get; set; } //= "TEAL_DTVS";

        public List<SelectListItem> CompanyCodeList { get; set; }
        [Required]
        public string PlantCode { get; set; } //= "TEAL_DTVS01";
        public List<SelectListItem> PlantCodeList { get; set; }
        [Required]
        public string LineCode { get; set; } //= "VCTM01";
        public List<SelectListItem> LineCodeList { get; set; }
        public string StationCode { get; set; }  //= "M1"
        public List<SelectListItem> StationCodeList { get; set; }

        public string SqlConnectionString { get; set; } //= "Connection String"
    }

    public class EmailResponse
    {
        public bool IsSent { get; set; }
        public string Message { get; set; }
        public string[] ToSent { get; set; }
        public string[] CCSent { get; set; }
        public string[] BCCSent { get; set; }
    }
    public class DownloadReportResponse
    {
        public string Message { get; set; }
    }

    public class FileDownloadModel
    {
        public byte[] FileBytes { get; set; }
        public string FileName { get; set; }
    }

    public class ApiResponce
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }

    public class DownloadFileNameModel
    {
        public FileContentResult File { get; set; }
        public string FileName { get; set; }
    }

    public class SelectModel
    {
        public string Value { get; set; }
        public string Text { get; set; }
    }


}