namespace EventManager.API.Dto.File
{
    public class FileNew : FileBaseForm
    {
        public FileNew()
        {
            FileCreatedOnDateTime = DateTime.Now;
        }

        public virtual DateTime FileCreatedOnDateTime { get; set; }
    }
}
