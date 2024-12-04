using EventManager.API.Dto.File;
using EventManager.DAL;
using LinqToDB;

namespace EventManager.API.Services.FileStorage
{
    public class FileService : IFileService
    {
        private readonly PostgresConnection _db;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public const string NO_IMAGE_FILE = "public/no-image.png";
        public const string NO_USER_LOGO = "public/no-user-logo.png";

        public FileService(PostgresConnection db, IConfiguration config, IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            _config = config;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<long> CreateFileAsync(IFormFile file, FileType type, long? currentUserId)
        {
            var relativeFolderPath = Path.Combine(type.ToString().ToLower(), DateTime.Now.ToString("yyyy-MM-dd"));
            var relativeFilePath = Path.Combine(relativeFolderPath, Guid.NewGuid().ToString());

            Directory.CreateDirectory(Path.Combine(_config["FileStoragePath"], relativeFolderPath));

            using (Stream fileStream = new FileStream(Path.Combine(_config["FileStoragePath"], relativeFilePath), FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            var fileNew = new FileNew
            {
                FileName = file.FileName,
                FileStorageRelativePath = relativeFilePath,
                FileExtension = Path.GetExtension(file.FileName),
            };

            return await _db.Files.X_CreateAsync(fileNew, currentUserId);
        }

        public async Task<string> GetPublicFileUrlAsync(long fileId, string fallbackFile)
        {
            var relativePath = await _db.Files
                .Where(x => x.FileId == fileId)
                .Select(x => x.FileStorageRelativePath)
                .FirstOrDefaultAsync();

            var urlPath = CreatePublicFileUrl(relativePath, fallbackFile);

            return urlPath;
        }

        public string CreatePublicFileUrl(string relativePath, string fallbackFile)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
            {
                relativePath = fallbackFile;
            }

            var domain = _webHostEnvironment.IsDevelopment() ? "http://localhost" : "https://ihelp.bg";
            var urlPath = $"{domain}/storage/{relativePath}";

            return urlPath;
        }

        public async Task DeleteFileAsync(long fileId, long? currentUserId)
        {
            var file = await _db.Files.FirstOrDefaultAsync(x => x.FileId == fileId);
            if (file == null)
            {
                return;
            }

            var fileStoragePath = Path.Combine(_config["FileStoragePath"], file.FileStorageRelativePath);
            if (File.Exists(fileStoragePath))
            {
                File.Delete(fileStoragePath);
            }

            await _db.Files.X_DeleteAsync(x => x.FileId == fileId, currentUserId);
        }
    }

    public enum FileType
    {
        Public,
        Private
    }
}
