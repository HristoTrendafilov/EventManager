﻿namespace EventManager.API.Dto.User
{
    public class UserUpdatePassword
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string NewPasswordRepeated { get; set; }
    }
}