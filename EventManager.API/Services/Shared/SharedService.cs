using EventManager.API.Helpers;
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

            return await _userService.IsUserAdmin(currentUserId.Value);
        }
    }
}
