using EventManager.DAL;
using EventManager.API.Dto.WebSession;
using System.Linq.Expressions;

namespace EventManager.API.Services.WebSession
{
    public interface IWebSessionService
    {
        Task<WebSessionPoco> GetWebSessionAsync(Expression<Func<WebSessionPoco, bool>> predicate);
        Task<long> CreateWebSession(WebSessionNew webSession);
        Task CloseWebSessionAsync(long webSessionId, long? currentUserId);
        Task<bool> WebSessionExistsAsync(Expression<Func<WebSessionPoco, bool>> predicate);
        Task<string> GetUserIpInfoAsync(string ipAddress);
        Task<List<VWebSessionPoco>> GetUserLastActiveWebSessions(long userId);
        Task RevokeUserSessionsAsync(long userId);
        Task<WebSessionPoco> CacheGetOrAddWebSessionAsync(long webSessionId);
        void CacheRemoveWebSession(long webSessionId);
    }
}