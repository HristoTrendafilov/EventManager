using EventManager.API.Helpers;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Region
{
    [GenerateZodSchema]
    public class RegionBaseForm
    {
        [Required(ErrorMessage = "Името на региона е задължително.")]
        public string RegionName { get; set; }
    }
}
