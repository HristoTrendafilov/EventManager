using EventManager.API.Services.User;
using EventManager.API.Services.WebSession;
using EventManager.DAL;
using Microsoft.Extensions.Caching.Memory;

namespace EventManager.API.Services.Cache
{
    public class CacheService : ICacheService
    {
        private readonly IMemoryCache _cache;
        private readonly IWebSessionService _webSessionService;
        private readonly IUserService _userService;

        public CacheService(IMemoryCache cache, IWebSessionService webSessionService, IUserService userService)
        {
            _cache = cache;
            _webSessionService = webSessionService;
            _userService = userService;
        }

        private T Get<T>(string key)
        {
            return _cache.TryGetValue(key, out T value) ? value : default;
        }

        private void Set<T>(string key, T value, TimeSpan expiration)
        {
            var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(expiration);
            _cache.Set(key, value, cacheEntryOptions);
        }

        private void Remove(string key)
        {
            _cache.Remove(key);
        }

        public async Task<WebSessionPoco> GetOrAddWebSessionAsync(long webSessionId)
        {
            var cacheKey = $"WebSession_{webSessionId}";

            var webSession = Get<WebSessionPoco>(cacheKey);
            if (webSession == null)
            {
                webSession = await _webSessionService.GetWebSessionAsync(x => x.WebSessionId == webSessionId);
                Set(cacheKey, webSession, TimeSpan.FromHours(12));
            }

            return webSession;
        }

        public void RemoveWebSession(long webSessionId)
        {
            Remove($"WebSession_{webSessionId}");
        }

        public async Task<List<RolePoco>> GetOrAddWebUserRolesAsync(long userId)
        {
            var cacheKey = $"UserRoles_{userId}";

            var roles = Get<List<RolePoco>>(cacheKey);
            if (roles == null)
            {
                roles = await _userService.GetAllUserRolesAsync(userId);
                Set(cacheKey, roles, TimeSpan.FromHours(12));
            }
            return roles;
        }

        public void RemoveUserRoles(long userId)
        {
            Remove($"UserRoles_{userId}");
        }
    }
}
