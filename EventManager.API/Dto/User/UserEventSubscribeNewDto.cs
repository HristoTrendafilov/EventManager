namespace EventManager.Dto.User
{
    public class UserEventSubscribeNewDto
    {
        public UserEventSubscribeNewDto()
        {
            this.UserSubscribedOnDateTime = DateTime.Now;
        }

        public long UserId { get; set; }
        public long EventId { get; set; }
        public DateTime UserSubscribedOnDateTime { get; set; }
    }
}
