using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Shared;
using EventManager.API.Services.User;
using EventManager.API.Services.WebSession;
using EventManager.BOL;
using EventManager.API.Dto.Region;
using EventManager.API.Dto.User;
using EventManager.API.Dto.WebSession;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using EventManager.API.Services.Region;
using EventManager.DAL;
using System.Data;
using EventManager.API.Dto.User.Role;
using EventManager.API.BackgroundServices;
using EventManager.API.Services.FileStorage;
using EventManager.API.Services.Organization;

namespace EventManager.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IWebSessionService _webSessionService;
        private readonly ISharedService _sharedService;
        private readonly IConfiguration _configuration;
        private readonly IRegionService _regionService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IFileService _fileService;
        private readonly IOrganizationService _organizationService;
        private readonly EmailQueueService _emailQueueService;

        public UserController(
            IUserService userService,
            IWebSessionService webSessionService,
            ISharedService sharedService,
            IConfiguration configuration,
            IRegionService regionService,
            IWebHostEnvironment webHostEnvironment,
            IFileService fileService,
            IOrganizationService organizationService,
            EmailQueueService emailQueueService)
        {
            _userService = userService;
            _webSessionService = webSessionService;
            _sharedService = sharedService;
            _configuration = configuration;
            _regionService = regionService;
            _webHostEnvironment = webHostEnvironment;
            _fileService = fileService;
            _organizationService = organizationService;
            _emailQueueService = emailQueueService;
        }

        [HttpGet("{userId}/view")]
        public async Task<ActionResult> GetUserView(long userId)
        {
            var userView = await _userService.GetUserViewAsync(x => x.UserId == userId);
            if (userView == null)
            {
                return NotFound();
            }

            userView.CanEdit = await _sharedService.IsUserAuthorizedToEdit(User, userId);

            var userRegionsHelping = await _regionService.GetUserRegionsHelping(userId);
            userView.RegionsHelping = Mapper.CreateList<RegionView>(userRegionsHelping);

            return Ok(userView);
        }

        [Authorize]
        [HttpGet("{userId}/update")]
        public async Task<ActionResult> GetUserForUpdate(long userId)
        {
            if (!await _userService.UserExistsAsync(x => x.UserId == userId))
            {
                return NotFound();
            }

            if (!await _sharedService.IsUserAuthorizedToEdit(User, userId))
            {
                return Unauthorized();
            }

            var userView = await _userService.GetUserViewAsync(x => x.UserId == userId);
            var userToReturn = Mapper.CreateObject<UserForUpdate>(userView);

            var userRegionsHelping = await _regionService.GetUserRegionsHelping(userId);
            userToReturn.UserRegionsHelpingIds = userRegionsHelping.Select(x => x.RegionId).ToList();

            var webSessionsPoco = await _webSessionService.GetUserLastActiveWebSessions(userId);
            userToReturn.WebSessions = Mapper.CreateList<WebSessionView>(webSessionsPoco);

            return Ok(userToReturn);
        }

        [Authorize]
        [HttpPut("{userId}/update/personal-data")]
        public async Task<ActionResult> UpdateUserPersonalData(long userId, [FromForm] UserUpdatePersonalData user)
        {
            if (!await _sharedService.IsUserAuthorizedToEdit(User, userId))
            {
                return Unauthorized();
            }

            if (!await _userService.UserExistsAsync(x => x.UserId == userId))
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(user.UserPhoneNumber))
            {
                if (await _userService.UserExistsAsync(x => x.UserPhoneNumber == user.UserPhoneNumber && x.UserId != userId))
                {
                    return BadRequest($"Вече съществува потребител с телефонен номер: {user.UserPhoneNumber}");
                }
            }

            await _userService.UpdateUserPersonalDataAsync(userId, user, User.X_CurrentUserId());

            var userView = await _userService.GetUserViewAsync(x => x.UserId == userId);
            var response = new UserUpdatePersonalDataResponse
            {
                ProfilePictureUrl = _fileService.CreatePublicFileUrl(userView.UserProfilePictureRelativePath, FileService.NO_USER_LOGO),
            };

            return Ok(response);
        }

        [Authorize]
        [HttpPut("{userId}/update/username")]
        public async Task<ActionResult> UpdateUserUsername(long userId, UserUpdateUsername update)
        {
            if (!await _sharedService.IsUserAuthorizedToEdit(User, userId))
            {
                return Unauthorized();
            }

            if (await _userService.UserExistsAsync(x => x.Username == update.Username && x.UserId != userId))
            {
                return BadRequest($"Вече съществува потребителското име: {update.Username}");
            }

            var user = await _userService.GetUserPocoAsync(x => x.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }

            user.Username = update.Username;
            await _userService.UpdateUserAsync(userId, user, User.X_CurrentUserId());

            return NoContent();
        }

        [Authorize]
        [HttpPut("{userId}/update/password")]
        public async Task<ActionResult> UpdateUserPassword(long userId, UserUpdatePassword password)
        {
            if (!await _sharedService.IsUserAuthorizedToEdit(User, userId))
            {
                return Unauthorized();
            }

            if (password.NewPassword != password.NewPasswordRepeated)
            {
                return BadRequest("Паролите не съвпадат");
            }

            var user = await _userService.GetUserPocoAsync(x => x.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.UserPassword != password.CurrentPassword)
            {
                return BadRequest("Неправилна парола");
            }

            user.UserPassword = password.NewPassword;
            await _userService.UpdateUserAsync(userId, user, User.X_CurrentUserId());

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult> LoginUser(UserLogin userLogin)
        {
            var user = await _userService.GetUserViewAsync(x => x.Username == userLogin.Username && x.UserPassword == userLogin.Password);
            if (user == null)
            {
                return BadRequest("Неправилно потребителско име или парола.");
            }
            if (!user.UserIsEmailVerified)
            {
                return BadRequest($"Моля, потвърдете имейла си, за да може да достъпите сайта.");
            }

            var now = DateTime.Now;
            var expiresOn = now.AddHours(12);

            var ipAddress = HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            var ipInfo = await _webSessionService.GetUserIpInfoAsync(ipAddress);

            var webSession = new WebSessionNew
            {
                WebSessionExpireOnDateTime = expiresOn,
                UserId = user.UserId,
                WebSessionUserIpAddress = ipAddress,
                WebSessionIpInfo = ipInfo,
            };

            var webSessionId = await _webSessionService.CreateWebSession(webSession);

            var claimsForToken = new List<Claim>
            {
                new (CustomClaimTypes.UserId, user.UserId.ToString()),
                new (CustomClaimTypes.WebSessionId, webSessionId.ToString()),
            };

            var securityKey = new SymmetricSecurityKey(Convert.FromBase64String(_configuration["Authentication:SecretForKey"]));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _configuration["Authentication:Issuer"],
                audience: _configuration["Authentication:Audience"],
                claims: claimsForToken,
                notBefore: now,
                expires: expiresOn,
                signingCredentials: signingCredentials);

            var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            var userRoles = await _userService.GetAllUserRolesAsync(user.UserId);

            var userForWeb = new UserForWeb
            {
                UserId = user.UserId,
                Username = user.Username,
                Token = token,
                WebSessionId = webSessionId,
                IsAdmin = userRoles.Any(x => x.RoleId == (int)UserRole.Admin),
                IsEventCreator = userRoles.Any(x => x.RoleId == (int)UserRole.EventCreator),
                ProfilePictureUrl = user.ProfilePictureUrl,
            };

            return Ok(userForWeb);
        }

        [HttpPost]
        public async Task<ActionResult> RegisterUser([FromForm] UserNew user)
        {
            if (user.UserPassword != user.PasswordRepeated)
            {
                return BadRequest($"Паролите не съвпадат");
            }

            if (await _userService.UserExistsAsync(x => x.Username == user.Username))
            {
                return BadRequest($"Вече съществува потребителското име: {user.Username}");
            }
            if (await _userService.UserExistsAsync(x => x.UserEmail == user.UserEmail))
            {
                return BadRequest($"Вече съществува потребител с имейл: {user.UserEmail}");
            }

            if (!string.IsNullOrWhiteSpace(user.UserPhoneNumber))
            {
                if (await _userService.UserExistsAsync(x => x.UserPhoneNumber == user.UserPhoneNumber))
                {
                    return BadRequest($"Вече съществува потребител с телефонен номер: {user.UserPhoneNumber}");
                }
            }

            var userId = await _userService.CreateUserAsync(user, User.X_CurrentUserId());

            _emailQueueService.QueueEmail(new EmailQueueOptions
            {
                TemplateFileName = "EmailVerificationTemplate.html",
                EmailFrom = "no-reply@ihelp.bg",
                EmailTo = new List<string> { user.UserEmail },
                Subject = "Регистрация в ihelp.bg",
                IsBodyHtml = true,
                Replacements = new Dictionary<string, string>
                {
                    { "{{username}}", user.Username },
                    { "{{verificationSecret}}", user.UserEmailVerificationSecret },
                    { "{{userId}}", userId.ToString() },
                    { "{{domain}}", _webHostEnvironment.IsDevelopment() ? "http://localhost" : "https://ihelp.bg" }
                }
            });

            return NoContent();
        }

        [HttpPost("email-verification")]
        public async Task<ActionResult> UserVerifyEmail(UserVerifyEmail verification)
        {
            var user = await _userService.GetUserPocoAsync(x => x.UserId == verification.UserId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.UserEmailVerificationSecret != verification.EmailVerificationSecret)
            {
                return BadRequest($"Неправилни параметри.");
            }

            if (user.UserIsEmailVerified)
            {
                return BadRequest($"Имейлът Ви е вече потвърден.");
            }

            user.UserIsEmailVerified = true;
            await _userService.UpdateUserAsync(verification.UserId, user, User.X_CurrentUserId());

            return NoContent();
        }

        [HttpPost("logout")]
        public async Task<ActionResult> LogoutUser()
        {
            var currentUserId = User.X_CurrentUserId();
            if (!currentUserId.HasValue)
            {
                return NoContent();
            }

            if (!await _userService.UserExistsAsync(x => x.UserId == currentUserId.Value))
            {
                return NotFound();
            }

            var webSessionId = User.X_WebSessionId();
            if (!webSessionId.HasValue)
            {
                return NotFound();
            }

            if (!await _webSessionService.WebSessionExistsAsync(x => x.WebSessionId == webSessionId.Value))
            {
                return NotFound();
            }

            await _webSessionService.CloseWebSessionAsync(webSessionId.Value, currentUserId);

            return NoContent();
        }

        [Authorize]
        [Role(UserRole.Admin)]
        [HttpDelete("{userId}/delete")]
        public async Task<ActionResult> DeleteUser(long userId)
        {
            if (!await _sharedService.IsUserAuthorizedToEdit(User, userId))
            {
                return Unauthorized();
            }

            if (!await _userService.UserExistsAsync(x => x.UserId == userId))
            {
                return NotFound();
            }

            await _userService.DeleteUserAsync(userId, User.X_CurrentUserId());

            return NoContent();
        }

        [Authorize]
        [Role(UserRole.Admin)]
        [HttpPut("roles")]
        public async Task<ActionResult> SaveUserRoles(RoleBaseForm userRoles)
        {
            await _userService.SaveUserRoles(userRoles, User.X_CurrentUserId());

            return NoContent();
        }

        [Authorize]
        [Role(UserRole.Admin)]
        [HttpGet("roles")]
        public async Task<ActionResult> GetAllRoles()
        {
            var roles = await _userService.GetAllRolesAsync(x => x.RoleId != (int)UserRole.Admin);
            var rolesView = Mapper.CreateList<RoleView>(roles);

            return Ok(rolesView);
        }

        [Authorize]
        [Role(UserRole.Admin)]
        [HttpPost("roles/filter")]
        public async Task<ActionResult> GetUsersForRoles(RoleFilter filter)
        {
            var predicate = PredicateBuilder.True<VUserPoco>();

            if (!string.IsNullOrWhiteSpace(filter.Username))
            {
                predicate = predicate.And(x => x.Username.StartsWith(filter.Username, StringComparison.CurrentCultureIgnoreCase));
            }

            var usersViewPoco = await _userService.GetAllUsersViewAsync(predicate);
            var usersView = Mapper.CreateList<UserView>(usersViewPoco);

            foreach (var user in usersView)
            {
                var roles = await _userService.GetAllUserRolesAsync(user.UserId);
                var rolesView = Mapper.CreateList<RoleView>(roles);

                user.UserRoles = rolesView;
            }

            return Ok(usersView);
        }

        [HttpGet("{userId}/organizations/select")]
        [Authorize]
        public async Task<ActionResult> GetUserOrganizationsSelect(long userId)
        {
            var userOrganizations = await _organizationService.GetUserOrganizationsAsync(userId, true);

            return Ok(userOrganizations);
        }
    }
}
