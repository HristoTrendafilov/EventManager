using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace EventManager.API.Dto
{
    public class NotEmptyCollection : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var colection = value as ICollection;
            if (colection == null || colection.Count == 0)
            {
                return new ValidationResult(ErrorMessage);
            }

            return ValidationResult.Success;
        }
    }
}
