using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanDigitization_web.Models
{
    
    public class Alerts
    {
        public string Machine_Code { get; set; }
        public string combinename { get; set; }
        public string alertID { get; set; }
        public string Alert_Name { get; set; }
        public string P1_Variable { get; set; }
        public string P1_PG { get; set; }
        public string P1_Param { get; set; }
        public string P2_Variable { get; set; }
        public string P2_PG { get; set; }
        public string P2_Param { get; set; }
        public string Expression { get; set; }
        public Int32 Constant { get; set; }
        public float DurationForAlert { get; set; }
        public float DurationForRepetetion { get; set; }
        public int Group_id1 { get; set; }
        public string MessageText { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
        public string Remarks { get; set; }
        public string QueryType { get; set; }
        public string Machine_Code1 { get; set; }
        public string Machine_Code2 { get; set; }
        public int Group_id2 { get; set; }
        public int unique_id { get; set; }
        public int Group_id3 { get; set; }
    }

  
    public class Setting
    {
        public string QueryType { get; set; }
        public string Parameter { get; set; }
        public string Parameter1 { get; set; }
        public string Parameter2 { get; set; }
    }
}