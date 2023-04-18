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

        public class GroupedRecordsOrder
        {
            public int SettlingTimeHour { get; set; }
            public int RequiredVolume { get; set; }
            public float UsefulVolume { get; set; }
            public List<RecordsGroup> tanksRecordGroups { get; set; } = new List<RecordsGroup>();
        }

        public class RecordsGroup
        {
            public List<RequiredTanksRecord> requiredTanksGroup { get; set; } = new List<RequiredTanksRecord>();
        }

        public class RequiredTanksRecord
        {
            public int NominalVolume { get; set; }
            public int NeedCountForWork { get; set; }
            public decimal CisternPrice { get; set; }
        }

        [HttpGet("GetProductParks")]
        public IActionResult GetProductParks()
        {
            return Ok(db.ProductParks);
        }

        [HttpGet("GetCisternPurposes")]
        public IActionResult GetCisternPurposes()
        {
            return Ok(db.PurposeCisterns);
        }

        [HttpGet("GetCisternPurposesForOilType")]
        public IActionResult GetCisternPurposesForOilType(string oilType)
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

        [HttpGet("GetOilTypes")]
        public IActionResult GetOilTypes()
        {
            return Ok(oilTypes);
        }

        [HttpGet("CalculateByProductPark")]
        public IActionResult Calculate(int productParkId, int cisternPurposeId, bool groupSelect)
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
                return Ok(CalculateByNW(cisternPurposeId, oilTypeId, (int)maxOil, (int)maxWater, groupSelect));
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("CalculateByValues")]
        public IActionResult Calculate(int cisternPurposeId, string oilType, int oilValue, int waterValue, bool groupSelect)
        {
            int oilTypeId = Array.IndexOf(oilTypes, oilType);

            if (cisternPurposeId == -1 || oilTypeId == -1)
            {
                return NotFound();
            }

            GroupedRecordsOrder data;

            data = CalculateByNW(cisternPurposeId, oilTypeId, oilValue, waterValue, groupSelect);

            return Ok(data);
        }

        private GroupedRecordsOrder CalculateByNW(int cisternPurposeId, int oilTypeId, int oilValue, int waterValue, bool groupSelect)
        {
            GroupedRecordsOrder data = new GroupedRecordsOrder();

            int settlingTime = CalculateSettlingTime(cisternPurposeId, oilTypeId),
                needVolumeM3 = CalculateNeedVolumeM3(cisternPurposeId, oilValue, waterValue, settlingTime);
            float usefulVolume = CalculateUsefulVolume(cisternPurposeId);

            if (oilValue > 0 && waterValue > 0 && (cisternPurposeId != 0 || oilTypeId == 0))
            {
                if (groupSelect)
                {
                    data = CalculateTanksForParametrsGroupSelect(settlingTime, needVolumeM3, usefulVolume);
                }
                else
                {
                    data = CalculateTanksForParametrs(settlingTime, needVolumeM3, usefulVolume);
                }
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

        private GroupedRecordsOrder CalculateTanksForParametrs(int settlingTime, int needVolumeM3, float usefulVolume)
        {
            GroupedRecordsOrder result = new GroupedRecordsOrder();

            result.SettlingTimeHour = settlingTime;
            result.RequiredVolume = needVolumeM3;
            result.UsefulVolume = usefulVolume;

            var cisternVolumePrices = db.Cisterns.Select(cistern => new { cistern.NominalVolumeM3, Price = cistern.PriceCisterns.First().PriceRub ?? 0 }) ;

            List<RecordsGroup> tankRecords = new List<RecordsGroup>();

            foreach (var cisternVolumePrice in cisternVolumePrices)
            {
                int needCount = (int)Math.Ceiling(needVolumeM3 / (cisternVolumePrice.NominalVolumeM3 * usefulVolume));

                tankRecords.Add(new RecordsGroup()
                {
                    requiredTanksGroup = new List<RequiredTanksRecord>() {
                    new RequiredTanksRecord() {
                    NominalVolume = cisternVolumePrice.NominalVolumeM3,
                    NeedCountForWork = needCount,
                    CisternPrice = cisternVolumePrice.Price
                }}
                });
            }

            result.tanksRecordGroups = tankRecords.OrderBy(group => group.requiredTanksGroup.Sum(x => x.CisternPrice * x.NeedCountForWork)).Take(5).ToList();

            return result;
        }

        private GroupedRecordsOrder CalculateTanksForParametrsGroupSelect(int settlingTime, int needVolumeM3, float usefulVolume)
        {
            GroupedRecordsOrder result = new GroupedRecordsOrder();

            result.SettlingTimeHour = settlingTime;
            result.RequiredVolume = needVolumeM3;
            result.UsefulVolume = usefulVolume;

            CisternNominalCountPrice[] cisternVolumePrices = db.Cisterns.Select(cistern => new CisternNominalCountPrice { NominalVolumeM3 = cistern.NominalVolumeM3, CountForFull = 0, Price = cistern.PriceCisterns.First().PriceRub ?? 0 })
                .OrderBy(x => x.NominalVolumeM3).ToArray();

            List<RecordsGroup> tankRecords = new List<RecordsGroup>();

            cisternVolumePrices[0].CountForFull = (int)Math.Ceiling(needVolumeM3 / (cisternVolumePrices[0].NominalVolumeM3 * usefulVolume));

            while (true)
            {
                if(tankRecords.Count() > 100)
                {
                    tankRecords = tankRecords.OrderBy(group => group.requiredTanksGroup.Sum(x => x.CisternPrice * x.NeedCountForWork))
                .Take(30).ToList();
                }

                // Add to tank records
                RecordsGroup recordsGroup = new RecordsGroup();

                foreach (var cisternVolumePrice in cisternVolumePrices)
                {
                    if (cisternVolumePrice.CountForFull > 0)
                    {
                        recordsGroup.requiredTanksGroup.Add(new RequiredTanksRecord()
                        {
                            NominalVolume = cisternVolumePrice.NominalVolumeM3,
                            NeedCountForWork = cisternVolumePrice.CountForFull,
                            CisternPrice = cisternVolumePrice.Price
                        });
                    }
                }

                tankRecords.Add(recordsGroup);

                if (cisternVolumePrices.Count(x => x.CountForFull > 0) == 1
                    && (cisternVolumePrices.First(x => x.CountForFull > 0).CountForFull == 1
                        || cisternVolumePrices.Last(x => x.CountForFull > 0).NominalVolumeM3 == cisternVolumePrices.Last().NominalVolumeM3))
                {
                    break;
                }

                // Next in combination
                int firstNumCisternIndex = Array.IndexOf(cisternVolumePrices, cisternVolumePrices.First(x => x.CountForFull > 0));

                cisternVolumePrices[firstNumCisternIndex + 1].CountForFull += 1;

                for (int index = 0; index <= firstNumCisternIndex; index++)
                {
                    cisternVolumePrices[index].CountForFull = 0;
                }

                int currentNominalVolume = cisternVolumePrices.Sum(x => x.CountForFull * x.NominalVolumeM3);

                if (needVolumeM3 / usefulVolume > currentNominalVolume)
                {
                    cisternVolumePrices[0].CountForFull = (int)Math.Ceiling((needVolumeM3 / usefulVolume - currentNominalVolume) / cisternVolumePrices[0].NominalVolumeM3);
                }
            }

            result.tanksRecordGroups = tankRecords.OrderBy(group => group.requiredTanksGroup.Sum(x => x.CisternPrice * x.NeedCountForWork))
                .Take(20).ToList();

            return result;
        }

        class CisternNominalCountPrice
        {
            public int NominalVolumeM3 { get; set; }
            public int CountForFull { get; set; }
            public decimal Price { get; set; }
        }
    }
}
