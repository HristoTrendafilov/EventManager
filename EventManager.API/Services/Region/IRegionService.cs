using EventManager.DAL;
using EventManager.DTO.Region;
using System.Linq.Expressions;

namespace EventManager.API.Services.Region
{
    public interface IRegionService
    {
        Task<List<RegionPoco>> GetAllRegionsAsync(Expression<Func<RegionPoco, bool>> predicate);
        Task<RegionPoco> GetRegionAsync(Expression<Func<RegionPoco, bool>> predicate);
        Task<long> CreateRegionAsync(RegionNew region, long? currentUserId);
        Task UpdateRegionAsync(long regionId, RegionUpdate region, long? currentUserId);
        Task DeleteRegionAsync(long regionId, long? currentUserId);
        Task<bool> RegionExistsAsync(Expression<Func<RegionPoco, bool>> predicate);
    }
}
