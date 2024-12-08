using EventManager.API.Core;
using EventManager.API.Dto;
using EventManager.API.Helpers;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Organization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EventManager.API.Dto.Organization;
using EventManager.API.Services.Shared;
using EventManager.API.Dto.Event;
using EventManager.BOL;

namespace EventManager.API.Controllers
{
    [Authorize]
    [Role(UserRole.Admin)]
    [Route("api/organizations")]
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        private readonly IOrganizationService _organizationService;
        private readonly ISharedService _sharedService;

        public OrganizationController(IOrganizationService organizationService, ISharedService sharedService)
        {
            _organizationService = organizationService;
            _sharedService = sharedService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllOrganizationsView()
        {
            var organizations = await _organizationService.GetAllOrganizationsViewAsync(x => true);
            return Ok(organizations);
        }

        [HttpGet("{organizationId}/view")]
        public async Task<ActionResult> GetOrganizationView(long organizationId)
        {
            if (!await _organizationService.OrganizationExistsAsync(x => x.OrganizationId == organizationId))
            {
                return NotFound();
            }

            var currentUserId = User.X_CurrentUserId();

            var organization = await _organizationService.GetOrganizationViewAsync(x => x.OrganizationId == organizationId);
            organization.isUserSubscribed = currentUserId.HasValue &&
                await _organizationService.OrganizationSubscriptionExistsAsync(x => x.OrganizationId == organizationId 
                                                                                && x.UserId == currentUserId.Value);

            return Ok(organization);
        }

        [HttpPost("new")]
        public async Task<ActionResult> CreateOrganization([FromForm] OrganizationNew organization)
        {
            if (await _organizationService.OrganizationExistsAsync(x => x.OrganizationName == organization.OrganizationName))
            {
                return BadRequest($"Вече съществува организация с име: {organization.OrganizationName}");
            }

            var organizationId = await _organizationService.CreateOrganizationAsync(organization, User.X_CurrentUserId());
            var organizationView = await _organizationService.GetOrganizationViewAsync(x => x.OrganizationId == organizationId);

            return Ok(organizationView);
        }

        [HttpPut("{organizationId}/update")]
        public async Task<ActionResult> UpdateOrganization(long organizationId, [FromForm] OrganizationUpdate organization)
        {
            if (await _organizationService.OrganizationExistsAsync(x => x.OrganizationName == organization.OrganizationName && x.OrganizationId != organizationId))
            {
                return BadRequest($"Вече съществува организация с име: {organization.OrganizationName}");
            }

            var organizationPoco = await _organizationService.GetOrganizationPocoAsync(x => x.OrganizationId == organizationId);
            if (!await _sharedService.IsUserAuthorizedToEdit(User, organizationPoco.OrganizationCreatedByUserId))
            {
                return Unauthorized();
            }

            await _organizationService.UpdateOrganizationAsync(organizationId, organization, User.X_CurrentUserId());
            var organizationView = await _organizationService.GetOrganizationViewAsync(x => x.OrganizationId == organizationId);

            return Ok(organizationView);
        }

        [HttpGet("{organizationId}/update")]
        public async Task<ActionResult> GetOrganizationForUpdate(long organizationId)
        {
            var organizationView = await _organizationService.GetOrganizationViewAsync(x => x.OrganizationId == organizationId);
            if (organizationView == null)
            {
                return NotFound();
            }

            if (!await _sharedService.IsUserAuthorizedToEdit(User, organizationView.OrganizationCreatedByUserId))
            {
                return Unauthorized();
            }

            var organizationToReturn = Mapper.CreateObject<OrganizationForUpdate>(organizationView);

            return Ok(organizationToReturn);
        }

        [HttpPost("{organizationId}/members")]
        public async Task<ActionResult> AddUserToOrganization(long organizationId)
        {
            var currentUserId = User.X_CurrentUserId();

            if (await _organizationService.UserOrganizationExistsAsync(x => x.UserId == currentUserId.Value && x.OrganizationId == organizationId))
            {
                return BadRequest($"Вече е добавен потребител с ID: {currentUserId.Value}");
            }

            await _organizationService.AddUserToOrganizationAsync(organizationId, currentUserId);
 
            return NoContent();
        }

        [HttpDelete("{organizationId}/members")]
        public async Task<ActionResult> RemoveUserFromOrganization(long organizationId)
        {
            var currentUserId = User.X_CurrentUserId();

            if (!await _organizationService.UserOrganizationExistsAsync(x => x.UserId == currentUserId.Value && x.OrganizationId == organizationId))
            {
                return BadRequest($"Не съществува членство на потребител с ID: {currentUserId.Value}");
            }

           await _organizationService.RemoveUserFromOrganizationAsync(currentUserId.Value, organizationId, currentUserId);

            return Ok();
        }


        [HttpPost("{organizationId}/subscription")]
        public async Task<ActionResult> SubscribeUserToOrganization(long organizationId)
        {
            var currentUserId = User.X_CurrentUserId();

            if (await _organizationService.OrganizationSubscriptionExistsAsync(x => x.UserId == currentUserId.Value && x.OrganizationId == organizationId))
            {
                return BadRequest($"Вече е абониран потребител с ID: {currentUserId.Value}");
            }

            await _organizationService.SubscribeUserToOrganizationAsync(organizationId, currentUserId);

            return NoContent();
        }

        [HttpDelete("{organizationId}/subscription")]
        public async Task<ActionResult> UnsubscribeUserFromOrganization(long organizationId)
        {
            var currentUserId = User.X_CurrentUserId();

            if (!await _organizationService.OrganizationSubscriptionExistsAsync(x => x.UserId == currentUserId.Value && x.OrganizationId == organizationId))
            {
                return BadRequest($"Не съществува абонамент на потребител с ID: {currentUserId.Value}");
            }

            await _organizationService.UnsubscribeUserFromOrganizationAsync(currentUserId.Value, organizationId, currentUserId);

            return NoContent();
        }
    }
}
