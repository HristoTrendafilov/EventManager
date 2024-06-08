using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Services.Email;
using EventManager.API.Services.User;
using EventManager.API.Services.WebSession;
using EventManager.BOL;
using EventManager.DAL;
using EventManager.DTO.Region;
using EventManager.DTO.User;
using EventManager.DTO.WebSession;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;

namespace EventManager.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        const int _maxUsersPageCount = 20;

        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly IWebSessionService _webSessionService;
        private readonly IConfiguration _configuration;
        private readonly PostgresConnection _db;
        private readonly Mapper _mapper;

        public UserController(
            IUserService userService,
            IEmailService emailService,
            IWebSessionService webSessionService,
            IConfiguration configuration,
            PostgresConnection db,
            Mapper mapper)
        {
            _userService = userService;
            _emailService = emailService;
            _webSessionService = webSessionService;
            _configuration = configuration;
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllUsers(int pageNumber = 1, int pageSize = 10)
        {
            if (pageSize > _maxUsersPageCount)
            {
                pageSize = _maxUsersPageCount;
            }

            var (users, paginationMetadata) = await _userService.GetAllUsersAsync(x => true, pageNumber, pageSize);

            Response.Headers.Append("X-Pagination", JsonConvert.SerializeObject(paginationMetadata));

            var usersToReturn = _mapper.CreateList<UserDto>(users);

            return Ok(usersToReturn);
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult> GetUser(long userId)
        {
            if (!await _userService.UserExistsAsync(x => x.UserId == userId))
            {
                return NotFound();
            }

            var user = await _userService.GetUserAsync(x => x.UserId == userId);
            var userToReturn = _mapper.CreateObject<UserDto>(user);

            return Ok(userToReturn);
        }

        [HttpPost("login")]
        public async Task<ActionResult> LoginUser(UserLoginDto login)
        {
            Thread.Sleep(2000);

            var user = await _userService.GetUserAsync(x => x.Username == login.Username && x.Password == login.Password);
            if (user == null)
            {
                return BadRequest("Неправилно потребителско име или парола.");
            }
            if (!user.IsEmailVerified)
            {
                return BadRequest($"Моля, потвърдете имейла си, за да може да достъпите сайта.");
            }

            var claimsForToken = new List<Claim>
            {
                new (ClaimTypes.NameIdentifier, user.UserId.ToString()),
            };

            var userClaims = await _userService.GetAllUserClaimsAsync(user.UserId);
            foreach (var claim in userClaims)
            {
                var claimTypeProperty = typeof(ClaimTypes).GetFields(BindingFlags.Static | BindingFlags.Public)
                    .FirstOrDefault(x => x.Name == claim.ClaimType);

                if (claimTypeProperty != null)
                {
                    var claimType = (string)claimTypeProperty.GetValue(null);
                    claimsForToken.Add(new Claim(claimType, claim.ClaimName));
                }
                else
                {
                    claimsForToken.Add(new Claim(claim.ClaimType, claim.ClaimName));
                }
            }

            var securityKey = new SymmetricSecurityKey(Convert.FromBase64String(_configuration["Authentication:SecretForKey"]));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var now = DateTime.Now;
            var expiresOn = DateTime.Now.AddHours(1);

            var jwtSecurityToken = new JwtSecurityToken(
                _configuration["Authentication:Issuer"],
                _configuration["Authentication:Audience"],
                claimsForToken,
                now,
                expiresOn,
                signingCredentials);

            var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            var webSession = new WebSessionNewDto
            {
                LoginDateTime = now,
                ExpireOnDateTime = expiresOn,
                UserId = user.UserId,
            };

            var webSessionId = await _webSessionService.CreateWebSession(webSession);

            var response = new UserForWebDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Token = token,
                WebSessionId = webSessionId,
                IsLoggedIn = true,
                IsAdmin = userClaims.Any(x => x.ClaimId == (int)UserClaimType.Admin),
                IsEventCreator = userClaims.Any(x => x.ClaimId == (int)UserClaimType.EventCreator),
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> RegisterUser(UserNewDto userNew)
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

            var userId = await _db.WithTransactionAsync(async () =>
            {
                var currentUser = User.X_GetCurrentUserId();

                userNew.CreatedByUserId = currentUser;
                return await _userService.CreateUserAsync(userNew, currentUser);
            });

            var user = await _userService.GetUserAsync(x => x.UserId == userId);
            var userResponse = _mapper.CreateObject<UserDto>(user);

            var userRegionsHelping = await _userService.GetAllUserRegionsHelping(userId);
            userResponse.RegionsHelping = _mapper.CreateList<RegionDto>(userRegionsHelping);

            return Ok(userResponse);
        }

        [HttpPut("{userId}")]
        [Authorize]
        public async Task<ActionResult> UpdateUser(long userId, UserUpdateDto user)
        {
            if (!User.X_IsAuthorizedToEdit(userId))
            {
                return Unauthorized();
            }

            user.Username = user.Username.Trim();
            user.Email = user.Email.Trim();
            user.PhoneNumber = user.PhoneNumber?.Trim();

            if (!await _userService.UserExistsAsync(x => x.UserId == userId))
            {
                return NotFound();
            }

            if (await _userService.UserExistsAsync(x => x.Username == user.Username && x.UserId != userId))
            {
                return BadRequest($"Вече съществува потребителското име: {user.Username}");
            }
            if (await _userService.UserExistsAsync(x => x.Email == user.Email && x.UserId != userId))
            {
                return BadRequest($"Вече съществува потребител с имейл: {user.Email}");
            }

            if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
            {
                if (await _userService.UserExistsAsync(x => x.PhoneNumber == user.PhoneNumber && x.UserId != userId))
                {
                    return BadRequest($"Вече съществува потребител с телефонен номер: {user.PhoneNumber}");
                }
            }

            await _db.WithTransactionAsync(async () =>
            {
                await _userService.UpdateUserAsync(userId, user, User.X_GetCurrentUserId());
            });

            return NoContent();
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> LogoutUser(UserLogoutDto logout)
        {
            var currentUserId = User.X_GetCurrentUserId();

            if (!await _userService.UserExistsAsync(x => x.UserId == currentUserId.Value))
            {
                return NotFound();
            }

            if (!await _webSessionService.WebSessionExistsAsync(x => x.WebSessionId == logout.WebSessionId))
            {
                return NotFound();
            }

            var webSessionPoco = await _webSessionService.GetWebSessionAsync(x => x.WebSessionId == logout.WebSessionId);
            var webSessionUpdate = _mapper.CreateObject<WebSessionUpdateDto>(webSessionPoco);
            webSessionUpdate.LogoutDateTime = DateTime.Now;

            await _db.WithTransactionAsync(async () =>
            {
                await _webSessionService.UpdateWebSessionAsync(logout.WebSessionId, webSessionUpdate, currentUserId);
            });

            return NoContent();
        }

        [HttpDelete("{userId}")]
        [Authorize]
        [ClaimAccess(ClaimTypeValues.Admin)]
        public async Task<ActionResult> DeleteUser(long userId)
        {
            if (!User.X_IsAuthorizedToEdit(userId))
            {
                return Unauthorized();
            }

            if (!await _userService.UserExistsAsync(x => x.UserId == userId))
            {
                return NotFound();
            }

            await _db.WithTransactionAsync(async () =>
            {
                await _userService.DeleteUserAsync(userId, User.X_GetCurrentUserId());
            });

            return NoContent();
        }

        [Authorize]
        [HttpPost("claims")]
        [ClaimAccess(ClaimTypeValues.Admin)]
        public async Task<ActionResult> AddClaimToUser(UserClaimNewDto claim)
        {
            if (!await _userService.ClaimExistsAsync(x => x.UserId == claim.UserId && x.ClaimId == claim.ClaimId))
            {
                return BadRequest($"Вече съществува това право за потребител с ID: {claim.UserId}");
            }

            await _db.WithTransactionAsync(async () =>
            {
                return await _userService.CreateUserClaimAsync(claim, User.X_GetCurrentUserId());
            });

            return NoContent();
        }
    }
}
