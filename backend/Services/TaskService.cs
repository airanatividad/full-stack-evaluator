using Microsoft.EntityFrameworkCore;
using TaskManager.DTOs;
using TaskManager.Models;
using TaskManager.Data;

namespace TaskManager.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GetTaskDto>> GetAllTasksAsync()
        {
            return await _context.Tasks
                .Select(t => new GetTaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    IsDone = t.IsDone
                })
                .ToListAsync();
        }

        public async Task<GetTaskDto?> GetTaskByIdAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return null;
            return new GetTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                IsDone = task.IsDone
            };
        }

        public async Task<GetTaskDto> CreateTaskAsync(CreateTaskDto dto)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                UserId = dto.UserId,
                IsDone = false
            };
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return new GetTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                IsDone = task.IsDone
            };
        }

        public async Task<bool> UpdateTaskAsync(int id, GetTaskDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;
            task.Title = dto.Title;
            task.IsDone = dto.IsDone;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
