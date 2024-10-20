using EventManager.DAL;
using EventManager.API.Dto.Region;
using LinqToDB;
using System.Linq.Expressions;

namespace EventManager.API.Services.Region
{
    public class RegionService : IRegionService
    {
        private readonly PostgresConnection _db;

        public RegionService(PostgresConnection db)
        {
            _db = db;
        }

        public Task<long> CreateRegionAsync(RegionNew region, long? currentUserId)
        {
            return _db.Regions.X_CreateAsync(region, currentUserId);
        }

        public Task DeleteRegionAsync(long regionId, long? currentUserId)
        {
            return _db.Regions.X_DeleteAsync(x => x.RegionId == regionId, currentUserId);
        }

        public Task<List<RegionPoco>> GetAllRegionsAsync(Expression<Func<RegionPoco, bool>> predicate)
        {
            return _db.Regions.Where(predicate).ToListAsync();
        }

        public Task<RegionPoco> GetRegionAsync(Expression<Func<RegionPoco, bool>> predicate)
        {
            return _db.Regions.FirstOrDefaultAsync(predicate);
        }

        public Task<bool> RegionExistsAsync(Expression<Func<RegionPoco, bool>> predicate)
        {
            return _db.Regions.AnyAsync(predicate);
        }

        public Task UpdateRegionAsync(long regionId, RegionUpdate region, long? currentUserId)
        {
            return _db.Regions.X_UpdateAsync(regionId, region, currentUserId);
        }

        public async Task<RegionPoco> GetUserRegion(long userId)
        {
            var userRegionId = await _db.Users.Where(x => x.UserId == userId).Select(x => x.RegionId).FirstOrDefaultAsync();

            return await _db.Regions.FirstOrDefaultAsync(x => x.RegionId == userRegionId);
        }

        public Task<List<RegionPoco>> GetUserRegionsHelping(long userId)
        {
            return (from regionsHelping in _db.UsersRegionsHelping.Where(x => x.UserId == userId)
                    join regions in _db.Regions on regionsHelping.RegionId equals regions.RegionId
                    select regions).ToListAsync();
        }
    }
}
