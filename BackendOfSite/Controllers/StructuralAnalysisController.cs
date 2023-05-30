using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Collections.Generic;
using System.Security.Cryptography.Xml;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StructuralAnalysisController : Controller
    {
        readonly string[] formTypes = { "Все", "Цилиндрический", "Параллелепипед" };

        class Column
        {
            public string Name { get; set; } = "";
            public string Width { get; set; } = "";
        }

        class Row
        {
            public List<string> Cells { get; set; } = new List<string>();
            public string TooltipString { get; set; } = "";
        }

        class EntityTable
        {
            public List<Column> Columns { get; set; } = new List<Column>();
            public List<Row> Rows { get; set; } = new List<Row>();
        }

        class EntityResponce
        {
            public EntityTable entityTable { get; set; } = new EntityTable();
            public double minimalSquire { get; set; }
            public double height { get; set; }
        }

        [HttpGet("GetFormTypes")]
        public IActionResult GetFormTypes()
        {
            return Ok(formTypes.Select((name, index) => new { name, index }));
        }

        [HttpGet("AnalyseByFormVolume")]
        public IActionResult AnalyseByFormVolume(int volumeValue, int formTypeIndex, string limitesAsString)
        {
            EntityTable entityTable = new EntityTable();
            double squire = 0f, height = 0f;
            int[] limites = limitesAsString.Split(';').Select(x => Convert.ToInt32(x)).ToArray();


            entityTable.Columns = new List<Column>();

            if (formTypeIndex == 1 || formTypeIndex == 0)
            {
                entityTable.Columns.AddRange(new List<Column>()
                {
                    new Column(){ Name = "Радиус, м", Width = "50px"}
                });
            }
            
            if (formTypeIndex == 2 || formTypeIndex == 0)
            {
                entityTable.Columns.AddRange(new List<Column>()
                {
                    new Column(){ Name = "Ширина стороны, м", Width = "50px"},
                });
            }

            entityTable.Columns.AddRange(new List<Column>(){
                new Column(){ Name = "Высота, м", Width = "100px"},
                new Column() { Name = "Толщина нижнего пояса, м", Width = "100px" },
                new Column() { Name = "Толщина верхнего пояса, м", Width = "150px" },
                new Column() { Name = "Общий вес, кг.", Width = "150px" },
                //new Column() { Name = "Общий объем, т.", Width = "150px" },
                new Column() { Name = "Общая стоимость, руб.", Width = "150px" }
            });

            if(formTypeIndex == 0)
            {
                entityTable.Columns.Add(new Column() { Name = "Форма, тип", Width = "150px" });
            }


            if (formTypeIndex == 0)
            {
                for (formTypeIndex = 1; formTypeIndex < formTypes.Length; formTypeIndex++)
                {
                    List<Row> rowsByForm = StructualAnalyzeByForm(formTypeIndex, volumeValue, limites, true);

                    entityTable.Rows.AddRange(rowsByForm);
                }

                entityTable.Rows = entityTable.Rows.OrderBy(row => Convert.ToDecimal(row.Cells[row.Cells.Count - 2])).ToList();
            }
            else
            {
                entityTable.Rows = StructualAnalyzeByForm(formTypeIndex, volumeValue, limites, false)
                    .OrderBy(row => Convert.ToDecimal(row.Cells.Last())).ToList();
            }


            EntityResponce entityResponce = new EntityResponce()
            {
                entityTable = entityTable,
                minimalSquire = squire,
                height = height
            };

            return Ok(entityResponce);
        }

        private List<Row> StructualAnalyzeByForm(int formTypeIndex, int volumeValue, int[] limites, bool willFullTable)
        {
            List<Row> rows = new List<Row>();

            if (formTypeIndex < 1 || formTypeIndex > formTypes.Length)
            {
                return rows;
            }

            const decimal metalDensityKgPerCubicMetr = 7500; // кг/м^3
            const decimal metalCostPeTon = 70000; // Руб/т
            string formTypeString = formTypes[formTypeIndex];

            if (formTypeIndex == 1)
            {
                for (int radius = limites[0] ; radius <= limites[1]; radius++)
                {
                    Row row = StructureAnalyseForCylinderTanks(radius, volumeValue, metalDensityKgPerCubicMetr, metalCostPeTon, willFullTable);
                    
                    rows.Add(row);
                }
            }
            else if (formTypeIndex == 2)
            {
                for (int sideAWidth = limites[2]; sideAWidth <= limites[3]; sideAWidth++)
                {
                    //
                }
            }

            return rows;
        }

        private decimal CalculateParallelogeamTankWeight(int sideAWidth, int sideBWidth, double currHeight, int volumeValue, float metalDensityKgPerCubicMillimetr)
        {
            return -1;
        }

        private decimal CalculateParallepipedTankCosts(decimal tankWeight, decimal metalCostsPerKillogram)
        {
            return tankWeight * metalCostsPerKillogram;
        }

        // For Cylinder
        private Row StructureAnalyseForCylinderTanks(int radius, int volumeValue, decimal metalDensityKgPerCubicMetr, decimal metalCostPeTon, bool willFullTable)
        {
            Row row = new Row
            {
                Cells = {
                        radius.ToString()
                    }
            };

            double bottomArea = radius * radius * Math.PI;

            double height = RoundUp(volumeValue / bottomArea, 3);
            row.Cells.Add(height.ToString());

            double lowerBeltWeight = CalculateLowerBeltWeight(volumeValue, height, radius);
            row.Cells.Add(lowerBeltWeight.ToString());

            double upperBeltWeight = CalculateUpperBeltWeight(volumeValue, height, radius);
            row.Cells.Add(upperBeltWeight.ToString());

            double wallSteelWeight = CalculateWallWeigtVolume(volumeValue, height, radius);
            double bottomSteelWeight = RoundUp(7500 * bottomArea * lowerBeltWeight, 3);
            double roofSteelWeight = RoundUp(7500 * bottomArea * 0.004, 3);

            double totalSteelWeight = wallSteelWeight + bottomSteelWeight + roofSteelWeight;
            row.Cells.Add(RoundUp(totalSteelWeight, 2).ToString());

            row.Cells.Add(CalculateCylinderTankCosts(totalSteelWeight, metalCostPeTon).ToString());


            if (willFullTable)
            {
                row.Cells.Add(formTypes[1]);
            }

            return row;
        }

        private decimal CalculateCylinderTankWeight(int radius, double currHeight, int volumeValue, float metalDensityKgPerCubicMillimetr)
        {
            return -1;
        }

        private decimal CalculateCylinderTankCosts(double tankWeightKilogram, decimal metalCostPerKillogram)
        {
            return (decimal)RoundUp(tankWeightKilogram / 1000 * (double)metalCostPerKillogram, 0);
        }

        private double CalculateWallWeigtVolume(double volumeValue, double height, double radius)
        {
            const double metalSheetWidth = 1.5;

            double squire = 0,
                result = 0,
                weight = 0,
                beltNumbers = RoundUp(height / metalSheetWidth, 0);

            for (int beltNumber = 1; beltNumber <= beltNumbers; beltNumber++)
            {
                squire = 2 * Math.PI * radius * metalSheetWidth;
                weight = CalculateBeltWeightByItNumber(beltNumber, volumeValue, height, radius);

                result = result + RoundUp(7500 * squire * weight, 0);
            }

            return result;
        }

        private double CalculateBeltWeightByItNumber(int beltNumber, double volumeValue, double height, double radius)
        {
            const double metalSheetWidth = 1.5,
                lowerBeltWorkingConditionCoefficient = 0.7,
                upperBeltWorkingConditionCoefficient = 0.8;

            double weight,
                reliabilityFactor, steelDesignResistance,
                workingConditionCoefficient;

            reliabilityFactor = volumeValue < 10000 ? 1.1 : 1.15;

            steelDesignResistance = 325 / (reliabilityFactor * 1.025);

            workingConditionCoefficient = beltNumber == 1
                ? lowerBeltWorkingConditionCoefficient
                : upperBeltWorkingConditionCoefficient;

            weight = RoundUp((1.1 * 871 * 9.81 *
                (height - metalSheetWidth * (beltNumber - 1)) * radius)
                / (steelDesignResistance * 1000000 * workingConditionCoefficient), 3);

            weight = weight < 0.004 ? 0.004 : weight;

            return weight;
        }

        private double CalculateLowerBeltWeight(double volumeValue, double height, double radius)
        {
            const double metalSheetWidth = 1.5,
                lowerBeltWorkingConditionCoefficient = 0.7;

            double weight,
                reliabilityFactor, steelDesignResistance,
                workingConditionCoefficient;

            reliabilityFactor = volumeValue < 10000 ? 1.1 : 1.15;

            steelDesignResistance = 325 / (reliabilityFactor * 1.025);

            workingConditionCoefficient = lowerBeltWorkingConditionCoefficient;

            weight = RoundUp((1.1 * 871 * 9.81 *
                (height - metalSheetWidth * (1 - 1)) * radius)
                / (steelDesignResistance * 1000000 * workingConditionCoefficient), 3);

            weight = weight < 0.004 ? 0.004 : weight;

            return weight;
        }

        private double CalculateUpperBeltWeight(double volumeValue, double height, double radius)
        {
            const double metalSheetWidth = 1.5,
                upperBeltWorkingConditionCoefficient = 0.8;

            double weight, beltNumbers,
                reliabilityFactor, steelDesignResistance,
                workingConditionCoefficient;

            beltNumbers = RoundUp(height / metalSheetWidth, 0);

            reliabilityFactor = volumeValue < 10000 ? 1.1 : 1.15;

            steelDesignResistance = 325 / (reliabilityFactor * 1.025);

            workingConditionCoefficient = upperBeltWorkingConditionCoefficient;

            weight = RoundUp((1.1 * 871 * 9.81 *
                (height - metalSheetWidth * (beltNumbers - 1)) * radius)
                / (steelDesignResistance * 1000000 * workingConditionCoefficient), 3);

            weight = weight < 0.004 ? 0.004 : weight;

            return weight;
        }

        private double RoundUp(double flNumber, int numberAfterDot)
        {
            return ((int)Math.Ceiling(flNumber * Math.Pow(10, numberAfterDot))) / Math.Pow(10, numberAfterDot);
        }
    }
}
