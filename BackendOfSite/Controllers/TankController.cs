using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TankController : Controller
    {
        DbCisternContext db;

        public TankController()
        {
            db = new DbCisternContext();
        }

        [HttpGet("")]
        public IActionResult GetTankNames()
        {
            return Ok(from cistern in db.Cisterns.ToList()
                      select new
                      {
                          Id = cistern.CisternId,
                          CisternName = "РВС-" + cistern.NominalVolumeM3.ToString() + " м^3"
                      });
        }

        [HttpGet("TankCharacters/{tankId:int}")]
        public IActionResult GetTankCharacters(int tankId)
        {
            var cistern = db.Cisterns.ToList().FirstOrDefault(cistern => cistern.CisternId == tankId);

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
