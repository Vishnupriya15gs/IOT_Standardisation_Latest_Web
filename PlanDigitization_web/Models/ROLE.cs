using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;
namespace RBACModel
{
    [Table("tbl_Role")]
    public partial class ROLE
    {
        public ROLE()
        {
            tbl_Permission = new HashSet<PERMISSION>();
            Users = new HashSet<USER>();
        }
        [Key]
        public int RoleID { get; set; }
        public int Unique_id { get; set; }
        [Required]
        public string RoleName { get; set; }
       
        public virtual ICollection<PERMISSION> tbl_Permission { get; set; }
        public virtual ICollection<USER> Users { get; set; }
    }
}
