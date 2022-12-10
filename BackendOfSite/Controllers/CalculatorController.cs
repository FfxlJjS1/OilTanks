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
            return Ok(db.Tovps.Select(row => new { row.TovpId, row.Name }));
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
            List<LineStruct> data = new List<LineStruct>();

            int settlingTime = CalculateSettlingTime(tankTypeId, oilTypeId),
                needVolumeM3 = CalculateNeedVolumeM3(tankTypeId, oilValue, waterValue, settlingTime);
            float usefulVolume = CalculateUsefulVolume(tankTypeId);

            if(tankTypeId != 0 || oilTypeId == 0)
            {
                data = CalculateTanksForParametrs(settlingTime, needVolumeM3, usefulVolume);
            }

            return data;
        }

        private int CalculateSettlingTime(int tankTypeId, int oilTypeId)
        {
            int settlingTime = 0;

            if (tankTypeId == 0)
            {
                if (oilTypeId == 0)
                {
                    settlingTime = 4;
                }
            }
            else if (tankTypeId == 1)
            {
                settlingTime = 56;
            }
            else if (tankTypeId == 2)
            {
                settlingTime = 72;
            }
            else if (tankTypeId == 3)
            {
                if (oilTypeId == 0)
                {
                    settlingTime = 8;
                }
                else if (oilTypeId == 1)
                {
                    settlingTime = 12;
                }
            }
            else if (tankTypeId == 4)
            {
                settlingTime = 6;
                settlingTime = 6;
            }

            return settlingTime;
        }

        private int CalculateNeedVolumeM3(int tankTypeId, float oilValue, float waterValue, int settlingTime)
        {
            int needVolume = 0;

            switch(tankTypeId)
            {
                case 0:
                    needVolume = (int)Math.Ceiling((oilValue + waterValue) / 24 * settlingTime);
                    break;
                case 1:
                    needVolume = (int)Math.Ceiling((oilValue) / 24 * settlingTime);
                    break;
                case 2:
                    needVolume = (int)Math.Ceiling((oilValue) / 24 * settlingTime);
                    break;
                case 3:
                    needVolume = (int)Math.Ceiling((waterValue) / 24 * settlingTime);
                    break;
                case 4:
                    needVolume = (int)Math.Ceiling((waterValue) / 24 * settlingTime);
                    break;
                default:
                    needVolume = 0;
                    break;
            }

            return needVolume;
        }

        private float CalculateUsefulVolume(int tankTypeId)
        {
            float usefulVolume = 0;

            switch(tankTypeId)
            {
                case 0:
                    usefulVolume = 0.7f;
                    break;
                case 1:
                    usefulVolume = 0.85f;
                    break;
                case 2:
                    usefulVolume = 0.9f;
                    break;
                case 3:
                    usefulVolume = 0.9f;
                    break;
                case 4:
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

            var cisternVolumes = db.Cisterns.Select(cistern => cistern.NominalVolumeM3);
            
            foreach(var cisternVolume in cisternVolumes)
            {
                int needCount = (int)Math.Ceiling(needVolumeM3 / (cisternVolume * usefulVolume));

                result.Add(new LineStruct()
                {
                    SettlingTimeHour = settlingTime,
                    RequiredVolume = needVolumeM3,
                    UsefulVolume = usefulVolume,
                    NominalVolume = cisternVolume,
                    NeedCountForWork = needCount
                });
            }

            return result;
        }
    }
}
