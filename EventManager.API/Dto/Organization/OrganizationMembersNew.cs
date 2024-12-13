using EventManager.API.Helpers;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationMembersNew
    {
        public OrganizationMembersNew()
        {
            UsersIds = new List<long>();
        }

        public List<long> UsersIds { get; set; }
    }
}
