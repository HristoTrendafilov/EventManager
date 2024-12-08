using EventManager.API.Helpers;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Organization
{
    [GenerateZodSchema]
    public class OrganizationBaseForm
    {
        [Required(ErrorMessage = "Името на организацията е задължително")]
        public string OrganizationName { get; set; }

        [Required(ErrorMessage = "Описанието на организацията е задължително")]
        public string OrganizationDescription { get; set; }

        public virtual IFormFile OrganizationLogoFile { get; set; }

        #region JsonIgnore
        [JsonIgnore]
        public long OrganizationLogoFileId { get; set; }
        #endregion JsonIgnore
    }
}
