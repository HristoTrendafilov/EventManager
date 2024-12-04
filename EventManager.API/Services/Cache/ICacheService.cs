using EventManager.DAL;

namespace EventManager.API.Services.Cache
{
    public interface ICacheService
    {
        Task<WebSessionPoco> GetOrAddWebSessionAsync(long webSessionId);
        void RemoveWebSession(long webSessionId);
        Task<List<RolePoco>> GetOrAddWebUserRolesAsync(long userId);
        void RemoveUserRoles(long userId);
    }
}