using EventManager.API.Helpers;
using Newtonsoft.Json;

namespace EventManager.API.Dto.Event
{
    [GenerateZodSchema]
    public class EventNew : EventManipulationDto
    {
        public EventNew()
        {
            EventCreatedAtDateTime = DateTime.Now;
        }

        [JsonIgnore]
        public DateTime EventCreatedAtDateTime { get; set; }
    }
}
