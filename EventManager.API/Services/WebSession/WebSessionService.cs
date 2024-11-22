using EventManager.DAL;
using EventManager.API.Dto.WebSession;
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

        public Task<long> CreateWebSession(WebSessionNew webSession)
        {
            return _db.WebSessions.X_CreateAsync(webSession, null);
        }

        public Task<bool> WebSessionExistsAsync(Expression<Func<WebSessionPoco, bool>> predicate)
        {
            return _db.WebSessions.AnyAsync(predicate);
        }

        public async Task CloseWebSessionAsync(long webSessionId, long? currentUserId)
        {
            var webSessionPoco = await _db.WebSessions.FirstOrDefaultAsync(x => x.WebSessionId == webSessionId);
            webSessionPoco.WebSessionLogoutDateTime = DateTime.Now;

            await _db.WebSessions.X_UpdateAsync(webSessionId, webSessionPoco, currentUserId);
        }

        public Task<WebSessionPoco> GetWebSessionAsync(Expression<Func<WebSessionPoco, bool>> predicate)
        {
            return _db.WebSessions.FirstOrDefaultAsync(predicate);
        }
    }
}
