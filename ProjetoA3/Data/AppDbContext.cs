using Microsoft.EntityFrameworkCore;
using ProjetoA3.Models;

namespace ProjetoA3.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<TaskItem> TaskItems { get; set; }
    }
}
