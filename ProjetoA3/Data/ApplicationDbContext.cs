using Microsoft.EntityFrameworkCore;

namespace ProjetoA3.Models
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        public DbSet<Task> Tasks { get; set; }
    }
}
