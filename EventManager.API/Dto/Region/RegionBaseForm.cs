using EventManager.API.Helpers;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Region
{
    [GenerateZodSchema]
    public class RegionBaseForm
    {
        public RegionBaseForm()
        {
            RegionCreatedOnDateTime = DateTime.Now;
        }

        [Required(ErrorMessage = "Името на региона е задължително.")]
        public string RegionName { get; set; }

        [JsonIgnore]
        public long RegionId { get; set; }

        public DateTime RegionCreatedOnDateTime { get; set; }
    }
}
