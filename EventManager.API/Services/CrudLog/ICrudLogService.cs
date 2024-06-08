using EventManager.DAL;
using System.Linq.Expressions;

namespace EventManager.API.Services.Log
{
    public interface ICrudLogService
    {
        Task<List<CrudLogPoco>> GetAllCrudLogsAsync(Expression<Func<CrudLogPoco, bool>> predicate);
        Task<CrudLogPoco> GetCrudLogAsync(Expression<Func<CrudLogPoco, bool>> predicate);
        Task DeleteCrudLogAsync(long crudLogId, long? currentUserId);
        Task<bool> CrudLogExistsAsync(Expression<Func<CrudLogPoco, bool>> predicate);
    }
}
