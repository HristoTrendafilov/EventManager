using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    public abstract class UserManipulationDto
    {
        public UserManipulationDto()
        {
            UserRegionsHelpingIds = new List<long>();
        }

        [Required(ErrorMessage = "Потребителско име е задължително.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Името е задължително.")]
        public string FirstName { get; set; }

        public string SecondName { get; set; }

        [Required(ErrorMessage = "Фамилията е задължителна.")]
        public string LastName { get; set; }

        [EmailAddress(ErrorMessage = "Имейлът е задължителен.")]
        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Регионът, в който живеете, е задължителен.")]
        public long RegionId { get; set; }

        [NotEmptyCollection(ErrorMessage = "Моля, изберете региони, в които искате да помагате.")]
        public List<long> UserRegionsHelpingIds { get; set; }

        public long? CreatedByUserId { get; set; }
    }
}
