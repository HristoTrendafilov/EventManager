using EventManager.API.Dto.Event;
using EventManager.API.Dto.Home;
using EventManager.API.Dto.Region;
using EventManager.API.Services.Event;
using EventManager.BOL;
using Microsoft.AspNetCore.Mvc;

namespace EventManager.API.Controllers
{
    [Route("api/home")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly Mapper _mapper;

        public HomeController(IEventService eventService, Mapper mapper)
        {
            _eventService = eventService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetHomeView()
        {
            var incomingEventsPoco = await _eventService.GetAllEventsViewAsync(x => x.EventStartDateTime >= DateTime.Now);
            var incomingEvents = _mapper.CreateList<EventView>(incomingEventsPoco);

            var view = new HomeView
            {
                IncommingEvents = incomingEvents,
            };

            return Ok(view);
        }
    }
}
