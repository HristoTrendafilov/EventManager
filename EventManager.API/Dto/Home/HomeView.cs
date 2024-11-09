using EventManager.API.Dto.Event;
using EventManager.API.Helpers;

namespace EventManager.API.Dto.Home
{
    [GenerateTypeScriptInterface]
    public class HomeView
    {
        public HomeView()
        {
            IncommingEvents = new List<EventView>();
        }

        public List<EventView> IncommingEvents { get; set; }
    }
}
