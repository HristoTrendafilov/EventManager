using EventManager.DAL;
using EventManager.API.Dto.User;
using System.Linq.Expressions;
using EventManager.API.Dto.User.Role;
using EventManager.API.Dto.Event;

namespace EventManager.API.Services.User
{
    public interface IUserService
    {
        Task<UserPoco> GetUserPocoAsync(Expression<Func<UserPoco, bool>> predicate);
        Task<UserView> GetUserViewAsync(Expression<Func<VUserPoco, bool>> predicate);
        Task<List<UserView>> GetAllUsersViewAsync(Expression<Func<VUserPoco, bool>> predicate, bool includeProfilePictureUrl);
        Task<long> CreateUserAsync(UserNew user, long? currentUserId);
        Task UpdateUserAsync(long userId, UserPoco user, long? currentUserId);
        Task UpdateUserPersonalDataAsync(long userId, UserUpdatePersonalData user, long? currentUserId);
        Task DeleteUserAsync(long userId, long? currentUserId);
        Task<bool> UserExistsAsync(Expression<Func<UserPoco, bool>> predicate);

        Task<List<RolePoco>> GetAllUserRolesAsync(long userId);
        Task<List<RolePoco>> GetAllRolesAsync(Expression<Func<RolePoco, bool>> predicate);
        Task SaveUserRoles(RoleBaseForm userClaim, long? currentUserId);

        Task<List<UserProfileEvent>> GetUserEventsSubscriptions(long userId);
        Task<List<UserProfileEvent>> GetUserEventsCreated(long userId);

        Task<List<RolePoco>> CacheGetOrAddUserRolesAsync(long userId);
        void CacheRemoveUserRoles(long userId);
        Task<List<UserProfileOrganization>> GetUserOrganizationSubscriptions(long userId);
        Task<List<UserProfileOrganization>> GetUserOrganizationsManaged(long userId);
    }
}
