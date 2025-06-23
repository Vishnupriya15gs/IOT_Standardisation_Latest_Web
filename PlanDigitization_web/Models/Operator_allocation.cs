using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanDigitization_web.Models
{

    public class Skill_Category
    {
        public string Id { get; set; }
        public string QueryType { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string Category_name { get; set; }
    }

    public class Skill_Set
    {
        public string Id { get; set; }
        public string QueryType { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string Category_id { get; set; }
        public string Category_name { get; set; }
        public string Skill { get; set; }
    }

    public class Machinewise_Skill
    {

        public string Id { get; set; }
        public string Category_id { get; set; }
        public string Ref_id { get; set; }
        public string Machine_id { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string QueryType { get; set; }

    }

    public class Machinewise_Skill_list
    { 
        public string Id { get; set; }
        public string Ref_id { get; set; }
        public string Skill_id { get; set; }
        public string Skill_rank { get; set; }
        public string Category_id { get; set; }
        public string Machine_id { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string QueryType { get; set; }

    }

    public class Operatorwise_Skill
    {
        public int ID { get; set; }
        public string Category_Id { get; set; }
        public string Operator_Id { get; set; }
        public string Machine_Id { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string QueryType { get; set; }

    }

    public class Operatorwise_Skill_list
    {
        public int ID { get; set; }
        public string Ref_Id { get; set; }
        public string Category_Id { get; set; }
        public string Operator_Id { get; set; }
        public string Skill_Id { get; set; }
        public string Skill_Rank { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string QueryType { get; set; }
        public string Machine_Id { get; set; }

    }

    public class Operator_Schedule
    {
        public int Id { get; set; }
        public string Machine { get; set; }
        public string Operator { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string QueryType { get; set; }
        public string FromDate { get; set; }
        public string FDate { get; set; }
        public string TDate { get; set; }
        public string OperatorName { get; set; }
        public string AssetName { get; set; }
        public int Ref_id { get; set; }
        public string ToDate { get; set; }
        public int Days { get; set; }
        public string Remarks { get; set; }
        public int Repeat { get; set; }
        public string Shift { get; set; }
        public string ShiftName { get; set; }

    }

    public class Operator_Allocation_Slots
    {
        public int Id { get; set; }
        public string Machine_id { get; set; }
        public string Operator_id { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string QueryType { get; set; }
        public int Ref_id { get; set; }
        public string FDate { get; set; }
        public string TDate { get; set; }
        public string Absent_Date { get; set; }
        public string Days { get; set; }
        public string Shift { get; set; }
        public string ShiftName { get; set; }

    }

    public class Absent_Data
    {
        public int ID { get; set; }
        public string Machine_id { get; set; }
        public string Operator { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string QueryType { get; set; }
        public string Absent_Date { get; set; }
        public string OperatorName { get; set; }
        public string ADate { get; set; }
        public string Shift { get; set; }
        public string ShiftName { get; set; }

    }
    public class Skill_Wise_Report
    {
        public int ID { get; set; }
        public string Companycode { get; set; }
        public string Plantcode { get; set; }
        public string LineCode { get; set; }
        public string Machine { get; set; }
        public string Operator { get; set; }
        public string Skill_id { get; set; }
        public string Skill_Rank { get; set; }
    }


}