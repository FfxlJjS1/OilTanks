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
        readonly string[] formTypes = { "Цилиндрический", "Параллелепипед" };

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
            return Ok(formTypes);
        }

        [HttpGet("AnalyseByFormVolume")]
        public IActionResult AnalyseByFormVolume(int volumeValue)
        {
            EntityTable entityTable = new EntityTable();
            double squire = 0f, height = 0f;


            entityTable.Columns = new List<Column>()
            {
                new Column(){ Name = "Радиус, м", Width = "50px"},
                new Column(){ Name = "Ширина стороны, м", Width = "50px"},
                new Column(){ Name = "Площадь дна, м", Width = "50px"},
                new Column(){ Name = "Длина окружности, м", Width = "50px"},
                new Column(){ Name = "Высота, м", Width = "100px"},
                new Column(){ Name = "Площадь стенок, м2", Width = "100px"},
                new Column(){ Name = "Площадь всех материалов, м2", Width = "150px"},
                new Column() { Name = "Форма, тип", Width="150px"}
            };


            for(int formTypeIndex = 0; formTypeIndex < formTypes.Length; formTypeIndex++)
            {
                List<List<string>> rowsByForm = StructualAnalyzeByForm(formTypeIndex, volumeValue);

                entityTable.Rows.AddRange(rowsByForm);
            }

            entityTable.Rows = entityTable.Rows.OrderBy(row => Convert.ToDecimal(row[6])).ToList();

            EntityResponce entityResponce = new EntityResponce()
            {
                entityTable = entityTable,
                minimalSquire = squire,
                height = height
            };

            return Ok(entityResponce);
        }

        private List<List<string>> StructualAnalyzeByForm(int formTypeIndex, int volumeValue)
        {
            List<List<string>> rows = new List<List<string>>();

            if (formTypeIndex < 0 || formTypeIndex > formTypes.Length)
            {
                return rows;
            }

            string formTypeString = formTypes[formTypeIndex];

            if (formTypeIndex == 0)
            {
                const int maxRadius = 30;

                for (int radius = 1; radius <= maxRadius; radius++)
                {
                    List<string> row = new List<string>
                    {
                        radius.ToString(),
                        "-1",
                        Math.Round(radius * radius * Math.PI, 3).ToString(),
                        Math.Round(radius * Math.PI * 2, 3).ToString()
                    };

                    double currHeight = Math.Round(volumeValue / Convert.ToDouble(row[2]), 3);
                    row.Add(currHeight.ToString());
                    row.Add(Math.Round(Convert.ToDouble(row[3]) * Convert.ToDouble(row[4]), 3).ToString());

                    double currSquire = Math.Round(Convert.ToDouble(row[2]) * 2 + Convert.ToDouble(row[5]), 3);
                    row.Add(currSquire.ToString());

                    row.Add(formTypeString);

                    rows.Add(row);
                }
            }
            else if (formTypeIndex == 1)
            {
                const int maxSideWidth = 30;

                for (int sideAWidth = 1; sideAWidth <= maxSideWidth; sideAWidth++)
                {
                    for (int sideBWidth = 1; sideBWidth <= maxSideWidth; sideBWidth++)
                    {
                        List<string> row = new List<string>
                        {
                            "-1",
                            sideAWidth.ToString() + " / " + sideBWidth.ToString(),
                            (sideAWidth * sideBWidth).ToString(),
                            "-1"
                        };

                        double currHeight = Math.Round(volumeValue / Convert.ToDouble(row[2]), 3);
                        row.Add(currHeight.ToString());
                        row.Add(Math.Round((sideAWidth + sideBWidth) * currHeight * 2, 3).ToString());
                        row.Add(Math.Round((sideAWidth * sideBWidth + sideAWidth * currHeight + sideBWidth * currHeight) * 2, 3).ToString());
                        row.Add(formTypeString);

                        rows.Add(row);
                    }
                }
            }

            return rows;
        }
    }
}
