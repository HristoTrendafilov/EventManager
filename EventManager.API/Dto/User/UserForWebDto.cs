namespace EventManager.Dto.User
{
    public class UserForWebDto
    {
        public long UserId { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
        public long WebSessionId { get; set; }
        public bool IsLoggedIn { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsEventCreator { get; set; }
    }
}
