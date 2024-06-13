using Microsoft.AspNetCore.Mvc;
using ProjetoA3.Models;
using System.Collections.Generic;
using System.Linq;
using TaskModel = ProjetoA3.Models.Task;

namespace ProjetoA3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [HttpGet]
        public ActionResult<IEnumerable<TaskModel>> Get()
        {
            return _context.Tasks.ToList();
        }

        [HttpPost]
        public ActionResult<TaskModel> Post(TaskModel task)
        {
            _context.Tasks.Add(task);
            _context.SaveChanges();
            return Ok(task);
        }
        [HttpPut("{id}")]
        public ActionResult<TaskModel> Put(int id, TaskModel task)
        {
            var existingTask = _context.Tasks.Find(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.IsComplete = task.IsComplete;

            _context.SaveChanges();

            return Ok(existingTask);
        }
    }
}
        