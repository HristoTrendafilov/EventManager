
namespace EventManager.API.Services.FileStorage
{
    public interface IFileService
    {
        Task<long> CreateFileAsync(IFormFile file, FileType type, long? currentUserId);
        Task<string> GetPublicFileUrlAsync(long fileId, string fallbackFile);
        string CreatePublicFileUrl(string relativePath, string fallbackFile);
        Task DeleteFileAsync(long fileId, long? currentUserId);
    }
}