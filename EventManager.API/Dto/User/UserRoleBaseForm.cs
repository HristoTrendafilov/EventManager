using EventManager.API.Helpers;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserRoleBaseForm
    {
        [Required(ErrorMessage = "Потребителят е задължителен.")]
        public long UserId { get; set; }

        public List<long> RolesIds { get; set; }
    }
}
