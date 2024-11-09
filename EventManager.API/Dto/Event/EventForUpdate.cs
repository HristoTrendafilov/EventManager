using EventManager.API.Helpers;

namespace EventManager.API.Dto.Event
{
    [GenerateTypeScriptInterface]
    public class EventForUpdate : EventBaseForm
    {
        public bool HasMainImage { get; set; }
    }
}
