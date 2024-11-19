using EventManager.API.Helpers;
using LinqToDB.Mapping;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    public abstract class UserBaseForm
    {
        protected UserBaseForm()
        {
            UserRegionsHelpingIds = new List<long>();
        }

        [Required(ErrorMessage = "Името е задължително.")]
        public virtual string FirstName { get; set; }

        [Required(ErrorMessage = "Фамилията е задължителна.")]
        public virtual string LastName { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Регионът, в който живеете, е задължителен.")]
        public virtual long RegionId { get; set; }

        [NotEmptyCollection(ErrorMessage = "Моля, изберете региони, в които искате да помагате.")]
        public virtual List<long> UserRegionsHelpingIds { get; set; }

        [Nullable]
        public virtual IFormFile ProfilePicture { get; set; }

        [Nullable]
        public virtual string SecondName { get; set; }

        [Nullable]
        public virtual string PhoneNumber { get; set; }

        [Nullable]
        public virtual string ShortDescription { get; set; }
    }
}
