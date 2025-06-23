
using System;

using System.Linq;
using System.Web;

namespace PlanDigitization_web.Models
{
    public class Loginmodel
    {
       
       
        public string UserName { get; set; }
        public string lastlogin { get; set; }
        public string Password { get; set; }
        public string UserSessionId { get; set; }
        
       
    }
    public class Loginmodelres
    {
        public string loginstatus { get; set; }
        public string lastlogindate { get; set; }
    }

    public class login
    {
       
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public string Line_Code { get; set; }
        public string UserID { get; set; }
        public string UserName { get; set; }
        public string User_Function { get; set; }
        public string RoleName { get; set; }
        public string PlantCode { get; set; }
        public string IsSuperAdmin { get; set; }
        public string Email { get; set; }
        public string IsAdmin { get; set; }
        public string Logo { get; set; }
        public string LastLoginDate { get; set; }
        public string CurrentLoginDate { get; set; }
    }

}