using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace EventManager.API.Core.Exceptions
{
    public class ExceptionFilter : IActionFilter, IOrderedFilter
    {
        public int Order => int.MaxValue - 10;

        public void OnActionExecuted(ActionExecutedContext context)
        {
            //if (context.Exception is <OurExceptionType> httpResponseException)
            //{
            //    context.Result = new ObjectResult(httpResponseException.Value)
            //    {
            //        StatusCode = (int)httpResponseException.StatusCode,
            //    };
            //}

            //context.ExceptionHandled = true;
        }

        public void OnActionExecuting(ActionExecutingContext context) { }
    }
}
