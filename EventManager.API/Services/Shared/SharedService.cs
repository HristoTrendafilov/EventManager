using EventManager.API.Core;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Cache;
using System.Security.Claims;

namespace EventManager.API.Services.Shared
{
    public class SharedService : ISharedService
    {
        private readonly ICacheService _cacheService;

        public SharedService(ICacheService cacheService)
        {
            _cacheService = cacheService;
        }

        public async Task<bool> IsUserAuthorizedToEdit(ClaimsPrincipal user, long createdByUserId)
        {
            if (user?.X_CurrentUserId() is not long currentUserId)
            {
                return false;
            }

            if (createdByUserId == currentUserId)
            {
                return true;
            }

            var roles = await _cacheService.GetOrAddWebUserRolesAsync(currentUserId);
            return roles.Any(role => role.RoleId == (int)UserRole.Admin);
        }
    }
}
