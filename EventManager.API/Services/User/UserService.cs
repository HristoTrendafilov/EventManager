using EventManager.API.Core;
using EventManager.DAL;
using EventManager.API.Dto.User;
using LinqToDB;
using System.Linq.Expressions;
using EventManager.API.Services.FileStorage;
using EventManager.API.Dto.User.Role;
using EventManager.API.Services.Cache;
using EventManager.API.Services.WebSession;

namespace EventManager.API.Services.User
{
    public class UserService : IUserService
    {
        private readonly PostgresConnection _db;
        private readonly IFileService _fileStorageService;
        private readonly ICacheService _cacheService;
        private readonly IWebSessionService _webSessionService;

        public UserService(
            PostgresConnection db, 
            IFileService fileStorageService, 
            ICacheService cacheService, 
            IWebSessionService webSessionService)
        {
            _db = db;
            _fileStorageService = fileStorageService;
            _cacheService = cacheService;
            _webSessionService = webSessionService;
        }

        public async Task<long> CreateUserAsync(UserNew user, long? currentUserId)
        {
            var userId = await _db.WithTransactionAsync(async () =>
            {
                if (user.ProfilePicture != null)
                {
                    user.UserProfilePictureFileId = await _fileStorageService.CreateFileAsync(user.ProfilePicture, currentUserId);
                }

                var userId = await _db.Users.X_CreateAsync(user, currentUserId);

                await SaveUserRegionsHelping(userId, user.UserRegionsHelpingIds);

                return userId;
            });

            return userId;
        }

        public async Task DeleteUserAsync(long userId, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                await _db.UsersRoles.X_DeleteAsync(x => x.UserId == userId, currentUserId);
                await _db.UsersRegionsHelping.X_DeleteAsync(x => x.UserId == userId, currentUserId);

                await _db.Users.X_DeleteAsync(x => x.UserId == userId, currentUserId);
            });
        }

        public Task UpdateUserAsync(long userId, UserPoco user, long? currentUserId)
        {
            return _db.Users.X_UpdateAsync(userId, user, currentUserId);
        }

        public async Task UpdateUserPersonalDataAsync(long userId, UserUpdatePersonalData user, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                var profilePictureId = await _db.Users
                       .Where(x => x.UserId == userId)
                       .Select(x => x.UserProfilePictureFileId)
                       .FirstOrDefaultAsync();

                if (user.ProfilePicture != null)
                {
                    var newProfilePictureFileId = await _fileStorageService.CreateFileAsync(user.ProfilePicture, currentUserId);
                    user.UserProfilePictureFileId = newProfilePictureFileId;

                    await _db.Users.X_UpdateAsync(userId, user, currentUserId);

                    if (profilePictureId.HasValue)
                    {
                        await _fileStorageService.DeleteFileAsync(profilePictureId.Value, currentUserId);
                    }
                }
                else
                {
                    user.UserProfilePictureFileId = profilePictureId;
                    await _db.Users.X_UpdateAsync(userId, user, currentUserId);
                }

                await SaveUserRegionsHelping(userId, user.UserRegionsHelpingIds);
            });
        }

        private async Task SaveUserRegionsHelping(long userId, List<long> userRegionsHelpingIds)
        {
            await _db.UsersRegionsHelping.X_DeleteAsync(x => x.UserId == userId, userId);
            foreach (var userRegionHelpingId in userRegionsHelpingIds)
            {
                var userRegionHelping = new UserRegionHelpingNew { UserId = userId, RegionId = userRegionHelpingId };
                await CreateUserRegionHelpingAsync(userRegionHelping, userId);
            }
        }

        public Task<UserPoco> GetUserPocoAsync(Expression<Func<UserPoco, bool>> predicate)
        {
            return _db.Users.FirstOrDefaultAsync(predicate);
        }

        public Task<VUserPoco> GetUserViewAsync(Expression<Func<VUserPoco, bool>> predicate)
        {
            return _db.VUsers.FirstOrDefaultAsync(predicate);
        }

        public Task<List<VUserPoco>> GetAllUsersViewAsync(Expression<Func<VUserPoco, bool>> predicate)
        {
            return _db.VUsers.Where(predicate).ToListAsync();
        }

        public Task<bool> UserExistsAsync(Expression<Func<UserPoco, bool>> predicate)
        {
            return _db.Users.AnyAsync(predicate);
        }

        public Task CreateUserRegionHelpingAsync(UserRegionHelpingNew userRegionHelping, long? currentUserId)
        {
            return _db.UsersRegionsHelping.X_CreateAsync(userRegionHelping, currentUserId);
        }

        public Task<List<RolePoco>> GetAllUserRolesAsync(long userId)
        {
            return (from userRoles in _db.UsersRoles.Where(x => x.UserId == userId)
                    join roles in _db.Roles on userRoles.RoleId equals roles.RoleId
                    select roles).ToListAsync();
        }

        public Task<bool> IsUserAdmin(long userId)
        {
            return _db.UsersRoles.Where(x => x.UserId == userId && x.RoleId == (int)UserRole.Admin).AnyAsync();
        }

        public async Task SaveUserRoles(RoleBaseForm userRoles, long? currentUserId)
        {
            var existingRoles = await _db.UsersRoles
                   .Where(x => x.UserId == userRoles.UserId && x.RoleId != (int)UserRole.Admin)
                   .ToListAsync();

            var rolesToDelete = existingRoles
                .Where(x => !userRoles.RolesIds.Contains(x.RoleId))
                .ToList();

            var rolesToAdd = userRoles.RolesIds
                .Where(roleId => !existingRoles.Any(x => x.RoleId == roleId))
                .ToList();

            await _db.WithTransactionAsync(async () =>
            {
                foreach (var role in rolesToDelete)
                {
                    await _db.UsersRoles.X_DeleteAsync(x => x.UserRoleId == role.UserRoleId, currentUserId);
                }

                foreach (var roleId in rolesToAdd)
                {
                    var userRole = new UserRolePoco
                    {
                        UserId = userRoles.UserId,
                        RoleId = roleId,
                        UserRoleCreatedOnDateTime = DateTime.Now
                    };

                    await _db.UsersRoles.X_CreateAsync(userRole, currentUserId);
                }

                await _webSessionService.RevokeUserSessionsAsync(userRoles.UserId);
            });

            var cacheKey = $"UserPrivileges_{userRoles.UserId}";
            _cacheService.Remove(cacheKey);
        }

        public Task<List<RolePoco>> GetAllRolesAsync(Expression<Func<RolePoco, bool>> predicate)
        {
            return _db.Roles.Where(predicate).ToListAsync();
        }

        public async Task<byte[]> GetUserProfilePictureAsync(long userId)
        {
            var user = await _db.VUsers.FirstOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                return null;
            }

            if (!File.Exists(user.FileStoragePath))
            {
                return null;
            }

            return await File.ReadAllBytesAsync(user.FileStoragePath);
        }
    }
}
