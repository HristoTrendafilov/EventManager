using EventManager.API.Dto.WebSession;
using EventManager.API.Helpers;
using LinqToDB.Mapping;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserForUpdate
    {
        public UserForUpdate()
        {
            UserRegionsHelpingIds = new List<long>();
            WebSessions = new List<WebSessionView>();
        }

        public bool HasProfilePicture { get; set; }

        public string Username { get; set; }

        public string UserFirstName { get; set; }

        [Nullable]
        public string UserSecondName { get; set; }

        public string UserLastName { get; set; }

        public string ProfilePictureUrl { get; set; }

        public long RegionId { get; set; }

        [Nullable]
        public string UserPhoneNumber { get; set; }

        [Nullable]
        public string UserShortDescription { get; set; }

        public List<long> UserRegionsHelpingIds { get; set; }

        public List<WebSessionView> WebSessions { get; set; }
    }
}
