using EventManager.API.Helpers;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserForWeb
    {
        public long UserId { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
        public long WebSessionId { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsEventCreator { get; set; }
    }
}
