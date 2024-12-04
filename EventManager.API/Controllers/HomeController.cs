using EventManager.API.Dto.Home;
using EventManager.API.Services.Event;
using Microsoft.AspNetCore.Mvc;

namespace EventManager.API.Controllers
{
    [Route("api/home")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IEventService _eventService;

        public HomeController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<ActionResult> GetHomeView()
        {
            var incomingEvents = await _eventService.GetAllEventsViewAsync(x => !x.EventHasEnded, true);

            var view = new HomeView
            {
                IncommingEvents = incomingEvents,
            };

            return Ok(view);
        }
    }
}
