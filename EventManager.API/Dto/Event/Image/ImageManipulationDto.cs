using System.ComponentModel.DataAnnotations;

namespace EventManager.Dto.Event.Image
{
    public abstract class ImageManipulationDto
    {
        [Required(ErrorMessage = "Името на изображението е задължително.")]
        public string ImageName { get; set; }

        [Required(ErrorMessage = "Съдържанието на снимката е задължително.")]
        public string ImageBase64 { get; set; }

        public string ImageExtension { get; set; }

        public string ImageFilePath { get; set; }

        public bool ImageIsMain { get; set; }

        public long EventId { get; set; }
    }
}
