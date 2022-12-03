using BackendOfSite.EFDbCistern;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalculatorController : ControllerBase
    {
        DbCisternContext db;
        string[] oilTypes = { "Девонская", "Сернистая" };

        public CalculatorController()
        {
            db = new DbCisternContext();
        }

        public class LineStruct
        {
            public int SettlingTimeHour { get; set; }
            public int RequiredVolume { get; set; }
            public float UsefulVolume { get; set; }
            public int NominalVolume { get; set; }
            public int NeedCountForWork { get; set; }
        }

        [HttpGet("OilTypes")]
        public IActionResult GetOilTypes()
        {
            return Ok(oilTypes);
        }

        [HttpGet]
        public IActionResult Calculate(string oilType, int oilValue, int waterValue)
        {
            if (!oilTypes.Contains(oilType))
            {
                return NotFound();
            }

            int settlingTimeBeforeDropping = 0,
                settlingTimeBufferMaretial = 0,
                settlingTimeProduct = 0,
                settlingTimeTechWasteWater = 0,
                settlingTimeBufferWasteWater = 0;

            if(oilType == oilTypes[0])
            {
                settlingTimeBeforeDropping = 4;
                settlingTimeBufferMaretial = 56;
                settlingTimeProduct = 72;
                settlingTimeTechWasteWater = 8;
                settlingTimeBufferWasteWater = 6;
            }
            else if(oilType == oilTypes[1])
            {
                settlingTimeBeforeDropping = 0;
                settlingTimeBufferMaretial = 56;
                settlingTimeProduct = 72;
                settlingTimeTechWasteWater = 12;
                settlingTimeBufferWasteWater = 6;
            }

            Dictionary<string, List<LineStruct>> data = new Dictionary<string, List<LineStruct>>();

            int needVolumeM3 = 0, leftBetweenNominal = 0, rightBetweenNominal = 0;
            float usefulVolume = 0f, needCount = 0f;

            List<LineStruct> beforeDropList = new List<LineStruct>();

            if (oilType == oilTypes[0])
            {
                needVolumeM3 = (oilValue + waterValue) / 24 * settlingTimeBeforeDropping;
                rightBetweenNominal = db.Cisterns.ToList().First(cistern => cistern.NominalVolumeM3 > needVolumeM3).NominalVolumeM3;
                leftBetweenNominal = db.Cisterns.ToList().Last(cistern => cistern.NominalVolumeM3 < needVolumeM3).NominalVolumeM3;
                usefulVolume = 0.7f;
                needCount = needVolumeM3 / (rightBetweenNominal * usefulVolume);

                beforeDropList.Add(new LineStruct()
                {
                    SettlingTimeHour = settlingTimeBeforeDropping,
                    RequiredVolume = needVolumeM3,
                    UsefulVolume = 0.7f,
                    NominalVolume = rightBetweenNominal,
                    NeedCountForWork = (int)Math.Ceiling(needCount)
                });

                needCount = needVolumeM3 / (leftBetweenNominal * usefulVolume);

                beforeDropList.Add(new LineStruct()
                {
                    SettlingTimeHour = settlingTimeBeforeDropping,
                    RequiredVolume = needVolumeM3,
                    UsefulVolume = 0.7f,
                    NominalVolume = leftBetweenNominal,
                    NeedCountForWork = (int)Math.Ceiling(needCount)
                });
            }

            List<LineStruct> bufferMaterialList = new List<LineStruct>();


            needVolumeM3 = oilValue / 24 * settlingTimeBufferMaretial;
            rightBetweenNominal = db.Cisterns.ToList().First(cistern => cistern.NominalVolumeM3 > needVolumeM3).NominalVolumeM3;
            leftBetweenNominal = db.Cisterns.ToList().Last(cistern => cistern.NominalVolumeM3 < needVolumeM3).NominalVolumeM3;
            usefulVolume = 0.85f;
            needCount = needVolumeM3 / (rightBetweenNominal * usefulVolume);

            bufferMaterialList.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTimeBufferMaretial,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = rightBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });

            needCount = needVolumeM3 / (leftBetweenNominal * usefulVolume);

            bufferMaterialList.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTimeBufferMaretial,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = leftBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });

            List<LineStruct> productList = new List<LineStruct>();

            needVolumeM3 = oilValue / 24 * settlingTimeProduct;
            rightBetweenNominal = db.Cisterns.ToList().First(cistern => cistern.NominalVolumeM3 > needVolumeM3).NominalVolumeM3;
            leftBetweenNominal = db.Cisterns.ToList().Last(cistern => cistern.NominalVolumeM3 < needVolumeM3).NominalVolumeM3;
            usefulVolume = 0.9f;
            needCount = needVolumeM3 / (rightBetweenNominal * usefulVolume);

            productList.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTimeProduct,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = rightBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });

            needCount = needVolumeM3 / (leftBetweenNominal * usefulVolume);

            productList.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTimeProduct,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = leftBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });

            List<LineStruct> techWasteWaterList = new List<LineStruct>();

            needVolumeM3 = waterValue / 24 * settlingTimeTechWasteWater;
            rightBetweenNominal = db.Cisterns.ToList().First(cistern => cistern.NominalVolumeM3 > needVolumeM3).NominalVolumeM3;
            leftBetweenNominal = db.Cisterns.ToList().Last(cistern => cistern.NominalVolumeM3 < needVolumeM3).NominalVolumeM3;
            usefulVolume = 0.9f;
            needCount = needVolumeM3 / (rightBetweenNominal * usefulVolume);

            techWasteWaterList.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTimeTechWasteWater,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = rightBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });

            needCount = needVolumeM3 / (leftBetweenNominal * usefulVolume);

            techWasteWaterList.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTimeTechWasteWater,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = leftBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });

            List<LineStruct> bufferWasteWaterList = new List<LineStruct>();

            needVolumeM3 = waterValue / 24 * settlingTimeBufferWasteWater;
            rightBetweenNominal = db.Cisterns.ToList().First(cistern => cistern.NominalVolumeM3 > needVolumeM3).NominalVolumeM3;
            leftBetweenNominal = db.Cisterns.ToList().Last(cistern => cistern.NominalVolumeM3 < needVolumeM3).NominalVolumeM3;
            usefulVolume = 0.8f;
            needCount = needVolumeM3 / (rightBetweenNominal * usefulVolume);

            bufferWasteWaterList.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTimeBufferWasteWater,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = rightBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });

            needCount = needVolumeM3 / (leftBetweenNominal * usefulVolume);

            bufferWasteWaterList.Add(new LineStruct()
            {
                SettlingTimeHour = settlingTimeBufferWasteWater,
                RequiredVolume = needVolumeM3,
                UsefulVolume = usefulVolume,
                NominalVolume = leftBetweenNominal,
                NeedCountForWork = (int)Math.Ceiling(needCount)
            });


            data.Add("Предв.сброс", beforeDropList);
            data.Add("Буф.сырье", bufferMaterialList);
            data.Add("Товарн.", productList);
            data.Add("Тех.сточ.воды", techWasteWaterList);
            data.Add("Буф.сточ.воды", bufferWasteWaterList);

            return Ok(data);
        }
    }
}
