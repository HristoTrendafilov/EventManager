using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Log;
using EventManager.BOL;
using EventManager.API.Dto.CrudLog;
using Microsoft.AspNetCore.Mvc;

namespace EventManager.API.Controllers
{
    [ApiController]
    [Role(UserRole.Admin)]
    [Route("api/crud-logs")]
    public class CrudLogController : ControllerBase
    {
        private readonly ICrudLogService _crudLogService;
        private readonly Mapper _mapper;

        public CrudLogController(ICrudLogService crudLogService, Mapper mapper)
        {
            _crudLogService = crudLogService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllCrudLogs()
        {
            var crudLogs = await _crudLogService.GetAllCrudLogsAsync(x => true);
            var crudLogsToReturn = _mapper.CreateList<CrudLogDto>(crudLogs);

            return Ok(crudLogsToReturn);
        }

        [HttpGet("{crudLogId}")]
        public async Task<ActionResult> GetCrudLog(long crudLogId)
        {
            if (!await _crudLogService.CrudLogExistsAsync(x => x.CrudLogId == crudLogId))
            {
                return NotFound();
            }

            var crudLog = await _crudLogService.GetCrudLogAsync(x => x.CrudLogId == crudLogId);
            var crudLogToReturn = _mapper.CreateObject<CrudLogDto>(crudLog);

            return Ok(crudLogToReturn);
        }

        [HttpDelete("{crudLogId}/delete")]
        public async Task<ActionResult> DeleteCrudLog(long crudLogId)
        {
            if (!await _crudLogService.CrudLogExistsAsync(x => x.CrudLogId == crudLogId))
            {
                return NotFound();
            }

            await _crudLogService.DeleteCrudLogAsync(crudLogId, User.X_CurrentUserId());

            return NoContent();
        }
    }
}
