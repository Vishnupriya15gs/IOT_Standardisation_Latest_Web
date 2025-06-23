using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Plant_Digitization_api.Controllers
{
    public class database_connection
    {
        private string connectionstring = ConfigurationManager.ConnectionStrings["con"].ToString();


        public string Getconnectionstring(string companycode, string plantcode)
        {

            using (var connection = new SqlConnection(connectionstring))
            {
                connection.Open();

                SqlCommand command = new SqlCommand("SELECT distinct connection from database_connection where CompanyCode=@CompanyCode and PlantCode=@PlantCode", connection);


                command.Parameters.AddWithValue("@CompanyCode", companycode);
                command.Parameters.AddWithValue("@PlantCode", plantcode);
                //command.Parameters.AddWithValue("@Line_Code", linecode);
                SqlDataAdapter da = new SqlDataAdapter(command);
                object ret = command.ExecuteScalar();
                if (ret != null)
                {
                    return (string)ret;
                }

                else
                {
                    return "0";
                }
            }


        }
    }
}