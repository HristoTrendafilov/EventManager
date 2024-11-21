using EventManager.API.Helpers;
using LinqToDB.Mapping;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserUpdatePersonalData
    {
        public UserUpdatePersonalData()
        {
            UserRegionsHelpingIds = new List<long>();
        }

        [Required(ErrorMessage = "Името е задължително")]
        public string UserFirstName { get; set; }

        [Nullable]
        public string UserSecondName { get; set; }

        [Required(ErrorMessage = "Фамилията е задължителна")]
        public string UserLastName { get; set; }

        [Required(ErrorMessage = "Изберете регион, в който живеете")]
        public long RegionId { get; set; }

        [Nullable]
        public string UserPhoneNumber { get; set; }

        [Nullable]
        public string UserShortDescription { get; set; }

        [Nullable]
        public IFormFile ProfilePicture { get; set; }

        [NotEmptyCollection(ErrorMessage = "Изберете поне един регион, в коойто искате да помагате")]
        public List<long> UserRegionsHelpingIds { get; set; }

        #region JsonIgnore
        [JsonIgnore]
        public long? UserProfilePictureFileId { get; set; }
        #endregion JsonIgnore
    }
}
