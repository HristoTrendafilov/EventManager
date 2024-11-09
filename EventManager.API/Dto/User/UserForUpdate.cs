using EventManager.API.Helpers;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserForUpdate : UserBaseForm
    {
        public bool HasProfilePicture { get; set; }
        public string Username { get; set; }
    }
}
