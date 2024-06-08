using System.ComponentModel.DataAnnotations;

namespace EventManager.DTO.Event
{
    public abstract class EventManipulationDto
    {
        [Required(ErrorMessage = "Името на събитието е задължително.")]
        [MinLength(5, ErrorMessage = "Името на събитието трябва да е поне 5 символа.")]
        public string EventName { get; set; }

        public string EventDescription { get; set; }

        [Range(typeof(DateTime), "01-01-1900", "01-01-3000", ErrorMessage = "Дата на събитието е задължителна.")]
        public DateTime EventStartDateTime { get; set; }

        public DateTime? EventEndDateTime { get; set; }

        public long CreatedByUserId { get; set; }

        [Range(1, long.MaxValue, ErrorMessage = "Регионът на събитието е задължителен.")]
        public long RegionId { get; set; }
    }
}
