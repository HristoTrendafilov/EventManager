using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    public class UserLoginDto
    {
        [Required(ErrorMessage = "Потребителско име е задължително.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Паролата е задължителна.")]
        public string Password { get; set; }
    }
}
