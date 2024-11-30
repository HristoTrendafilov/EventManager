namespace EventManager.API.Services.Email
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailOptions options);
    }
}