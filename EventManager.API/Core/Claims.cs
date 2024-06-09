namespace EventManager.API.Core
{
    public static class ClaimTypeValues
    {
        public const string Admin = "Admin";
        public const string EventCreator = "EventCreator";
    }

    public static class CustomClaimTypes
    {
        public const string Role = "Role";
        public const string UserId = "UserId";
    }

    public enum UserClaimType
    {
        None = 0,
        Admin = 1,
        EventCreator = 2
    }
}
