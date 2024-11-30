using EventManager.DAL;

namespace EventManager.API.Services.Email
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailOptions options, long? currentUserId);
        Task CreateEmailAsync(EmailPoco email, long? currentUserId);
    }
}