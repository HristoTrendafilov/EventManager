using EventManager.API.Helpers;

namespace EventManager.API.Dto.User
{
    [GenerateZodSchema]
    public class UserUpdatePassword
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string NewPasswordRepeated { get; set; }
    }
}
