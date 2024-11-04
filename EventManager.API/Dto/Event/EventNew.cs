namespace EventManager.API.Dto.Event
{
    public class EventNew : EventManipulationDto
    {
        public EventNew()
        {
            EventCreatedAtDateTime = DateTime.Now;
        }

        public DateTime EventCreatedAtDateTime { get; set; }
    }
}
