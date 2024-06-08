using EventManager.DAL;
using EventManager.DTO.WebSession;
using LinqToDB;
using System.Linq.Expressions;

namespace EventManager.API.Services.WebSession
{
    public class WebSessionService : IWebSessionService
    {
        private readonly PostgresConnection _db;

        public WebSessionService(PostgresConnection db)
        {
            _db = db;
        }

        public Task<long> CreateWebSession(WebSessionNewDto webSession)
        {
            return _db.WebSessions.X_CreateAsync(webSession, null);
        }

        public Task<bool> WebSessionExistsAsync(Expression<Func<WebSessionPoco, bool>> predicate)
        {
            return _db.WebSessions.AnyAsync(predicate);
        }

        public async Task UpdateWebSessionAsync(long webSessionId, WebSessionUpdateDto webSession, long? currentUserId)
        {
            await _db.WebSessions.X_UpdateAsync(webSessionId, webSession, currentUserId);
        }

        public Task<WebSessionPoco> GetWebSessionAsync(Expression<Func<WebSessionPoco, bool>> predicate)
        {
            return _db.WebSessions.FirstOrDefaultAsync(predicate);
        }
    }
}
