using EventManager.API.Core;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.User;
using System.Security.Claims;

namespace EventManager.API.Services.Shared
{
    public class SharedService : ISharedService
    {
        private readonly IUserService _userService;

        public SharedService(IUserService userService)
        {
            _userService = userService;
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

            var roles = await _userService.CacheGetOrAddUserRolesAsync(currentUserId);
            return roles.Any(role => role.RoleId == (int)UserRole.Admin);
        }
    }
}
