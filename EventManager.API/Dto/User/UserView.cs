using EventManager.API.Dto.Region;

namespace EventManager.API.Dto.User
{
    public class UserView
    {
        public UserView()
        {
            RegionsHelping = new List<RegionView>();
        }

        public long UserId { get; set; }
        public DateTime CreatedOnDateTime { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string SecondName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public long RegionId { get; set; }
        public string RegionName { get; set; }
        public string ProfilePictureBase64 { get; set; }
        public string ShortDescription { get; set; }
        public bool CanEdit { get; set; }

        public List<RegionView> RegionsHelping { get; set; }
    }
}
