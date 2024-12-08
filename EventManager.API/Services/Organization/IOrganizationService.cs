using EventManager.API.Dto.Organization;
using EventManager.DAL;
using System.Linq.Expressions;

namespace EventManager.API.Services.Organization
{
    public interface IOrganizationService
    {
        Task<long> CreateOrganizationAsync(OrganizationNew organization, long? currentUserId);
        Task<List<OrganizationView>> GetAllOrganizationsViewAsync(Expression<Func<VOrganizationPoco, bool>> predicate);
        Task<OrganizationPoco> GetOrganizationPocoAsync(Expression<Func<OrganizationPoco, bool>> predicate);
        Task<OrganizationView> GetOrganizationViewAsync(Expression<Func<VOrganizationPoco, bool>> predicate);
        Task<UserOrganizationView> GetUserOrganizationViewAsync(Expression<Func<VUserOrganizationPoco, bool>> predicate);
        Task<bool> OrganizationExistsAsync(Expression<Func<OrganizationPoco, bool>> predicate);
        Task<long> AddUserToOrganizationAsync(long organizationId, long? currentUserId);
        Task<long> RemoveUserFromOrganizationAsync(long userId, long organizationId, long? currentUserId);
        Task UpdateOrganizationAsync(long organizationId, OrganizationUpdate organization, long? currentUserId);
        Task<bool> UserOrganizationExistsAsync(Expression<Func<UserOrganizationPoco, bool>> predicate);
        Task<long> SubscribeUserToOrganizationAsync(long organizationId, long? currentUserId);
        Task<long> UnsubscribeUserFromOrganizationAsync(long userId, long organizationId, long? currentUserId);
        Task<bool> OrganizationSubscriptionExistsAsync(Expression<Func<OrganizationSubscriptionPoco, bool>> predicate);
        Task<List<UserOrganizationView>> GetAllOrganizationMembersViewAsync(Expression<Func<VUserOrganizationPoco, bool>> predicate);
        Task<List<OrganizationView>> GetUserOrganizationsAsync(long userId, bool includeDefault);
    }
}
