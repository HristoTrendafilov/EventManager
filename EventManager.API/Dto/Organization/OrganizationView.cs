using EventManager.API.Helpers;
using EventManager.DAL;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationView : VOrganizationPoco
    {
        public string OrganizationLogoUrl { get; set; }
        public bool isUserSubscribed { get; set; }
    }
}
