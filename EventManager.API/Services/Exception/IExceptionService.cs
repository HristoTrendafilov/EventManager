using EventManager.DAL;
using EventManager.API.Dto.Exception;
using System.Linq.Expressions;

namespace EventManager.API.Services.Exception
{
    public interface IExceptionService
    {
        Task<List<ExceptionPoco>> GetAllExceptionsAsync(Expression<Func<ExceptionPoco, bool>> predicate);
        Task<ExceptionPoco> GetExceptionAsync(Expression<Func<ExceptionPoco, bool>> predicate);
        Task<long> CreateExceptionAsync(ExceptionNew exception, long? currentUserId);
        Task<long> CreateExceptionAsync(System.Exception ex, long? currentUserId);
        Task ResolveException(long exceptionId, long? currentUserId);
        Task DeleteExceptionAsync(long exceptionId, long? currentUserId);
        Task<bool> ExceptionExistsAsync(Expression<Func<ExceptionPoco, bool>> predicate);
    }
}
