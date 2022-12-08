using BackendOfSite.EFDbCistern;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalculatorController : ControllerBase
    {
        private readonly DbCisternContext db;
        readonly string[] tankTypes = { "Предв.сброс", "Буф.сырье", "Товар.", "Тех.сточ.воды", "Буф.сточ.воды" };
        readonly string[] oilTypes = { "Девонская", "Сернистая" };

        public CalculatorController(DbCisternContext context)
        {
            db = context;
        }

        public class LineStruct
        {
            public int SettlingTimeHour { get; set; }
            public int RequiredVolume { get; set; }
            public float UsefulVolume { get; set; }
            public int NominalVolume { get; set; }
            public int NeedCountForWork { get; set; }
        }

        [HttpGet("CommodityParks")]
        public IActionResult GetCommodityParks()
        {
            return Ok(db.Tovps.ToList().Select(row => new { row.TovpId, row.Name }));
        }

        [HttpGet("TankTypes")]
        public IActionResult GetTankTypes()
        {
            return Ok(tankTypes);
        }

        [HttpGet("OilTypes")]
        public IActionResult GetOilTypes()
        {
            return Ok(oilTypes);
        }

        [HttpGet("CalculateByCommodityPark")]
        public IActionResult Calculate(int commodityParkId, string tankType)
        {
            int tankTypeId = Array.IndexOf(tankTypes, tankType),
                oilTypeId = 0;
            decimal maxOil = -1, maxWater = -1;

            maxOil = db.Debets.Include(p => p.Tovp).Where(p => p.TovpId == commodityParkId)
                .GroupBy(x => new { x.Month, x.Year },
                    (key, group) => new { key.Month, key.Year, Result = group.Sum(x => x.QnPred) })
                .Max(x => x.Result) ?? -1;

            maxWater = db.Debets.Include(p => p.Tovp).Where(p => p.TovpId == commodityParkId)
                .GroupBy(x => new { x.Month, x.Year },
                    (key, group) => new { key.Month, key.Year, Result = group.Sum(x => x.QwPred) })
                .Max(x => x.Result) ?? -1;

            if (maxOil != -1 && maxWater != -1)
            {
                return Ok(CalculateByNW(tankTypeId, oilTypeId, (int)maxOil, (int)maxWater));
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("CalculateByValues")]
        public IActionResult Calculate(string tankType, string oilType, int oilValue, int waterValue)
        {
            int tankTypeId = Array.IndexOf(tankTypes, tankType),
                oilTypeId = Array.IndexOf(oilTypes, oilType);

            if (tankTypeId == -1 || oilTypeId == -1)
            {
                return NotFound();
            }

            List<LineStruct> data;

            if(tankTypeId <= 4)
            {
                data = CalculateByNW(tankTypeId, oilTypeId, oilValue, waterValue);
            }
            else // If it's not realized
            {
                return NotFound();
            }

            return Ok(data);
        }

        private List<LineStruct> CalculateByNW(int tankTypeId, int oilTypeId, int oilValue, int waterValue)
        {
            int settlingTimeBeforeDropping = 0,
                settlingTimeBufferMaretial = 0,
                settlingTimeProduct = 0,
                settlingTimeTechWasteWater = 0,
                settlingTimeBufferWasteWater = 0;

            if (oilTypeId == 0)
            {
                settlingTimeBeforeDropping = 4;
                settlingTimeBufferMaretial = 56;
                settlingTimeProduct = 72;
                settlingTimeTechWasteWater = 8;
                settlingTimeBufferWasteWater = 6;
            }
            else if (oilTypeId == 1)
            {
                settlingTimeBeforeDropping = 0;
                settlingTimeBufferMaretial = 56;
                settlingTimeProduct = 72;
                settlingTimeTechWasteWater = 12;
                settlingTimeBufferWasteWater = 6;
            }

            List<LineStruct> data = new List<LineStruct>();

            if (tankTypeId == 0) // before drop
            {
                if (oilTypeId == 0)
                {
                    data = calculateTanksForParametrs(settlingTimeBeforeDropping, oilValue, waterValue, 0.7f);
                }
            }
            else if (tankTypeId == 1) // buff materials
            {
                data = calculateTanksForParametrs(settlingTimeBufferMaretial, oilValue, waterValue, 0.85f);
            }
            else if (tankTypeId == 2) // Product
            {
                data = calculateTanksForParametrs(settlingTimeProduct, oilValue, waterValue, 0.9f);
            }
            else if (tankTypeId == 3) // Technical waste water
            {
                data = calculateTanksForParametrs(settlingTimeTechWasteWater, oilValue, waterValue, 0.9f);
            }
            else if (tankTypeId == 4) // Buffer waste water
            {
                data = calculateTanksForParametrs(settlingTimeBufferWasteWater, oilValue, waterValue, 0.8f);
            }

            return data;
        }

        private List<LineStruct> calculateTanksForParametrs(int settlingTime, float oilValue, float waterValue, float usefulVolume)
        {
            List<LineStruct> result = new List<LineStruct>();

            int needVolumeM3 = (int)Math.Ceiling((oilValue + waterValue) / 24 * settlingTime);
            var rightBetweenNominal = db.Cisterns.ToList().First(cistern => cistern.NominalVolumeM3 > needVolumeM3).NominalVolumeM3;
            var leftBetweenNominal = db.Cisterns.ToList().Last(cistern => cistern.NominalVolumeM3 < needVolumeM3).NominalVolumeM3;
            usefulVolume = 0.7f;
            var needCount = needVolumeM3 / (rightBetweenNominal * usefulVolume);

            result.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTime,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = rightBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });

            needCount = needVolumeM3 / (leftBetweenNominal * usefulVolume);

            result.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTime,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = leftBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });

            return result;
        }
    }
}
