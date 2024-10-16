﻿using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto.Region
{
    public abstract class RegionManipulationDto
    {
        [Required(ErrorMessage = "Името на региона е задължително.")]
        public string RegionName { get; set; }
    }
}
