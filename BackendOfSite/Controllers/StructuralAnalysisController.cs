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

        class EntityTable
        {
            public List<Column> Columns { get; set; } = new List<Column>();
            public List<List<string>> Rows { get; set; } = new List<List<string>>();
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
                    new Column(){ Name = "Радиус, м", Width = "50px"},
                    new Column(){ Name = "Длина окружности, м", Width = "50px"}
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
                new Column(){ Name = "Площадь дна, м", Width = "50px"},
                new Column(){ Name = "Высота, м", Width = "100px"},
                new Column() { Name = "Площадь стенок, м2", Width = "100px" },
                new Column() { Name = "Площадь всех материалов, м2", Width = "150px" },
                new Column() { Name = "Вес, т.", Width = "150px" },
                new Column() { Name = "Стоимость, руб.", Width = "150px" }
            });

            if(formTypeIndex == 0)
            {
                entityTable.Columns.Add(new Column() { Name = "Форма, тип", Width = "150px" });
            }


            if (formTypeIndex == 0)
            {
                for (formTypeIndex = 1; formTypeIndex < formTypes.Length; formTypeIndex++)
                {
                    List<List<string>> rowsByForm = StructualAnalyzeByForm(formTypeIndex, volumeValue, limites, true);

                    entityTable.Rows.AddRange(rowsByForm);
                }
            }
            else
            {
                entityTable.Rows = StructualAnalyzeByForm(formTypeIndex, volumeValue, limites, false);
            }


            EntityResponce entityResponce = new EntityResponce()
            {
                entityTable = entityTable,
                minimalSquire = squire,
                height = height
            };

            return Ok(entityResponce);
        }

        private List<List<string>> StructualAnalyzeByForm(int formTypeIndex, int volumeValue, int[] limites, bool willFullTable)
        {
            List<List<string>> rows = new List<List<string>>();

            if (formTypeIndex < 1 || formTypeIndex > formTypes.Length)
            {
                return rows;
            }

            const float metalDensityKgPerCubicMillimetr = 7900f; // Кг/мм^3
            const decimal metalCostPerKilogram = 53000; // Руб/кг
            string formTypeString = formTypes[formTypeIndex];

            if (formTypeIndex == 1)
            {
                for (int radius = limites[0] ; radius <= limites[1]; radius++)
                {
                    List<string> row = new List<string>
                    {
                        radius.ToString(),
                        Math.Round(radius * Math.PI * 2, 3).ToString()
                    };

                    if (willFullTable)
                    {
                        row.Add("-1");
                    }

                    double bottomArea = Math.Round(radius * radius * Math.PI, 3);
                    row.Add(bottomArea.ToString());

                    double currHeight = Math.Round(volumeValue / bottomArea, 3);
                    row.Add(currHeight.ToString());

                    double wallArea = Math.Round(Convert.ToDouble(row[1]) * currHeight, 3);
                    row.Add(wallArea.ToString());

                    double currSquire = Math.Round(bottomArea * 2 + wallArea, 3);
                    row.Add(currSquire.ToString());

                    decimal tankWeight = CalculateCylinderTankWeight(radius, currHeight, volumeValue, metalDensityKgPerCubicMillimetr);
                    row.Add(tankWeight.ToString());

                    row.Add(CalculateCylinderTankCosts(tankWeight, metalCostPerKilogram).ToString());

                    if (willFullTable)
                    {
                        row.Add(formTypeString);
                    }

                    rows.Add(row);
                }
            }
            else if (formTypeIndex == 2)
            {
                for (int sideAWidth = limites[2]; sideAWidth <= limites[3]; sideAWidth++)
                {
                    for (int sideBWidth = limites[2]; sideBWidth <= limites[3]; sideBWidth++)
                    {
                        List<string> row = new List<string>();

                        if (willFullTable)
                        {
                            row.Add("-1");
                            row.Add("-1");
                        }

                        row.Add(sideAWidth.ToString() + " / " + sideBWidth.ToString());

                        double bottomArea = (sideAWidth * sideBWidth);
                        row.Add(bottomArea.ToString());


                        double currHeight = Math.Round(volumeValue / bottomArea, 3);
                        row.Add(currHeight.ToString());
                        row.Add(Math.Round((sideAWidth + sideBWidth) * currHeight * 2, 3).ToString());
                        row.Add(Math.Round((sideAWidth * sideBWidth + sideAWidth * currHeight + sideBWidth * currHeight) * 2, 3).ToString());

                        decimal tankWeight = CalculateParallelogeamTankWeight(sideAWidth, sideBWidth, currHeight, volumeValue, metalDensityKgPerCubicMillimetr);
                        row.Add(tankWeight.ToString());

                        row.Add(CalculateParallepipedTankCosts(tankWeight, metalCostPerKilogram).ToString());

                        if (willFullTable)
                        {
                            row.Add(formTypeString);
                        }

                        rows.Add(row);
                    }
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

        private decimal CalculateCylinderTankWeight(int radius, double currHeight, int volumeValue, float metalDensityKgPerCubicMillimetr)
        {
            return -1;
        }

        private decimal CalculateCylinderTankCosts(decimal tankWeight, decimal metalCostPerKillogram)
        {
            return tankWeight * metalCostPerKillogram;
        }
    }
}
