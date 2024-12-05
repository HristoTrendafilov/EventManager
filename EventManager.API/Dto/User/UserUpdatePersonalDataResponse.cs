using EventManager.API.Helpers;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserUpdatePersonalDataResponse
    {
        public string ProfilePictureUrl { get; set; }
    }
}
