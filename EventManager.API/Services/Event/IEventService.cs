using EventManager.API.Helpers;
using EventManager.DAL;
using EventManager.API.Dto.Event;
using System.Linq.Expressions;

namespace EventManager.API.Services.Event
{
    public interface IEventService
    {
        Task<(List<EventPoco> events, PaginationMetadata metadata)> GetAllEventsAsync
            (Expression<Func<EventPoco, bool>> predicate, int pageNumber, int pageSize);
        Task<EventPoco> GetEventAsync(Expression<Func<EventPoco, bool>> predicate);
        Task<long> CreateEventAsync(EventNew newEvent, long? currentUserId);
        Task UpdateEventAsync(long eventId, EventUpdate updateEvent, long? currentUserId);
        Task DeleteEventAsync(long eventId, long? currentUserId);
        Task<bool> EventExistsAsync(Expression<Func<EventPoco, bool>> predicate);
        Task<byte[]> GetEventMainImageAsync(long eventId);

        Task<long> SubscribeUser(long eventId, long? currentUserId);
        Task UnsubscribeUser(long userEventId, long? currentUserId);
        Task<bool> UserSubscriptionExists(Expression<Func<UserEventPoco, bool>> predicate);
    }
}