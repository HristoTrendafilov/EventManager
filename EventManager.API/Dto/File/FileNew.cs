using LinqToDB.Mapping;

namespace EventManager.API.Dto.File
{
    public class FileNew
    {
        public FileNew()
        {
            FileCreatedOnDateTime = DateTime.Now;
        }

        public virtual string FileName { get; set; }

        [Nullable]
        public virtual string FileExtension { get; set; }

        public virtual string FileStoragePath { get; set; }

        public virtual DateTime FileCreatedOnDateTime { get; set; }
    }
}
