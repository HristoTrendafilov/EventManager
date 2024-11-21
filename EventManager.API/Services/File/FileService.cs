using EventManager.DAL;

namespace EventManager.API.Services.FileStorage
{
    public class FileService : IFileService
    {
        private readonly PostgresConnection _db;
        private readonly IConfiguration _config;

        public FileService(PostgresConnection db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<long> CreateFileAsync(IFormFile file, long? currentUserId)
        {
            var fileFolder = Path.Combine(_config["FileStoragePath"], DateTime.Now.ToString("yyyy-MM-dd"));
            Directory.CreateDirectory(fileFolder);

            var filePath = Path.Combine(fileFolder, Guid.NewGuid().ToString());

            using (Stream fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            var filePoco = new FilePoco
            {
                FileName = file.FileName,
                FileExtension = Path.GetExtension(file.FileName),
                FileStoragePath = filePath,
                FileCreatedOnDateTime = DateTime.Now
            };

            return await _db.Files.X_CreateAsync(filePoco, currentUserId);
        }
    }
}
