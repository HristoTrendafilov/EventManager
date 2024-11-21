using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Controllers
{
    public class UserPasswordBaseForm
    {
        [Required(ErrorMessage = "Паролата е задължителна.")]
        public string UserPassword { get; set; }

        [Required(ErrorMessage = "Повторете отново новата парола.")]
        public string PasswordRepeated { get; set; }
    }
}
