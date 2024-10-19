namespace EventManager.API.Services.FileStorage
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IConfiguration _config;

        public FileStorageService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<string> SaveFileToStorage(IFormFile file)
        {
            var fileFolder = Path.Combine(_config["FileStoragePath"], DateTime.Now.ToString("yyyy-MM-dd"));
            Directory.CreateDirectory(fileFolder);

            var filePath = Path.Combine(fileFolder, Guid.NewGuid().ToString());

            using (Stream fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return filePath;
        }
    }
}
