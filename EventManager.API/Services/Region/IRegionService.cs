using EventManager.DAL;
using EventManager.API.Dto.Region;
using System.Linq.Expressions;

namespace EventManager.API.Services.Region
{
    public interface IRegionService
    {
        Task<List<RegionPoco>> GetAllRegionsAsync(Expression<Func<RegionPoco, bool>> predicate);
        Task<RegionPoco> GetRegionAsync(Expression<Func<RegionPoco, bool>> predicate);
        Task<long> CreateRegionAsync(RegionBaseForm region, long? currentUserId);
        Task UpdateRegionAsync(long regionId, RegionBaseForm region, long? currentUserId);
        Task DeleteRegionAsync(long regionId, long? currentUserId);
        Task<bool> RegionExistsAsync(Expression<Func<RegionPoco, bool>> predicate);
        Task<List<RegionPoco>> GetUserRegionsHelping(long userId);
    }
}
