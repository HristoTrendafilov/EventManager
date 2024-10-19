
namespace EventManager.API.Services.FileStorage
{
    public interface IFileStorageService
    {
        Task<string> SaveFileToStorage(IFormFile file);
    }
}