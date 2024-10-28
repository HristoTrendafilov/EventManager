using EventManager.DAL;

namespace EventManager.API.Dto.Event
{
    public class UserEventView: VUserEventPoco
    {
        public bool HasProfilePicture => !string.IsNullOrWhiteSpace(ProfilePicturePath);
    }
}
