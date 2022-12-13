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
        public IActionResult GetProductParks()
        {
            return Ok(db.ProductParks);
        }

        private PurposeCistern[] GetCisternPurposesFromDB() => db.PurposeCisterns.ToArray();

        [HttpGet("CisternPurposes")]
        public IActionResult GetCisternPurposes()
        {
            return Ok(GetCisternPurposesFromDB());
        }

        [HttpGet("CisternPurposesByOilType")]
        public IActionResult GetCisternPurposes(string oilType)
        {
            int oilTypeId = Array.IndexOf(oilTypes, oilType);
            List<PurposeCistern> resultCisternPurposes = new List<PurposeCistern>();

            if(oilTypeId == 0)
            {
                resultCisternPurposes = db.StandartSludges.Where(x => x.DevonHour > 0).Select(x => x.PurposeCistern).ToList();
            }
            else if(oilTypeId == 1)
            {
                resultCisternPurposes = db.StandartSludges.Where(x => x.SulfuricHour > 0).Select(x => x.PurposeCistern).ToList();
            }

            return Ok(resultCisternPurposes);
        }

        [HttpGet("OilTypes")]
        public IActionResult GetOilTypes()
        {
            return Ok(oilTypes);
        }

        [HttpGet("CalculateByProductPark")]
        public IActionResult Calculate(int productParkId, int cisternPurposeId)
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
                return Ok(CalculateByNW(cisternPurposeId, oilTypeId, (int)maxOil, (int)maxWater));
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("CalculateByValues")]
        public IActionResult Calculate(int cisternPurposeId, string oilType, int oilValue, int waterValue)
        {
            int oilTypeId = Array.IndexOf(oilTypes, oilType);

            if (cisternPurposeId == -1 || oilTypeId == -1)
            {
                return NotFound();
            }

            List<LineStruct> data;

            data = CalculateByNW(cisternPurposeId, oilTypeId, oilValue, waterValue);

            return Ok(data);
        }

        private List<LineStruct> CalculateByNW(int cisternPurposeId, int oilTypeId, int oilValue, int waterValue)
        {
            List<LineStruct> data = new List<LineStruct>();

            int settlingTime = CalculateSettlingTime(cisternPurposeId, oilTypeId),
                needVolumeM3 = CalculateNeedVolumeM3(cisternPurposeId, oilValue, waterValue, settlingTime);
            float usefulVolume = CalculateUsefulVolume(cisternPurposeId);

            if(oilValue > 0 && waterValue > 0 && (cisternPurposeId != 0 || oilTypeId == 0))
            {
                data = CalculateTanksForParametrs(settlingTime, needVolumeM3, usefulVolume);
            }

            return data;
        }

        private int CalculateSettlingTime(int cisternPurposeId, int oilTypeId)
        {
            int settlingTime = 0;

            var standartSludgeRow = db.StandartSludges.Where(row => row.PurposeCisternId == cisternPurposeId).First();
            
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

        private int CalculateNeedVolumeM3(int cisternPurposeId, float oilValue, float waterValue, int settlingTime)
        {
            int needVolume = 0;

            switch(cisternPurposeId)
            {
                case 1:
                    needVolume = (int)Math.Ceiling((oilValue + waterValue) / 24 * settlingTime);
                    break;
                case 2:
                    needVolume = (int)Math.Ceiling((oilValue) / 24 * settlingTime);
                    break;
                case 3:
                    needVolume = (int)Math.Ceiling((oilValue) / 24 * settlingTime);
                    break;
                case 4:
                    needVolume = (int)Math.Ceiling((waterValue) / 24 * settlingTime);
                    break;
                case 5:
                    needVolume = (int)Math.Ceiling((waterValue) / 24 * settlingTime);
                    break;
            }

            return needVolume;
        }

        private float CalculateUsefulVolume(int cisternPurposeId)
        {
            float usefulVolume = 0f;

            switch (cisternPurposeId)
            {
                case 1:
                    usefulVolume = 0.7f;
                    break;
                case 2:
                    usefulVolume = 0.85f;
                    break;
                case 3:
                    usefulVolume = 0.9f;
                    break;
                case 4:
                    usefulVolume = 0.9f;
                    break;
                case 5:
                    usefulVolume = 0.8f;
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

            result = result.OrderBy(row => row.CisternPrice * row.NeedCountForWork).Take(5).ToList();

            return result;
        }
    }
}
