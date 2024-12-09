using EventManager.API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserSearchFilter
    {
        [Required(ErrorMessage = "Потребителското име е задължително")]
        public string Username { get; set; }
    }
}
