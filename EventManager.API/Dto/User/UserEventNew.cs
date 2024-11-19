namespace EventManager.API.Dto.User
{
    public class UserEventNew
    {
        public UserEventNew()
        {
            UserSubscribedOnDateTime = DateTime.Now;
        }

        public long UserId { get; set; }

        public long EventId { get; set; }

        public DateTime UserSubscribedOnDateTime { get; set; }
    }
}
