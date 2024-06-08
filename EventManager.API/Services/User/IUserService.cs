using EventManager.API.Helpers;
using EventManager.DAL;
using EventManager.DTO.User;
using System.Linq.Expressions;

namespace EventManager.API.Services.User
{
    public interface IUserService
    {
        Task<(List<UserPoco> users, PaginationMetadata metadata)> GetAllUsersAsync
            (Expression<Func<UserPoco, bool>> predicate, int pageNumber, int pageSize);
        Task<UserPoco> GetUserAsync(Expression<Func<UserPoco, bool>> predicate);
        Task<long> CreateUserAsync(UserNewDto user, long? currentUserId);
        Task UpdateUserAsync(long userId, UserUpdateDto user, long? currentUserId);
        Task DeleteUserAsync(long userId, long? currentUserId);
        Task<bool> UserExistsAsync(Expression<Func<UserPoco, bool>> predicate);

        Task<List<RegionPoco>> GetAllUserRegionsHelping(long userId);
        Task CreateUserRegionHelpingAsync(UserRegionHelpingNewDto userRegionHelping, long? currentUserId);
        Task DeleteUserRegionHelpingAsync(Expression<Func<UserRegionHelpingPoco, bool>> predicate, long? currentUserId);

        Task<List<ClaimPoco>> GetAllUserClaimsAsync(long userId);
        Task<UserClaimPoco> GetUserClaimAsync(Expression<Func<UserClaimPoco, bool>> predicate);
        Task<long> CreateUserClaimAsync(UserClaimNewDto userClaim, long? currentUserId);
        Task DeleteUserClaimAsync(Expression<Func<UserClaimPoco, bool>> predicate, long? currentUserId);
        Task<bool> ClaimExistsAsync(Expression<Func<UserClaimPoco, bool>> predicate);
    }
}
