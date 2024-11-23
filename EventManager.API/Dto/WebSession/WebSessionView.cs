using EventManager.API.Helpers;
using EventManager.DAL;
using System.Text.Json.Serialization;

namespace EventManager.API.Dto.WebSession
{
    [GenerateTypeScriptInterface]
    public class WebSessionView : VWebSessionPoco
    {
        [JsonIgnore]
        public override string WebSessionIpInfo { get; set; }
    }
}
