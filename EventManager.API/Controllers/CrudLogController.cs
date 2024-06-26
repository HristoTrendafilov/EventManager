﻿using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Services.Log;
using EventManager.BOL;
using EventManager.DTO.CrudLog;
using Microsoft.AspNetCore.Mvc;

namespace EventManager.API.Controllers
{
    [Route("api/crud-logs")]
    [ApiController]
    [ClaimAccess(ClaimTypeValues.Admin)]
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

        [HttpDelete("{crudLogId}")]
        public async Task<ActionResult> DeleteException(long crudLogId)
        {
            if (!await _crudLogService.CrudLogExistsAsync(x => x.CrudLogId == crudLogId))
            {
                return NotFound();
            }

            await _crudLogService.DeleteCrudLogAsync(crudLogId, User.X_GetCurrentUserId());

            return NoContent();
        }
    }
}
