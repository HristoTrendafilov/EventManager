using EventManager.DAL;
using EventManager.API.Dto.User;
using System.Linq.Expressions;

namespace EventManager.API.Services.User
{
    public interface IUserService
    {
        Task<UserPoco> GetUserAsync(Expression<Func<UserPoco, bool>> predicate);
        Task<VUserPoco> GetUserViewAsync(Expression<Func<VUserPoco, bool>> predicate);
        Task<List<VUserPoco>> GetAllUsersViewAsync(Expression<Func<VUserPoco, bool>> predicate);
        Task<long> CreateUserAsync(UserNew user, long? currentUserId);
        Task UpdateUserAsync(long userId, UserPoco user, long? currentUserId);
        Task UpdateUserPersonalDataAsync(long userId, UserUpdatePersonalData user, long? currentUserId);
        Task DeleteUserAsync(long userId, long? currentUserId);
        Task<bool> UserExistsAsync(Expression<Func<UserPoco, bool>> predicate);
        Task<bool> IsUserAdmin(long userId);
        Task<byte[]> GetUserProfilePictureAsync(long userId);

        Task<List<RegionPoco>> GetAllUserRegionsHelping(long userId);
        Task CreateUserRegionHelpingAsync(UserRegionHelpingNew userRegionHelping, long? currentUserId);

        Task<List<RolePoco>> GetAllUserRolesAsync(long userId);
        Task<List<RolePoco>> GetAllRolesAsync(Expression<Func<RolePoco, bool>> predicate);
        Task SaveUserRoles(UserRoleBaseForm userClaim, long? currentUserId);
    }
}
