using EventManager.DAL;

namespace EventManager.API.Dto.Event
{
    public class EventView : VEventPoco
    {
        public EventView()
        {
            Subscribers = new List<VUserEventPoco>();
        }

        public List<VUserEventPoco> Subscribers { get; set; }
        public bool IsUserSubscribed { get; set; }
    }
}
