using EventManager.API.Services.Email;
using System.Threading.Channels;

namespace EventManager.API.Core.BackgroundServices
{
    public class EmailQueueService : BackgroundService
    {
        private readonly Channel<EmailOptions> _queue;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<EmailQueueService> _logger;

        public EmailQueueService(IServiceProvider serviceProvider, ILogger<EmailQueueService> logger)
        {
            _queue = Channel.CreateUnbounded<EmailOptions>(); // Unbounded queue
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public void QueueEmail(EmailOptions emailOptions)
        {
            _queue.Writer.TryWrite(emailOptions);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Wait for an email task to be available
                    var emailOptions = await _queue.Reader.ReadAsync(stoppingToken);

                    // Process the email task
                    using var scope = _serviceProvider.CreateScope();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                    await emailService.SendEmailAsync(emailOptions, null);
                  
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while sending email.");
                }
            }
        }
    }

}
