namespace EventManager.API.Dto.WebSession
{
    public class WebSessionNew : WebSessionBaseForm
    {
        public WebSessionNew()
        {
            WebSessionCreatedOnDateTime = DateTime.Now;
        }

        public DateTime WebSessionCreatedOnDateTime { get; set; }
    }
}
