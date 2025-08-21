using Microsoft.AspNetCore.Mvc;

using TaskManager.DTOs;
using TaskManager.Services;  
namespace TaskManager.API
{
    [Route("tasks")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITasksService _taskService;

        public TasksController(ITasksService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            var task = await _taskService.CreateTaskAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null)
                return NotFound();
            return Ok(task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] GetTaskDto dto)
        {
            var success = await _taskService.UpdateTaskAsync(id, dto);
            if (!success) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _taskService.DeleteTaskAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
