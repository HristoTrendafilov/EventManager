using EventManager.API.Dto.Region;
using EventManager.DAL;

namespace EventManager.API.Dto.User
{
    public class UserView : VUserPoco
    {
        public UserView()
        {
            RegionsHelping = new List<RegionView>();
        }

        public bool CanEdit { get; set; }
        public bool HasProfilePicture => !string.IsNullOrWhiteSpace(ProfilePicturePath);

        public List<RegionView> RegionsHelping { get; set; }
        public List<long> UserRegionsHelpingIds => RegionsHelping.Select(x => x.RegionId).ToList();
    }
}
