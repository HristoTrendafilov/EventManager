using EventManager.API.Helpers;

namespace EventManager.API.Dto
{
    [GenerateTypeScriptInterface]
    public class PrimaryKeyResponse
    {
        public long PrimaryKey { get; set; }
    }
}
