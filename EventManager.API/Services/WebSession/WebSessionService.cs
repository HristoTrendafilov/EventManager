using EventManager.DAL;
using EventManager.API.Dto.WebSession;
using LinqToDB;
using System.Linq.Expressions;
using System.Net;
using Newtonsoft.Json;
using EventManager.API.Services.Exception;

namespace EventManager.API.Services.WebSession
{
    public class WebSessionService : IWebSessionService
    {
        private readonly PostgresConnection _db;

        public WebSessionService(PostgresConnection db)
        {
            _db = db;
        }

        public Task<long> CreateWebSession(WebSessionNew webSession)
        {
            return _db.WebSessions.X_CreateAsync(webSession, null);
        }

        public Task<bool> WebSessionExistsAsync(Expression<Func<WebSessionPoco, bool>> predicate)
        {
            return _db.WebSessions.AnyAsync(predicate);
        }

        public async Task CloseWebSessionAsync(long webSessionId, long? currentUserId)
        {
            var webSessionPoco = await _db.WebSessions.FirstOrDefaultAsync(x => x.WebSessionId == webSessionId);
            webSessionPoco.WebSessionLogoutDateTime = DateTime.Now;

            await _db.WebSessions.X_UpdateAsync(webSessionId, webSessionPoco, currentUserId);
        }

        public Task<WebSessionPoco> GetWebSessionAsync(Expression<Func<WebSessionPoco, bool>> predicate)
        {
            return _db.WebSessions.FirstOrDefaultAsync(predicate);
        }

        public Task<List<VWebSessionPoco>> GetUserLastActiveWebSessions(long userId)
        {
            return _db.VWebSessions
                .Where(x => x.UserId == userId && x.WebSessionIpInfo != null)
                .OrderByDescending(x => x.WebSessionCreatedOnDateTime)
                .Take(10)
                .ToListAsync();
        }

        public async Task<(string ipAddress, string ipInfo)> GetUserIpInfoAsync(HttpContext context)
        {
            var ipAddress = string.Empty;
            var remoteIpAddress = context.Connection.RemoteIpAddress;

            using var httpClient = new HttpClient();

            if (IPAddress.IsLoopback(remoteIpAddress))
            {
                // Get the public IP address for testing purposes
                ipAddress = await httpClient.GetStringAsync("https://api.ipify.org");
            }
            else
            {
                // Get the IP address from the header passed from Nginx
                ipAddress = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
                if (string.IsNullOrEmpty(ipAddress))
                {
                    ipAddress = remoteIpAddress?.ToString();
                }
            }

            // Fetch IP information
            var ipInfoResponse = await httpClient.GetStringAsync($"http://ip-api.com/json/{ipAddress}");

            return (ipAddress, ipInfoResponse);

        }
    }
}
