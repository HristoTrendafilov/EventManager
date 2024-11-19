using LinqToDB.Mapping;

namespace EventManager.API.Dto.WebSession
{
    public class WebSessionBaseForm
    {
        public long WebSessionId { get; set; }
        
        public DateTime LoginDateTime { get; set; }
        
        public long UserId { get; set; }
        
        public DateTime ExpireOnDateTime { get; set; }

        [Nullable]
        public string UserIpAddress { get; set; }

        [Nullable]
        public DateTime? LogoutDateTime { get; set; }
    }
}
