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
            public decimal CisternPrice { get; set; }
        }

        [HttpGet("ProductParks")]
        public IActionResult GetCommodityParks()
        {
            return Ok(db.ProductParks);
        }

        private PurposeCistern[] GetPurposeCisternsFromDB() => db.PurposeCisterns.ToArray();

        [HttpGet("PurposeCisterns")]
        public IActionResult GetPurposeCisterns()
        {
            return Ok(GetPurposeCisternsFromDB());
        }

        [HttpGet("OilTypes")]
        public IActionResult GetOilTypes()
        {
            return Ok(oilTypes);
        }

        [HttpGet("CalculateByProductPark")]
        public IActionResult Calculate(int productParkId, int purposeCisternId)
        {
            int oilTypeId = 0;
            decimal maxOil = -1, maxWater = -1;

            maxOil = db.FlowRates.Include(p => p.ProductPark).Where(p => p.ProductParkId == productParkId)
                .GroupBy(x => new { x.Month, x.Year },
                    (key, group) => new { key.Month, key.Year, Result = group.Sum(x => x.QnPred) })
                .Max(x => x.Result) ?? -1;

            maxWater = db.FlowRates.Include(p => p.ProductPark).Where(p => p.ProductParkId == productParkId)
                .GroupBy(x => new { x.Month, x.Year },
                    (key, group) => new { key.Month, key.Year, Result = group.Sum(x => x.QwPred) })
                .Max(x => x.Result) ?? -1;

            if (maxOil != -1 && maxWater != -1)
            {
                return Ok(CalculateByNW(purposeCisternId, oilTypeId, (int)maxOil, (int)maxWater));
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("CalculateByValues")]
        public IActionResult Calculate(int purposeCisternId, string oilType, int oilValue, int waterValue)
        {
            int oilTypeId = Array.IndexOf(oilTypes, oilType);

            if (purposeCisternId == -1 || oilTypeId == -1)
            {
                return NotFound();
            }

            List<LineStruct> data;

            if(purposeCisternId <= 4)
            {
                data = CalculateByNW(purposeCisternId, oilTypeId, oilValue, waterValue);
            }
            else // If it's not realized
            {
                return NotFound();
            }

            return Ok(data);
        }

        private List<LineStruct> CalculateByNW(int purposeCisternId, int oilTypeId, int oilValue, int waterValue)
        {
            List<LineStruct> data = new List<LineStruct>();

            int settlingTime = CalculateSettlingTime(purposeCisternId, oilTypeId),
                needVolumeM3 = CalculateNeedVolumeM3(purposeCisternId, oilValue, waterValue, settlingTime);
            float usefulVolume = CalculateUsefulVolume(purposeCisternId);

            if(purposeCisternId != 0 || oilTypeId == 0)
            {
                data = CalculateTanksForParametrs(settlingTime, needVolumeM3, usefulVolume);
            }

            return data;
        }

        private int CalculateSettlingTime(int purposeCisternId, int oilTypeId)
        {
            int settlingTime = 0;

            var standartSludgeRow = db.StandartSludges.Where(row => row.PurposeCisternId == purposeCisternId).First();
            
            if(oilTypeId == 0)
            {
                settlingTime = standartSludgeRow.DevonHour ?? 0;
            }
            else if(oilTypeId == 1)
            {
                settlingTime = standartSludgeRow.SulfuricHour ?? 0;
            }

            return settlingTime;
        }

        private int CalculateNeedVolumeM3(int purposeCisternId, float oilValue, float waterValue, int settlingTime)
        {
            int needVolume;

            switch(purposeCisternId)
            {
                case 1:
                    needVolume = (int)Math.Ceiling((oilValue + waterValue) / 24 * settlingTime);
                    break;
                case 2:
                    needVolume = (int)Math.Ceiling((oilValue) / 24 * settlingTime);
                    break;
                case 4:
                    needVolume = (int)Math.Ceiling((oilValue) / 24 * settlingTime);
                    break;
                case 5:
                    needVolume = (int)Math.Ceiling((waterValue) / 24 * settlingTime);
                    break;
                case 6:
                    needVolume = (int)Math.Ceiling((waterValue) / 24 * settlingTime);
                    break;
                default:
                    needVolume = 0;
                    break;
            }

            return needVolume;
        }

        private float CalculateUsefulVolume(int purposeCisternId)
        {
            float usefulVolume;

            switch(purposeCisternId)
            {
                case 1:
                    usefulVolume = 0.7f;
                    break;
                case 2:
                    usefulVolume = 0.85f;
                    break;
                case 4:
                    usefulVolume = 0.9f;
                    break;
                case 5:
                    usefulVolume = 0.9f;
                    break;
                case 6:
                    usefulVolume = 0.8f;
                    break;
                default:
                    usefulVolume = 0f;
                    break;
            }

            return usefulVolume;
        }

        private List<LineStruct> CalculateTanksForParametrs(int settlingTime, int needVolumeM3, float usefulVolume)
        {
            List<LineStruct> result = new List<LineStruct>();

            var cisternVolumePrices = db.Cisterns.Select(cistern => new { cistern.NominalVolumeM3, Price = cistern.PriceCisterns.First().PriceRub ?? 0 }) ;
            
            foreach(var cisternVolumePrice in cisternVolumePrices)
            {
                int needCount = (int)Math.Ceiling(needVolumeM3 / (cisternVolumePrice.NominalVolumeM3 * usefulVolume));

                result.Add(new LineStruct()
                {
                    SettlingTimeHour = settlingTime,
                    RequiredVolume = needVolumeM3,
                    UsefulVolume = usefulVolume,
                    NominalVolume = cisternVolumePrice.NominalVolumeM3,
                    NeedCountForWork = needCount,
                    CisternPrice = cisternVolumePrice.Price
                });
            }

            result = result.OrderBy(row => row.CisternPrice * row.NeedCountForWork).ToList();

            return result;
        }
    }
}
