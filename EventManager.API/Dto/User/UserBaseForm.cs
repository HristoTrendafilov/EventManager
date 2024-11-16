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
        public virtual string FirstName { get; set; }

        public virtual string SecondName { get; set; }

        [Required(ErrorMessage = "Фамилията е задължителна.")]
        public virtual string LastName { get; set; }

        public virtual string PhoneNumber { get; set; }

        public virtual string ShortDescription { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Регионът, в който живеете, е задължителен.")]
        public virtual long RegionId { get; set; }

        [NotEmptyCollection(ErrorMessage = "Моля, изберете региони, в които искате да помагате.")]
        public virtual List<long> UserRegionsHelpingIds { get; set; }

        public virtual IFormFile ProfilePicture { get; set; }

        public virtual string ProfilePicturePath { get; set; }
    }
}
