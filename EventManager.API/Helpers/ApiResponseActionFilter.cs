using EventManager.API.Dto;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

public class ApiResponseActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        // Nothing to do here before the action executes
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // Check if the result is a NoContentResult (204 No Content)
        if (context.Result is NoContentResult)
        {
            // Return an empty ApiResponse with success: true and data: null
            var apiResponse = new ApiResponse<object>(null);

            context.Result = new JsonResult(apiResponse)
            {
                StatusCode = StatusCodes.Status200OK  // Set the status code to 204
            };
        }
        else if (context.Result is UnauthorizedResult unauthorizedResult)
        {
            var apiErrorResponse = new ApiResponse<object>(null, "You do not have the rights to access this resource.");

            context.Result = new JsonResult(apiErrorResponse)
            {
                StatusCode = unauthorizedResult.StatusCode
            };
        }
        else if (context.Result is NotFoundResult notFound)
        {
            var apiErrorResponse = new ApiResponse<object>(null, "The resource you are looking for is not found.");

            context.Result = new JsonResult(apiErrorResponse)
            {
                StatusCode = notFound.StatusCode
            };
        }
        // Check if the result is an ObjectResult (typically used in API responses)
        else if (context.Result is ObjectResult objectResult)
        {
            // Only wrap the response if the status code is 200
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
                // For errors (status code 400 or higher), wrap the error message
                var apiErrorResponse = new ApiResponse<object>(null, objectResult.Value?.ToString());

                context.Result = new JsonResult(apiErrorResponse)
                {
                    StatusCode = objectResult.StatusCode
                };
            }
            else if (objectResult.StatusCode >= 500)
            {
                if (objectResult.Value is ProblemDetails problemDetails)
                {
                    var apiErrorResponse = new ApiResponse<object>(null, problemDetails.Detail);

                    context.Result = new JsonResult(apiErrorResponse)
                    {
                        StatusCode = objectResult.StatusCode
                    };
                }
            }
        }
    }
}
