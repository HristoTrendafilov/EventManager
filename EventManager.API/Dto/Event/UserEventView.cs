using EventManager.API.Helpers;
using EventManager.DAL;

namespace EventManager.API.Dto.Event
{
    [GenerateTypeScriptInterface]
    public class UserEventView : VUserEventPoco
    {
        public string UserProfilePictureUrl { get; set; }
    }
}
