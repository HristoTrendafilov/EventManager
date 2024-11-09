using EventManager.API.Helpers;

namespace EventManager.API.Dto.Region
{
    [GenerateTypeScriptInterface]
    public class RegionView
    {
        public long RegionId { get; set; }
        public string RegionName { get; set; }
    }
}
