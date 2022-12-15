using BackendOfSite.EFDbCistern;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CisternController : Controller
    {
        private readonly DbCisternContext db;

        public CisternController(DbCisternContext context)
        {
            db = context;
        }

        [HttpGet]
        public IActionResult GetCisternNames()
        {
            return Ok(db.Cisterns.Select(row => new
            {
                Id = row.CisternId,
                CisternNominal = row.NominalVolumeM3.ToString()
            }));
        }

        [HttpGet("CisternCharacters")]
        public IActionResult GetCisternCharacters(int cisternId)
        {
            var cistern = db.Cisterns.IgnoreAutoIncludes()
                .Include(x => x.WallMethodMade)
                .Include(x => x.LadderTypeConstruction)
                .Include(x => x.RoofTypeConstruction)
                .Include(x => x.RoofTypeForm)
                .Include(x => x.BottomTypeSlope)
                .Include(x => x.PriceCisterns)
                .FirstOrDefault(cistern => cistern.CisternId == cisternId);

            if(cistern != null)
            {
                return Ok(cistern);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
