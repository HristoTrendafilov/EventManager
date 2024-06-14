using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Services.Event;
using EventManager.BOL;
using EventManager.DTO.Event;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace EventManager.API.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventController : ControllerBase
    {
        const int _maxEventsPageCount = 20;

        private readonly IEventService _eventService;
        private readonly Mapper _mapper;

        public EventController(IEventService eventService, Mapper mapper)
        {
            _eventService = eventService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllEvents(int pageNumber = 1, int pageSize = 10)
        {
            if (pageSize > _maxEventsPageCount)
            {
                pageSize = _maxEventsPageCount;
            }

            var (events, paginationMetadata) = await _eventService.GetAllEventsAsync(x => true, pageNumber, pageSize);

            Response.Headers.Append("X-Pagination", JsonConvert.SerializeObject(paginationMetadata));

            var eventsToReturn = _mapper.CreateList<EventDto>(events);

            return Ok(eventsToReturn);
        }

        [HttpGet("{eventId}")]
        public async Task<ActionResult> GetEvent(long eventId)
        {
            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            var eventPoco = await _eventService.GetEventAsync(x => x.EventId == eventId);
            var eventToReturn = _mapper.CreateObject<EventDto>(eventPoco);

            return Ok(eventToReturn);
        }

        [HttpPost]
        [Authorize]
        [ClaimAccess(ClaimTypeValues.EventCreator)]
        public async Task<ActionResult> CreateEvent(EventNew eventNew)
        {
            if (await _eventService.EventExistsAsync(x => x.EventName == eventNew.EventName))
            {
                return BadRequest($"Вече съществува събитие с име: {eventNew.EventName}");
            }

            var currentUserId = User.X_GetCurrentUserId();
            eventNew.CreatedByUserId = currentUserId.Value;

            var eventId = await _eventService.CreateEventAsync(eventNew, currentUserId);

            var eventPoco = await _eventService.GetEventAsync(x => x.EventId == eventId);
            var eventToReturn = _mapper.CreateObject<EventDto>(eventPoco);

            return Ok(eventToReturn);
        }

        [HttpPut("{eventId}")]
        [Authorize]
        [ClaimAccess(ClaimTypeValues.EventCreator)]
        public async Task<ActionResult> UpdateEvent(long eventId, EventUpdate eventUpdate)
        {
            if (!User.X_IsAuthorizedToEdit(eventUpdate.CreatedByUserId))
            {
                return Unauthorized();
            }

            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            if (await _eventService.EventExistsAsync(x => x.EventName == eventUpdate.EventName && x.EventId != eventId))
            {
                return BadRequest($"Вече съществува събитие с име: {eventUpdate.EventName}");
            }

            await _eventService.UpdateEventAsync(eventId, eventUpdate, User.X_GetCurrentUserId());

            return NoContent();
        }

        [HttpDelete("{eventId}")]
        [Authorize]
        [ClaimAccess(ClaimTypeValues.Admin)]
        public async Task<ActionResult> DeleteEvent(long eventId)
        {
            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            var eventPoco = await _eventService.GetEventAsync(x => x.EventId == eventId);

            if (!User.X_IsAuthorizedToEdit(eventPoco.CreatedByUserId))
            {
                return Unauthorized();
            }

            await _eventService.DeleteEventAsync(eventId, User.X_GetCurrentUserId());

            return NoContent();
        }

        [Authorize]
        [HttpPost("subscription/{eventId}")]
        public async Task<ActionResult> SubscribeUserForEvent(long eventId)
        {
            if (!await _eventService.EventExistsAsync(x => x.EventId == eventId))
            {
                return NotFound();
            }

            var currentUserId = User.X_GetCurrentUserId();

            if (await _eventService.UserSubscriptionExists(x => x.UserId == currentUserId.Value && x.EventId == eventId))
            {
                return BadRequest($"Вече е записан потребител с ID: {currentUserId.Value}");
            }

            await _eventService.SubscribeUser(eventId, currentUserId);

            return NoContent();
        }

        [Authorize]
        [HttpDelete("subscription/{userEventId}")]
        public async Task<ActionResult> UnsubscribeUserFromEvent(long userEventId)
        {
            if (!await _eventService.UserSubscriptionExists(x => x.UserEventId == userEventId))
            {
                return NotFound();
            }

            await _eventService.UnsubscribeUser(userEventId, User.X_GetCurrentUserId());

            return NoContent();
        }
    }
}
