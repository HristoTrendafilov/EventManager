using EventManager.API.Core;
using EventManager.API.Services.Email;
using EventManager.API.Services.Exception;
using System.Threading.Channels;

namespace EventManager.API.BackgroundServices
{
    public class EmailQueueService : BackgroundService
    {
        private readonly Channel<EmailQueueOptions> _queue;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<EmailQueueService> _logger;

        public EmailQueueService(IServiceProvider serviceProvider, ILogger<EmailQueueService> logger)
        {
            _queue = Channel.CreateUnbounded<EmailQueueOptions>(); // Unbounded queue
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public void QueueEmail(EmailQueueOptions queueOptions)
        {
            _queue.Writer.TryWrite(queueOptions);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("EmailQueueService is running.");

                using var scope = _serviceProvider.CreateScope();

                try
                {
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                    var queueOptions = await _queue.Reader.ReadAsync(stoppingToken);

                    // Send email in the background
                    var filePath = Path.Combine(Global.EmailTemplatesFolder, queueOptions.TemplateFileName);

                    // Read the HTML file content
                    var emailContent = await File.ReadAllTextAsync(filePath);
                    foreach (var replacement in queueOptions.Replacements)
                    {
                        emailContent = emailContent.Replace(replacement.Key, replacement.Value);
                    }

                    var emailOptions = new EmailOptions
                    {
                        EmailFrom = queueOptions.EmailFrom,
                        EmailTo = queueOptions.EmailTo,
                        Subject = queueOptions.Subject,
                        Content = emailContent,
                        IsBodyHtml = queueOptions.isBodyHtml,
                    };

                    await emailService.SendEmailAsync(emailOptions, queueOptions.CreatedByUserId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while sending email.");

                    var exceptionService = scope.ServiceProvider.GetRequiredService<IExceptionService>();
                    await exceptionService.CreateExceptionAsync(ex, null);
                }
            }
        }
    }

}
