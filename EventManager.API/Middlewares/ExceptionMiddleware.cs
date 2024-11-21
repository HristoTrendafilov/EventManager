using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Exception;
using EventManager.API.Dto.Exception;
using System.Net;
using EventManager.API.Core;

namespace EventManager.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IExceptionService _exceptionService;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger,
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

                await _exceptionService.CreateExceptionAsync(new ExceptionBaseForm
                {
                    Exception = ex.ToString(),
                    ExceptionMessage = ex.Message,
                    ExceptionCreatedOnDateTime = DateTime.Now,
                    UserId = context.User.X_CurrentUserId()
                }, context.User.X_CurrentUserId());

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var apiErrorResponse = new ApiResponse<object>(null, "An error occurred on the server.");
                await context.Response.WriteAsJsonAsync(apiErrorResponse);
            }
        }
    }
}
