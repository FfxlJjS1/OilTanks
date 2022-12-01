using BackendOfSite.EFDbCistern;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("api/calculator/[controller]")]
    public class CalculatorController : ControllerBase
    {
        DbCisternContext db;

        public CalculatorController(DbCisternContext context)
        {
            db = context;
        }

        [HttpGet(Name = "DbCisternBackend")]
        public IActionResult Get()
        {
            return Ok();
        }
    }
}
