namespace EventManager.DTO.Event.Image
{
    public class ImageDto
    {
        public long ImageId { get; set; }

        public string ImageName { get; set; }

        public string ImageExtension { get; set; }

        public string ImageFilePath { get; set; }

        public bool ImageIsMain { get; set; }

        public long EventId { get; set; }
    }
}
