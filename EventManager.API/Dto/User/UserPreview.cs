using EventManager.API.Helpers;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserPreview
    {
        public long UserId { get; set; }
        public string Username { get; set; }
        public string UserFullName { get; set; }
        public string UserProfilePictureUrl { get; set; }
    }
}
