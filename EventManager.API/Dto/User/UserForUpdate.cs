using EventManager.API.Helpers;
using Newtonsoft.Json;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserForUpdate : UserBaseForm
    {
        public bool HasProfilePicture { get; set; }
        public string Username { get; set; }

        #region JsonIgnore
        [JsonIgnore]
        public override IFormFile ProfilePicture { get; set; }
        #endregion JsonIgnore
    }
}
