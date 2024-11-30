using EventManager.API.Helpers;
using LinqToDB.Mapping;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserNew
    {
        public UserNew()
        {
            UserCreatedOnDateTime = DateTime.Now;
            UserRegionsHelpingIds = new List<long>();
        }

        [Required(ErrorMessage = "Потребителско име е задължително")]
        public string Username { get; set; }

        [EmailAddress(ErrorMessage = "Имейлът е задължителен")]
        public string UserEmail { get; set; }

        [Required(ErrorMessage = "Паролата е задължителна")]
        public string UserPassword { get; set; }

        [Required(ErrorMessage = "Повторете отново паролата")]
        public string PasswordRepeated { get; set; }

        [Required(ErrorMessage = "Името е задължително")]
        public string UserFirstName { get; set; }

        [Nullable]
        public string UserSecondName { get; set; }

        [Required(ErrorMessage = "Фамилията е задължителна")]
        public string UserLastName { get; set; }

        [Nullable]
        public string UserPhoneNumber { get; set; }

        [Required(ErrorMessage = "Изберете регион, в който живеете")]
        public long RegionId { get; set; }

        [NotEmptyCollection(ErrorMessage = "Изберете поне един регион, в коойто искате да помагате")]
        public List<long> UserRegionsHelpingIds { get; set; }

        [Nullable]
        public IFormFile ProfilePicture { get; set; }

        [Nullable]
        public string UserShortDescription { get; set; }

        #region JsonIgnore
        [JsonIgnore]
        public long? UserProfilePictureFileId { get; set; }

        [JsonIgnore]
        public DateTime UserCreatedOnDateTime { get; set; }

        [JsonIgnore]
        public string UserEmailVerificationSecret { get; set; }

        [JsonIgnore]
        public long? UserCreatedByUserId { get; set; }
        #endregion JsonIgnore
    }
}
