using System.Net;
using System.Net.Mail;

namespace EventManager.API.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(EmailOptions options)
        {
            using var client = new SmtpClient()
            {
                Host = _config["SmtpEmailConfig:SmtpServer"],
                Port = int.Parse(_config["SmtpEmailConfig:Port"]),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = true,
                Credentials = new NetworkCredential(
                    _config["SmtpEmailConfig:Username"],
                    _config["SmtpEmailConfig:Password"]
                ),
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(options.EmailFrom, "ihelp"),
                Subject = options.Subject,
                Body = options.Content,
                IsBodyHtml = options.IsBodyHtml,
            };

            mailMessage.To.Add(string.Join(',', options.EmailTo));

            await client.SendMailAsync(mailMessage);
        }
    }

    public class EmailOptions
    {
        public string EmailFrom { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public bool IsBodyHtml { get; set; }

        public List<string> EmailTo { get; set; }
    }
}
