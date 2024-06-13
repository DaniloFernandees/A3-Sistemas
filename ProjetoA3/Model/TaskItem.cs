namespace ProjetoA3.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Responsible { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? DeadDate { get; set; }
    }
}
