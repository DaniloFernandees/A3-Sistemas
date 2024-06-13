using Microsoft.EntityFrameworkCore;

namespace ProjetoA3.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Task> Tasks { get; set; }
    }
}