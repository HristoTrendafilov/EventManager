namespace EventManager.API.Core
{
    public static class ClaimTypeValues
    {
        public const string Admin = "admin";
        public const string EventCreator = "event_creator";
    }

    public enum UserClaimType
    {
        None = 0,
        Admin = 1,
        EventCreator = 2
    }
}
