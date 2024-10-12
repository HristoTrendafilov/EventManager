namespace EventManager.API.Core
{
    public static class ClaimTypeValues
    {
        public const string Admin = "Admin";
        public const string EventCreator = "EventCreator";
    }

    public class CustomClaimTypes
    {
        public const string UserId = "UserId";
        public const string WebSessionId = "WebSessionId";
    }

    public enum UserRole
    {
        None = 0,
        Admin = 1,
        EventCreator = 2
    }
}
