using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Exception;
using EventManager.Dto.Exception;
using System.Net;

namespace EventManager.API.Core.Exceptions
{
    public class CustomExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomExceptionMiddleware> _logger;
        private readonly IExceptionService _exceptionService;

        public CustomExceptionMiddleware(
            RequestDelegate next,
            ILogger<CustomExceptionMiddleware> logger,
            IExceptionService exceptionService)
        {
            _next = next;
            _logger = logger;
            _exceptionService = exceptionService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(new EventId(), ex, ex.Message);

                await _exceptionService.CreateExceptionAsync(new ExceptionNew
                {
                    Exception = ex.ToString(),
                    ExceptionMessage = ex.Message,
                    ExceptionDateTime = DateTime.Now,
                    UserId = context.User.X_CurrentUserId()
                }, context.User.X_CurrentUserId());

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
            }
        }
    }
}
