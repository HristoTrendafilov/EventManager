using EventManager.API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public abstract class UserBaseForm
    {
        protected UserBaseForm()
        {
            UserRegionsHelpingIds = new List<long>();
        }

        [Required(ErrorMessage = "Името е задължително.")]
        public string FirstName { get; set; }

        public string SecondName { get; set; }

        [Required(ErrorMessage = "Фамилията е задължителна.")]
        public string LastName { get; set; }

        public string PhoneNumber { get; set; }

        public string ShortDescription { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Регионът, в който живеете, е задължителен.")]
        public long RegionId { get; set; }

        [NotEmptyCollection(ErrorMessage = "Моля, изберете региони, в които искате да помагате.")]
        public List<long> UserRegionsHelpingIds { get; set; }

        public IFormFile ProfilePicture { get; set; }

        public string ProfilePicturePath { get; set; }
    }
}
