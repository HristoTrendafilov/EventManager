using EventManager.API.Helpers;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserRoleFilter
    {
        public string Username { get; set; }
    }
}
