using Microsoft.AspNetCore.Mvc;

namespace ProjetoA3.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private static List<Task> tasks = new List<Task>();

        // GET: api/tasks
        [HttpGet]
        public IEnumerable<Task> Get()
        {
            return tasks;
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public ActionResult<Task> Get(int id)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }
            return task;
        }
    }
}
