using EventManager.Dto.Event.Image;

namespace EventManager.Dto.Event
{
    public class EventUpdate : EventManipulationDto
    {
        public ImageUpdate Image { get; set; }
    }
}
