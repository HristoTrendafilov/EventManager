using EventManager.API.Helpers;

namespace EventManager.API.Dto.User
{
    [GenerateTypeScriptInterface]
    public class UserVerifyEmail
    {
        public long UserId { get; set; }
        public string EmailVerificationSecret { get; set; }
    }
}
