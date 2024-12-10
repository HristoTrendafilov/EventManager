using EventManager.API.Helpers;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationMembersNew
    {
        public List<long> UsersIds { get; set; }
    }
}
