using EventManager.API.Helpers;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationUsersNew
    {
        public List<long> UsersIds { get; set; }
    }
}
