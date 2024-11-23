using EventManager.API.Core;
using System.Security.Claims;

namespace EventManager.API.Helpers.Extensions
{
    public static class IdentityExtensions
    {
        public static long? X_CurrentUserId(this ClaimsPrincipal user) =>
            long.TryParse(user?.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.UserId)?.Value, out var userId) ? userId : null;

        public static long? X_WebSessionId(this ClaimsPrincipal user) =>
            long.TryParse(user?.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.WebSessionId)?.Value, out var webSessionId) ? webSessionId : null;
    }
}