using EventManager.API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User.Role
{
    [GenerateZodSchema]
    public class RoleFilter
    {
        [Required(ErrorMessage = "Моля, въведете потребителско име")]
        public string Username { get; set; }
    }
}
