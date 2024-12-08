
using EventManager.API.Helpers;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Organization
{
    [GenerateZodSchema]
    public class OrganizationNew : OrganizationBaseForm
    {
        public OrganizationNew()
        {
            OrganizationCreatedOnDateTime = DateTime.Now;
        }

        [Required(ErrorMessage = "Логото на организацията е задължително")]
        [MaxFileSize(1 * 1024 * 1024, ErrorMessage = "Максималният размер за файл е 1MB")]
        public override IFormFile OrganizationLogoFile { get; set; }

        #region JsonIgnore
        [JsonIgnore]
        public DateTime OrganizationCreatedOnDateTime { get; set; }
        [JsonIgnore]
        public long OrganizationCreatedByUserId { get; set; }
        #endregion JsonIgnore
    }
}
