﻿using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.User
{
    public class UserRegionHelpingNew
    {
        public long UserRegionHelpingId { get; set; }

        [Required(ErrorMessage = "Потребителят е задължителен.")]
        public long UserId { get; set; }

        [Required(ErrorMessage = "Регионът е задължителен.")]
        public long RegionId { get; set; }
    }
}
