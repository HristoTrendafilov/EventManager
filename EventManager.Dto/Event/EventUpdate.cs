using EventManager.DTO.Event.Image;

namespace EventManager.DTO.Event
{
    public class EventUpdate : EventManipulationDto
    {
        public ImageUpdate Image { get; set; }
    }
}
