using TaskManager.DTOs;

namespace TaskManager.Services
{
    public interface ITasksService
    {
        Task<IEnumerable<GetTaskDto>> GetAllTasksAsync();
        Task<GetTaskDto?> GetTaskByIdAsync(int id);
        Task<GetTaskDto> CreateTaskAsync(CreateTaskDto dto);
        Task<bool> UpdateTaskAsync(int id, GetTaskDto dto);
        Task<bool> DeleteTaskAsync(int id);
    }
}
