using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanDigitization_web.Models
{
    public class FirstPasslive
    {
        public string Linecode { get; set; }

        public string ShiftID { get; set; }

        public string Variantcode { get; set; }

        public Int32 TotalOkParts { get; set; }

        public Int32 TotalNokParts { get; set; }

        public Int32 TotalReworkParts { get; set; }

        public decimal Firstpassyeild { get; set; }

        public decimal COPQ { get; set; }
    }
}