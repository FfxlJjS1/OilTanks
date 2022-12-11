using BackendOfSite.EFDbCistern;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
                CisternName = "РВС-" + row.NominalVolumeM3.ToString() + " м^3"
            }));
        }

        [HttpGet("CisternCharacters")]
        public IActionResult GetCisternCharacters(int cisternId)
        {
            var cistern = db.Cisterns.FirstOrDefault(cistern => cistern.CisternId == cisternId);

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
