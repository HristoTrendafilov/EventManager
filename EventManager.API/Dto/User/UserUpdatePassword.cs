using EventManager.API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserUpdatePassword
    {
        [Required(ErrorMessage = "Текущата парола е задължителна")]
        public string CurrentPassword { get; set; }

        [Required(ErrorMessage = "Новата парола е задължителна")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Повторете отново новата парола")]
        public string NewPasswordRepeated { get; set; }
    }
}
