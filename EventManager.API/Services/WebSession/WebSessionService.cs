using EventManager.DAL;
using EventManager.API.Dto.WebSession;
using LinqToDB;
using System.Linq.Expressions;
using System.Net;
using EventManager.API.Services.Cache;

namespace EventManager.API.Services.WebSession
{
    public class WebSessionService : IWebSessionService
    {
        private readonly PostgresConnection _db;
        private readonly ICacheService _cacheService;

        public WebSessionService(PostgresConnection db, ICacheService cacheService)
        {
            _db = db;
            _cacheService = cacheService;
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
            CacheRemoveWebSession(webSessionId);
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
                .Where(x => x.UserId == userId && x.WebSessionLogoutDateTime == null)
                .ToListAsync();

            foreach (var session in activeSessions)
            {
                session.WebSessionRevoked = true;
                await _db.WebSessions.X_UpdateAsync(session.WebSessionId, session, userId);
                CacheRemoveWebSession(session.WebSessionId);
            }
        }

        public async Task<WebSessionPoco> CacheGetOrAddWebSessionAsync(long webSessionId)
        {
            var cacheKey = $"WebSession_{webSessionId}";

            var webSession = _cacheService.Get<WebSessionPoco>(cacheKey);
            if (webSession == null)
            {
                webSession = await GetWebSessionAsync(x => x.WebSessionId == webSessionId);
                _cacheService.Set(cacheKey, webSession, TimeSpan.FromHours(12));
            }

            return webSession;
        }

        public void CacheRemoveWebSession(long webSessionId)
        {
            _cacheService.Remove($"WebSession_{webSessionId}");
        }
    }
}
