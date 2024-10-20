using EventManager.API.Helpers;
using EventManager.DAL;
using EventManager.API.Dto.User;
using System.Linq.Expressions;

namespace EventManager.API.Services.User
{
    public interface IUserService
    {
        Task<(List<UserPoco> users, PaginationMetadata metadata)> GetAllUsersAsync
            (Expression<Func<UserPoco, bool>> predicate, int pageNumber, int pageSize);
        Task<UserPoco> GetUserAsync(Expression<Func<UserPoco, bool>> predicate);
        Task<VUserPoco> GetUserViewAsync(Expression<Func<VUserPoco, bool>> predicate);
        Task<long> CreateUserAsync(UserNewDto user, long? currentUserId);
        Task UpdateUserAsync(long userId, UserUpdateDto user, long? currentUserId);
        Task DeleteUserAsync(long userId, long? currentUserId);
        Task<bool> UserExistsAsync(Expression<Func<UserPoco, bool>> predicate);
        Task<bool> IsUserAdmin(long userId);

        Task<List<RegionPoco>> GetAllUserRegionsHelping(long userId);
        Task CreateUserRegionHelpingAsync(UserRegionHelpingNewDto userRegionHelping, long? currentUserId);
        Task DeleteUserRegionHelpingAsync(Expression<Func<UserRegionHelpingPoco, bool>> predicate, long? currentUserId);

        Task<List<RolePoco>> GetAllUserRolesAsync(long userId);
        Task<UserRolePoco> GetUserRoleAsync(Expression<Func<UserRolePoco, bool>> predicate);
        Task<long> CreateUserRoleAsync(UserRoleNewDto userClaim, long? currentUserId);
        Task DeleteUserRoleAsync(Expression<Func<UserRolePoco, bool>> predicate, long? currentUserId);
        Task<bool> UserRoleExistsAsync(Expression<Func<UserRolePoco, bool>> predicate);
    }
}
