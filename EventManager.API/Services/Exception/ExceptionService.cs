using EventManager.BOL;
using EventManager.DAL;
using EventManager.API.Dto.Exception;
using LinqToDB;
using System.Linq.Expressions;

namespace EventManager.API.Services.Exception
{
    public class ExceptionService : IExceptionService
    {
        private readonly PostgresConnection _db;

        public ExceptionService(PostgresConnection db, Mapper mapper)
        {
            _db = db;
        }

        public Task<long> CreateExceptionAsync(ExceptionBaseForm exception, long? currentUserId)
        {
            return _db.Exceptions.X_CreateAsync(exception, currentUserId);
        }

        public async Task DeleteExceptionAsync(long exceptionId, long? currentUserId)
        {
            await _db.Exceptions.X_DeleteAsync(x => x.ExceptionId == exceptionId, currentUserId);
        }

        public Task<bool> ExceptionExistsAsync(Expression<Func<ExceptionPoco, bool>> predicate)
        {
            return _db.Exceptions.AnyAsync(predicate);
        }

        public Task<List<ExceptionPoco>> GetAllExceptionsAsync(Expression<Func<ExceptionPoco, bool>> predicate)
        {
            return _db.Exceptions.Where(predicate).ToListAsync();
        }

        public Task<ExceptionPoco> GetExceptionAsync(Expression<Func<ExceptionPoco, bool>> predicate)
        {
            return _db.Exceptions.FirstOrDefaultAsync(predicate);
        }

        public async Task ResolveException(long exceptionId, long? currentUserId)
        {
            var exception = await this.GetExceptionAsync(x => x.ExceptionId == exceptionId);
            if (exception != null)
            {
                exception.ExceptionIsResolved = true;
                await _db.Exceptions.X_UpdateAsync(exceptionId, exception, currentUserId);
            }
        }
    }
}
