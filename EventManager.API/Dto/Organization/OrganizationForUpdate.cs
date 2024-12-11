using EventManager.API.Helpers;
using LinqToDB.Mapping;
using Newtonsoft.Json;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationForUpdate : OrganizationBaseForm
    {
        public string OrganizationLogoUrl { get; set; }

        public List<OrganizationUser> OrganizationManagers { get; set; }
        [Nullable]
        public override List<long> OrganizationManagersIds => OrganizationManagers?.Select(x => x.UserId).ToList();

        #region JsonIgnore
        [JsonIgnore]
        public override IFormFile OrganizationLogoFile { get; set; }
        #endregion JsonIgnore
    }
}
