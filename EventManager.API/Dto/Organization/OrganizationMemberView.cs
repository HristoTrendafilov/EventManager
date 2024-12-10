using EventManager.API.Helpers;
using EventManager.DAL;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationMemberView : VOrganizationMemberPoco
    {
        public string UserProfilePictureUrl { get; set; }
    }
}
