namespace RBACModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("tbl_Permission")]
    public partial class PERMISSION
    {
        public PERMISSION()
        {
            tbl_Role = new HashSet<ROLE>();
        }

        [Key]
        public int Permission_id { get; set; }
        public string RoleID { get; set; }

        [Required]
        [StringLength(50)]
        public string Module_name { get; set; }

        public string Add_form { get; set; }
        public string View_form { get; set; }
        public string Delete_form { get; set; }
        public string Edit_form { get; set; }

        public virtual ICollection<ROLE> tbl_Role { get; set; }
    }
}
