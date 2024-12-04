using EventManager.API.Helpers;
using EventManager.DAL;
using EventManager.API.Dto.Event;
using EventManager.API.Dto.User;
using LinqToDB;
using System.Linq.Expressions;
using EventManager.API.Services.FileStorage;

namespace EventManager.API.Services.Event
{
    public class EventService : IEventService
    {
        private readonly PostgresConnection _db;
        private readonly IFileService _fileStorageService;

        public EventService(PostgresConnection db, IFileService fileStorageService)
        {
            _db = db;
            _fileStorageService = fileStorageService;
        }

        public Task<VEventPoco> GetEventViewAsync(Expression<Func<VEventPoco, bool>> predicate)
        {
            return _db.VEvents.FirstOrDefaultAsync(predicate);
        }

        public Task<List<VEventPoco>> GetAllEventsViewAsync(Expression<Func<VEventPoco, bool>> predicate)
        {
            return _db.VEvents.Where(predicate).ToListAsync();
        }

        public async Task<long> CreateEventAsync(EventNew @event, long? currentUserId)
        {
            return await _db.WithTransactionAsync(async () =>
            {
                var eventId = await _db.Events.X_CreateAsync(@event, currentUserId);

                if (@event.MainImage != null)
                {
                    await CreateEventImageAsync(@event.MainImage, eventId, currentUserId);
                }

                return eventId;
            });
        }

        public async Task UpdateEventAsync(long eventId, EventBaseForm @event, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                await _db.Events.X_UpdateAsync(eventId, @event, currentUserId);

                if (@event.MainImage != null)
                {
                    await DeleteEventMainImageAsync(eventId, currentUserId);
                    await CreateEventImageAsync(@event.MainImage, eventId, currentUserId);
                }
            });
        }

        private async Task CreateEventImageAsync(IFormFile file, long eventId, long? currentUserId)
        {
            var fileId = await _fileStorageService.CreateFileAsync(file, FileType.Public, currentUserId);

            var image = new EventImagePoco
            {
                EventId = eventId,
                FileId = fileId,
                EventImageIsMain = true,
                EventImageCreatedOnDateTime = DateTime.Now,
            };

            await _db.EventImages.X_CreateAsync(image, currentUserId);
        }

        private async Task DeleteEventMainImageAsync(long eventId, long? currentUserId)
        {
            var mainImage = await _db.VEventImages.FirstOrDefaultAsync(x => x.EventId == eventId && x.EventImageIsMain);
            if (mainImage == null)
            {
                return;
            }

            await _db.WithTransactionAsync(async () =>
            {
                await _db.EventImages.X_DeleteAsync(x => x.EventImageId == mainImage.EventImageId, currentUserId);
                await _fileStorageService.DeleteFileAsync(mainImage.FileId, currentUserId);
            });
        }

        public async Task DeleteEventAsync(long eventId, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                var eventImages = await _db.EventImages.Where(x => x.EventId == eventId).ToListAsync();

                await DeleteAllEventImages(eventId, currentUserId);

                await _db.UsersEvents.X_DeleteAsync(x => x.EventId == eventId, currentUserId);
                await _db.EventImages.X_DeleteAsync(x => x.EventId == eventId, currentUserId);
                await _db.Events.X_DeleteAsync(x => x.EventId == eventId, currentUserId);
            });
        }

        public async Task DeleteAllEventImages(long eventId, long? currentUserId)
        {
            var images = await _db.VEventImages.Where(x => x.EventId == eventId).ToListAsync();

            await _db.WithTransactionAsync(async () =>
            {
                foreach (var image in images)
                {
                    if (File.Exists(image.FileStoragePath))
                    {
                        File.Delete(image.FileStoragePath);
                    }
                }

                var filesIds = images.Select(x => x.FileId).ToList();
                var eventImagesIds = images.Select(x => x.EventImageId).ToList();

                await _db.Files.X_DeleteAsync(x => filesIds.Contains(x.FileId), currentUserId);
                await _db.EventImages.X_DeleteAsync(x => eventImagesIds.Contains(x.EventImageId), currentUserId);
            });
        }

        public async Task<(List<VEventPoco> events, PaginationMetadata metadata)> GetPaginationEventsAsync
            (Expression<Func<VEventPoco, bool>> predicate, int pageNumber, int pageSize)
        {
            var events = await PagedList<VEventPoco>.CreateAsync(_db.VEvents.Where(predicate), pageNumber, pageSize);

            var paginationMetadata = new PaginationMetadata
            {
                TotalCount = events.TotalCount,
                PageSize = events.PageSize,
                CurrentPage = events.CurrentPage,
                TotalPages = events.TotalPages,
            };

            return (events, paginationMetadata);
        }

        public Task<EventPoco> GetEventPocoAsync(Expression<Func<EventPoco, bool>> predicate)
        {
            return _db.Events.FirstOrDefaultAsync(predicate);
        }

        public Task<bool> EventExistsAsync(Expression<Func<EventPoco, bool>> predicate)
        {
            return _db.Events.AnyAsync(predicate);
        }

        public Task<long> SubscribeUser(long eventId, long? currentUserId)
        {
            var userEvent = new UserEventNew
            {
                EventId = eventId,
                UserId = currentUserId.Value
            };

            return _db.UsersEvents.X_CreateAsync(userEvent, currentUserId);
        }

        public async Task<long> UnsubscribeUser(long userId, long eventId, long? currentUserId)
        {
            var userEvent = await _db.UsersEvents.FirstOrDefaultAsync(x => x.UserId == userId && x.EventId == eventId);
            await _db.UsersEvents.X_DeleteAsync(x => x.UserEventId == userEvent.UserEventId, currentUserId);

            return userEvent.UserEventId;
        }

        public Task<bool> UserSubscriptionExists(Expression<Func<UserEventPoco, bool>> predicate)
        {
            return _db.UsersEvents.AnyAsync(predicate);
        }

        public Task<List<VUserEventPoco>> GetAllEventSubscribersViewAsync(long eventId)
        {
            return _db.VUsersEvents.Where(x => x.EventId == eventId)
                .OrderByDescending(x => x.UserSubscribedOnDateTime).ToListAsync();
        }

        public Task<VUserEventPoco> GetEventSubscriberViewAsync(Expression<Func<VUserEventPoco, bool>> predicate)
        {
            return _db.VUsersEvents.FirstOrDefaultAsync(predicate);
        }

        public async Task<byte[]> GetEventMainImageAsync(long eventId)
        {
            var mainImageFilePath = await _db.VEventImages
                .Where(x => x.EventId == eventId && x.EventImageIsMain)
                .Select(x => x.FileStoragePath)
                .FirstOrDefaultAsync();

            if (string.IsNullOrWhiteSpace(mainImageFilePath) || !File.Exists(mainImageFilePath))
            {
                return null;
            }

            return await File.ReadAllBytesAsync(mainImageFilePath);
        }
    }
}
