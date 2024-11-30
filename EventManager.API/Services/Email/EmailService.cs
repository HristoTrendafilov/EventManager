using EventManager.DAL;
using System.Net;
using System.Net.Mail;

namespace EventManager.API.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly PostgresConnection _db;
        private readonly IConfiguration _config;

        public EmailService(PostgresConnection db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task CreateEmailAsync(EmailPoco email, long? currentUserId)
        {
            await _db.Emails.X_CreateAsync(email, currentUserId);
        }

        public async Task SendEmailAsync(EmailOptions options, long? currentUserId)
        {
            var poco = new EmailPoco
            {
                EmailFrom = options.EmailFrom,
                EmailTo = string.Join(',', options.EmailTo),
                EmailSubject = options.Subject,
                EmailContent = options.Content,
                EmailCreatedOnDateTime = DateTime.Now,
            };

            await CreateEmailAsync(poco, currentUserId);

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
        public EmailOptions()
        {
            EmailTo = new List<string>();
        }

        public string EmailFrom { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public bool IsBodyHtml { get; set; }

        public List<string> EmailTo { get; set; }
    }

    public class  EmailQueueOptions
    {
        public EmailQueueOptions()
        {
            Replacements = new Dictionary<string, string>();
            EmailTo = new List<string>();
        }

        public string EmailFrom { get; set; }
        public List<string> EmailTo { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public bool isBodyHtml { get; set; }

        public string TemplateFileName { get; set; }
        public Dictionary<string,string> Replacements { get; set; }

        public long? CreatedByUserId { get; set; }
    }
}
