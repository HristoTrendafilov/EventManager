using EventManager.API.Helpers;
using Newtonsoft.Json;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationForUpdate : OrganizationBaseForm
    {
        public string OrganizationLogoUrl { get; set; }

        #region JsonIgnore
        [JsonIgnore]
        public override IFormFile OrganizationLogoFile { get; set; }
        #endregion JsonIgnore
    }
}
