using LinqToDB.Mapping;

namespace EventManager.API.Dto.File
{
    public class FileBaseForm
    {
        public virtual string FileName { get; set; }

        [Nullable]
        public virtual string FileExtension { get; set; }

        public virtual string FileStoragePath { get; set; }
    }
}
