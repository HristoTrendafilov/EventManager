using EventManager.API.Helpers;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserProfileOrganization
    {
        public long OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public string OrganizationLogoRelativePath { get; set; }
        public string OrganizationLogoUrl { get; set; }
        public DateTime OrganizationSubscriptionCreatedOnDateTime { get; set; }
        public string OrganizationDescription { get; set; }
    }

    public enum UserProfileOrganizationType
    {
        Subscriptions = 1,
        Managed = 2
    }
}
