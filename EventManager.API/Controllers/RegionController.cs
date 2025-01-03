﻿using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Region;
using EventManager.BOL;
using EventManager.API.Dto.Region;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventManager.API.Controllers
{
    [ApiController]
    [Route("api/regions")]
    public class RegionController : ControllerBase
    {
        private readonly IRegionService _regionService;

        public RegionController(IRegionService regionService)
        {
            _regionService = regionService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllRegions()
        {
            var regions = await _regionService.GetAllRegionsAsync(x => true);
            var regionToReturn = Mapper.CreateList<RegionView>(regions);

            return Ok(regionToReturn);
        }

        [HttpGet("{regionId}/view")]
        public async Task<ActionResult> GetRegionView(long regionId)
        {
            if (!await _regionService.RegionExistsAsync(x => x.RegionId == regionId))
            {
                return NotFound();
            }

            var region = await _regionService.GetRegionAsync(x => x.RegionId == regionId);
            var regionToReturn = Mapper.CreateObject<RegionView>(region);

            return Ok(regionToReturn);
        }

        [Role(UserRole.Admin)]
        [Authorize]
        [HttpPost("new")]
        public async Task<ActionResult> CreateRegion(RegionNew region)
        {
            if (await _regionService.RegionExistsAsync(x => x.RegionName == region.RegionName))
            {
                return BadRequest($"Вече съществува регион: {region.RegionName}");
            }

            var regionId = await _regionService.CreateRegionAsync(region, User.X_CurrentUserId());

            var regionPoco = await _regionService.GetRegionAsync(x => x.RegionId == regionId);
            var regionToReturn = Mapper.CreateObject<RegionView>(regionPoco);

            return Ok(regionToReturn);
        }

        [Role(UserRole.Admin)]
        [Authorize]
        [HttpPut("{regionId}/update")]
        public async Task<ActionResult> UpdateRegion(long regionId, RegionUpdate region)
        {
            if (await _regionService.RegionExistsAsync(x => x.RegionName == region.RegionName && x.RegionId != regionId))
            {
                return BadRequest($"Вече съществува регион: {region.RegionName}");
            }

             await _regionService.UpdateRegionAsync(regionId, region, User.X_CurrentUserId());

            var regionPoco = await _regionService.GetRegionAsync(x => x.RegionId == regionId);
            var regionToReturn = Mapper.CreateObject<RegionView>(regionPoco);

            return Ok(regionToReturn);
        }

        [Role(UserRole.Admin)]
        [Authorize]
        [HttpGet("{regionId}/update")]
        public async Task<ActionResult> GetRegionForUpdate(long regionId)
        {
            if (!await _regionService.RegionExistsAsync(x => x.RegionId == regionId))
            {
                return NotFound();
            }
 
            var regionPoco = await _regionService.GetRegionAsync(x => x.RegionId == regionId);
            var regionToReturn = Mapper.CreateObject<RegionForUpdate>(regionPoco);

            return Ok(regionToReturn);
        }
    }
}
