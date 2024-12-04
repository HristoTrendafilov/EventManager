using EventManager.API.Helpers;
using EventManager.DAL;
using EventManager.API.Dto.Event;
using System.Linq.Expressions;

namespace EventManager.API.Services.Event
{
    public interface IEventService
    {
        Task<EventView> GetEventViewAsync(Expression<Func<VEventPoco, bool>> predicate, bool includeMainImageUrl);
        Task<(List<VEventPoco> events, PaginationMetadata metadata)> GetPaginationEventsAsync
            (Expression<Func<VEventPoco, bool>> predicate, int pageNumber, int pageSize);
        Task<EventPoco> GetEventPocoAsync(Expression<Func<EventPoco, bool>> predicate);
        Task<List<EventView>> GetAllEventsViewAsync(Expression<Func<VEventPoco, bool>> predicate, bool includeMainImageUrl);
        Task<long> CreateEventAsync(EventNew newEvent, long? currentUserId);
        Task UpdateEventAsync(long eventId, EventBaseForm updateEvent, long? currentUserId);
        Task DeleteEventAsync(long eventId, long? currentUserId);
        Task<bool> EventExistsAsync(Expression<Func<EventPoco, bool>> predicate);
        Task<byte[]> GetEventMainImageAsync(long eventId);

        Task<long> SubscribeUser(long eventId, long? currentUserId);
        Task<long> UnsubscribeUser(long userId, long eventId, long? currentUserId);
        Task<bool> UserSubscriptionExists(Expression<Func<UserEventPoco, bool>> predicate);
        Task<List<UserEventView>> GetAllEventSubscribersViewAsync(long eventId);
        Task<UserEventView> GetEventSubscriberViewAsync(Expression<Func<VUserEventPoco, bool>> predicate);
    }
}