
namespace EventManager.API.Services.FileStorage
{
    public interface IFileService
    {
        Task<long> CreateFileAsync(IFormFile file, long? currentUserId);
        Task DeleteFileAsync(long fileId, long? currentUserId);
    }
}