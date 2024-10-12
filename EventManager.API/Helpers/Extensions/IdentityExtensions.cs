using EventManager.API.Core;
using System.Security.Claims;

namespace EventManager.API.Helpers.Extensions
{
    public static class IdentityExtensions
    {
        public static long? X_CurrentUserId(this ClaimsPrincipal user)
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

        public static long? X_WebSessionId(this ClaimsPrincipal user)
        {
            if (user == null)
            {
                return null;
            }

            var webSessionId = user.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.WebSessionId)?.Value;
            if (string.IsNullOrWhiteSpace(webSessionId))
            {
                return null;
            }

            return long.Parse(webSessionId);
        }
    }
}
