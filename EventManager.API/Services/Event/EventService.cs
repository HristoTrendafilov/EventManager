﻿using EventManager.API.Helpers;
using EventManager.DAL;
using EventManager.Dto.Event;
using EventManager.Dto.User;
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

                var eventImage = @event.Image;
                if (eventImage != null)
                {
                    var imageFilePath = await this.SaveEventImageAsync(eventImage);

                    var image = new ImagePoco
                    {
                        EventId = eventId,
                        ImageExtension = Path.GetExtension(eventImage.FileName),
                        ImageFilePath = imageFilePath,
                        ImageIsMain = true,
                        ImageName = eventImage.FileName
                    };

                    await _db.Images.X_CreateAsync(image, currentUserId);
                }

                return eventId;
            });
        }

        public async Task UpdateEventAsync(long eventId, EventUpdate updateEvent, long? currentUserId)
        {
            // TODO: Fix the logic here
            //await _db.WithTransactionAsync(async () =>
            //{
            //    await _db.Events.X_UpdateAsync(eventId, updateEvent, currentUserId);

            //    if (updateEvent.Image != null)
            //    {
            //        if (updateEvent.Image.Delete)
            //        {
            //            await _db.Images.X_DeleteAsync(x => x.ImageId == updateEvent.Image.ImageId, currentUserId);
            //        }
            //        else if (updateEvent.Image.IsNew)
            //        {
            //            if (updateEvent.Image.ImageId > 0)
            //            {
            //                await _db.Images.X_DeleteAsync(x => x.ImageId == updateEvent.Image.ImageId, currentUserId);
            //            }

            //            var imageFilePath = await this.SaveEventImageAsync(updateEvent.Image.ImageBase64);

            //            updateEvent.Image.ImageId = 0;
            //            updateEvent.Image.EventId = eventId;
            //            updateEvent.Image.ImageFilePath = imageFilePath;
            //        }
            //    }
            //});
        }

        public async Task<string> SaveEventImageAsync(IFormFile file)
        {
            var imageFolder = Path.Combine(_config["FolderPaths:EventImagesFolder"], DateTime.Now.ToString("yyyy-MM-dd"));
            Directory.CreateDirectory(imageFolder);

            var imageFilePath = Path.Combine(imageFolder, Guid.NewGuid().ToString());

            using (Stream fileStream = new FileStream(imageFilePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return imageFilePath;
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
    }
}
