using EventManager.Dto.Region;

namespace EventManager.Dto.User
{
    public class UserDto
    {
        public UserDto()
        {
            RegionsHelping = new List<RegionDto>();
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

        public List<RegionDto> RegionsHelping { get; set; }
    }
}
