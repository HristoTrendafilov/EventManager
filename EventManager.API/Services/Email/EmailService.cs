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

        public async Task SendEmailAsync(SendEmailOptions options)
        {
            using var client = new SmtpClient()
            {
                Host = _config["SmtpEmailConfig:Host"],
                Port = int.Parse(_config["SmtpEmailConfig:HostPort"]),
                DeliveryMethod = SmtpDeliveryMethod.Network,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(options.EmailFrom),
                Subject = options.Subject,
                Body = options.Message,
                IsBodyHtml = options.IsBodyHtml,
            };

            mailMessage.To.Add(string.Join(", ", options.EmailsTo));
            await client.SendMailAsync(mailMessage);
        }
    }

    public class SendEmailOptions
    {
        public SendEmailOptions(SendFromEmail email, string subject, string message)
        {
            this.Subject = subject;
            this.Message = message;

            if (email == SendFromEmail.Official)
            {
                this.EmailFrom = StartUpHelper._configuration["SmtpEmailConfig:OfficialEmail"];
            }
            else if (email == SendFromEmail.Noreply)
            {
                this.EmailFrom = StartUpHelper._configuration["SmtpEmailConfig:NoReplyEmail"];
            }

            this.IsBodyHtml = true;
            this.EmailsTo = new List<string>();
        }

        public string EmailFrom { get; set; }

        public string Subject { get; set; }

        public string Message { get; set; }

        public bool IsBodyHtml { get; set; }

        public List<string> EmailsTo { get; set; }

        public void AddEmailsToSend(params string[] emails)
        {
            this.EmailsTo.AddRange(emails);
        }
    }

    public enum SendFromEmail
    {
        Official,
        Noreply
    }
}
