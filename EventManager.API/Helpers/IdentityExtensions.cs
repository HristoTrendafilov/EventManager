using EventManager.API.Core;
using System.Security.Claims;

namespace EventManager.API.Helpers
{
    public static class IdentityExtensions
    {
        public static long? X_GetCurrentUserId(this ClaimsPrincipal user)
        {
            if (user == null)
            {
                return null;
            }

            var userId = user.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.UserId)?.Value;
            if (string.IsNullOrWhiteSpace(userId))
            {
                return null;
            }

            return long.Parse(userId);
        }

        public static bool X_IsAuthorizedToEdit(this ClaimsPrincipal user, long entityUserCreatorId)
        {
            var currentUserId = user.X_GetCurrentUserId();
            if (currentUserId == null)
            {
                return false;
            }

            var isAdmin = user.HasClaim(c => c.Type == CustomClaimTypes.Role && c.Value == ClaimTypeValues.Admin);
            if (isAdmin || currentUserId == entityUserCreatorId)
            {
                return true;
            }

            return false;
        }
    }
}
