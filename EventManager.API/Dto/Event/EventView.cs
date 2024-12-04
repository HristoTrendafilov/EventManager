using EventManager.API.Helpers;
using EventManager.DAL;

namespace EventManager.API.Dto.Event
{
    [GenerateTypeScriptInterface]
    public class EventView : VEventPoco
    {
        public EventView()
        {
            Subscribers = new List<UserEventView>();
        }

        public bool CanEdit { get; set; }
        public bool IsUserSubscribed { get; set; }
        public string MainImageUrl { get; set; }
        public List<UserEventView> Subscribers { get; set; }
    }
}
