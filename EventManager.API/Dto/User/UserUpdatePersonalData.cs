using EventManager.API.Helpers;
using Newtonsoft.Json;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserUpdatePersonalData : UserBaseForm
    {
        #region JsonIgnore
        [JsonIgnore]
        public string ProfilePicturePath { get; set; }
        #endregion JsonIgnore
    }
}
