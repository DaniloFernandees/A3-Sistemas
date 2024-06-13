using Microsoft.EntityFrameworkCore;
using ProjetoA3.Models;

namespace ProjetoA3.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<TaskItem> TaskItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskItem>()
                .Property(t => t.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<TaskItem>()
                .Property(t => t.CreationDate)
                .HasColumnType("DATETIME");

            modelBuilder.Entity<TaskItem>()
                .Property(t => t.DeadDate)
                .HasColumnType("DATETIME");

            base.OnModelCreating(modelBuilder);
        }
    }
}
