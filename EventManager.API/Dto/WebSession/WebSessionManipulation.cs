namespace EventManager.API.Dto.WebSession
{
    public abstract class WebSessionManipulation
    {
        public long WebSessionId { get; set; }
        public DateTime LoginDateTime { get; set; }
        public long UserId { get; set; }
        public DateTime ExpireOnDateTime { get; set; }
        public string UserIpAddress { get; set; }
        public DateTime? LogoutDateTime { get; set; }
    }
}
