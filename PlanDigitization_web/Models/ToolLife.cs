using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PlanDigitization_web.Models
{
    public class ToolLife1
    {
        public string HashId { get; set; }
        public string MachineCode { get; set; }
        public string Flag { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string subsystem { get; set; }
        //public string linecode { get; set; }
        public string Linecode { get; set; }
        public string linename { get; set; }
        public string Element { get; set; }
        public string Make { get; set; }
        public string PartNumber { get; set; }
        public string Classification { get; set; }
        public string UOM { get; set; }
        public string lastmain { get; set; }
        public string isreplaced { get; set; }
        public string noofreplace { get; set; }
        public string remark { get; set; }
        public string CurrentUsage { get; set; }
        public string ToolID { get; set; }
        public string Parameter { get; set; }

    }

    public class ToolLife
    {
       
        public string Line_code { get; set; }
        
        public string ToolName { get; set; }

        public string ToolID { get; set; }

        public string Make { get; set; }

        public string UOM { get; set; }

        public string Part_number { get; set; }
        
        public string Classification { get; set; }

        public string ratedlifecle { get; set; }

        public string Machine_code { get; set; }

        public string Conversion_parameter { get; set; }

        public string currentlifecle { get; set; }

        public string lastmain { get; set; }

        public string currentusage { get; set; }
        public string QueryType { get; set; }

        public string CompanyCode { get; set; }

        public string PlantCode { get; set; }

        public string LineCode { get; set; }
        public string SerialNo { get; set; }

        public string RecText { get; set; }
        public string IsReplaced { get; set; }
        public string noofreplacements { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public string NSerialNo { get; set; }


    }
    public class Variable_Property
    {
        public string HashId { get; set; }

        public string Flag { get; set; }
        public string CompanyCode { get; set; }
        public string MachineCode { get; set; }
        public string PlantCode { get; set; }
      
        //public string linecode { get; set; }
        public string Linecode { get; set; }
       public string Parameter { get; set; }


    }
}
