using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanDigitization_web.Models
{
    public class MailModel
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string username { get; set; }
        public string QueryType { get; set; }
        public string id { get; set; }
        public string Feedback { get; set; }
        public string FB_Comments { get; set; }
        public DateTime FB_Date { get; set; }
        public string FB_Document { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
    }
    public class manualmodel
    {
        public string username { get; set; }
        public string QueryType { get; set; }
        public string id { get; set; }
        public string Feedback { get; set; }
        public string FB_Comments { get; set; }
        public DateTime FB_Date { get; set; }
        public string FB_Document { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string LineCode { get; set; }
    }
}