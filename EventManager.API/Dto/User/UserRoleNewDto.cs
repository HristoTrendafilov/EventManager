﻿using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    public class UserRoleNewDto
    {
        [Required(ErrorMessage = "Потребителят е задължителен.")]
        public long UserId { get; set; }

        [Required(ErrorMessage = "Правото е задължително.")]
        public long RoleId { get; set; }
    }
}
