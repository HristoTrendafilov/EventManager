using Newtonsoft.Json;

namespace EventManager.API.Dto.Event
{
    public class EventNew : EventBaseForm
    {
        public EventNew()
        {
            EventCreatedOnDateTime = DateTime.Now;
        }

        [JsonIgnore]
        public DateTime EventCreatedOnDateTime { get; set; }

        [JsonIgnore]
        public virtual long EventCreatedByUserId { get; set; }
    }
}
