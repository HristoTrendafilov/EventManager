using System.Security.Claims;

namespace EventManager.API.Services.Shared
{
    public interface ISharedService
    {
        Task<bool> IsUserAuthorizedToEdit(ClaimsPrincipal user, long createdByUserId);
    }
}