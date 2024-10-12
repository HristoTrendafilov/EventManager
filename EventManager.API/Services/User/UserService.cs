using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.DAL;
using EventManager.API.Dto.User;
using LinqToDB;
using System.Linq.Expressions;

namespace EventManager.API.Services.User
{
    public class UserService : IUserService
    {
        private readonly PostgresConnection _db;

        public UserService(PostgresConnection db)
        {
            _db = db;
        }

        public async Task<long> CreateUserAsync(UserNewDto user, long? currentUserId)
        {
            var userId = await _db.WithTransactionAsync(async () =>
            {
                var userId = await _db.Users.X_CreateAsync(user, currentUserId);

                foreach (var userRegionHelpingId in user.UserRegionsHelpingIds)
                {
                    var userRegionHelping = new UserRegionHelpingNewDto { UserId = userId, RegionId = userRegionHelpingId };
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
                await DeleteUserRoleAsync(x => x.UserId == userId, currentUserId);
                await DeleteUserRegionHelpingAsync(x => x.UserId == userId, currentUserId);

                await _db.Users.X_DeleteAsync(x => x.UserId == userId, currentUserId);
            });
        }

        public async Task UpdateUserAsync(long userId, UserUpdateDto user, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                await this.DeleteUserRegionHelpingAsync(x => x.UserId == userId, currentUserId);
                foreach (var userRegionHelpingId in user.UserRegionsHelpingIds)
                {
                    var userRegionHelping = new UserRegionHelpingNewDto { UserId = userId, RegionId = userRegionHelpingId };
                    await this.CreateUserRegionHelpingAsync(userRegionHelping, currentUserId);
                }

                await _db.Users.X_UpdateAsync(userId, user, currentUserId);
            });
        }

        public async Task<(List<UserPoco> users, PaginationMetadata metadata)> GetAllUsersAsync
            (Expression<Func<UserPoco, bool>> predicate, int pageNumber, int pageSize)
        {
            var users = await PagedList<UserPoco>.CreateAsync(_db.Users.Where(predicate), pageNumber, pageSize);

            var paginationMetadata = new PaginationMetadata
            {
                TotalCount = users.TotalCount,
                PageSize = users.PageSize,
                CurrentPage = users.CurrentPage,
                TotalPages = users.TotalPages,
            };

            return (users, paginationMetadata);
        }

        public Task<UserPoco> GetUserAsync(Expression<Func<UserPoco, bool>> predicate)
        {
            return _db.Users.FirstOrDefaultAsync(predicate);
        }

        public Task<bool> UserExistsAsync(Expression<Func<UserPoco, bool>> predicate)
        {
            return _db.Users.AnyAsync(predicate);
        }

        public Task CreateUserRegionHelpingAsync(UserRegionHelpingNewDto userRegionHelping, long? currentUserId)
        {
            return _db.UsersRegionsHelping.X_CreateAsync(userRegionHelping, currentUserId);
        }

        public Task DeleteUserRegionHelpingAsync(Expression<Func<UserRegionHelpingPoco, bool>> predicate, long? currentUserId)
        {
            return _db.UsersRegionsHelping.X_DeleteAsync(predicate, currentUserId);
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

        public Task<long> CreateUserRoleAsync(UserRoleNewDto userClaim, long? currentUserId)
        {
            return _db.UsersRoles.X_CreateAsync(userClaim, currentUserId);
        }

        public Task DeleteUserRoleAsync(Expression<Func<UserRolePoco, bool>> predicate, long? currentUserId)
        {
            return _db.UsersRoles.X_DeleteAsync(predicate, currentUserId);
        }

        public Task<List<RegionPoco>> GetAllUserRegionsHelping(long userId)
        {
            return (from userRegionsHelping in _db.UsersRegionsHelping.Where(x => x.UserId == userId)
                    join regions in _db.Regions on userRegionsHelping.RegionId equals regions.RegionId
                    select regions).ToListAsync();
        }

        public Task DeleteUserRoleAsync(Expression<Func<UserRolePoco, bool>> predicate)
        {
            return _db.UsersRoles.DeleteAsync(predicate);
        }

        public Task<bool> UserRoleExistsAsync(Expression<Func<UserRolePoco, bool>> predicate)
        {
            return _db.UsersRoles.AnyAsync(predicate);
        }

        public Task<UserRolePoco> GetUserRoleAsync(Expression<Func<UserRolePoco, bool>> predicate)
        {
            return _db.UsersRoles.FirstOrDefaultAsync(predicate);
        }
    }
}
