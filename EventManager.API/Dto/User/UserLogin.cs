using EventManager.API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserLogin
    {
        [Required(ErrorMessage = "Потребителско име е задължително.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Паролата е задължителна.")]
        public string Password { get; set; }
    }
}
