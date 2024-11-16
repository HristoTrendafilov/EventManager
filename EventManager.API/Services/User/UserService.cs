using EventManager.API.Core;
using EventManager.DAL;
using EventManager.API.Dto.User;
using LinqToDB;
using System.Linq.Expressions;
using EventManager.API.Services.FileStorage;

namespace EventManager.API.Services.User
{
    public class UserService : IUserService
    {
        private readonly PostgresConnection _db;
        private readonly IFileStorageService _fileStorageService;

        public UserService(PostgresConnection db, IFileStorageService fileStorageService)
        {
            _db = db;
            _fileStorageService = fileStorageService;
        }

        public async Task<long> CreateUserAsync(UserNew user, long? currentUserId)
        {
            var userId = await _db.WithTransactionAsync(async () =>
            {
                if (user.ProfilePicture != null)
                {
                    user.ProfilePicturePath = await _fileStorageService.SaveFileToStorage(user.ProfilePicture);
                }

                var userId = await _db.Users.X_CreateAsync(user, currentUserId);

                foreach (var userRegionHelpingId in user.UserRegionsHelpingIds)
                {
                    var userRegionHelping = new UserRegionHelpingNew { UserId = userId, RegionId = userRegionHelpingId };
                    await this.CreateUserRegionHelpingAsync(userRegionHelping, currentUserId);
                }

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
                var userProfilePictureFilePath = await _db.Users.Where(x => x.UserId == userId)
                      .Select(x => x.ProfilePicturePath).FirstOrDefaultAsync();

                if (user.ProfilePicture != null)
                {
                    if (!string.IsNullOrWhiteSpace(userProfilePictureFilePath) && File.Exists(userProfilePictureFilePath))
                    {
                        File.Delete(userProfilePictureFilePath);
                    }

                    userProfilePictureFilePath = await _fileStorageService.SaveFileToStorage(user.ProfilePicture);
                }

                user.ProfilePicturePath = userProfilePictureFilePath;

                await _db.UsersRegionsHelping.X_DeleteAsync(x => x.UserId == userId, currentUserId);
                foreach (var userRegionHelpingId in user.UserRegionsHelpingIds)
                {
                    var userRegionHelping = new UserRegionHelpingNew { UserId = userId, RegionId = userRegionHelpingId };
                    await this.CreateUserRegionHelpingAsync(userRegionHelping, currentUserId);
                }

                await _db.Users.X_UpdateAsync(userId, user, currentUserId);
            });
        }

        public Task<UserPoco> GetUserAsync(Expression<Func<UserPoco, bool>> predicate)
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

        public async Task SaveUserRoles(UserRoleBaseForm userRoles, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                await _db.UsersRoles.X_DeleteAsync(x => x.UserId == userRoles.UserId && x.RoleId != (int)UserRole.Admin, currentUserId);

                foreach (var roleId in userRoles.RolesIds)
                {
                    var userRole = new UserRolePoco
                    {
                        UserId = userRoles.UserId,
                        RoleId = roleId
                    };

                    await _db.UsersRoles.X_CreateAsync(userRole, currentUserId);
                }
            });
        }

        public Task<List<RolePoco>> GetAllRolesAsync(Expression<Func<RolePoco, bool>> predicate)
        {
            return _db.Roles.Where(predicate).ToListAsync();
        }

        public Task<List<RegionPoco>> GetAllUserRegionsHelping(long userId)
        {
            return (from userRegionsHelping in _db.UsersRegionsHelping.Where(x => x.UserId == userId)
                    join regions in _db.Regions on userRegionsHelping.RegionId equals regions.RegionId
                    select regions).ToListAsync();
        }

        public async Task<byte[]> GetUserProfilePictureAsync(long userId)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                return null;
            }

            if (!File.Exists(user.ProfilePicturePath))
            {
                return null;
            }

            return await File.ReadAllBytesAsync(user.ProfilePicturePath);
        }
    }
}
