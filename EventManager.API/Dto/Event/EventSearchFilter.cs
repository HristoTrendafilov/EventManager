using EventManager.API.Helpers;
using LinqToDB.Mapping;

namespace EventManager.API.Dto.Event
{
    [GenerateZodSchema]
    public class EventSearchFilter
    {
        [Nullable]
        public string EventName { get; set; }
    }
}
