using EventManager.API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Event
{
    [GenerateZodSchema]
    public abstract class EventBaseForm
    {
        [Required(ErrorMessage = "Името на събитието е задължително.")]
        [MinLength(5, ErrorMessage = "Името на събитието трябва да е поне 5 символа.")]
        public virtual string EventName { get; set; }

        public virtual string EventDescription { get; set; }

        [Range(typeof(DateTime), "01-01-1900", "01-01-3000", ErrorMessage = "Дата на събитието е задължителна.")]
        public virtual DateTime EventStartDateTime { get; set; }

        public virtual DateTime? EventEndDateTime { get; set; }

        [Range(1, long.MaxValue, ErrorMessage = "Регионът на събитието е задължителен.")]
        public virtual long RegionId { get; set; }

        public virtual IFormFile MainImage { get; set; }
    }
}
