using EventManager.API.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace EventManager.API.Helpers
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

    public class ClaimAccessAttribute : TypeFilterAttribute
    {
        public ClaimAccessAttribute(string claimValue) : base(typeof(ClaimAccessFilter))
        {
            Arguments = [new Claim(CustomClaimTypes.Role, claimValue)];
        }
    }

    public class ClaimAccessFilter : IAuthorizationFilter
    {
        private readonly Claim _claim;

        public ClaimAccessFilter(Claim claim)
        {
            _claim = claim;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            var isAdmin = user.HasClaim(x => x.Type == CustomClaimTypes.Role && x.Value == ClaimTypeValues.Admin);
            if (!isAdmin)
            {
                var hasClaim = user.HasClaim(x => x.Type == _claim.Type && x.Value == _claim.Value);
                if (!hasClaim)
                {
                    context.Result = new ForbidResult();
                }
            }
        }
    }
}
