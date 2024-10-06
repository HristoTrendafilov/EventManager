using EventManager.DTO.Event.Image;
using Microsoft.AspNetCore.Http;

namespace EventManager.DTO.Event
{
    public class EventNew : EventManipulationDto
    {
        public IFormFile Image { get; set; }
    }
}
