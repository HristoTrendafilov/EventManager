using Newtonsoft.Json;

namespace EventManager.API.Dto.Event
{
    public class EventNew : EventBaseForm
    {
        public EventNew()
        {
            EventCreatedAtDateTime = DateTime.Now;
        }

        [JsonIgnore]
        public DateTime EventCreatedAtDateTime { get; set; }

        [JsonIgnore]
        public virtual long CreatedByUserId { get; set; }
    }
}
