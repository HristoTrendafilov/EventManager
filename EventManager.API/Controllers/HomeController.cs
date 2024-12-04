using EventManager.API.Dto.Event;
using EventManager.API.Dto.Home;
using EventManager.API.Services.Event;
using EventManager.API.Services.FileStorage;
using EventManager.BOL;
using Microsoft.AspNetCore.Mvc;

namespace EventManager.API.Controllers
{
    [Route("api/home")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly IFileService _fileService;

        public HomeController(IEventService eventService, IFileService fileService)
        {
            _eventService = eventService;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<ActionResult> GetHomeView()
        {
            var incomingEventsPoco = await _eventService.GetAllEventsViewAsync(x => x.EventStartDateTime >= DateTime.Now);
            var incomingEvents = Mapper.CreateList<EventView>(incomingEventsPoco);

            foreach (var @event in incomingEvents)
            {
                @event.MainImageUrl = _fileService.CreatePublicFileUrl(@event.MainImageRelativePath, FileService.NO_IMAGE_FILE);
            }

            var view = new HomeView
            {
                IncommingEvents = incomingEvents,
            };

            return Ok(view);
        }
    }
}
