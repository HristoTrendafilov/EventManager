using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Exception;
using EventManager.BOL;
using EventManager.API.Dto.Exception;
using Microsoft.AspNetCore.Mvc;

namespace EventManager.API.Controllers
{
    [ApiController]
    [Role(UserRole.Admin)]
    [Route("api/exceptions")]
    public class ExceptionController : ControllerBase
    {
        private readonly IExceptionService _exceptionService;

        public ExceptionController(IExceptionService exceptionService)
        {
            _exceptionService = exceptionService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllExceptions()
        {
            var exceptions = await _exceptionService.GetAllExceptionsAsync(x => true);
            var exceptionsToReturn = Mapper.CreateList<ExceptionView>(exceptions); 

            return Ok(exceptionsToReturn);
        }

        [HttpGet("{exceptionId}")]
        public async Task<ActionResult> GetException(long exceptionId)
        {
            if (!await _exceptionService.ExceptionExistsAsync(x => x.ExceptionId == exceptionId))
            {
                return NotFound();
            }

            var exception = await _exceptionService.GetExceptionAsync(x => x.ExceptionId == exceptionId);
            var exceptionToReturn = Mapper.CreateObject<ExceptionView>(exception);

            return Ok(exceptionToReturn);
        }

        [HttpPut("{exceptionId}")]
        public async Task<ActionResult> ResolveException(long exceptionId)
        {
            if (!await _exceptionService.ExceptionExistsAsync(x => x.ExceptionId == exceptionId))
            {
                return NotFound();
            }

            await _exceptionService.ResolveException(exceptionId, User.X_CurrentUserId());

            return NoContent();
        }

        [HttpDelete("{exceptionId}")]
        public async Task<ActionResult> DeleteException(long exceptionId)
        {
            if (!await _exceptionService.ExceptionExistsAsync(x => x.ExceptionId == exceptionId))
            {
                return NotFound();
            }

            await _exceptionService.DeleteExceptionAsync(exceptionId, User.X_CurrentUserId());

            return NoContent();
        }
    }
}
