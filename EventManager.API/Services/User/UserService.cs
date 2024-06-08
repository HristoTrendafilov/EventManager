using EventManager.API.Helpers;
using EventManager.DAL;
using EventManager.DTO.User;
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
            var userId = await _db.Users.X_CreateAsync(user, currentUserId);

            foreach (var userRegionHelpingId in user.UserRegionsHelpingIds)
            {
                var userRegionHelping = new UserRegionHelpingNewDto { UserId = userId, RegionId = userRegionHelpingId };
                await this.CreateUserRegionHelpingAsync(userRegionHelping, currentUserId);
            }

            return userId;
        }

        public async Task DeleteUserAsync(long userId, long? currentUserId)
        {
            await DeleteUserClaimAsync(x => x.UserId == userId, currentUserId);
            await DeleteUserRegionHelpingAsync(x => x.UserId == userId, currentUserId);

            await _db.Users.X_DeleteAsync(x => x.UserId == userId, currentUserId);
        }

        public async Task UpdateUserAsync(long userId, UserUpdateDto user, long? currentUserId)
        {
            await this.DeleteUserRegionHelpingAsync(x => x.UserId == userId, currentUserId);
            foreach (var userRegionHelpingId in user.UserRegionsHelpingIds)
            {
                var userRegionHelping = new UserRegionHelpingNewDto { UserId = userId, RegionId = userRegionHelpingId };
                await this.CreateUserRegionHelpingAsync(userRegionHelping, currentUserId);
            }

            await _db.Users.X_UpdateAsync(userId, user, currentUserId);
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

        public Task<List<ClaimPoco>> GetAllUserClaimsAsync(long userId)
        {
            return (from userClaims in _db.UsersClaims.Where(x => x.UserId == userId)
                    join claims in _db.Claims on userClaims.ClaimId equals claims.ClaimId
                    select claims).ToListAsync();
        }

        public Task<long> CreateUserClaimAsync(UserClaimNewDto userClaim, long? currentUserId)
        {
            return _db.UsersClaims.X_CreateAsync(userClaim, currentUserId);
        }

        public Task DeleteUserClaimAsync(Expression<Func<UserClaimPoco, bool>> predicate, long? currentUserId)
        {
            return _db.UsersClaims.X_DeleteAsync(predicate, currentUserId);
        }

        public Task<List<RegionPoco>> GetAllUserRegionsHelping(long userId)
        {
            return (from userRegionsHelping in _db.UsersRegionsHelping.Where(x => x.UserId == userId)
                    join regions in _db.Regions on userRegionsHelping.RegionId equals regions.RegionId
                    select regions).ToListAsync();
        }

        public Task DeleteUserClaimAsync(Expression<Func<UserClaimPoco, bool>> predicate)
        {
            return _db.UsersClaims.DeleteAsync(predicate);
        }

        public Task<bool> ClaimExistsAsync(Expression<Func<UserClaimPoco, bool>> predicate)
        {
            return _db.UsersClaims.AnyAsync(predicate);
        }

        public Task<UserClaimPoco> GetUserClaimAsync(Expression<Func<UserClaimPoco, bool>> predicate)
        {
            return _db.UsersClaims.FirstOrDefaultAsync(predicate);
        }
    }
}
