using EventManager.API.Helpers;
using Newtonsoft.Json;

namespace EventManager.API.Dto.Event
{
    [GenerateTypeScriptInterface]
    public class EventForUpdate : EventBaseForm
    {
        public string MainImageUrl { get; set; }

        #region JsonIgnore
        [JsonIgnore]
        public override IFormFile MainImage { get; set; }
        #endregion JsonIgnore
    }
}
