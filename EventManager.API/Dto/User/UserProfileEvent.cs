using EventManager.API.Helpers;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserProfileEvent
    {
        public long EventId { get; set; }
        public string EventName { get; set; }
        public virtual string EventDescription { get; set; }
        public string MainImageUrl { get; set; }
        public string MainImageRelativePath { get; set; }
        public DateTime UserSubscribedOnDateTime { get; set; }
        public DateTime EventCreatedOnDateTime { get; set; }
    }
}
