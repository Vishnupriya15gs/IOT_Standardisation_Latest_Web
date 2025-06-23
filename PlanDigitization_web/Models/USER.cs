using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace RBACModel
{
    [Table("Users")]
    public partial class USER
    {
        public USER()
        {
            tbl_Role = new HashSet<ROLE>();
        }

        [Key]
        public string UserID { get; set; }

        [Required]
        [StringLength(30)]
        public string UserName { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        public bool IsSuperAdmin { get; set; }
        public bool IsAdmin { get; set; }

        [StringLength(50)]
        public string LastName { get; set; }

        public virtual ICollection<ROLE> tbl_Role { get; set; }
    }
}
