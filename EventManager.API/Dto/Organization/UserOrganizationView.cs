using EventManager.API.Helpers;
using EventManager.DAL;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class UserOrganizationView : VUserOrganizationPoco
    {
        public string UserProfilePictureUrl { get; set; }
    }
}
