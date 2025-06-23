using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PlanDigitization_web.Models
{
    public class Diagnostics
    {
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string LineCode { get; set; }
        public string DeviceID { get; set; }
        public string Devicename { get; set; }
        public string DeviceRef { get; set; }
        public string Event { get; set; }
        public int Unique_ID { get; set; }
        public DateTime LogTime { get; set; }
    }

    public class Diagnostics_settings
    {
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string LineCode { get; set; }
        public string DeviceID { get; set; }
        public string make { get; set; }
        public string gateway { get; set; }
        public string DeviceRef { get; set; }
        public string ioserver { get; set; }
        public int Unique_ID { get; set; }
        public string partnumber { get; set; }
        [Required(ErrorMessage = "Please select date")]
        public string installed { get; set; }
        public string connectedto { get; set; }
        public string macaddress { get; set; }
        public string remarks { get; set; }
    }

    public class URL_table
    {
        public string QueryType { get; set; }
        public string Unique_id { get; set; }
        public string URL { get; set; }
        public string LineCode { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
    }



    public class Department
    {
        public string QueryType { get; set; }
        public string Dept_id { get; set; }
        public string Status { get; set; }
        public string exception { get; set; }
        public string Dept_name { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Unique_id { get; set; }
        public string Area_name { get; set; }
        public string Area_id { get; set; }
    }
    public class Area
    {
        public string QueryType { get; set; }
        public string Area_id { get; set; }
        public string Status { get; set; }
        public string exception { get; set; }
        public string Area_name { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Unique_id { get; set; }
    }
    public class Subassembly
    {
        public string QueryType { get; set; }
        public string Subassembly_id { get; set; }
        public string Subassembly_name { get; set; }
        public string LineCode { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Unique_id { get; set; }
        public string MachineCode { get; set; }
    }

    public class VariableSetting
    {
        public string QueryType { get; set; }
        public string varname { get; set; }
        public string groupp { get; set; }
        public string propname { get; set; }
        public string value { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string LineCode { get; set; }
        public int Unique_id { get; set; }
    }

    public class AlertResponse
    {
                    
        public string QueryType { get; set; }
        public string AlertID { get; set; }
        public string Machine { get; set; }
        public string Message { get; set; }
        public string Comment { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string LineCode { get; set; }
        public int Unique_id { get; set; }
        public int Duration { get; set; }
        public int Count { get; set; }
        public Nullable<DateTime> StartTime { get; set; }
        public Nullable<DateTime> EndTime { get; set; }
        public string Last_Respond_status { get; set; }
        public Nullable<DateTime> Last_Respond_Time { get; set; }
        public string ResponseSelect { get; set; }
        public string Last_Responded_UserName { get; set; }
    }

    public class Roles
    {
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
        public string Unique_id { get; set; }
        public string RoleName { get; set; }
        public string RoleDescription { get; set; }
        public string RoleID { get; set; }
    }
    public class UserGroups
    {
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
        public string Unique_id { get; set; }
        public string GroupID { get; set; }
        public string GroupName { get; set; }
        public string GroupDescription { get; set; }
    }

    public class feedback
    {
        public string QueryType { get; set; }
        public string id { get; set; }
        public string UserName { get; set; }
        public string Feedback { get; set; }
        public string FB_Comments { get; set; }
        public DateTime FB_Date { get; set; }
        public string FB_Document { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string LineCode { get; set; }
    }

    public class Permission
    {
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string Unique_id { get; set; }
        public string RoleID { get; set; }
        public string Module_name { get; set; }
        public string View_form { get; set; }
        public string Edit_form { get; set; }
        public string Add_form { get; set; }
        public string Delete_form { get; set; }

    }
    public class Line_Permission
    {
        public string QueryType { get; set; }
        public string Line_Code { get; set; }
        public string Plant_Code { get; set; }
        public string RoleID { get; set; }
        public string Area_Code { get; set; }
        public string Dept_Code { get; set; }
        public string CompanyCode { get; set; }

    }
    public class UserGroup_Allocation
    {
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string Unique_id { get; set; }
        public string GroupID { get; set; }
        public string UserID { get; set; }
        public string PlantCode { get; set; }
        public string LineCode { get; set; }
        // public string Module_name { get; set; }

    }

    public class Customer
    {
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public string DomainName { get; set; }
        public string ContactPerson_FirstName { get; set; }
        public string ContactPerson_LastName { get; set; }
        public string ContactPerson_Mobile_NO { get; set; }
        public string ContactPerson_Email { get; set; }
        public string LocationName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string state { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Logo { get; set; }
        public string PreLogo { get; set; }
        public string Manager { get; set; }
        public bool IsActive { get; set; }

        public string PlantID { get; set; }
        public string LineCode { get; set; }
    }

    public class plant
    {
        public string QueryType { get; set; }
        public string PlantID { get; set; }
        public string PlantName { get; set; }
        public string PlantDescription { get; set; }
        public string PlantLocation { get; set; }
        public string TimeZone { get; set; }
        public string ParentOrganization { get; set; }
        public string Unique_id { get; set; }
        public string IsActive { get; set; }
    }

    public class Function
    {
        public string QueryType { get; set; }
        public string Unique_id { get; set; }
        public string FunctionID { get; set; }
        public string FunctionName { get; set; }
        public string FunctionDescription { get; set; }
        public string ParentPlant { get; set; }
        public string PlantName { get; set; }
        public string IsActive { get; set; }
        public string CompanyCode { get; set; }
        public string Dept_id { get; set; }
        public string dept_name { get; set; }
        public string Parameter2 { get; set; }
    }

    public class Skill
    {
        public string QueryType { get; set; }
        public string Unique_id { get; set; }
        public string Skill_ID { get; set; }
        public string SkillName { get; set; }
        public string CompanyCode { get; set; }
        public string Line_Code { get; set; }
        public string Plant_Code { get; set; }
    }

    public class users
    {
        public string QueryType { get; set; }
        public string Unique_id { get; set; }
        public string UserID { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string RoleID { get; set; }
        public string SkillSet { get; set; }
        public string SkillName { get; set; }
        public string RoleName { get; set; }
        public string IsActive { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string LineRoleID { get; set; }
    }


    public class disetsetting
    {

        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Flag { get; set; }
        public string QueryType { get; set; }
        public string LineCode { get; set; }
        public string MachineCode { get; set; }
        public string tool { get; set; }
    }


    public class Production
    {
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
        public string QueryType { get; set; }
        public string Year { get; set; }
        public string Month { get; set; }
        public string Shift { get; set; }
        public string FirstHr { get; set; }
        public string SecondHr { get; set; }
        public string ThirdHr { get; set; }
        public string FourthHr { get; set; }
        public string FifthHr { get; set; }
        public string SixthHr { get; set; }
        public string SeventhHr { get; set; }
        public string EightthHr { get; set; }

    }

    public class usersettings
    {
       
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Flag { get; set; }
        public string QueryType { get; set; }
        public string Parameter { get; set; }
        public string Parameter1 { get; set; }
        public string Parameter2 { get; set; }
        public string Parameter3 { get; set; }
        public string LineCode { get; set; }
    }
    public class assets
    {
        public string QueryType { get; set; }
        public string Unique_id { get; set; }
        public string AssetID { get; set; }
        public string FunctionName { get; set; }
        public string funname { get; set; }
        public string AssetName { get; set; }
        public string AssetDescription { get; set; }
        public string ShiftID { get; set; }
        public string sname { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string ewonnumber { get; set; }
        public string Bottle_neck { get; set; }
    }

    public class Operations
    {
        public string QueryType { get; set; }
        public string Unique_id { get; set; }
        public string OperationID { get; set; }
        public string OperationName { get; set; }
        public string OperationDescription { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
    }

    public class Products
    {
        public string QueryType { get; set; }
        public string M_ID { get; set; }
        public string Variant_Code { get; set; }
        public string VariantName { get; set; }
        public string VariantDescription { get; set; }
        public string OperationName { get; set; }
        public string OpName { get; set; }
        public string AsName { get; set; }
        public string Machine_Code { get; set; }
        public string RecipeName { get; set; }
        public string CycleTime { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
        public decimal Cost { get; set; }
        public decimal? Autocycletime { get; set; }
        public decimal? Manualcycletime { get; set; }
        public decimal? Idlecycletime { get; set; }
        public decimal? Nooffixtures { get; set; }
        public byte[] ImgData { get; set; }
    }

    public class Holiday
    {
        public string QueryType { get; set; }
        public string Unique_id { get; set; }
        public string HolidayID { get; set; }
        public string HolidayReason { get; set; }
        public string PlantName { get; set; }

        public string PlantID { get; set; }
        public string Dates { get; set; }
        public DateTime Date { get; set; }
        public string CompanyCode { get; set; }
        public string LineCode { get; set; }
    }

    public class Operatorskill
    {
        public string QueryType { get; set; }
        public string O_ID { get; set; }
        public string OperatorID { get; set; }
        public string SkillName { get; set; }
        public string OperatorName { get; set; }
        public string SName { get; set; }
        public string ScoreValue { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
    }

    public class Alarm
    {
        public string QueryType { get; set; }
        public string ID { get; set; }
        public string A_ID { get; set; }
        public string Line_Code { get; set; }
        public string FunctionName { get; set; }
        public string Machine_Code { get; set; }
        public string AssetName { get; set; }
        public string Alarm_ID { get; set; }
        public string Alarm_Description { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }

        public string LineCode { get; set; }
        public string Parameter { get; set; }
        public string Parameter1 { get; set; }
        public string Parameter2 { get; set; }
        public string Parameter3 { get; set; }

        public string Help { get; set; }
        public string FileName { get; set; }



    }




    public class Rejectiondata
    {
        public string QueryType { get; set; }
        public string R_ID { get; set; }
        public string RejectionCode { get; set; }
        public string RejectionName { get; set; }
        public string RejectionDescription { get; set; }
        public string PName { get; set; }
        public string OName { get; set; }
        public string AName { get; set; }
        public int Category_ID { get; set; }
        public string ProductName { get; set; }
        public string OperationName { get; set; }
        public string AssetName { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
    }

    public class Losses
    {
        public string QueryType { get; set; }
        public string ID { get; set; }
        public string Line_Code { get; set; }
        public string FunctionName { get; set; }
        public string Machine_Code { get; set; }
        public string AssetName { get; set; }
        public string Loss_ID { get; set; }
        public string Loss_Description { get; set; }
        public string Loss_Category { get; set; }
        public string Loss_Type { get; set; }
        public string Subassambly { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
    }

    public class Loss_category
    {
        public string QueryType { get; set; }
        public string ID { get; set; }
        public string Line_Code { get; set; }
        public string Loss_Category { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
    }

    public class Loss_type
    {
        public string QueryType { get; set; }
        public string ID { get; set; }
        public string Line_Code { get; set; }
        public string Loss_Type { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
    }

    public class Diset
    {
        public string date { get; set; }
        public string id { get; set; }
        public string loaded { get; set; }
        public string unloaded { get; set; }
        public string production { get; set; }
        public string cummulative { get; set; }
        public string starttime { get; set; }
        public string stoptime { get; set; }
        public string reason { get; set; }
        public string MachineCode { get; set; }
        public int Instance { get; set; }
    }

    public class reportMail
    {
        public string name { get; set; }
        public string emailid { get; set; }
        public string status { get; set; }
        public string exception { get; set; }
        public string linecode { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string QueryType { get; set; }
        public string Unique_id { get; set; }
    }
    public class Ewondetails
    {
        public string linecode { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public int Unique_id { get; set; }
        public string device_id { get; set; }
        public string devicename { get; set; }
        public string deviceip { get; set; }
        public string t2maccount { get; set; }
        public string t2musername { get; set; }
        public string t2mpassword { get; set; }
        public string t2mdeveloperid { get; set; }
        public string t2mdeviceusername { get; set; }
        public string t2mdevicepassword { get; set; }
        public string QueryType { get; set; }
        public string status { get; set; }
        public string ewonurl { get; set; }
    }

    public class Toollist
    {
        public string QueryType { get; set; }
        public string ID { get; set; }
        public string Line_Code { get; set; }
        public string FunctionName { get; set; }
        public string AssetName { get; set; }
        public string ToolName { get; set; }
        public string ToolID { get; set; }
        public string UOM { get; set; }
        public string Make { get; set; }
        public string Classification { get; set; }
        public string Part_number { get; set; }
        public string RatedLifeCycle { get; set; }
        public string Machine_Code { get; set; }
        public string Conversion_parameter { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string SerialNo { get; set; }
        public string Rectext { get; set; }
        public string Subassembly { get; set; }
        public string RecommendationText { get; set; }

    }

    public class Operator
    {
        public string QueryType { get; set; }
        public string OP_ID { get; set; }
        public string OperatorName { get; set; }
        public string OperatorID { get; set; }
        public string AssetName { get; set; }
        public string AName { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
    }

    public class RootObject
    {
        public List<Shift> data { get; set; }
    }

    public class Shift
    {
       
        public string QueryType { get; set; }
        public string ID { get; set; }
        public string ShiftName { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public decimal BreakTime { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
    }
    
    public class Changepassword
    {
        public string Input1 { get; set; }
        public string Input2 { get; set; }
        public string Input3 { get; set; }
    }
    public class Alert_History
    {
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string LineCode { get; set; }
        public string MachineCode { get; set; }
        public DateTime fromdate { get; set; }
        public DateTime todate { get; set; }
        public string AlertID { get; set; }
        public string AlertDateAndTime { get; set; }
        public string SentGroup { get; set; }
        public string InstanceCount { get; set; }
        public string CommentBy { get; set; }

    }


    public class production_plan
    {
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
        public string Shift_ID { get; set; }
        public string Product_Name { get; set; }
        public int target_production { get; set; }
        public DateTime fromdate { get; set; }
        public DateTime todate { get; set; }
        public int id { get; set; }
    }

    public class production_setting
    {
        public string shiftid { get; set; }
        public string linecode { get; set; }
        public string productname { get; set; }
        public string targetproduction { get; set; }
        public DateTime fromdate { get; set; }
        public DateTime todate { get; set; }
        public string companycode { get; set; }
        public string plantcode { get; set; }
        public int id { get; set; }
        public string querytype { get; set; }
    }
    public class manual
    {
        public string QueryType { get; set; }
        public string id { get; set; }
        public string UserName { get; set; }
        public string filename { get; set; }
        public string remarks { get; set; }

        public string linecode { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public DateTime Uploadedtime { get; set; }
    }
    public class Cycletime_setting
    {
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
        public string Machine { get; set; }
        public string Variant { get; set; }
        public string Movement { get; set; }
        public string Type { get; set; }
        public string Cycle_time { get; set; }
        public string ID { get; set; }
        public string Status { get; set; }

        public string if_applicable { get; set; }
    }


    public class GroupData
    {
        public List<Permission> Permission_data { get; set; }

    }

    public class Role
    {

        public string RoleID { get; set; }
        public string Unique_id { get; set; }
        public string RoleName { get; set; }
        public string QueryType { get; set; }
        public string CompanyCode { get; set; }
        public string PlantCode { get; set; }
        public string Line_Code { get; set; }
        public string RoleDescription { get; set; }

    }

}