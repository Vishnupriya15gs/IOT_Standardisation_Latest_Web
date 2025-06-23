using PlanDigitization_web.Models;
using RBACModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

public class RBACUser
{
    public string UserID { get; set; }
    public bool IsSuperAdmin { get; set; }
    public bool IsAdmin { get; set; }
    public string UserName { get; set; }

    private List<UserRole> Roles = new List<UserRole>();

    public RBACUser(string _username)
    {
        this.UserName = _username;
        this.IsSuperAdmin = false;
        this.IsAdmin = false;
        GetDatabaseUserRolesPermissions();
    }

    private void GetDatabaseUserRolesPermissions()
    {
        var x = string.Empty;
        if (HttpContext.Current.Session["toggle"].ToString() != null)
        {
            x = HttpContext.Current.Session["toggle"].ToString();
        }
        if (x == "0")
        {
            using (RBAC_Model _data = new RBAC_Model())
            {

                USER _user = _data.Users.Where(u => u.UserID == this.UserName).FirstOrDefault();
                if (_user != null)
                {
                    this.UserID = _user.UserID;
                    foreach (ROLE _role in _user.tbl_Role)
                    {
                        UserRole _userRole = new UserRole { RoleID = _role.RoleID, RoleName = _role.RoleName };

                        foreach (PERMISSION _permission in _role.tbl_Permission)
                        {
                            _userRole.Permissions.Add(new RolePermission
                            {
                                Permission_Id = _permission.Permission_id,
                                Module_name = _permission.Module_name,
                                Add_form = _permission.Add_form,
                                View_form = _permission.View_form,
                                Edit_form = _permission.Edit_form,
                                Delete_form = _permission.Delete_form
                            });
                        }
                        this.Roles.Add(_userRole);


                    }
                    if (!this.IsSuperAdmin)
                        this.IsSuperAdmin = _user.IsSuperAdmin;
                    if (!this.IsAdmin)
                        this.IsAdmin = _user.IsAdmin;
                }
            }
        }
        else
        {
            using (RBAC_Model _data = new RBAC_Model())
            {
                this.UserName = "Changeover";
                USER _user = _data.Users.Where(u => u.UserID == this.UserName).FirstOrDefault();
                if (_user != null)
                {
                    this.UserID = _user.UserID;
                    foreach (ROLE _role in _user.tbl_Role)
                    {
                        UserRole _userRole = new UserRole { RoleID = 35, RoleName = "Changeoverrole" };

                        foreach (PERMISSION _permission in _role.tbl_Permission)
                        {
                            _userRole.Permissions.Add(new RolePermission
                            {
                                Permission_Id = _permission.Permission_id,
                                Module_name = _permission.Module_name,
                                Add_form = _permission.Add_form,
                                View_form = _permission.View_form,
                                Edit_form = _permission.Edit_form,
                                Delete_form = _permission.Delete_form
                            });
                        }
                        this.Roles.Add(_userRole);


                    }
                    if (!this.IsSuperAdmin)
                        this.IsSuperAdmin = _user.IsSuperAdmin;
                    if (!this.IsAdmin)
                        this.IsAdmin = _user.IsAdmin;
                }
            }

        }
    }

    public bool HasPermission(string requiredPermission)
    {
        string[] return_str = requiredPermission.Split('-');
        bool bFound = false;
        if (return_str[1].ToString() == "Add")
        {
            foreach (UserRole role in this.Roles)
            {
                bFound = (role.Permissions.Where(p => p.Module_name.ToLower() == return_str[0].ToString().ToLower() && p.Add_form == "1").ToList().Count > 0);
                if (bFound)
                    break;
            }
        }
        else if (return_str[1].ToString() == "Edit")
        {
            foreach (UserRole role in this.Roles)
            {
                bFound = (role.Permissions.Where(p => p.Module_name.ToLower() == return_str[0].ToString().ToLower() && p.Edit_form == "1").ToList().Count > 0); if (bFound)
                    break;
            }
        }
        else if (return_str[1].ToString() == "Delete")
        {
            foreach (UserRole role in this.Roles)
            {
                bFound = (role.Permissions.Where(p => p.Module_name.ToLower() == return_str[0].ToString().ToLower() && p.Delete_form == "1").ToList().Count > 0); if (bFound)
                    break;
            }
        }
        else if (return_str[1].ToString() == "View")
        {
            foreach (UserRole role in this.Roles)
            {
                bFound = (role.Permissions.Where(p => p.Module_name.ToLower() == return_str[0].ToString().ToLower() && p.View_form == "1").ToList().Count > 0); if (bFound)
                    break;
            }
        }

        if (this.IsSuperAdmin == true)
        {
            bFound = true;
        }
        else if (this.IsAdmin == true)
        {
            bFound = true;
        }

        return bFound;
    }

    public bool HasRole(string role)
    {
        return (Roles.Where(p => p.RoleName == role).ToList().Count > 0);
    }

    public bool HasRoles(string roles)
    {
        bool bFound = false;
        string[] _roles = roles.ToLower().Split(';');
        foreach (UserRole role in this.Roles)
        {
            try
            {
                bFound = _roles.Contains(role.RoleName.ToLower());
                if (bFound)
                    return bFound;
            }
            catch (Exception)
            {
            }
        }
        return bFound;
    }
}

public class UserRole
{
    public int RoleID { get; set; }
    public string RoleName { get; set; }
    public List<RolePermission> Permissions = new List<RolePermission>();
}

public class RolePermission
{
    public int Permission_Id { get; set; }
    public string Module_name { get; set; }
    public string Add_form { get; set; }
    public string View_form { get; set; }
    public string Edit_form { get; set; }
    public string Delete_form { get; set; }

}