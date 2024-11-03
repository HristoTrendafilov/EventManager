using EventManager.API.Services.Log;
using EventManager.DAL;
using LinqToDB;
using System.Linq.Expressions;

namespace EventManager.API.Services.CrudLog
{
    public class CrudLogService : ICrudLogService
    {
        private readonly PostgresConnection _db;

        public CrudLogService(PostgresConnection db)
        {
            _db = db;
        }

        public Task<bool> CrudLogExistsAsync(Expression<Func<CrudLogPoco, bool>> predicate)
        {
            return _db.CrudLogs.AnyAsync(predicate);
        }

        public async Task DeleteCrudLogAsync(long crudLogId, long? currentUserId)
        {
            await _db.CrudLogs.X_DeleteAsync(x => x.CrudLogId == crudLogId, currentUserId);
        }

        public Task<List<VCrudLogPoco>> GetAllCrudLogsViewAsync(Expression<Func<VCrudLogPoco, bool>> predicate)
        {
            return _db.VCrudLogs.Where(predicate).ToListAsync();
        }

        public Task<CrudLogPoco> GetCrudLogAsync(Expression<Func<CrudLogPoco, bool>> predicate)
        {
            return _db.CrudLogs.FirstOrDefaultAsync(predicate);
        }
    }
}
