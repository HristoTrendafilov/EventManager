using EventManager.API.Helpers;
using LinqToDB.Mapping;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationMembersNew
    {
        public OrganizationMembersNew()
        {
            Users = new List<OrganizationUser>();
        }

        public List<OrganizationUser> Users { get; set; }
    }

    [GenerateTypeScriptInterface]
    public class OrganizationUser
    {
        public long UserId { get; set; }
        public bool IsManager { get; set; }

        [TypescriptOptional]
        public string Username { get; set; }
        [TypescriptOptional]
        public string UserFullName { get; set; }
        [TypescriptOptional]
        public string UserProfilePictureUrl { get; set; }
    }
}
