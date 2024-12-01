using EventManager.API.Dto.Region;
using EventManager.API.Dto.User.Role;
using EventManager.API.Helpers;
using EventManager.DAL;
using Newtonsoft.Json;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserView : VUserPoco
    {
        public UserView()
        {
            RegionsHelping = new List<RegionView>();
            UserRoles = new List<RoleView>();
        }

        public bool CanEdit { get; set; }
        public List<RegionView> RegionsHelping { get; set; }
        public List<long> UserRegionsHelpingIds => RegionsHelping.Select(x => x.RegionId).ToList();

        public List<RoleView> UserRoles { get; set; }
        public List<long> UserRolesIds => this.UserRoles.Select(x => x.RoleId).ToList();

        #region JsonIgnore
        [JsonIgnore]
        public override string UserPassword { get; set; }
        [JsonIgnore]
        public override long? UserProfilePictureFileId { get; set; }
        [JsonIgnore]
        public override string UserEmailVerificationSecret { get; set; }
        [JsonIgnore]
        public override bool UserIsEmailVerified { get; set; }
        [JsonIgnore]
        public override DateTime UserCreatedOnDateTime { get; set; }
        #endregion JsonIgnore
    }
}
