using EventManager.API.Dto.Organization;
using EventManager.API.Dto.User;
using EventManager.API.Services.FileStorage;
using EventManager.BOL;
using EventManager.DAL;
using LinqToDB;
using System.Linq.Expressions;

namespace EventManager.API.Services.Organization
{
    public class OrganizationService : IOrganizationService
    {
        private readonly PostgresConnection _db;
        private readonly IFileService _fileService;

        public OrganizationService(PostgresConnection db, IFileService fileService)
        {
            _db = db;
            _fileService = fileService;
        }

        public async Task<long> CreateOrganizationAsync(OrganizationNew organization, long? currentUserId)
        {
            var organizationId = await _db.WithTransactionAsync(async () =>
            {
                var fileId = await _fileService.CreateFileAsync(organization.OrganizationLogoFile, FileType.Public, currentUserId);
                organization.OrganizationLogoFileId = fileId;
                organization.OrganizationCreatedByUserId = currentUserId.Value;

                var organizationId = await _db.Organizations.X_CreateAsync(organization, currentUserId);

                return organizationId;
            });

            return organizationId;
        }

        public async Task UpdateOrganizationAsync(long organizationId, OrganizationUpdate organization, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                var oldLogoFileId = await _db.Organizations
                    .Where(x => x.OrganizationId == organizationId)
                    .Select(x => x.OrganizationLogoFileId)
                    .FirstOrDefaultAsync();


                var fileId = await _fileService.CreateFileAsync(organization.OrganizationLogoFile, FileType.Public, currentUserId);
                organization.OrganizationLogoFileId = fileId;
                await _db.Organizations.X_UpdateAsync(organizationId, organization, currentUserId);

                await _fileService.DeleteFileAsync(oldLogoFileId, currentUserId);
            });
        }

        public async Task<OrganizationPoco> GetOrganizationPocoAsync(Expression<Func<OrganizationPoco, bool>> predicate)
        {
            return await _db.Organizations.FirstOrDefaultAsync(predicate);
        }

        public async Task<OrganizationView> GetOrganizationViewAsync(Expression<Func<VOrganizationPoco, bool>> predicate)
        {
            var organizationViewPoco = await _db.VOrganizations.FirstOrDefaultAsync(predicate);
            var organizationView = Mapper.CreateObject<OrganizationView>(organizationViewPoco);
            organizationView.OrganizationLogoUrl = 
                _fileService.CreatePublicFileUrl(organizationView.FileStorageRelativePath, FileService.NO_IMAGE_FILE);

            return organizationView;
        }

        public async Task<List<OrganizationView>> GetAllOrganizationsViewAsync(Expression<Func<VOrganizationPoco, bool>> predicate)
        {
            var organizationsViewPoco = await _db.VOrganizations.Where(predicate).ToListAsync();
            var organizationsView = Mapper.CreateList<OrganizationView>(organizationsViewPoco);
            foreach (var organization in organizationsView)
            {
                organization.OrganizationLogoUrl = _fileService
                    .CreatePublicFileUrl(organization.FileStorageRelativePath, FileService.NO_IMAGE_FILE);
            }

            return organizationsView;
        }

        public Task<bool> OrganizationExistsAsync(Expression<Func<OrganizationPoco, bool>> predicate)
        {
            return _db.Organizations.AnyAsync(predicate);
        }

        public Task<bool> UserOrganizationExistsAsync(Expression<Func<UserOrganizationPoco, bool>> predicate)
        {
            return _db.UsersOrganization.AnyAsync(predicate);
        }

        public Task<long> AddUserToOrganizationAsync(long organizationId, long? currentUserId)
        {
            var userOrganization = new UserOrganizationPoco
            {
                OrganizationId = organizationId,
                UserId = currentUserId.Value
            };

            return _db.UsersOrganization.X_CreateAsync(userOrganization, currentUserId);
        }

        public async Task<long> RemoveUserFromOrganizationAsync(long userId, long organizationId, long? currentUserId)
        {
            var userOrganization = await _db.UsersOrganization
                .FirstOrDefaultAsync(x => x.UserId == userId && x.OrganizationId == organizationId);
            await _db.UsersOrganization
                .X_DeleteAsync(x => x.UserOrganizationId == userOrganization.UserOrganizationId, currentUserId);

            return userOrganization.UserOrganizationId;
        }

        public async Task<UserOrganizationView> GetUserOrganizationViewAsync(Expression<Func<VUserOrganizationPoco, bool>> predicate)
        {
            var userOrganizationPoco = await _db.VUsersOrganizations.FirstOrDefaultAsync(predicate);
            return Mapper.CreateObject<UserOrganizationView>(userOrganizationPoco);
        }

        public Task<long> SubscribeUserToOrganizationAsync(long organizationId, long? currentUserId)
        {
            var subscription = new OrganizationSubscriptionPoco
            {
                OrganizationId = organizationId,
                UserId = currentUserId.Value,
                OrganizationSubscriptionCreatedOnDateTime = DateTime.Now
            };

            return _db.OrganizationsSubscriptions.X_CreateAsync(subscription, currentUserId);
        }

        public async Task<long> UnsubscribeUserFromOrganizationAsync(long userId, long organizationId, long? currentUserId)
        {
            var subscription = await _db.OrganizationsSubscriptions
                .FirstOrDefaultAsync(x => x.UserId == userId && x.OrganizationId == organizationId);
            await _db.OrganizationsSubscriptions
                .X_DeleteAsync(x => x.OrganizationSubscriptionId == subscription.OrganizationSubscriptionId, currentUserId);

            return subscription.OrganizationSubscriptionId;
        }

        public Task<bool> OrganizationSubscriptionExistsAsync(Expression<Func<OrganizationSubscriptionPoco, bool>> predicate)
        {
            return _db.OrganizationsSubscriptions.AnyAsync(predicate);
        }
    }
}
