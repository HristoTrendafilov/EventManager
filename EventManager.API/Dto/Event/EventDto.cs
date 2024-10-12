namespace EventManager.API.Dto.Event
{
    public class EventDto
    {
        public long EventId { get; set; }

        public string EventName { get; set; }

        public string EventDescription { get; set; }

        public DateTime EventStartDateTime { get; set; }

        public DateTime? EventEndDateTime { get; set; }

        public long CreatedByUserId { get; set; }

        public long RegionId { get; set; }
    }
}
