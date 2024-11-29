using EventManager.DAL;
using EventManager.API.Dto.WebSession;
using LinqToDB;
using System.Linq.Expressions;
using System.Net;

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

        public Task<List<VWebSessionPoco>> GetUserLastActiveWebSessions(long userId)
        {
            return _db.VWebSessions
                .Where(x => x.UserId == userId && x.WebSessionIpInfo != null)
                .OrderByDescending(x => x.WebSessionCreatedOnDateTime)
                .Take(10)
                .ToListAsync();
        }

        public async Task<string> GetUserIpInfoAsync(string ipAddress)
        {
            using var httpClient = new HttpClient();
            var ipInfoResponse = await httpClient.GetStringAsync($"http://ip-api.com/json/{ipAddress}");

            return ipInfoResponse;
        }

        public async Task RevokeUserSessionsAsync(long userId)
        {
            var activeSessions = await _db.WebSessions
                .Where(ws => ws.UserId == userId && ws.WebSessionLogoutDateTime == null)
                .ToListAsync();

            foreach (var session in activeSessions)
            {
                session.WebSessionRevoked = true;
                await _db.WebSessions.X_UpdateAsync(session.WebSessionId, session, userId);
            }
        }
    }
}
