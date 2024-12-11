using EventManager.API.Helpers;
using LinqToDB.Mapping;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Organization
{
    [GenerateZodSchema]
    public class OrganizationBaseForm
    {
        public OrganizationBaseForm()
        {
            OrganizationManagersIds = new List<long>();
        }

        [Required(ErrorMessage = "Името на организацията е задължително")]
        public string OrganizationName { get; set; }

        [Required(ErrorMessage = "Описанието на организацията е задължително")]
        public string OrganizationDescription { get; set; }

        public virtual IFormFile OrganizationLogoFile { get; set; }

        [Nullable]
        public virtual List<long> OrganizationManagersIds { get; set; }

        #region JsonIgnore
        [JsonIgnore]
        public long OrganizationLogoFileId { get; set; }
        #endregion JsonIgnore
    }
}
