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

namespace EventManager.API.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventController : ControllerBase
    {
        const int _maxEventsPageCount = 20;

        private readonly IEventService _eventService;
        private readonly ISharedService _sharedService;
        private readonly Mapper _mapper;

        public EventController(IEventService eventService, ISharedService sharedService, Mapper mapper)
        {
            _eventService = eventService;
            _sharedService = sharedService;
            _mapper = mapper;
        }

        [HttpGet("{eventId}/view")]
        public async Task<ActionResult> GetEventView(long eventId)
        {
            var eventViewPoco = await _eventService.GetEventViewAsync(x => x.EventId == eventId);
            if (eventViewPoco == null)
            {
                return NotFound();
            }

            var eventView = _mapper.CreateObject<EventView>(eventViewPoco);
            eventView.CanEdit = await _sharedService.IsUserAuthorizedToEdit(User, eventView.CreatedByUserId.Value);

            var currentUserId = User.X_CurrentUserId();
            if (currentUserId.HasValue)
            {
                eventView.IsUserSubscribed = await _eventService.UserSubscriptionExists(x => x.EventId == eventId && x.UserId == currentUserId.Value);
            }

            return Ok(eventView);
        }

        [HttpGet("{eventId}/subscribers")]
        public async Task<ActionResult> GetEventSubscribers(long eventId)
        {
            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            var subscribers = await _eventService.GetAllEventSubscribersViewAsync(eventId);
            var subscribersToReturn = _mapper.CreateList<UserEventView>(subscribers);

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

            var eventsToReturn = _mapper.CreateList<EventView>(events);

            return Ok(eventsToReturn);
        }

        [Authorize]
        [HttpGet("{eventId}/update")]
        public async Task<ActionResult> GetEventForUpdate(long eventId)
        {
            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            var eventPoco = await _eventService.GetEventAsync(x => x.EventId == eventId);

            if (!await _sharedService.IsUserAuthorizedToEdit(User, eventPoco.CreatedByUserId))
            {
                return Unauthorized();
            }

            var eventToReturn = _mapper.CreateObject<EventDto>(eventPoco);

            return Ok(eventToReturn);
        }

        [Authorize]
        [Role(UserRole.EventCreator)]
        [HttpPut("{eventId}/update")]
        public async Task<ActionResult> UpdateEvent(long eventId, [FromForm] EventUpdate @event)
        {
            if (!await _sharedService.IsUserAuthorizedToEdit(User, @event.CreatedByUserId))
            {
                return Unauthorized();
            }

            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            if (await _eventService.EventExistsAsync(x => x.EventName == @event.EventName && x.EventId != eventId))
            {
                return BadRequest($"Вече съществува събитие с име: {@event.EventName}");
            }

            await _eventService.UpdateEventAsync(eventId, @event, User.X_CurrentUserId());

            return Ok(new SaveEventResponse { EventId = eventId });
        }

        [HttpGet("{eventId}/main-image")]
        public async Task<ActionResult> GetEventMainImage(long eventId)
        {
            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            var mainImage = await _eventService.GetEventMainImageAsync(eventId);
            if (mainImage == null)
            {
                return NotFound();
            }

            return File(mainImage, "application/octet-stream");
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

            var currentUserId = User.X_CurrentUserId();
            @event.CreatedByUserId = currentUserId.Value;

            var eventId = await _eventService.CreateEventAsync(@event, currentUserId);

            return Ok(new SaveEventResponse { EventId = eventId });
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

            var eventPoco = await _eventService.GetEventAsync(x => x.EventId == eventId);

            if (!await _sharedService.IsUserAuthorizedToEdit(User, eventPoco.CreatedByUserId))
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

            var userEventId = await _eventService.SubscribeUser(eventId, currentUserId);
            var userEvent = await _eventService.GetEventSubscriberViewAsync(x => x.UserEventId == userEventId);
            var userEventToReturn = _mapper.CreateObject<UserEventView>(userEvent);

            return Ok(userEventToReturn);
        }

        [Authorize]
        [HttpDelete("{eventId}/subscription")]
        public async Task<ActionResult> UnsubscribeUserFromEvent(long eventId)
        {
            var currentUserId = User.X_CurrentUserId();
            var userEventId = await _eventService.UnsubscribeUser(currentUserId.Value, eventId, currentUserId);

            return Ok(new PrimaryKeyResponse { PrimaryKey = userEventId });
        }
    }
}
