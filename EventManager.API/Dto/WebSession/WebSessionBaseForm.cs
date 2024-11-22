using LinqToDB.Mapping;

namespace EventManager.API.Dto.WebSession
{
    public class WebSessionBaseForm
    {
        public long UserId { get; set; }

        public DateTime WebSessionExpireOnDateTime { get; set; }

        [Nullable]
        public string WebSessionUserIpAddress { get; set; }

        [Nullable]
        public DateTime? WebSessionLogoutDateTime { get; set; }
    }
}
