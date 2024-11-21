using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    public class UserUpdateUsername
    {
        [Required(ErrorMessage = "Потребителско име е задължително")]
        public string Username { get; set; }
    }
}
