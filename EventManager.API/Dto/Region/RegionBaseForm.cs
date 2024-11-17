using EventManager.API.Helpers;
using EventManager.DAL;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Region
{
    [GenerateZodSchema]
    public class RegionBaseForm : RegionPoco
    {
        [Required(ErrorMessage = "Името на региона е задължително.")]
        public override string RegionName { get; set; }

        [JsonIgnore]
        public override long RegionId { get; set; }
    }
}
