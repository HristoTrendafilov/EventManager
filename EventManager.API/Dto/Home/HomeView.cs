using EventManager.API.Dto.Event;

namespace EventManager.API.Dto.Home
{
    public class HomeView
    {
        public HomeView()
        {
            IncommingEvents = new List<EventView>();
        }

        public List<EventView> IncommingEvents { get; set; }
    }
}
