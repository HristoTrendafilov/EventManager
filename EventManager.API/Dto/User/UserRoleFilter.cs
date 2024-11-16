using EventManager.API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserRoleFilter
    {
        [Required(ErrorMessage = "Моля, въведете потребителско име")]
        public string Username { get; set; }
    }
}
