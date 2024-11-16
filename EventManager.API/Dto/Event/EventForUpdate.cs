using EventManager.API.Helpers;
using Newtonsoft.Json;

namespace EventManager.API.Dto.Event
{
    [GenerateTypeScriptInterface]
    public class EventForUpdate : EventBaseForm
    {
        public bool HasMainImage { get; set; }

        #region JsonIgnore
        [JsonIgnore]
        public override IFormFile MainImage { get; set; }
        #endregion JsonIgnore
    }
}
