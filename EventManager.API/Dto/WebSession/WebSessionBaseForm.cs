using LinqToDB.Mapping;

namespace EventManager.API.Dto.WebSession
{
    public class WebSessionBaseForm
    {
        public WebSessionBaseForm()
        {
            WebSessionCreatedOnDateTime = DateTime.Now;
        }

        public long UserId { get; set; }

        [Nullable]
        public string WebSessionUserIpAddress { get; set; }

        public DateTime WebSessionCreatedOnDateTime { get; set; }

        public DateTime WebSessionExpireOnDateTime { get; set; }

        [Nullable]
        public DateTime? WebSessionLogoutDateTime { get; set; }
    }
}
