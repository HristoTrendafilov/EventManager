using EventManager.API.Helpers;
using LinqToDB.Mapping;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Event
{
    [GenerateZodSchema]
    public class EventBaseForm
    {
        [Required(ErrorMessage = "Името на събитието е задължително.")]
         public virtual string EventName { get; set; }

        [Range(typeof(DateTime), "01-01-1971", "01-01-3000", ErrorMessage = "Дата на събитието е задължителна.")]
        public virtual DateTime EventStartDateTime { get; set; }

        [Range(1, long.MaxValue, ErrorMessage = "Регионът на събитието е задължителен.")]
        public virtual long RegionId { get; set; }

        [Nullable]
        public virtual string EventDescription { get; set; }

        [Nullable]
        public virtual DateTime? EventEndDateTime { get; set; }

        [Nullable]
        [MaxFileSize(1 * 1024 * 1024, ErrorMessage = "Максималният размер за файл е 1MB")]
        public virtual IFormFile MainImage { get; set; }
    }
}
