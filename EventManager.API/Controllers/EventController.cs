using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Event;
using EventManager.API.Services.Shared;
using EventManager.BOL;
using EventManager.API.Dto.Event;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using EventManager.API.Dto;
using Newtonsoft.Json.Serialization;
using EventManager.DAL;
using EventManager.API.Services.FileStorage;

namespace EventManager.API.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventController : ControllerBase
    {
        const int _maxEventsPageCount = 20;

        private readonly IEventService _eventService;
        private readonly ISharedService _sharedService;
        private readonly IFileService _fileService;

        public EventController(IEventService eventService, ISharedService sharedService, IFileService fileService)
        {
            _eventService = eventService;
            _sharedService = sharedService;
            _fileService = fileService;
        }

        [HttpGet("{eventId}/view")]
        public async Task<ActionResult> GetEventView(long eventId)
        {
            var eventView = await _eventService.GetEventViewAsync(x => x.EventId == eventId, true);
            if (eventView == null)
            {
                return NotFound();
            }

            var currentUserId = User.X_CurrentUserId();

            eventView.CanEdit = await _sharedService.IsUserAuthorizedToEdit(User, eventView.EventCreatedByUserId);
            eventView.MainImageUrl = _fileService.CreatePublicFileUrl(eventView.MainImageRelativePath, FileService.NO_IMAGE_FILE);
            eventView.IsUserSubscribed = currentUserId.HasValue && 
                await _eventService.UserSubscriptionExists(x => x.EventId == eventId && x.UserId == currentUserId.Value);

            return Ok(eventView);
        }

        [HttpGet("{eventId}/subscribers")]
        public async Task<ActionResult> GetEventSubscribers(long eventId)
        {
            var subscribers = await _eventService.GetAllEventSubscribersViewAsync(eventId);
            var subscribersToReturn = Mapper.CreateList<UserEventView>(subscribers);

            return Ok(subscribersToReturn);
        }

        [HttpPost("search/{pageNumber}")]
        public async Task<ActionResult> GetPaginationEvents(int pageNumber, EventSearchFilter filter)
        {
            if (filter.PageSize > _maxEventsPageCount)
            {
                filter.PageSize = _maxEventsPageCount;
            }

            var predicate = PredicateBuilder.True<VEventPoco>();

            if (!string.IsNullOrWhiteSpace(filter.EventName))
            {
                predicate = predicate.And(x => x.EventName.StartsWith(filter.EventName) || x.EventName.Contains(filter.EventName));
            }

            var (events, paginationMetadata) = await _eventService.GetPaginationEventsAsync(predicate, pageNumber, filter.PageSize);

            Response.Headers.Append("X-Pagination", JsonConvert.SerializeObject(paginationMetadata, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            }));

            var eventsToReturn = Mapper.CreateList<EventView>(events);
            foreach (var @event in eventsToReturn)
            {
                @event.MainImageUrl = _fileService.CreatePublicFileUrl(@event.MainImageRelativePath, FileService.NO_IMAGE_FILE);
            }

            return Ok(eventsToReturn);
        }

        [Authorize]
        [Role(UserRole.EventCreator)]
        [HttpGet("{eventId}/update")]
        public async Task<ActionResult> GetEventForUpdate(long eventId)
        {
            var eventView = await _eventService.GetEventViewAsync(x => x.EventId == eventId, true);
            if (eventView == null)
            {
                return NotFound();
            }

            if (!await _sharedService.IsUserAuthorizedToEdit(User, eventView.EventCreatedByUserId))
            {
                return Unauthorized();
            }
             
            var eventToReturn = Mapper.CreateObject<EventForUpdate>(eventView);

            return Ok(eventToReturn);
        }

        [Authorize]
        [Role(UserRole.EventCreator)]
        [HttpPut("{eventId}/update")]
        public async Task<ActionResult> UpdateEvent(long eventId, [FromForm] EventUpdate @event)
        {
            if (await _eventService.EventExistsAsync(x => x.EventName == @event.EventName && x.EventId != eventId))
            {
                return BadRequest($"Вече съществува събитие с име: {@event.EventName}");
            }

            if (@event.EventEndDateTime.HasValue && @event.EventEndDateTime.Value < @event.EventStartDateTime)
            {
                return BadRequest($"Датата за край на събитието не може да е по-малка от тази за начало");
            }

            var eventPoco = await _eventService.GetEventPocoAsync(x => x.EventId == eventId);
            if (!await _sharedService.IsUserAuthorizedToEdit(User, eventPoco.EventCreatedByUserId))
            {
                return Unauthorized();
            }

            await _eventService.UpdateEventAsync(eventId, @event, User.X_CurrentUserId());

            return Ok(new PrimaryKeyResponse { PrimaryKey = eventId });
        }

        [Authorize]
        [Role(UserRole.EventCreator)]
        [HttpPost("new")]
        public async Task<ActionResult> CreateEvent([FromForm] EventNew @event)
        {
            if (await _eventService.EventExistsAsync(x => x.EventName == @event.EventName))
            {
                return BadRequest($"Вече съществува събитие с име: {@event.EventName}");
            }

            if (@event.EventEndDateTime.HasValue && @event.EventEndDateTime.Value < @event.EventStartDateTime)
            {
                return BadRequest($"Датата за край на събитието не може да е по-малка от тази за начало");
            }

            var currentUserId = User.X_CurrentUserId();
            @event.EventCreatedByUserId = currentUserId.Value;

            var eventId = await _eventService.CreateEventAsync(@event, currentUserId);

            return Ok(new PrimaryKeyResponse { PrimaryKey = eventId });
        }

        [Authorize]
        [Role(UserRole.Admin)]
        [HttpDelete("{eventId}/delete")]
        public async Task<ActionResult> DeleteEvent(long eventId)
        {
            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            var eventPoco = await _eventService.GetEventPocoAsync(x => x.EventId == eventId);

            if (!await _sharedService.IsUserAuthorizedToEdit(User, eventPoco.EventCreatedByUserId))
            {
                return Unauthorized();
            }

            await _eventService.DeleteEventAsync(eventId, User.X_CurrentUserId());

            return NoContent();
        }

        [Authorize]
        [HttpPost("{eventId}/subscription")]
        public async Task<ActionResult> SubscribeUserForEvent(long eventId)
        {
            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            var currentUserId = User.X_CurrentUserId();

            if (await _eventService.UserSubscriptionExists(x => x.UserId == currentUserId.Value && x.EventId == eventId))
            {
                return BadRequest($"Вече е записан потребител с ID: {currentUserId.Value}");
            }

            var eventView = await _eventService.GetEventViewAsync(x => x.EventId == eventId, false);
            if (eventView.EventHasEnded)
            {
                return BadRequest("Събитието вече е приключило. Не може да се запишете");
            }

            var userEventId = await _eventService.SubscribeUser(eventId, currentUserId);
            var userEvent = await _eventService.GetEventSubscriberViewAsync(x => x.UserEventId == userEventId);
            var userEventToReturn = Mapper.CreateObject<UserEventView>(userEvent);

            return Ok(userEventToReturn);
        }

        [Authorize]
        [HttpDelete("{eventId}/subscription")]
        public async Task<ActionResult> UnsubscribeUserFromEvent(long eventId)
        {
            var currentUserId = User.X_CurrentUserId();

            if (!await _eventService.UserSubscriptionExists(x => x.UserId == currentUserId.Value && x.EventId == eventId))
            {
                return BadRequest($"Не съществува записан потребител с ID: {currentUserId.Value}");
            }

            var userEventId = await _eventService.UnsubscribeUser(currentUserId.Value, eventId, currentUserId);

            return Ok(new PrimaryKeyResponse { PrimaryKey = userEventId });
        }
    }
}
