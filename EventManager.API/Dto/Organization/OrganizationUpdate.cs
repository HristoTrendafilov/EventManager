using EventManager.API.Helpers;

namespace EventManager.API.Dto.Organization
{
    [GenerateZodSchema]
    public class OrganizationUpdate : OrganizationBaseForm
    {
        [MaxFileSize(1 * 1024 * 1024, ErrorMessage = "Максималният размер за файл е 1MB")]
        public override IFormFile OrganizationLogoFile { get; set; }
    }
}
