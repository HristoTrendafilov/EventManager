using EventManager.API.Helpers;

namespace EventManager.API.Dto.User.Role
{
    [GenerateTypeScriptInterface]
    public class RoleView
    {
        public long RoleId { get; set; }
        public string RoleName { get; set; }
        public string RoleNameBg { get; set; }
    }
}
