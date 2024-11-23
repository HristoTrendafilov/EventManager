using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using EventManager.API.Core;

public class ApiResponseActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        // Nothing to do here before the action executes
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        switch (context.Result)
        {
            case NoContentResult:
                HandleNoContentResult(context);
                break;
            case UnauthorizedResult unauthorizedResult:
                HandleUnauthorizedResult(context, unauthorizedResult);
                break;
            case NotFoundResult notFoundResult:
                HandleNotFoundResult(context, notFoundResult);
                break;
            case ObjectResult objectResult:
                HandleObjectResult(context, objectResult);
                break;
        }
    }

    private static void HandleNoContentResult(ActionExecutedContext context)
    {
        var apiResponse = new ApiResponse<object>(null);
        context.Result = new JsonResult(apiResponse)
        {
            StatusCode = StatusCodes.Status200OK
        };
    }

    private static void HandleUnauthorizedResult(ActionExecutedContext context, UnauthorizedResult unauthorizedResult)
    {
        var apiErrorResponse = new ApiResponse<object>(null, "Нямате право на достъп до този ресурс.");
        context.Result = new JsonResult(apiErrorResponse)
        {
            StatusCode = unauthorizedResult.StatusCode
        };
    }

    private static void HandleNotFoundResult(ActionExecutedContext context, NotFoundResult notFoundResult)
    {
        var apiErrorResponse = new ApiResponse<object>(null, "Ресурсът, който търсите, не може да бъде намерен.");
        context.Result = new JsonResult(apiErrorResponse)
        {
            StatusCode = notFoundResult.StatusCode
        };
    }

    private static void HandleObjectResult(ActionExecutedContext context, ObjectResult objectResult)
    {
        if (objectResult.StatusCode >= 200 && objectResult.StatusCode <= 299)
        {
            var apiResponse = new ApiResponse<object>(objectResult.Value);
            context.Result = new JsonResult(apiResponse)
            {
                StatusCode = objectResult.StatusCode
            };
        }
        else if (objectResult.StatusCode >= 400 && objectResult.StatusCode <= 499)
        {
            var apiErrorResponse = new ApiResponse<object>(null, objectResult.Value?.ToString());
            context.Result = new JsonResult(apiErrorResponse)
            {
                StatusCode = objectResult.StatusCode
            };
        }
        else if (objectResult.StatusCode >= 500 && objectResult.Value is ProblemDetails problemDetails)
        {
            var apiErrorResponse = new ApiResponse<object>(null, problemDetails.Detail);
            context.Result = new JsonResult(apiErrorResponse)
            {
                StatusCode = objectResult.StatusCode
            };
        }
    }
}
