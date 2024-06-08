using EventManager.DAL;
using EventManager.DTO.WebSession;
using System.Linq.Expressions;

namespace EventManager.API.Services.WebSession
{
    public interface IWebSessionService
    {
        Task<WebSessionPoco> GetWebSessionAsync(Expression<Func<WebSessionPoco, bool>> predicate);
        Task<long> CreateWebSession(WebSessionNewDto webSession);
        Task UpdateWebSessionAsync(long webSessionId, WebSessionUpdateDto webSession, long? currentUserId);
        Task<bool> WebSessionExistsAsync(Expression<Func<WebSessionPoco, bool>> predicate);
    }
}