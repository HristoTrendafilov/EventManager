using EventManager.API.Helpers;
using EventManager.API.Services.Exception;
using EventManager.DTO.Exception;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
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
                await this.HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            _logger.LogError(new EventId(), ex, ex.Message);

            await _exceptionService.CreateExceptionAsync(new ExceptionNew
            {
                Exception = ex.ToString(),
                ExceptionMessage = ex.Message,
                ExceptionDateTime = DateTime.Now,
                UserId = context.User.X_GetCurrentUserId()
            }, null);

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync("Грешка на сървъра. Моля, опитайте по-късно.");
        }
    }
}
