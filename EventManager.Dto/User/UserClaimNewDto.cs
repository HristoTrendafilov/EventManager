using System.ComponentModel.DataAnnotations;

namespace EventManager.DTO.User
{
    public class UserClaimNewDto
    {
        [Required(ErrorMessage = "Потребителят е задължителен.")]
        public long UserId { get; set; }

        [Required(ErrorMessage = "Правото е задължително.")]
        public long ClaimId { get; set; }
    }
}
