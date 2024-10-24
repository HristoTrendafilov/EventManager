using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    public class UserNew : UserManipulation
    {
        public UserNew()
        {
            CreatedOnDateTime = DateTime.Now;
            EmailVerificationSecret = Guid.NewGuid().ToString();
        }

        [Required(ErrorMessage = "Потребителско име е задължително.")]
        public string Username { get; set; }

        [EmailAddress(ErrorMessage = "Имейлът е задължителен.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Паролата е задължителна.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Моля, повторете отново паролата")]
        public string PasswordRepeated { get; set; }

        public DateTime CreatedOnDateTime { get; set; }

        public string EmailVerificationSecret { get; set; }

        public long? CreatedByUserId { get; set; }
    }
}
