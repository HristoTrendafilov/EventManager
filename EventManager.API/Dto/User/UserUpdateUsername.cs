using EventManager.API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserUpdateUsername
    {
        [Required(ErrorMessage = "Потребителско име е задължително")]
        public string Username { get; set; }
    }
}
