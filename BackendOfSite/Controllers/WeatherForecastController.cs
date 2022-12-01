using Microsoft.AspNetCore.Mvc;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DbCisternBackendController : ControllerBase
    {
        private readonly ILogger<DbCisternBackendController> _logger;

        public DbCisternBackendController(ILogger<DbCisternBackendController> logger)
        {
            _logger = logger;
        }
    }
}