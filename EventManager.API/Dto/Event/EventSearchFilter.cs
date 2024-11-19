using EventManager.API.Helpers;
using LinqToDB.Mapping;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Event
{
    [GenerateZodSchema]
    public class EventSearchFilter
    {
        [Nullable]
        public string EventName { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Размерът на страниците трябва да е по-голям от 0")]
        public int PageSize { get; set; }
    }
}
