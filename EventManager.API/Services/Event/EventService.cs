using EventManager.API.Helpers;
using EventManager.DAL;
using EventManager.API.Dto.Event;
using EventManager.API.Dto.User;
using LinqToDB;
using System.Linq.Expressions;

namespace EventManager.API.Services.Event
{
    public class EventService : IEventService
    {
        private readonly PostgresConnection _db;
        private readonly IConfiguration _config;

        public EventService(PostgresConnection db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<long> CreateEventAsync(EventNew @event, long? currentUserId)
        {
            return await _db.WithTransactionAsync(async () =>
            {
                var eventId = await _db.Events.X_CreateAsync(@event, currentUserId);

                if (@event.MainImage != null)
                {
                    await this.CreateEventImageAsync(@event.MainImage, eventId, currentUserId);
                }

                return eventId;
            });
        }

        public async Task UpdateEventAsync(long eventId, EventUpdate @event, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                await _db.Events.X_UpdateAsync(eventId, @event, currentUserId);

                if (@event.MainImage != null)
                {
                    await this.DeleteEventMainImageAsync(eventId, currentUserId);
                    await this.CreateEventImageAsync(@event.MainImage, eventId, currentUserId);
                }
            });
        }

        private async Task CreateEventImageAsync(IFormFile file, long eventId, long? currentUserId)
        {
            var imageFolder = Path.Combine(_config["FolderPaths:EventImagesFolder"], DateTime.Now.ToString("yyyy-MM-dd"));
            Directory.CreateDirectory(imageFolder);

            var imageFilePath = Path.Combine(imageFolder, Guid.NewGuid().ToString());

            using (Stream fileStream = new FileStream(imageFilePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            var image = new ImagePoco
            {
                EventId = eventId,
                ImageExtension = Path.GetExtension(file.FileName),
                ImageFilePath = imageFilePath,
                ImageIsMain = true,
                ImageName = file.FileName
            };

            await _db.Images.X_CreateAsync(image, currentUserId);
        }

        private async Task DeleteEventMainImageAsync(long eventId, long? currentUserId)
        {
            var mainImage = await _db.Images.FirstOrDefaultAsync(x => x.EventId == eventId && x.ImageIsMain);
            if (mainImage == null)
            {
                return;
            }

            if (File.Exists(mainImage.ImageFilePath))
            {
                File.Delete(mainImage.ImageFilePath);
            }

            await _db.Images.X_DeleteAsync(x => x.ImageId == mainImage.ImageId, currentUserId);
        }

        public async Task DeleteEventAsync(long eventId, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                var eventImages = await _db.Images.Where(x => x.EventId == eventId).ToListAsync();
                foreach (var image in eventImages)
                {
                    if (File.Exists(image.ImageFilePath))
                    {
                        File.Delete(image.ImageFilePath);
                    }
                }

                await _db.UsersEvents.X_DeleteAsync(x => x.EventId == eventId, currentUserId);
                await _db.Images.X_DeleteAsync(x => x.EventId == eventId, currentUserId);
                await _db.Events.X_DeleteAsync(x => x.EventId == eventId, currentUserId);
            });
        }

        public async Task<(List<EventPoco> events, PaginationMetadata metadata)> GetAllEventsAsync
            (Expression<Func<EventPoco, bool>> predicate, int pageNumber, int pageSize)
        {
            var events = await PagedList<EventPoco>.CreateAsync(_db.Events.Where(predicate), pageNumber, pageSize);

            var paginationMetadata = new PaginationMetadata
            {
                TotalCount = events.TotalCount,
                PageSize = events.PageSize,
                CurrentPage = events.CurrentPage,
                TotalPages = events.TotalPages,
            };

            return (events, paginationMetadata);
        }

        public Task<EventPoco> GetEventAsync(Expression<Func<EventPoco, bool>> predicate)
        {
            return _db.Events.FirstOrDefaultAsync(predicate);
        }

        public Task<bool> EventExistsAsync(Expression<Func<EventPoco, bool>> predicate)
        {
            return _db.Events.AnyAsync(predicate);
        }

        public Task<long> SubscribeUser(long eventId, long? currentUserId)
        {
            var userEvent = new UserEventSubscribeNewDto
            {
                EventId = eventId,
                UserId = currentUserId.Value
            };

            return _db.UsersEvents.X_CreateAsync(userEvent, currentUserId);
        }

        public async Task UnsubscribeUser(long userEventId, long? currentUserId)
        {
            await _db.UsersEvents.X_DeleteAsync(x => x.UserEventId == userEventId, currentUserId);
        }

        public Task<bool> UserSubscriptionExists(Expression<Func<UserEventPoco, bool>> predicate)
        {
            return _db.UsersEvents.AnyAsync(predicate);
        }

        public async Task<byte[]> GetEventMainImageAsync(long eventId)
        {
            var mainImage = await _db.Images.FirstOrDefaultAsync(x => x.EventId == eventId && x.ImageIsMain);
            if (mainImage == null)
            {
                return null;
            }

            if (!File.Exists(mainImage.ImageFilePath))
            {
                return null;
            }

            return await File.ReadAllBytesAsync(mainImage.ImageFilePath);
        }
    }
}
