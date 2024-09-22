using EventManager.API.Core;
using EventManager.API.Services.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections;
using System.ComponentModel.DataAnnotations;

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

    public class RoleAttribute : TypeFilterAttribute
    {
        public RoleAttribute(UserRole role) : base(typeof(RoleAccessFilter))
        {
            Arguments = [role];
        }
    }

    public class RoleAccessFilter : IAsyncAuthorizationFilter
    {
        private readonly UserRole _role;  // Role is passed through the constructor
        private readonly IUserService _userService;

        // Constructor accepts the UserRole directly and the user service for user role fetching
        public RoleAccessFilter(UserRole role, IUserService userService)
        {
            _role = role;
            _userService = userService;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // Extract the user ID from the JWT claims
            var userIdClaim = context.HttpContext.User.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.UserId)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim))
            {
                context.Result = new ForbidResult();  // Deny access if user ID is missing
                return;
            }

            // Fetch user roles from the database or service
            var userRoles = await _userService.GetAllUserRolesAsync(long.Parse(userIdClaim));

            var isAdmin = userRoles.Any(x => x.RoleId == (int)UserRole.Admin);
            if (!isAdmin)
            {
                // Check if the user has the required role (which was passed through the constructor)
                if (!userRoles.Any(x => x.RoleId == (int)_role))
                {
                    context.Result = new ForbidResult();  // Deny access if the user doesn't have the required role
                    return;
                }
            }

            // Allow the request to proceed if the user has the required role
            await Task.CompletedTask;
        }
    }

}
