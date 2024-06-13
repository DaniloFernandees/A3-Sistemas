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
    }
}
