using EventManager.API.Dto.Event;
using EventManager.API.Dto.Organization;
using EventManager.API.Dto.User;
using EventManager.API.Helpers;
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

                foreach (var userId in organization.OrganizationManagersIds)
                {
                    var organizationMember = new OrganizationMemberPoco
                    {
                        OrganizationId = organizationId,
                        UserId = userId,
                        CreatedOnDateTime = DateTime.Now,
                        IsManager = true
                    };

                    await _db.OrganizationsMembers.X_CreateAsync(organizationMember, currentUserId);
                }

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

                if (organization.OrganizationLogoFile != null)
                {
                    var fileId = await _fileService.CreateFileAsync(organization.OrganizationLogoFile, FileType.Public, currentUserId);
                    organization.OrganizationLogoFileId = fileId;
                    await _db.Organizations.X_UpdateAsync(organizationId, organization, currentUserId);
                    await _fileService.DeleteFileAsync(oldLogoFileId, currentUserId);

                }
                else
                {
                    organization.OrganizationLogoFileId = oldLogoFileId;
                    await _db.Organizations.X_UpdateAsync(organizationId, organization, currentUserId);
                }

                var existingMembers = await _db.OrganizationsMembers
                   .Where(x => x.OrganizationId == organizationId)
                   .ToListAsync();

                foreach (var userId in organization.OrganizationManagersIds)
                {
                    var existingMember = existingMembers.FirstOrDefault(x => x.UserId == userId);

                    if (existingMember != null)
                    {
                        if (!existingMember.IsManager)
                        {
                            existingMember.IsManager = true;
                            await _db.OrganizationsMembers.X_UpdateAsync(existingMember.OrganizationMemberId, existingMember, currentUserId);
                        }
                    }
                    else
                    {
                        var organizationMember = new OrganizationMemberPoco
                        {
                            OrganizationId = organizationId,
                            UserId = userId,
                            CreatedOnDateTime = DateTime.Now,
                            IsManager = true
                        };

                        await _db.OrganizationsMembers.X_CreateAsync(organizationMember, currentUserId);
                    }
                }

                var membersToDelete = existingMembers
                    .Where(x => !organization.OrganizationManagersIds.Contains(x.UserId) && x.IsManager)
                    .ToList();

                foreach (var member in membersToDelete)
                {
                    await _db.OrganizationsMembers.X_DeleteAsync(x => x.OrganizationMemberId == member.OrganizationMemberId, currentUserId);
                }
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

        public Task<bool> OrganizationMemberExists(Expression<Func<OrganizationMemberPoco, bool>> predicate)
        {
            return _db.OrganizationsMembers.AnyAsync(predicate);
        }

        public async Task AddMembersToOrganizationAsync(long organizationId, OrganizationMembersNew members, long? currentUserId)
        {
            await _db.WithTransactionAsync(async () =>
            {
                foreach (var userId in members.UsersIds)
                {
                    var organizationMember = new OrganizationMemberPoco
                    {
                        OrganizationId = organizationId,
                        UserId = userId,
                        CreatedOnDateTime = DateTime.Now,
                        IsManager = false
                    };

                    await _db.OrganizationsMembers.X_CreateAsync(organizationMember, currentUserId);
                }
            });
        }

        public async Task<long> DeleteOrganizationMember(long userId, long organizationId, long? currentUserId)
        {
            var userOrganization = await _db.OrganizationsMembers
                .FirstOrDefaultAsync(x => x.UserId == userId && x.OrganizationId == organizationId);
            await _db.OrganizationsMembers
                .X_DeleteAsync(x => x.OrganizationMemberId == userOrganization.OrganizationMemberId, currentUserId);

            return userOrganization.OrganizationMemberId;
        }

        public async Task<OrganizationMemberView> GetOrganizationMemberViewAsync(Expression<Func<VOrganizationMemberPoco, bool>> predicate)
        {
            var organizationMemberPoco = await _db.VOrganizationsMembers.FirstOrDefaultAsync(predicate);
            return Mapper.CreateObject<OrganizationMemberView>(organizationMemberPoco);
        }

        public async Task<List<OrganizationMemberView>> GetAllOrganizationMembersViewAsync(Expression<Func<VOrganizationMemberPoco, bool>> predicate)
        {
            var usersOrganizationsPoco = await _db.VOrganizationsMembers
                .Where(predicate)
                .OrderByDescending(x => x.CreatedOnDateTime)
                .ToListAsync();

            var usersOrganizations = Mapper.CreateList<OrganizationMemberView>(usersOrganizationsPoco);

            foreach (var userOrganization in usersOrganizations)
            {
                userOrganization.UserProfilePictureUrl =
                    _fileService.CreatePublicFileUrl(userOrganization.UserProfilePictureRelativePath, FileService.NO_USER_LOGO);
            }

            return usersOrganizations;
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

        public async Task<List<OrganizationView>> GetUserOrganizationsAsync(long userId, bool includeDefault)
        {
            var organizationIds = await _db.OrganizationsMembers.Where(x => x.UserId == userId)
                .Select(x => x.OrganizationId)
                .ToListAsync();

            if (includeDefault)
            {
                organizationIds.Add(1);
            }

            var organizationsViewPoco = await _db.VOrganizations
                .Where(x => organizationIds.Contains(x.OrganizationId))
                .OrderBy(x => x.OrganizationId)
                .ToListAsync();

            var organizationsView = Mapper.CreateList<OrganizationView>(organizationsViewPoco);

            return organizationsView;
        }

        public async Task<List<EventView>> GetOrganizationEvents(long organizationId)
        {
            var eventsViewPoco = await _db.VEvents
                .Where(x => x.OrganizationId == organizationId)
                .OrderByDescending(x => x.EventCreatedOnDateTime)
                .ToListAsync();

            var eventsView = Mapper.CreateList<EventView>(eventsViewPoco);

            foreach (var eventView in eventsView)
            {
                eventView.MainImageUrl = _fileService.CreatePublicFileUrl(eventView.MainImageRelativePath, FileService.NO_IMAGE_FILE);
            }

            return eventsView;
        }
    }
}
