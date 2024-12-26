using EventManager.API.Core;
using EventManager.DAL;
using EventManager.API.Dto.User;
using LinqToDB;
using System.Linq.Expressions;
using EventManager.API.Services.FileStorage;
using EventManager.API.Dto.User.Role;
using EventManager.API.Services.Cache;
using EventManager.API.Services.WebSession;
using EventManager.BOL;
using EventManager.API.Dto.Event;

namespace EventManager.API.Services.User
{
    public class UserService : IUserService
    {
        private readonly PostgresConnection _db;
        private readonly IFileService _fileService;
        private readonly ICacheService _cacheService;
        private readonly IWebSessionService _webSessionService;

        public UserService(
            PostgresConnection db,
            IFileService fileStorageService,
            ICacheService cacheService,
            IWebSessionService webSessionService)
        {
            _db = db;
            _fileService = fileStorageService;
            _cacheService = cacheService;
            _webSessionService = webSessionService;
        }

        public async Task<long> CreateUserAsync(UserNew user, long? currentUserId)
        {
            var userId = await _db.WithTransactionAsync(async () =>
            {
                if (user.ProfilePicture != null)
                {
                    var fileId = await _fileService.CreateFileAsync(user.ProfilePicture, FileType.Public, currentUserId);
                    user.UserProfilePictureFileId = fileId;
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
                    var fileId = await _fileService.CreateFileAsync(user.ProfilePicture, FileType.Public, currentUserId);
                    user.UserProfilePictureFileId = fileId;

                    await _db.Users.X_UpdateAsync(userId, user, currentUserId);

                    if (profilePictureId.HasValue)
                    {
                        await _fileService.DeleteFileAsync(profilePictureId.Value, currentUserId);
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

        public async Task<UserView> GetUserViewAsync(Expression<Func<VUserPoco, bool>> predicate)
        {
            var userViewPoco = await _db.VUsers.FirstOrDefaultAsync(predicate);
            if (userViewPoco == null)
            {
                return null;
            }

            var userView = Mapper.CreateObject<UserView>(userViewPoco);
            userView.UserProfilePictureUrl = _fileService.CreatePublicFileUrl(userView.UserProfilePictureRelativePath, FileService.NO_USER_LOGO);

            return userView;
        }

        public async Task<List<UserView>> GetAllUsersViewAsync(Expression<Func<VUserPoco, bool>> predicate, bool includeProfilePictureUrl)
        {
            var usersViewPoco = await _db.VUsers.Where(predicate).ToListAsync();
            var usersView = Mapper.CreateList<UserView>(usersViewPoco);

            if (includeProfilePictureUrl)
            {
                foreach (var user in usersView)
                {
                    user.UserProfilePictureUrl = _fileService.CreatePublicFileUrl(user.UserProfilePictureRelativePath, FileService.NO_USER_LOGO);
                }
            }

            return usersView;
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

            CacheRemoveUserRoles(userRoles.UserId);
        }

        public Task<List<RolePoco>> GetAllRolesAsync(Expression<Func<RolePoco, bool>> predicate)
        {
            return _db.Roles.Where(predicate).ToListAsync();
        }

        public async Task<List<RolePoco>> CacheGetOrAddUserRolesAsync(long userId)
        {
            var cacheKey = $"UserRoles_{userId}";

            var roles = _cacheService.Get<List<RolePoco>>(cacheKey);
            if (roles == null)
            {
                roles = await GetAllUserRolesAsync(userId);
                _cacheService.Set(cacheKey, roles, TimeSpan.FromHours(12));
            }
            return roles;
        }

        public void CacheRemoveUserRoles(long userId)
        {
            _cacheService.Remove($"UserRoles_{userId}");
        }

        public async Task<List<UserProfileEvent>> GetUserEventsSubscriptions(long userId)
        {
            var events = await _db.VUsersEvents.Where(x => x.UserId == userId).ToListAsync();

            var profileEvents = Mapper.CreateList<UserProfileEvent>(events);
            foreach (var @event in profileEvents)
            {
                @event.MainImageUrl = _fileService.CreatePublicFileUrl(@event.MainImageRelativePath, FileService.NO_IMAGE_FILE);
            }

            return profileEvents.OrderByDescending(x => x.UserSubscribedOnDateTime).ToList();
        }

        public async Task<List<UserProfileEvent>> GetUserEventsCreated(long userId)
        {
            var events = await _db.VEvents
                .Where(x => x.EventCreatedByUserId == userId)
                .OrderByDescending(x => x.EventCreatedOnDateTime)
                .ToListAsync();

            var profileEvents = Mapper.CreateList<UserProfileEvent>(events);
            foreach (var @event in profileEvents)
            {
                @event.MainImageUrl = _fileService.CreatePublicFileUrl(@event.MainImageRelativePath, FileService.NO_IMAGE_FILE);
            }

            return profileEvents;
        }

        public async Task<List<UserProfileOrganization>> GetUserOrganizationSubscriptions(long userId)
        {
            var organizations = await _db.VOrganizationsSubscriptions.Where(x => x.UserId == userId).ToListAsync();

            var profileOrganizations = Mapper.CreateList<UserProfileOrganization>(organizations);
            foreach (var organization in profileOrganizations)
            {
                organization.OrganizationLogoUrl = _fileService.CreatePublicFileUrl(organization.OrganizationLogoRelativePath, FileService.NO_IMAGE_FILE);
            }

            return profileOrganizations.OrderByDescending(x => x.OrganizationSubscriptionCreatedOnDateTime).ToList();
        }

        public async Task<List<UserProfileOrganization>> GetUserOrganizationsManaged(long userId)
        {
            var organizations = await _db.VOrganizationsMembers
                .Where(x => x.UserId == userId && x.IsManager)
                .ToListAsync();

            var profileOrganizations = Mapper.CreateList<UserProfileOrganization>(organizations);
            foreach (var organization in profileOrganizations)
            {
                organization.OrganizationLogoUrl = _fileService.CreatePublicFileUrl(organization.OrganizationLogoRelativePath, FileService.NO_IMAGE_FILE);
            }

            return profileOrganizations;
        }
    }
}
