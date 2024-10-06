using System.ComponentModel.DataAnnotations;

namespace EventManager.Dto.User
{
    public class UserNewDto : UserManipulationDto
    {
        public UserNewDto()
        {
            CreatedOn = DateTime.Now;
            EmailVerificationSecret = Guid.NewGuid().ToString();
        }

        [Required(ErrorMessage = "Паролата е задължителна.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Моля, повторете отново паролата")]
        public string PasswordRepeated { get; set; }

        public DateTime CreatedOn { get; set; }

        public string EmailVerificationSecret { get; set; }
    }
}
