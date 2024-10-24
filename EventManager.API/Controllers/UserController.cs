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
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using EventManager.API.Services.Region;

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
            var user = await _userService.GetUserViewAsync(x => x.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }

            var userView = _mapper.CreateObject<UserView>(user);
            userView.CanEdit = await _sharedService.IsUserAuthorizedToEdit(User, userId);

            var profilePicture = await _userService.GetUserProfilePictureAsync(userId);
            if (profilePicture != null)
            {
                userView.ProfilePictureBase64 = Convert.ToBase64String(profilePicture);
            }

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

        [HttpGet("{userId}/update/personal-data")]
        public async Task<ActionResult> GetUserPersonalData(long userId)
        {
            if (!await _sharedService.IsUserAuthorizedToEdit(User, userId))
            {
                return Unauthorized();
            }

            var user = await _userService.GetUserAsync(x => x.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }

            var personalData = _mapper.CreateObject<UserUpdatePersonalData>(user);

            var userRegionsHelping = await _regionService.GetUserRegionsHelping(userId);
            personalData.UserRegionsHelpingIds = userRegionsHelping.Select(x => x.RegionId).ToList();

            return Ok(personalData);
        }

        [HttpPost("login")]
        public async Task<ActionResult> LoginUser(UserLogin userLogin)
        {
            var user = await _userService.GetUserAsync(x => x.Username == userLogin.Username && x.Password == userLogin.Password);
            if (user == null)
            {
                return BadRequest("Неправилно потребителско име или парола.");
            }
            if (!user.IsEmailVerified)
            {
                return BadRequest($"Моля, потвърдете имейла си, за да може да достъпите сайта.");
            }

            var now = DateTime.Now;
            var expiresOn = now.AddHours(12);

            var webSession = new WebSessionNewDto
            {
                LoginDateTime = now,
                ExpireOnDateTime = expiresOn,
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

            var response = new UserForWebDto
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
            if (userNew.Password != userNew.PasswordRepeated)
            {
                return BadRequest($"Паролите не съвпадат");
            }

            if (await _userService.UserExistsAsync(x => x.Username == userNew.Username))
            {
                return BadRequest($"Вече съществува потребителското име: {userNew.Username}");
            }
            if (await _userService.UserExistsAsync(x => x.Email == userNew.Email))
            {
                return BadRequest($"Вече съществува потребител с имейл: {userNew.Email}");
            }

            if (!string.IsNullOrWhiteSpace(userNew.PhoneNumber))
            {
                if (await _userService.UserExistsAsync(x => x.PhoneNumber == userNew.PhoneNumber))
                {
                    return BadRequest($"Вече съществува потребител с телефонен номер: {userNew.PhoneNumber}");
                }
            }

            var currentUserId = User.X_CurrentUserId();

            userNew.CreatedByUserId = currentUserId;
            await _userService.CreateUserAsync(userNew, currentUserId);

            return NoContent();
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

            if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
            {
                if (await _userService.UserExistsAsync(x => x.PhoneNumber == user.PhoneNumber && x.UserId != userId))
                {
                    return BadRequest($"Вече съществува потребител с телефонен номер: {user.PhoneNumber}");
                }
            }

            await _userService.UpdateUserPersonalDataAsync(userId, user, User.X_CurrentUserId());

            return NoContent();
        }

        [HttpPost("logout")]
        [Authorize]
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
        [HttpDelete("{userId}")]
        [Role(UserRole.Admin)]
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
        [HttpPost("roles")]
        [Role(UserRole.Admin)]
        public async Task<ActionResult> AddRoleToUser(UserRoleNewDto role)
        {
            if (!await _userService.UserRoleExistsAsync(x => x.UserId == role.UserId && x.RoleId == role.RoleId))
            {
                return BadRequest($"Вече съществува това право за потребител с ID: {role.UserId}");
            }

            await _userService.CreateUserRoleAsync(role, User.X_CurrentUserId());

            return NoContent();
        }
    }
}
