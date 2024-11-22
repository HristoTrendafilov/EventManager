using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Email;
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

namespace EventManager.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly IWebSessionService _webSessionService;
        private readonly ISharedService _sharedService;
        private readonly IConfiguration _configuration;
        private readonly IRegionService _regionService;
        private readonly Mapper _mapper;

        public UserController(
            IUserService userService,
            IEmailService emailService,
            IWebSessionService webSessionService,
            ISharedService sharedService,
            IConfiguration configuration,
            IRegionService regionService,
            Mapper mapper)
        {
            _userService = userService;
            _emailService = emailService;
            _webSessionService = webSessionService;
            _sharedService = sharedService;
            _configuration = configuration;
            _regionService = regionService;
            _mapper = mapper;
        }

        [HttpGet("{userId}/view")]
        public async Task<ActionResult> GetUserView(long userId)
        {
            var userViewPoco = await _userService.GetUserViewAsync(x => x.UserId == userId);
            if (userViewPoco == null)
            {
                return NotFound();
            }

            var userView = _mapper.CreateObject<UserView>(userViewPoco);
            userView.CanEdit = await _sharedService.IsUserAuthorizedToEdit(User, userId);

            var userRegionsHelping = await _regionService.GetUserRegionsHelping(userId);
            userView.RegionsHelping = _mapper.CreateList<RegionView>(userRegionsHelping);

            return Ok(userView);
        }

        [HttpGet("{userId}/profile-picture")]
        public async Task<ActionResult> GetUserProfilePicture(long userId)
        {
            if (!await _userService.UserExistsAsync(x => x.UserId == userId))
            {
                return NotFound();
            }

            var profilePicture = await _userService.GetUserProfilePictureAsync(userId);
            if (profilePicture == null)
            {
                return NotFound();
            }

            return File(profilePicture, "application/octet-stream");
        }

        [Authorize]
        [HttpGet("{userId}/update")]
        public async Task<ActionResult> GetUserForUpdate(long userId)
        {
            if (!await _userService.UserExistsAsync(x => x.UserId == userId))
            {
                return NotFound();
            }

            var userView = await _userService.GetUserViewAsync(x => x.UserId == userId);

            if (!await _sharedService.IsUserAuthorizedToEdit(User, userId))
            {
                return Unauthorized();
            }

            var userToReturn = _mapper.CreateObject<UserForUpdate>(userView);

            var userRegionsHelping = await _regionService.GetUserRegionsHelping(userId);
            userToReturn.UserRegionsHelpingIds = userRegionsHelping.Select(x => x.RegionId).ToList();

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

            return NoContent();
        }

        [Authorize]
        [HttpPut("{userId}/update/username")]
        public async Task<ActionResult> UpdateUserUsername(long userId, string username)
        {
            if (!await _sharedService.IsUserAuthorizedToEdit(User, userId))
            {
                return Unauthorized();
            }

            if (await _userService.UserExistsAsync(x => x.Username == username && x.UserId != userId))
            {
                return BadRequest($"Вече съществува потребителското име: {username}");
            }

            var user = await _userService.GetUserPocoAsync(x => x.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }

            user.Username = username;
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
            var user = await _userService.GetUserPocoAsync(x => x.Username == userLogin.Username && x.UserPassword == userLogin.Password);
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

            var webSession = new WebSessionNew
            {
                WebSessionExpireOnDateTime = expiresOn,
                UserId = user.UserId,
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

            var response = new UserForWeb
            {
                UserId = user.UserId,
                Username = user.Username,
                Token = token,
                WebSessionId = webSessionId,
                IsAdmin = userRoles.Any(x => x.RoleId == (int)UserRole.Admin),
                IsEventCreator = userRoles.Any(x => x.RoleId == (int)UserRole.EventCreator),
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> RegisterUser([FromForm] UserNew userNew)
        {
            if (userNew.PasswordRepeated != userNew.PasswordRepeated)
            {
                return BadRequest($"Паролите не съвпадат");
            }

            if (await _userService.UserExistsAsync(x => x.Username == userNew.Username))
            {
                return BadRequest($"Вече съществува потребителското име: {userNew.Username}");
            }
            if (await _userService.UserExistsAsync(x => x.UserEmail == userNew.UserEmail))
            {
                return BadRequest($"Вече съществува потребител с имейл: {userNew.UserEmail}");
            }

            if (!string.IsNullOrWhiteSpace(userNew.UserPhoneNumber))
            {
                if (await _userService.UserExistsAsync(x => x.UserPhoneNumber == userNew.UserPhoneNumber))
                {
                    return BadRequest($"Вече съществува потребител с телефонен номер: {userNew.UserPhoneNumber}");
                }
            }

            var currentUserId = User.X_CurrentUserId();

            userNew.UserCreatedByUserId = currentUserId;
            await _userService.CreateUserAsync(userNew, currentUserId);

            return NoContent();
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> LogoutUser()
        {
            var currentUserId = User.X_CurrentUserId();

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
            var rolesView = _mapper.CreateList<RoleView>(roles);

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
            var usersView = _mapper.CreateList<UserView>(usersViewPoco);

            foreach (var user in usersView)
            {
                var roles = await _userService.GetAllUserRolesAsync(user.UserId);
                var rolesView = _mapper.CreateList<RoleView>(roles);

                user.UserRoles = rolesView;
            }

            return Ok(usersView);
        }
    }
}
