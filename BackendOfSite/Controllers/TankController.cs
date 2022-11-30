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

        [HttpGet]
        // GET: api/Tanks
        public IActionResult GetTanks()
        {
            return Ok(from cistern in db.Cisterns.ToList()
                       select new
                       {
                           Id = cistern.CisternId,
                           CisternName = "РВС-" + cistern.NominalVolumeM3.ToString() + " м^3"
                       });
        }
    }
}
