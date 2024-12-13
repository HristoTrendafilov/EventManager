using EventManager.API.Dto.User;
using EventManager.API.Helpers;
using Newtonsoft.Json;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationForUpdate : OrganizationBaseForm
    {
        public OrganizationForUpdate()
        {
            OrganizationManagers = new List<UserPreview>();
        }

        public string OrganizationLogoUrl { get; set; }

        public List<UserPreview> OrganizationManagers { get; set; }
        public override List<long> OrganizationManagersIds => OrganizationManagers.Select(x => x.UserId).ToList();

        #region JsonIgnore
        [JsonIgnore]
        public override IFormFile OrganizationLogoFile { get; set; }
        #endregion JsonIgnore
    }
}
