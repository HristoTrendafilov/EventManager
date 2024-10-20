using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    public class UserNewDto : UserManipulationDto
    {
        public UserNewDto()
        {
            CreatedOnDateTime = DateTime.Now;
            EmailVerificationSecret = Guid.NewGuid().ToString();
        }

        [Required(ErrorMessage = "Паролата е задължителна.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Моля, повторете отново паролата")]
        public string PasswordRepeated { get; set; }

        public DateTime CreatedOnDateTime { get; set; }

        public string EmailVerificationSecret { get; set; }

        public string ShortDescription { get; set; }

        public IFormFile ProfilePicture { get; set; }
    }
}
