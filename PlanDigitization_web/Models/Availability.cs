using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlanDigitization_web.Models
{
    public class Avl_Input
    {
        public Avl_Input()
        {

        }
        public List<string> LineList { get; set; }
        public List<string> MachineList { get; set; }
        public List<string> VariantList { get; set; }
        public List<string> OperatorList { get; set; }
    }
}