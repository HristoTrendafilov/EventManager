using EventManager.DAL;
using EventManager.API.Dto.User;
using System.Linq.Expressions;

namespace EventManager.API.Services.User
{
    public interface IUserService
    {
        Task<UserPoco> GetUserAsync(Expression<Func<UserPoco, bool>> predicate);
        Task<VUserPoco> GetUserViewAsync(Expression<Func<VUserPoco, bool>> predicate);
        Task<long> CreateUserAsync(UserNew user, long? currentUserId);
        Task UpdateUserAsync(long userId, UserPoco user, long? currentUserId);
        Task UpdateUserPersonalDataAsync(long userId, UserUpdatePersonalData user, long? currentUserId);
        Task DeleteUserAsync(long userId, long? currentUserId);
        Task<bool> UserExistsAsync(Expression<Func<UserPoco, bool>> predicate);
        Task<bool> IsUserAdmin(long userId);
        Task<byte[]> GetUserProfilePictureAsync(long userId);

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
