using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Log;
using EventManager.BOL;
using EventManager.API.Dto.CrudLog;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EventManager.DAL;

namespace EventManager.API.Controllers
{
    [ApiController]
    [Authorize]
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

        [HttpPost]
        public async Task<ActionResult> GetAllCrudLogs(CrudLogFilter filter)
        {
            var predicate = PredicateBuilder.True<VCrudLogPoco>()
                .And(x => x.CrudLogCreatedOnDateTime.Date == filter.ActionDateTime.Date);

            if (filter.ActionType != 0)
            {
                predicate = predicate.And(x => x.CrudLogActionType == filter.ActionType);
            }

            var crudLogs = await _crudLogService.GetAllCrudLogsViewAsync(predicate);
            var crudLogsToReturn = _mapper.CreateList<CrudLogView>(crudLogs);

            return Ok(crudLogsToReturn);
        }

        [HttpGet("{crudLogId}/view")]
        public async Task<ActionResult> GetCrudLogView(long crudLogId)
        {
            if (!await _crudLogService.CrudLogExistsAsync(x => x.CrudLogId == crudLogId))
            {
                return NotFound();
            }

            var crudLog = await _crudLogService.GetCrudLogAsync(x => x.CrudLogId == crudLogId);
            var crudLogToReturn = _mapper.CreateObject<CrudLogView>(crudLog);

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
