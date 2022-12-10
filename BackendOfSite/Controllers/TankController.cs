using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TankController : Controller
    {
        private readonly DbCisternContext db;

        public TankController(DbCisternContext context)
        {
            db = context;
        }

        [HttpGet]
        public IActionResult GetTankNames()
        {
            return Ok(from cistern in db.Cisterns
                      select new
                      {
                          Id = cistern.CisternId,
                          CisternName = "РВС-" + cistern.NominalVolumeM3.ToString() + " м^3"
                      });
        }

        [HttpGet("TankCharacters")]
        public IActionResult GetTankCharacters(int tankId)
        {
            var cistern = db.Cisterns.FirstOrDefault(cistern => cistern.CisternId == tankId);

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
