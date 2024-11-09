using EventManager.API.Dto.Region;
using EventManager.DAL;
using Newtonsoft.Json;

namespace EventManager.API.Dto.User
{
    public class UserView : VUserPoco
    {
        public UserView()
        {
            RegionsHelping = new List<RegionView>();
        }

        public bool CanEdit { get; set; }
        public List<RegionView> RegionsHelping { get; set; }
        public List<long> UserRegionsHelpingIds => RegionsHelping.Select(x => x.RegionId).ToList();

        [JsonIgnore]
        public override string Password { get; set; }

        [JsonIgnore]
        public override string ProfilePicturePath { get; set; }

        [JsonIgnore]
        public override string EmailVerificationSecret { get; set; }

        [JsonIgnore]
        public override bool? IsEmailVerified { get; set; }
    }
}
