using EventManager.API.Core;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Cache;
using EventManager.API.Services.User;
using EventManager.DAL;
using System.Security.Claims;

namespace EventManager.API.Services.Shared
{
    public class SharedService : ISharedService
    {
        private readonly IUserService _userService;
        private readonly ICacheService _cacheService;

        public SharedService(IUserService userService, ICacheService cacheService)
        {
            _userService = userService;
            _cacheService = cacheService;
        }

        public async Task<bool> IsUserAuthorizedToEdit(ClaimsPrincipal user, long createdByUserId)
        {
            if (user == null)
            {
                return false;
            }

            var currentUserId = user.X_CurrentUserId();
            if (!currentUserId.HasValue)
            {
                return false;
            }

            if (createdByUserId == currentUserId.Value)
            {
                return true;
            }

            var cacheKey = $"UserPrivileges_{currentUserId.Value}";
            var roles = _cacheService.Get<List<RolePoco>>(cacheKey);
            if (roles == null)
            {
                roles = await _userService.GetAllUserRolesAsync(currentUserId.Value);
                _cacheService.Set(cacheKey, roles, TimeSpan.FromHours(1));
            }

            return roles.Any(role => role.RoleId == (int)UserRole.Admin);
        }
    }
}
