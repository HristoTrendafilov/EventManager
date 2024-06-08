using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Services.Exception;
using EventManager.BOL;
using EventManager.DTO.Exception;
using Microsoft.AspNetCore.Mvc;

namespace EventManager.API.Controllers
{
    [Route("api/exceptions")]
    [ApiController]
    [ClaimAccess(ClaimTypeValues.Admin)]
    public class ExceptionController : ControllerBase
    {
        private readonly IExceptionService _exceptionService;
        private readonly Mapper _mapper;

        public ExceptionController(IExceptionService exceptionService, Mapper mapper)
        {
            _exceptionService = exceptionService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllExceptions()
        {
            var exceptions = await _exceptionService.GetAllExceptionsAsync(x => true);
            var exceptionsToReturn = _mapper.CreateList<ExceptionDto>(exceptions); 

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
            var exceptionToReturn = _mapper.CreateObject<ExceptionDto>(exception);

            return Ok(exceptionToReturn);
        }

        [HttpPut("{exceptionId}")]
        public async Task<ActionResult> ResolveException(long exceptionId)
        {
            if (!await _exceptionService.ExceptionExistsAsync(x => x.ExceptionId == exceptionId))
            {
                return NotFound();
            }

            await _exceptionService.ResolveException(exceptionId, User.X_GetCurrentUserId());

            return NoContent();
        }

        [HttpDelete("{exceptionId}")]
        public async Task<ActionResult> DeleteException(long exceptionId)
        {
            if (!await _exceptionService.ExceptionExistsAsync(x => x.ExceptionId == exceptionId))
            {
                return NotFound();
            }

            await _exceptionService.DeleteExceptionAsync(exceptionId, User.X_GetCurrentUserId());

            return NoContent();
        }
    }
}
