using EventManager.API.Core;
using EventManager.API.Helpers;
using EventManager.API.Helpers.Extensions;
using EventManager.API.Services.Region;
using EventManager.BOL;
using EventManager.DAL;
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
        private readonly Mapper _mapper;

        public RegionController(IRegionService regionService, Mapper mapper, PostgresConnection db)
        {
            _regionService = regionService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllRegions()
        {
            var regions = await _regionService.GetAllRegionsAsync(x => true);
            var regionToReturn = _mapper.CreateList<RegionView>(regions);

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
            var regionToReturn = _mapper.CreateObject<RegionView>(region);

            return Ok(regionToReturn);
        }

        [Authorize]
        [Role(UserRole.Admin)]
        [HttpPost]
        public async Task<ActionResult> CreateRegion(RegionNew region)
        {
            if (await _regionService.RegionExistsAsync(x => x.RegionName == region.RegionName))
            {
                return BadRequest($"Вече съществува регион: {region.RegionName}");
            }

            var regionId = await _regionService.CreateRegionAsync(region, User.X_CurrentUserId());

            var regionPoco = await _regionService.GetRegionAsync(x => x.RegionId == regionId);
            var regionToReturn = _mapper.CreateObject<RegionView>(regionPoco);

            return Ok(regionToReturn);
        }
    }
}
