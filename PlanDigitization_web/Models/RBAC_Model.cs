namespace RBACModel
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class RBAC_Model : DbContext
    {
        public RBAC_Model()
            : base("name=Auth_con")
        {
        }

        public virtual DbSet<PERMISSION> tbl_Permission { get; set; }
        public virtual DbSet<ROLE> tbl_Role { get; set; }
        public virtual DbSet<USER> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PERMISSION>()
                .HasMany(e => e.tbl_Role)
                .WithMany(e => e.tbl_Permission)
                .Map(m => m.ToTable("LNK_ROLE_PERMISSION").MapLeftKey("Permission_id").MapRightKey("RoleID"));

            modelBuilder.Entity<ROLE>()
                .HasMany(e => e.Users)
                .WithMany(e => e.tbl_Role)
                .Map(m => m.ToTable("LNK_USER_ROLE").MapLeftKey("RoleID").MapRightKey("UserID"));
        }
    }
}
