using System.ComponentModel.DataAnnotations;

namespace ProjetoA3.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public bool IsCompleted { get; set; }
    }
}
