namespace EventManager.API.Dto.Event.Image
{
    public class EventImageNew
    {
        public EventImageNew()
        {
            EventImageCreatedOnDateTime = DateTime.Now;
        }

        public bool EventImageIsMain { get; set; }

        public long EventId { get; set; }

        public long FileId { get; set; }

        public DateTime EventImageCreatedOnDateTime { get; set; }
    }
}
